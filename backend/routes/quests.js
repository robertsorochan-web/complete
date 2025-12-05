import express from 'express';
import { query } from '../db/init.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await query(
      `SELECT q.*, 
              COALESCE(uq.progress, 0) as user_progress,
              COALESCE(uq.status, 'available') as user_status,
              uq.completed_at
       FROM quests q
       LEFT JOIN user_quests uq ON q.id = uq.quest_id 
         AND uq.user_id = $1 
         AND uq.assigned_date = $2
       WHERE q.is_active = true
       ORDER BY q.quest_type, q.xp_reward DESC`,
      [req.userId, today]
    );

    const quests = result.rows.map(q => ({
      id: q.id,
      title: q.title,
      description: q.description,
      type: q.quest_type,
      actionType: q.action_type,
      targetCount: q.target_count,
      xpReward: q.xp_reward,
      difficulty: q.difficulty,
      progress: q.user_progress,
      status: q.user_status,
      completedAt: q.completed_at,
      percentComplete: Math.round((q.user_progress / q.target_count) * 100)
    }));

    const daily = quests.filter(q => q.type === 'daily');
    const weekly = quests.filter(q => q.type === 'weekly');
    const monthly = quests.filter(q => q.type === 'monthly');

    res.json({
      daily,
      weekly,
      monthly,
      totalAvailable: quests.length,
      completed: quests.filter(q => q.status === 'completed').length
    });
  } catch (err) {
    console.error('Get quests error:', err);
    res.status(500).json({ error: 'Failed to get quests' });
  }
});

router.post('/:questId/progress', async (req, res) => {
  try {
    const { questId } = req.params;
    const { increment = 1 } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const quest = await query(`SELECT * FROM quests WHERE id = $1`, [questId]);
    if (quest.rows.length === 0) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    const questData = quest.rows[0];

    let userQuest = await query(
      `SELECT * FROM user_quests WHERE user_id = $1 AND quest_id = $2 AND assigned_date = $3`,
      [req.userId, questId, today]
    );

    if (userQuest.rows.length === 0) {
      await query(
        `INSERT INTO user_quests (user_id, quest_id, progress, assigned_date) VALUES ($1, $2, 0, $3)`,
        [req.userId, questId, today]
      );
      userQuest = await query(
        `SELECT * FROM user_quests WHERE user_id = $1 AND quest_id = $2 AND assigned_date = $3`,
        [req.userId, questId, today]
      );
    }

    const currentProgress = userQuest.rows[0].progress;
    const newProgress = Math.min(currentProgress + increment, questData.target_count);
    const isCompleted = newProgress >= questData.target_count;

    await query(
      `UPDATE user_quests 
       SET progress = $3, 
           status = $4,
           completed_at = CASE WHEN $4 = 'completed' THEN NOW() ELSE NULL END
       WHERE user_id = $1 AND quest_id = $2 AND assigned_date = $5`,
      [req.userId, questId, newProgress, isCompleted ? 'completed' : 'active', today]
    );

    let xpAwarded = 0;
    if (isCompleted && userQuest.rows[0].status !== 'completed') {
      xpAwarded = questData.xp_reward;
      
      await query(
        `INSERT INTO xp_transactions (user_id, xp_amount, action_type, description)
         VALUES ($1, $2, 'quest_complete', $3)`,
        [req.userId, xpAwarded, `Completed quest: ${questData.title}`]
      );

      let xpResult = await query(`SELECT * FROM user_xp WHERE user_id = $1`, [req.userId]);
      if (xpResult.rows.length === 0) {
        await query(`INSERT INTO user_xp (user_id) VALUES ($1)`, [req.userId]);
      }
      
      await query(
        `UPDATE user_xp SET total_xp = total_xp + $2, lifetime_xp = lifetime_xp + $2, updated_at = NOW() WHERE user_id = $1`,
        [req.userId, xpAwarded]
      );
    }

    res.json({
      success: true,
      questId: parseInt(questId),
      progress: newProgress,
      targetCount: questData.target_count,
      isCompleted,
      xpAwarded
    });
  } catch (err) {
    console.error('Update quest progress error:', err);
    res.status(500).json({ error: 'Failed to update quest progress' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    
    const result = await query(
      `SELECT uq.*, q.title, q.xp_reward, q.quest_type
       FROM user_quests uq
       INNER JOIN quests q ON uq.quest_id = q.id
       WHERE uq.user_id = $1 AND uq.status = 'completed'
       ORDER BY uq.completed_at DESC
       LIMIT $2`,
      [req.userId, limit]
    );

    res.json({
      completedQuests: result.rows.map(q => ({
        id: q.quest_id,
        title: q.title,
        type: q.quest_type,
        xpEarned: q.xp_reward,
        completedAt: q.completed_at,
        date: q.assigned_date
      }))
    });
  } catch (err) {
    console.error('Get quest history error:', err);
    res.status(500).json({ error: 'Failed to get quest history' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalCompleted = await query(
      `SELECT COUNT(*) as count FROM user_quests WHERE user_id = $1 AND status = 'completed'`,
      [req.userId]
    );

    const xpFromQuests = await query(
      `SELECT COALESCE(SUM(q.xp_reward), 0) as total
       FROM user_quests uq
       INNER JOIN quests q ON uq.quest_id = q.id
       WHERE uq.user_id = $1 AND uq.status = 'completed'`,
      [req.userId]
    );

    const streakDays = await query(
      `SELECT COUNT(DISTINCT assigned_date) as count
       FROM user_quests
       WHERE user_id = $1 AND status = 'completed'
       AND assigned_date >= CURRENT_DATE - INTERVAL '30 days'`,
      [req.userId]
    );

    res.json({
      totalQuestsCompleted: parseInt(totalCompleted.rows[0].count),
      totalXPFromQuests: parseInt(xpFromQuests.rows[0].total),
      activeDaysThisMonth: parseInt(streakDays.rows[0].count)
    });
  } catch (err) {
    console.error('Get quest stats error:', err);
    res.status(500).json({ error: 'Failed to get quest stats' });
  }
});

export default router;
