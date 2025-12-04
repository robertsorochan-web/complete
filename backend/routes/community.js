import express from 'express';
import { query } from '../db/init.js';

const router = express.Router();

// Get all community groups
router.get('/groups', async (req, res) => {
  try {
    const result = await query(
      `SELECT g.*, 
              (SELECT COUNT(*) FROM user_groups WHERE group_id = g.id) as member_count,
              EXISTS(SELECT 1 FROM user_groups WHERE group_id = g.id AND user_id = $1) as is_member
       FROM community_groups g 
       WHERE g.is_active = true
       ORDER BY member_count DESC`,
      [req.userId]
    );

    res.json({
      groups: result.rows.map(g => ({
        id: g.id,
        name: g.name,
        slug: g.slug,
        description: g.description,
        theme: g.theme,
        icon: g.icon,
        memberCount: parseInt(g.member_count),
        isMember: g.is_member
      }))
    });
  } catch (err) {
    console.error('Get groups error:', err);
    res.status(500).json({ error: 'Failed to get groups' });
  }
});

// Join a group
router.post('/groups/:groupId/join', async (req, res) => {
  try {
    const { groupId } = req.params;

    await query(
      `INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2)
       ON CONFLICT (user_id, group_id) DO NOTHING`,
      [req.userId, groupId]
    );

    res.json({ success: true, message: 'Joined group successfully' });
  } catch (err) {
    console.error('Join group error:', err);
    res.status(500).json({ error: 'Failed to join group' });
  }
});

// Leave a group
router.post('/groups/:groupId/leave', async (req, res) => {
  try {
    const { groupId } = req.params;

    await query(
      `DELETE FROM user_groups WHERE user_id = $1 AND group_id = $2`,
      [req.userId, groupId]
    );

    res.json({ success: true, message: 'Left group successfully' });
  } catch (err) {
    console.error('Leave group error:', err);
    res.status(500).json({ error: 'Failed to leave group' });
  }
});

// Get user's groups
router.get('/my-groups', async (req, res) => {
  try {
    const result = await query(
      `SELECT g.* FROM community_groups g
       INNER JOIN user_groups ug ON g.id = ug.group_id
       WHERE ug.user_id = $1`,
      [req.userId]
    );

    res.json({ groups: result.rows });
  } catch (err) {
    console.error('Get my groups error:', err);
    res.status(500).json({ error: 'Failed to get your groups' });
  }
});

// Share an insight
router.post('/insights', async (req, res) => {
  try {
    const { insightText, layer, improvementValue } = req.body;

    if (!insightText || insightText.length < 10) {
      return res.status(400).json({ error: 'Insight must be at least 10 characters' });
    }

    const result = await query(
      `INSERT INTO shared_insights (user_id, insight_text, layer, improvement_value)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [req.userId, insightText, layer, improvementValue]
    );

    res.json({ success: true, insightId: result.rows[0].id });
  } catch (err) {
    console.error('Share insight error:', err);
    res.status(500).json({ error: 'Failed to share insight' });
  }
});

// Get community insights
router.get('/insights', async (req, res) => {
  try {
    const layer = req.query.layer;
    const limit = parseInt(req.query.limit) || 20;

    let queryText = `
      SELECT si.id, si.insight_text, si.layer, si.improvement_value, si.likes, si.created_at
      FROM shared_insights si
    `;
    const params = [limit];

    if (layer) {
      queryText += ` WHERE si.layer = $2`;
      params.push(layer);
    }

    queryText += ` ORDER BY si.created_at DESC LIMIT $1`;

    const result = await query(queryText, params);

    res.json({
      insights: result.rows.map(i => ({
        id: i.id,
        text: i.insight_text,
        layer: i.layer,
        improvement: i.improvement_value,
        likes: i.likes,
        createdAt: i.created_at
      }))
    });
  } catch (err) {
    console.error('Get insights error:', err);
    res.status(500).json({ error: 'Failed to get insights' });
  }
});

// Like an insight
router.post('/insights/:insightId/like', async (req, res) => {
  try {
    const { insightId } = req.params;

    await query(
      `UPDATE shared_insights SET likes = likes + 1 WHERE id = $1`,
      [insightId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Like insight error:', err);
    res.status(500).json({ error: 'Failed to like insight' });
  }
});

// Submit success story
router.post('/stories', async (req, res) => {
  try {
    const { title, story, improvementType, improvementPercentage, isAnonymous } = req.body;

    if (!story || story.length < 50) {
      return res.status(400).json({ error: 'Story must be at least 50 characters' });
    }

    const result = await query(
      `INSERT INTO success_stories (user_id, title, story, improvement_type, improvement_percentage, is_anonymous)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [req.userId, title, story, improvementType, improvementPercentage, isAnonymous !== false]
    );

    res.json({ success: true, storyId: result.rows[0].id });
  } catch (err) {
    console.error('Submit story error:', err);
    res.status(500).json({ error: 'Failed to submit story' });
  }
});

// Get success stories
router.get('/stories', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const result = await query(
      `SELECT ss.id, ss.title, ss.story, ss.improvement_type, ss.improvement_percentage, ss.created_at,
              CASE WHEN ss.is_anonymous THEN 'Anonymous' 
                   ELSE COALESCE(LEFT(u.name, 1) || '***', 'User') END as author
       FROM success_stories ss
       LEFT JOIN users u ON ss.user_id = u.id
       WHERE ss.is_approved = true OR ss.user_id = $1
       ORDER BY ss.created_at DESC
       LIMIT $2`,
      [req.userId, limit]
    );

    res.json({
      stories: result.rows.map(s => ({
        id: s.id,
        title: s.title,
        story: s.story,
        improvementType: s.improvement_type,
        improvementPercentage: s.improvement_percentage,
        author: s.author,
        createdAt: s.created_at
      }))
    });
  } catch (err) {
    console.error('Get stories error:', err);
    res.status(500).json({ error: 'Failed to get stories' });
  }
});

// Request accountability partner
router.post('/partners/request', async (req, res) => {
  try {
    // Find a random user who doesn't have a partner
    const availablePartner = await query(
      `SELECT u.id FROM users u
       WHERE u.id != $1 
       AND NOT EXISTS (
         SELECT 1 FROM accountability_partners ap 
         WHERE (ap.user_id = u.id OR ap.partner_id = u.id) AND ap.status = 'active'
       )
       ORDER BY RANDOM() LIMIT 1`,
      [req.userId]
    );

    if (availablePartner.rows.length === 0) {
      return res.json({ 
        success: false, 
        message: 'No available partners at the moment. Please try again later.' 
      });
    }

    await query(
      `INSERT INTO accountability_partners (user_id, partner_id, status)
       VALUES ($1, $2, 'pending')
       ON CONFLICT (user_id, partner_id) DO UPDATE SET status = 'pending'`,
      [req.userId, availablePartner.rows[0].id]
    );

    res.json({ success: true, message: 'Partner request sent!' });
  } catch (err) {
    console.error('Request partner error:', err);
    res.status(500).json({ error: 'Failed to request partner' });
  }
});

// Get my accountability partner
router.get('/partners/my-partner', async (req, res) => {
  try {
    const result = await query(
      `SELECT ap.*, 
              CASE WHEN ap.user_id = $1 THEN u2.name ELSE u1.name END as partner_name,
              CASE WHEN ap.user_id = $1 THEN u2.current_streak ELSE u1.current_streak END as partner_streak
       FROM accountability_partners ap
       LEFT JOIN users u1 ON ap.user_id = u1.id
       LEFT JOIN users u2 ON ap.partner_id = u2.id
       WHERE (ap.user_id = $1 OR ap.partner_id = $1) AND ap.status = 'active'
       LIMIT 1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.json({ hasPartner: false });
    }

    const partner = result.rows[0];
    res.json({
      hasPartner: true,
      partner: {
        name: partner.partner_name,
        streak: partner.partner_streak,
        matchedAt: partner.matched_at
      }
    });
  } catch (err) {
    console.error('Get partner error:', err);
    res.status(500).json({ error: 'Failed to get partner' });
  }
});

export default router;
