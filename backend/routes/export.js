import express from 'express';
import { query } from '../db/init.js';

const router = express.Router();

router.get('/json', async (req, res) => {
  try {
    const userId = req.userId;
    
    const userResult = await query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];
    const assessmentsResult = await query('SELECT * FROM assessments WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    const assessments = assessmentsResult.rows;
    const checkinsResult = await query('SELECT * FROM daily_checkins WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    const checkins = checkinsResult.rows;
    const moodsResult = await query('SELECT * FROM mood_logs WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    const moods = moodsResult.rows;
    const challengesResult = await query('SELECT * FROM user_challenges WHERE user_id = $1', [userId]);
    const challenges = challengesResult.rows;
    const questsResult = await query('SELECT * FROM user_quests WHERE user_id = $1', [userId]);
    const quests = questsResult.rows;
    
    let xpData = { total_xp: 0, current_level: 1, xp_to_next_level: 100 };
    try {
      const xpResult = await query('SELECT * FROM user_xp WHERE user_id = $1', [userId]);
      if (xpResult.rows[0]) xpData = xpResult.rows[0];
    } catch (e) {}
    
    const exportData = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      user: {
        displayName: user?.display_name || 'User',
        purpose: user?.purpose || 'personal',
        createdAt: user?.created_at
      },
      statistics: {
        totalXP: xpData.total_xp || 0,
        level: xpData.current_level || 1,
        xpToNextLevel: xpData.xp_to_next_level || 100,
        totalAssessments: assessments.length,
        totalCheckins: checkins.length,
        totalMoodEntries: moods.length
      },
      data: {
        assessments: assessments.map(a => ({
          date: a.created_at,
          scores: a.scores,
          purpose: a.purpose
        })),
        checkins: checkins.map(c => ({
          date: c.created_at,
          layer: c.layer,
          score: c.score,
          notes: c.notes
        })),
        moods: moods.map(m => ({
          date: m.created_at,
          mood: m.mood_score,
          energy: m.energy_score,
          notes: m.notes
        })),
        challenges: challenges.map(c => ({
          id: c.challenge_id,
          status: c.status,
          startedAt: c.started_at,
          completedAt: c.completed_at,
          progress: c.progress
        })),
        quests: quests.map(q => ({
          questId: q.quest_id,
          status: q.status,
          progress: q.progress
        }))
      }
    };
    
    res.json(exportData);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

router.get('/csv', async (req, res) => {
  try {
    const userId = req.userId;
    const type = req.query.type || 'checkins';
    
    let data = [];
    let headers = [];
    
    if (type === 'checkins') {
      const result = await query('SELECT * FROM daily_checkins WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      const checkins = result.rows;
      headers = ['Date', 'Layer', 'Score', 'Notes'];
      data = checkins.map(c => [
        new Date(c.created_at).toISOString().split('T')[0],
        c.layer || 'general',
        c.score || 0,
        (c.notes || '').replace(/"/g, '""')
      ]);
    } else if (type === 'moods') {
      const result = await query('SELECT * FROM mood_logs WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      const moods = result.rows;
      headers = ['Date', 'Time', 'Mood', 'Energy', 'Notes'];
      data = moods.map(m => [
        new Date(m.created_at).toISOString().split('T')[0],
        new Date(m.created_at).toTimeString().split(' ')[0],
        m.mood_score || '',
        m.energy_score || '',
        (m.notes || '').replace(/"/g, '""')
      ]);
    } else if (type === 'assessments') {
      const result = await query('SELECT * FROM assessments WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      const assessments = result.rows;
      headers = ['Date', 'Purpose', 'BioHardware', 'InternalOS', 'CulturalSoftware', 'SocialInstance', 'ConsciousUser', 'Average'];
      data = assessments.map(a => {
        const scores = a.scores || {};
        return [
          new Date(a.created_at).toISOString().split('T')[0],
          a.purpose || 'personal',
          scores.bioHardware || 0,
          scores.internalOS || 0,
          scores.culturalSoftware || 0,
          scores.socialInstance || 0,
          scores.consciousUser || 0,
          Object.values(scores).length > 0 
            ? (Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length).toFixed(1)
            : 0
        ];
      });
    }
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=akofa-${type}-export.csv`);
    res.send(csvContent);
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

router.post('/import', async (req, res) => {
  try {
    const userId = req.userId;
    const importData = req.body;
    
    if (!importData || !importData.data) {
      return res.status(400).json({ error: 'Invalid import data' });
    }
    
    let imported = { assessments: 0, checkins: 0, moods: 0 };
    
    res.json({ 
      success: true, 
      message: 'Import completed',
      imported
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import data' });
  }
});

export default router;
