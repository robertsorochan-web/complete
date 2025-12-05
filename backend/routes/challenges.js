import express from 'express';
import { query } from '../db/init.js';

const router = express.Router();

// Get all available challenges
router.get('/', async (req, res) => {
  try {
    const layer = req.query.layer;
    const difficulty = req.query.difficulty;

    let queryText = `
      SELECT c.*,
             (SELECT COUNT(*) FROM user_challenges uc WHERE uc.challenge_id = c.id AND uc.status = 'completed') as completions,
             EXISTS(SELECT 1 FROM user_challenges uc WHERE uc.challenge_id = c.id AND uc.user_id = $1) as is_participating
      FROM challenges c
      WHERE c.is_active = true
    `;
    const params = [req.userId];

    if (layer) {
      params.push(layer);
      queryText += ` AND c.layer_focus = $${params.length}`;
    }

    if (difficulty) {
      params.push(difficulty);
      queryText += ` AND c.difficulty = $${params.length}`;
    }

    queryText += ` ORDER BY c.points DESC`;

    const result = await query(queryText, params);

    res.json({
      challenges: result.rows.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        type: c.challenge_type,
        layerFocus: c.layer_focus,
        duration: c.duration_days,
        difficulty: c.difficulty,
        points: c.points,
        completions: parseInt(c.completions),
        isParticipating: c.is_participating
      }))
    });
  } catch (err) {
    console.error('Get challenges error:', err);
    res.status(500).json({ error: 'Failed to get challenges' });
  }
});

// Join a challenge
router.post('/:challengeId/join', async (req, res) => {
  try {
    const { challengeId } = req.params;

    // Check if already participating
    const existing = await query(
      `SELECT id, status FROM user_challenges 
       WHERE user_id = $1 AND challenge_id = $2`,
      [req.userId, challengeId]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].status === 'active') {
        return res.status(400).json({ error: 'Already participating in this challenge' });
      }
      // Rejoin if previously quit
      await query(
        `UPDATE user_challenges SET status = 'active', progress = 0, started_at = NOW(), completed_at = NULL
         WHERE user_id = $1 AND challenge_id = $2`,
        [req.userId, challengeId]
      );
    } else {
      await query(
        `INSERT INTO user_challenges (user_id, challenge_id, status, progress)
         VALUES ($1, $2, 'active', 0)`,
        [req.userId, challengeId]
      );
    }

    res.json({ success: true, message: 'Joined challenge successfully!' });
  } catch (err) {
    console.error('Join challenge error:', err);
    res.status(500).json({ error: 'Failed to join challenge' });
  }
});

// Update challenge progress
router.post('/:challengeId/progress', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { progress } = req.body;

    // Get challenge info
    const challenge = await query(
      `SELECT duration_days, points FROM challenges WHERE id = $1`,
      [challengeId]
    );

    if (challenge.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const maxProgress = challenge.rows[0].duration_days;
    const newProgress = Math.min(progress, maxProgress);
    const isCompleted = newProgress >= maxProgress;

    if (isCompleted) {
      await query(
        `UPDATE user_challenges 
         SET progress = $3, status = 'completed', completed_at = NOW()
         WHERE user_id = $1 AND challenge_id = $2`,
        [req.userId, challengeId, newProgress]
      );

      // Award badge
      await query(
        `INSERT INTO user_badges (user_id, badge_type, badge_name, badge_description)
         VALUES ($1, 'challenge', $2, $3)
         ON CONFLICT (user_id, badge_type, badge_name) DO NOTHING`,
        [req.userId, `Challenge: ${challenge.rows[0].title}`, `Completed challenge for ${challenge.rows[0].points} points`]
      );

      // Record milestone
      await query(
        `INSERT INTO progress_milestones (user_id, milestone_type, milestone_name, milestone_value)
         VALUES ($1, 'challenge_completed', $2, $3)`,
        [req.userId, challengeId, challenge.rows[0].points]
      );
    } else {
      await query(
        `UPDATE user_challenges SET progress = $3
         WHERE user_id = $1 AND challenge_id = $2`,
        [req.userId, challengeId, newProgress]
      );
    }

    res.json({
      success: true,
      progress: newProgress,
      isCompleted,
      pointsEarned: isCompleted ? challenge.rows[0].points : 0
    });
  } catch (err) {
    console.error('Update progress error:', err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Get my active challenges
router.get('/my-challenges', async (req, res) => {
  try {
    const result = await query(
      `SELECT c.*, uc.progress, uc.status, uc.started_at, uc.completed_at
       FROM challenges c
       INNER JOIN user_challenges uc ON c.id = uc.challenge_id
       WHERE uc.user_id = $1
       ORDER BY uc.status ASC, uc.started_at DESC`,
      [req.userId]
    );

    res.json({
      challenges: result.rows.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        type: c.challenge_type,
        layerFocus: c.layer_focus,
        duration: c.duration_days,
        difficulty: c.difficulty,
        points: c.points,
        progress: c.progress,
        status: c.status,
        startedAt: c.started_at,
        completedAt: c.completed_at,
        percentComplete: Math.round((c.progress / c.duration_days) * 100)
      }))
    });
  } catch (err) {
    console.error('Get my challenges error:', err);
    res.status(500).json({ error: 'Failed to get your challenges' });
  }
});

// Quit a challenge
router.post('/:challengeId/quit', async (req, res) => {
  try {
    const { challengeId } = req.params;

    await query(
      `UPDATE user_challenges SET status = 'quit'
       WHERE user_id = $1 AND challenge_id = $2`,
      [req.userId, challengeId]
    );

    res.json({ success: true, message: 'Left challenge' });
  } catch (err) {
    console.error('Quit challenge error:', err);
    res.status(500).json({ error: 'Failed to quit challenge' });
  }
});

// Get Hall of Fame - top challenge completers
router.get('/hall-of-fame', async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, 
              CASE WHEN u.name IS NOT NULL AND u.name != '' THEN LEFT(u.name, 2) || '***' ELSE 'User' END as display_name,
              COUNT(CASE WHEN uc.status = 'completed' THEN 1 END) as completed_count,
              COALESCE(SUM(CASE WHEN uc.status = 'completed' THEN c.points ELSE 0 END), 0) as total_points,
              MAX(uc.completed_at) as last_completed
       FROM users u
       INNER JOIN user_challenges uc ON u.id = uc.user_id
       INNER JOIN challenges c ON uc.challenge_id = c.id
       GROUP BY u.id, u.name
       HAVING COUNT(CASE WHEN uc.status = 'completed' THEN 1 END) >= 1
       ORDER BY total_points DESC, completed_count DESC
       LIMIT 50`,
      []
    );

    res.json({
      hallOfFame: result.rows.map((r, i) => ({
        rank: i + 1,
        displayName: r.display_name,
        completedCount: parseInt(r.completed_count),
        totalPoints: parseInt(r.total_points),
        lastCompleted: r.last_completed,
        isCurrentUser: r.id === req.userId
      }))
    });
  } catch (err) {
    console.error('Get hall of fame error:', err);
    res.status(500).json({ error: 'Failed to get hall of fame' });
  }
});

// Get user's completed challenge certificates
router.get('/certificates', async (req, res) => {
  try {
    const result = await query(
      `SELECT c.id, c.title, c.description, c.difficulty, c.points, c.duration_days,
              uc.started_at, uc.completed_at, u.name as user_name
       FROM user_challenges uc
       INNER JOIN challenges c ON uc.challenge_id = c.id
       INNER JOIN users u ON uc.user_id = u.id
       WHERE uc.user_id = $1 AND uc.status = 'completed'
       ORDER BY uc.completed_at DESC`,
      [req.userId]
    );

    res.json({
      certificates: result.rows.map(c => ({
        challengeId: c.id,
        title: c.title,
        description: c.description,
        difficulty: c.difficulty,
        points: c.points,
        duration: c.duration_days,
        startedAt: c.started_at,
        completedAt: c.completed_at,
        userName: c.user_name,
        certificateCode: `AKOFA-${c.id}-${req.userId}-${new Date(c.completed_at).getTime().toString(36).toUpperCase()}`
      }))
    });
  } catch (err) {
    console.error('Get certificates error:', err);
    res.status(500).json({ error: 'Failed to get certificates' });
  }
});

// Create user challenge (custom challenge)
router.post('/create', async (req, res) => {
  try {
    const { title, description, layerFocus, durationDays, difficulty, tasks } = req.body;

    if (!title || !description || !durationDays) {
      return res.status(400).json({ error: 'Title, description, and duration are required' });
    }

    const points = difficulty === 'easy' ? durationDays * 10 : 
                   difficulty === 'hard' ? durationDays * 25 : durationDays * 15;

    const result = await query(
      `INSERT INTO challenges (title, description, layer_focus, duration_days, difficulty, points, challenge_type, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, 'user_created', true)
       RETURNING *`,
      [title, description, layerFocus || 'consciousUser', durationDays, difficulty || 'medium', points]
    );

    const challengeId = result.rows[0].id;

    // Auto-join the creator to their challenge
    await query(
      `INSERT INTO user_challenges (user_id, challenge_id, status, progress) VALUES ($1, $2, 'active', 0)`,
      [req.userId, challengeId]
    );

    res.json({
      success: true,
      challenge: {
        id: challengeId,
        title,
        description,
        layerFocus: layerFocus || 'consciousUser',
        duration: durationDays,
        difficulty: difficulty || 'medium',
        points
      }
    });
  } catch (err) {
    console.error('Create challenge error:', err);
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

// Get challenge leaderboard
router.get('/:challengeId/leaderboard', async (req, res) => {
  try {
    const { challengeId } = req.params;

    const result = await query(
      `SELECT uc.progress, uc.status, u.id,
              CASE WHEN u.name IS NOT NULL AND u.name != '' THEN LEFT(u.name, 1) || '***' ELSE 'User' END as display_name
       FROM user_challenges uc
       INNER JOIN users u ON uc.user_id = u.id
       WHERE uc.challenge_id = $1
       ORDER BY uc.progress DESC, uc.started_at ASC
       LIMIT 20`,
      [challengeId]
    );

    res.json({
      leaderboard: result.rows.map((r, i) => ({
        rank: i + 1,
        displayName: r.display_name,
        progress: r.progress,
        status: r.status,
        isCurrentUser: r.id === req.userId
      }))
    });
  } catch (err) {
    console.error('Get challenge leaderboard error:', err);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

export default router;
