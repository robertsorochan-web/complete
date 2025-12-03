import express from 'express';
import { query } from '../db/init.js';

const router = express.Router();

// Get assessment
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM assessments WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        bioHardware: 5,
        internalOS: 5,
        culturalSoftware: 5,
        socialInstance: 5,
        consciousUser: 5
      });
    }

    const assessment = result.rows[0];
    res.json({
      id: assessment.id,
      bioHardware: assessment.bio_hardware,
      internalOS: assessment.internal_os,
      culturalSoftware: assessment.cultural_software,
      socialInstance: assessment.social_instance,
      consciousUser: assessment.conscious_user,
      updatedAt: assessment.updated_at
    });
  } catch (err) {
    console.error('Get assessment error:', err);
    res.status(500).json({ error: 'Failed to get assessment' });
  }
});

// Update assessment
router.post('/', async (req, res) => {
  try {
    const { bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser } = req.body;

    const result = await query(
      `INSERT INTO assessments (user_id, bio_hardware, internal_os, cultural_software, social_instance, conscious_user)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.userId, bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser]
    );

    const assessment = result.rows[0];
    res.json({
      id: assessment.id,
      bioHardware: assessment.bio_hardware,
      internalOS: assessment.internal_os,
      culturalSoftware: assessment.cultural_software,
      socialInstance: assessment.social_instance,
      consciousUser: assessment.conscious_user
    });
  } catch (err) {
    console.error('Update assessment error:', err);
    res.status(500).json({ error: 'Failed to update assessment' });
  }
});

export default router;
