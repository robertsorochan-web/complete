import express from 'express';
import { query } from '../db/init.js';

const router = express.Router();

// Calculate StackScore
// Formula: (Consistency × 0.3 + Progress × 0.4 + Balance × 0.3) × 550 + 300 + AI_Bonus
// Range: 300-850

const calculateStackScore = (consistency, progress, balance, aiBonus = 0) => {
  const baseScore = (consistency * 0.3 + progress * 0.4 + balance * 0.3);
  const scaledScore = Math.round(baseScore * 550 + 300 + aiBonus);
  return Math.min(850, Math.max(300, scaledScore));
};

const getScoreTier = (score) => {
  if (score >= 750) return { tier: 'Guru', color: '#FFD700' };
  if (score >= 650) return { tier: 'Master', color: '#C0C0C0' };
  if (score >= 550) return { tier: 'Adept', color: '#CD7F32' };
  if (score >= 450) return { tier: 'Practitioner', color: '#4A90A4' };
  return { tier: 'Novice', color: '#808080' };
};

// Get current StackScore
router.get('/', async (req, res) => {
  try {
    // Get user data
    const userResult = await query(
      `SELECT stack_score, current_streak, total_checkins FROM users WHERE id = $1`,
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Calculate consistency (based on streak and check-in frequency)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const checkinCount = await query(
      `SELECT COUNT(*) FROM daily_checkins 
       WHERE user_id = $1 AND checkin_date >= $2`,
      [req.userId, thirtyDaysAgo]
    );
    
    const consistency = Math.min(1, parseInt(checkinCount.rows[0].count) / 30);

    // Calculate progress (improvement over time)
    const recentAvg = await query(
      `SELECT AVG(bio_hardware + internal_os + cultural_software + social_instance + conscious_user) as recent
       FROM daily_checkins 
       WHERE user_id = $1 AND checkin_date >= CURRENT_DATE - INTERVAL '7 days'`,
      [req.userId]
    );

    const olderAvg = await query(
      `SELECT AVG(bio_hardware + internal_os + cultural_software + social_instance + conscious_user) as older
       FROM daily_checkins 
       WHERE user_id = $1 AND checkin_date >= CURRENT_DATE - INTERVAL '30 days' 
       AND checkin_date < CURRENT_DATE - INTERVAL '7 days'`,
      [req.userId]
    );

    let progress = 0.5; // Default to neutral
    if (recentAvg.rows[0].recent && olderAvg.rows[0].older) {
      const recent = parseFloat(recentAvg.rows[0].recent);
      const older = parseFloat(olderAvg.rows[0].older);
      progress = Math.min(1, Math.max(0, (recent - older + 10) / 20));
    }

    // Calculate balance (how evenly distributed are the layer scores)
    const latestCheckin = await query(
      `SELECT bio_hardware, internal_os, cultural_software, social_instance, conscious_user
       FROM daily_checkins WHERE user_id = $1 ORDER BY checkin_date DESC LIMIT 1`,
      [req.userId]
    );

    let balance = 0.5;
    if (latestCheckin.rows.length > 0) {
      const scores = [
        latestCheckin.rows[0].bio_hardware,
        latestCheckin.rows[0].internal_os,
        latestCheckin.rows[0].cultural_software,
        latestCheckin.rows[0].social_instance,
        latestCheckin.rows[0].conscious_user
      ];
      const avg = scores.reduce((a, b) => a + b, 0) / 5;
      const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / 5;
      balance = Math.max(0, 1 - variance / 20);
    }

    // Get AI bonus (from completed recommendations)
    const aiBonus = Math.round(Math.min(50, user.total_checkins * 0.5));

    const score = calculateStackScore(consistency, progress, balance, aiBonus);
    const tierInfo = getScoreTier(score);

    // Update user's stack score
    await query(
      `UPDATE users SET stack_score = $2, updated_at = NOW() WHERE id = $1`,
      [req.userId, score]
    );

    // Record in history
    await query(
      `INSERT INTO stack_score_history (user_id, score, consistency_score, progress_score, balance_score, ai_bonus)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [req.userId, score, consistency, progress, balance, aiBonus]
    );

    res.json({
      score,
      tier: tierInfo.tier,
      tierColor: tierInfo.color,
      breakdown: {
        consistency: Math.round(consistency * 100),
        progress: Math.round(progress * 100),
        balance: Math.round(balance * 100),
        aiBonus: Math.round(aiBonus)
      },
      nextTier: getNextTierInfo(score)
    });
  } catch (err) {
    console.error('Get stack score error:', err);
    res.status(500).json({ error: 'Failed to get stack score' });
  }
});

// Get StackScore history
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const result = await query(
      `SELECT score, consistency_score, progress_score, balance_score, ai_bonus, recorded_at
       FROM stack_score_history 
       WHERE user_id = $1 
       ORDER BY recorded_at DESC 
       LIMIT $2`,
      [req.userId, limit]
    );

    res.json({
      history: result.rows.map(h => ({
        score: h.score,
        consistency: Math.round(parseFloat(h.consistency_score) * 100),
        progress: Math.round(parseFloat(h.progress_score) * 100),
        balance: Math.round(parseFloat(h.balance_score) * 100),
        aiBonus: h.ai_bonus,
        date: h.recorded_at
      }))
    });
  } catch (err) {
    console.error('Get score history error:', err);
    res.status(500).json({ error: 'Failed to get score history' });
  }
});

// Get leaderboard (anonymous)
router.get('/leaderboard', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, stack_score, current_streak, 
              CASE WHEN name IS NOT NULL AND name != '' THEN LEFT(name, 1) || '***' ELSE 'User' END as display_name
       FROM users 
       WHERE stack_score > 300
       ORDER BY stack_score DESC 
       LIMIT 50`
    );

    // Get current user's rank
    const rankResult = await query(
      `SELECT COUNT(*) + 1 as rank FROM users 
       WHERE stack_score > (SELECT stack_score FROM users WHERE id = $1)`,
      [req.userId]
    );

    res.json({
      leaderboard: result.rows.map((u, i) => ({
        rank: i + 1,
        displayName: u.display_name,
        score: u.stack_score,
        streak: u.current_streak,
        isCurrentUser: u.id === req.userId
      })),
      userRank: parseInt(rankResult.rows[0].rank)
    });
  } catch (err) {
    console.error('Get leaderboard error:', err);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

function getNextTierInfo(currentScore) {
  const tiers = [
    { name: 'Novice', min: 300 },
    { name: 'Practitioner', min: 450 },
    { name: 'Adept', min: 550 },
    { name: 'Master', min: 650 },
    { name: 'Guru', min: 750 }
  ];

  for (let i = 0; i < tiers.length - 1; i++) {
    if (currentScore < tiers[i + 1].min) {
      return {
        nextTier: tiers[i + 1].name,
        pointsNeeded: tiers[i + 1].min - currentScore,
        progress: Math.round((currentScore - tiers[i].min) / (tiers[i + 1].min - tiers[i].min) * 100)
      };
    }
  }

  return {
    nextTier: 'Max Tier',
    pointsNeeded: 0,
    progress: 100
  };
}

export default router;
