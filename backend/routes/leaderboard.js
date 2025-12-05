import express from 'express';
import { query } from '../db/init.js';

const router = express.Router();

router.get('/streaks', async (req, res) => {
  try {
    const period = req.query.period || 'all';
    
    let queryText = `
      SELECT u.id, u.current_streak, u.longest_streak, u.total_checkins,
             CASE WHEN u.name IS NOT NULL AND u.name != '' 
                  THEN LEFT(u.name, 1) || '***' 
                  ELSE 'User' END as display_name
      FROM users u
      WHERE u.current_streak > 0
      ORDER BY u.current_streak DESC
      LIMIT 50
    `;

    const result = await query(queryText);

    const currentUserData = await query(
      `SELECT current_streak, longest_streak, total_checkins FROM users WHERE id = $1`,
      [req.userId]
    );

    const currentUserRank = await query(
      `SELECT COUNT(*) + 1 as rank FROM users WHERE current_streak > (SELECT current_streak FROM users WHERE id = $1)`,
      [req.userId]
    );

    const avgStreak = await query(`SELECT AVG(current_streak)::numeric(10,1) as avg FROM users WHERE current_streak > 0`);

    res.json({
      leaderboard: result.rows.map((r, i) => ({
        rank: i + 1,
        displayName: r.display_name,
        currentStreak: r.current_streak,
        longestStreak: r.longest_streak,
        totalCheckins: r.total_checkins,
        isCurrentUser: r.id === req.userId
      })),
      yourStats: {
        rank: parseInt(currentUserRank.rows[0]?.rank) || 0,
        currentStreak: currentUserData.rows[0]?.current_streak || 0,
        longestStreak: currentUserData.rows[0]?.longest_streak || 0,
        totalCheckins: currentUserData.rows[0]?.total_checkins || 0
      },
      communityAverage: parseFloat(avgStreak.rows[0]?.avg) || 0
    });
  } catch (err) {
    console.error('Get streak leaderboard error:', err);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

router.get('/layer/:layer', async (req, res) => {
  try {
    const { layer } = req.params;
    const validLayers = ['bio_hardware', 'internal_os', 'cultural_software', 'social_instance', 'conscious_user'];
    
    if (!validLayers.includes(layer)) {
      return res.status(400).json({ error: 'Invalid layer' });
    }

    const result = await query(
      `SELECT dc.user_id, 
              ROUND(AVG(dc.${layer})::numeric, 1) as avg_score,
              COUNT(*) as checkin_count,
              CASE WHEN u.name IS NOT NULL AND u.name != '' 
                   THEN LEFT(u.name, 1) || '***' 
                   ELSE 'User' END as display_name
       FROM daily_checkins dc
       INNER JOIN users u ON dc.user_id = u.id
       WHERE dc.checkin_date >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY dc.user_id, u.name
       HAVING COUNT(*) >= 5
       ORDER BY AVG(dc.${layer}) DESC
       LIMIT 50`,
      []
    );

    const communityAvg = await query(
      `SELECT AVG(${layer})::numeric(10,1) as avg 
       FROM daily_checkins 
       WHERE checkin_date >= CURRENT_DATE - INTERVAL '30 days'`,
      []
    );

    res.json({
      layer,
      leaderboard: result.rows.map((r, i) => ({
        rank: i + 1,
        displayName: r.display_name,
        avgScore: parseFloat(r.avg_score),
        checkinCount: parseInt(r.checkin_count),
        isCurrentUser: r.user_id === req.userId
      })),
      communityAverage: parseFloat(communityAvg.rows[0]?.avg) || 0
    });
  } catch (err) {
    console.error('Get layer leaderboard error:', err);
    res.status(500).json({ error: 'Failed to get layer leaderboard' });
  }
});

router.get('/challenges', async (req, res) => {
  try {
    const result = await query(
      `SELECT uc.user_id, 
              COUNT(CASE WHEN uc.status = 'completed' THEN 1 END) as completed_count,
              SUM(CASE WHEN uc.status = 'completed' THEN c.points ELSE 0 END) as total_points,
              CASE WHEN u.name IS NOT NULL AND u.name != '' 
                   THEN LEFT(u.name, 1) || '***' 
                   ELSE 'User' END as display_name
       FROM user_challenges uc
       INNER JOIN challenges c ON uc.challenge_id = c.id
       INNER JOIN users u ON uc.user_id = u.id
       GROUP BY uc.user_id, u.name
       HAVING COUNT(CASE WHEN uc.status = 'completed' THEN 1 END) > 0
       ORDER BY SUM(CASE WHEN uc.status = 'completed' THEN c.points ELSE 0 END) DESC
       LIMIT 50`,
      []
    );

    res.json({
      leaderboard: result.rows.map((r, i) => ({
        rank: i + 1,
        displayName: r.display_name,
        completedChallenges: parseInt(r.completed_count),
        totalPoints: parseInt(r.total_points),
        isCurrentUser: r.user_id === req.userId
      }))
    });
  } catch (err) {
    console.error('Get challenge leaderboard error:', err);
    res.status(500).json({ error: 'Failed to get challenge leaderboard' });
  }
});

router.get('/weekly', async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.current_streak, u.total_checkins,
              COALESCE(ux.total_xp, 0) as xp,
              COALESCE(ux.current_level, 1) as level,
              (SELECT COUNT(*) FROM daily_checkins dc WHERE dc.user_id = u.id AND dc.checkin_date >= CURRENT_DATE - INTERVAL '7 days') as weekly_checkins,
              CASE WHEN u.name IS NOT NULL AND u.name != '' 
                   THEN LEFT(u.name, 1) || '***' 
                   ELSE 'User' END as display_name
       FROM users u
       LEFT JOIN user_xp ux ON u.id = ux.user_id
       WHERE EXISTS (SELECT 1 FROM daily_checkins dc WHERE dc.user_id = u.id AND dc.checkin_date >= CURRENT_DATE - INTERVAL '7 days')
       ORDER BY (SELECT COUNT(*) FROM daily_checkins dc WHERE dc.user_id = u.id AND dc.checkin_date >= CURRENT_DATE - INTERVAL '7 days') DESC, u.current_streak DESC
       LIMIT 50`,
      []
    );

    res.json({
      period: 'weekly',
      leaderboard: result.rows.map((r, i) => ({
        rank: i + 1,
        displayName: r.display_name,
        weeklyCheckins: parseInt(r.weekly_checkins),
        currentStreak: r.current_streak,
        level: r.level,
        xp: r.xp,
        isCurrentUser: r.id === req.userId
      }))
    });
  } catch (err) {
    console.error('Get weekly leaderboard error:', err);
    res.status(500).json({ error: 'Failed to get weekly leaderboard' });
  }
});

router.get('/compare', async (req, res) => {
  try {
    const userData = await query(
      `SELECT u.current_streak, u.longest_streak, u.total_checkins,
              COALESCE(ux.total_xp, 0) as xp,
              COALESCE(ux.current_level, 1) as level
       FROM users u
       LEFT JOIN user_xp ux ON u.id = ux.user_id
       WHERE u.id = $1`,
      [req.userId]
    );

    const avgData = await query(
      `SELECT 
        AVG(current_streak)::numeric(10,1) as avg_streak,
        AVG(longest_streak)::numeric(10,1) as avg_longest,
        AVG(total_checkins)::numeric(10,1) as avg_checkins
       FROM users WHERE total_checkins > 0`,
      []
    );

    const avgXP = await query(
      `SELECT AVG(total_xp)::numeric(10,0) as avg_xp, AVG(current_level)::numeric(10,1) as avg_level FROM user_xp`,
      []
    );

    const user = userData.rows[0] || {};
    const avg = avgData.rows[0] || {};
    const xpAvg = avgXP.rows[0] || {};

    res.json({
      you: {
        currentStreak: user.current_streak || 0,
        longestStreak: user.longest_streak || 0,
        totalCheckins: user.total_checkins || 0,
        xp: user.xp || 0,
        level: user.level || 1
      },
      average: {
        currentStreak: parseFloat(avg.avg_streak) || 0,
        longestStreak: parseFloat(avg.avg_longest) || 0,
        totalCheckins: parseFloat(avg.avg_checkins) || 0,
        xp: parseFloat(xpAvg.avg_xp) || 0,
        level: parseFloat(xpAvg.avg_level) || 1
      },
      comparison: {
        streakVsAvg: ((user.current_streak || 0) - (parseFloat(avg.avg_streak) || 0)).toFixed(1),
        checkinsVsAvg: ((user.total_checkins || 0) - (parseFloat(avg.avg_checkins) || 0)).toFixed(1),
        xpVsAvg: ((user.xp || 0) - (parseFloat(xpAvg.avg_xp) || 0)).toFixed(0)
      }
    });
  } catch (err) {
    console.error('Get comparison error:', err);
    res.status(500).json({ error: 'Failed to get comparison' });
  }
});

export default router;
