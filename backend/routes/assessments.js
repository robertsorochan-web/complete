import express from 'express';
import { query } from '../db/init.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM assessments WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        environmentalMatrix: 5,
        bioHardware: 5,
        internalOS: 5,
        culturalSoftware: 5,
        socialInstance: 5,
        consciousUser: 5,
        existentialContext: 5
      });
    }

    const assessment = result.rows[0];
    res.json({
      id: assessment.id,
      environmentalMatrix: assessment.environmental_matrix || 5,
      bioHardware: assessment.bio_hardware,
      internalOS: assessment.internal_os,
      culturalSoftware: assessment.cultural_software,
      socialInstance: assessment.social_instance,
      consciousUser: assessment.conscious_user,
      existentialContext: assessment.existential_context || 5,
      updatedAt: assessment.updated_at
    });
  } catch (err) {
    console.error('Get assessment error:', err);
    res.status(500).json({ error: 'Failed to get assessment' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { 
      environmentalMatrix, bioHardware, internalOS, culturalSoftware, 
      socialInstance, consciousUser, existentialContext 
    } = req.body;

    const result = await query(
      `INSERT INTO assessments (user_id, environmental_matrix, bio_hardware, internal_os, cultural_software, social_instance, conscious_user, existential_context)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.userId, environmentalMatrix || 5, bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser, existentialContext || 5]
    );

    const assessment = result.rows[0];
    res.json({
      id: assessment.id,
      environmentalMatrix: assessment.environmental_matrix,
      bioHardware: assessment.bio_hardware,
      internalOS: assessment.internal_os,
      culturalSoftware: assessment.cultural_software,
      socialInstance: assessment.social_instance,
      consciousUser: assessment.conscious_user,
      existentialContext: assessment.existential_context
    });
  } catch (err) {
    console.error('Update assessment error:', err);
    res.status(500).json({ error: 'Failed to update assessment' });
  }
});

export default router;
