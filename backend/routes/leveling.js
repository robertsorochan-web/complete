import express from 'express';
import { query } from '../db/init.js';

const router = express.Router();

const LEVEL_THRESHOLDS = Array.from({ length: 100 }, (_, i) => Math.floor(100 * Math.pow(1.15, i)));

const calculateLevel = (totalXP) => {
  let level = 1;
  let xpNeeded = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      level = i + 2;
      xpNeeded = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i];
    } else {
      xpNeeded = LEVEL_THRESHOLDS[i];
      break;
    }
  }
  return { level: Math.min(level, 100), xpNeeded };
};

const FEATURE_UNLOCKS = {
  5: ['custom_themes', 'share_cards'],
  10: ['advanced_insights', 'friend_challenges'],
  15: ['challenge_creation', 'mood_analytics'],
  25: ['leaderboard_opt_in', 'data_export'],
  50: ['pro_templates', 'wellness_report'],
  75: ['mentor_mode', 'beta_features'],
  100: ['legendary_badge', 'all_features']
};

router.get('/status', async (req, res) => {
  try {
    let result = await query(
      `SELECT * FROM user_xp WHERE user_id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      await query(
        `INSERT INTO user_xp (user_id) VALUES ($1) ON CONFLICT DO NOTHING`,
        [req.userId]
      );
      result = await query(`SELECT * FROM user_xp WHERE user_id = $1`, [req.userId]);
    }

    const xpData = result.rows[0];
    const { level, xpNeeded } = calculateLevel(xpData.total_xp);
    const previousLevelXP = level > 1 ? LEVEL_THRESHOLDS[level - 2] : 0;
    const progressToNext = xpData.total_xp - previousLevelXP;
    const xpForCurrentLevel = xpNeeded - previousLevelXP;

    const unlockedFeatures = [];
    Object.entries(FEATURE_UNLOCKS).forEach(([lvl, features]) => {
      if (level >= parseInt(lvl)) {
        unlockedFeatures.push(...features);
      }
    });

    const nextUnlock = Object.entries(FEATURE_UNLOCKS).find(([lvl]) => level < parseInt(lvl));

    res.json({
      totalXP: xpData.total_xp,
      lifetimeXP: xpData.lifetime_xp,
      currentLevel: level,
      xpToNextLevel: xpNeeded - xpData.total_xp,
      progressPercent: Math.round((progressToNext / xpForCurrentLevel) * 100),
      unlockedFeatures,
      nextUnlock: nextUnlock ? { level: parseInt(nextUnlock[0]), features: nextUnlock[1] } : null
    });
  } catch (err) {
    console.error('Get level status error:', err);
    res.status(500).json({ error: 'Failed to get level status' });
  }
});

router.post('/award', async (req, res) => {
  try {
    const { amount, actionType, description } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid XP amount' });
    }

    await query(
      `INSERT INTO xp_transactions (user_id, xp_amount, action_type, description)
       VALUES ($1, $2, $3, $4)`,
      [req.userId, amount, actionType, description]
    );

    let result = await query(
      `SELECT * FROM user_xp WHERE user_id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      await query(`INSERT INTO user_xp (user_id) VALUES ($1)`, [req.userId]);
      result = await query(`SELECT * FROM user_xp WHERE user_id = $1`, [req.userId]);
    }

    const oldXP = result.rows[0].total_xp;
    const oldLevel = calculateLevel(oldXP).level;
    const newXP = oldXP + amount;
    const { level: newLevel } = calculateLevel(newXP);

    await query(
      `UPDATE user_xp SET 
        total_xp = total_xp + $2,
        lifetime_xp = lifetime_xp + $2,
        current_level = $3,
        last_xp_earned_at = NOW(),
        updated_at = NOW()
       WHERE user_id = $1`,
      [req.userId, amount, newLevel]
    );

    const leveledUp = newLevel > oldLevel;

    if (leveledUp) {
      const newUnlocks = FEATURE_UNLOCKS[newLevel] || [];
      if (newUnlocks.length > 0) {
        await query(
          `INSERT INTO user_badges (user_id, badge_type, badge_name, badge_description)
           VALUES ($1, 'level', $2, $3)
           ON CONFLICT DO NOTHING`,
          [req.userId, `Level ${newLevel}`, `Reached level ${newLevel}!`]
        );
      }
    }

    res.json({
      success: true,
      xpAwarded: amount,
      totalXP: newXP,
      currentLevel: newLevel,
      leveledUp,
      newUnlocks: leveledUp ? FEATURE_UNLOCKS[newLevel] : []
    });
  } catch (err) {
    console.error('Award XP error:', err);
    res.status(500).json({ error: 'Failed to award XP' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const result = await query(
      `SELECT * FROM xp_transactions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [req.userId, limit]
    );

    res.json({
      transactions: result.rows.map(t => ({
        id: t.id,
        amount: t.xp_amount,
        actionType: t.action_type,
        description: t.description,
        earnedAt: t.created_at
      }))
    });
  } catch (err) {
    console.error('Get XP history error:', err);
    res.status(500).json({ error: 'Failed to get XP history' });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const result = await query(
      `SELECT ux.total_xp, ux.current_level, u.id,
              CASE WHEN u.name IS NOT NULL AND u.name != '' 
                   THEN LEFT(u.name, 1) || '***' 
                   ELSE 'User' END as display_name
       FROM user_xp ux
       INNER JOIN users u ON ux.user_id = u.id
       ORDER BY ux.total_xp DESC
       LIMIT 50`,
      []
    );

    const currentUserRank = await query(
      `SELECT COUNT(*) + 1 as rank FROM user_xp WHERE total_xp > (SELECT total_xp FROM user_xp WHERE user_id = $1)`,
      [req.userId]
    );

    res.json({
      leaderboard: result.rows.map((r, i) => ({
        rank: i + 1,
        displayName: r.display_name,
        level: r.current_level,
        totalXP: r.total_xp,
        isCurrentUser: r.id === req.userId
      })),
      yourRank: parseInt(currentUserRank.rows[0]?.rank) || 0
    });
  } catch (err) {
    console.error('Get leaderboard error:', err);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

export default router;
