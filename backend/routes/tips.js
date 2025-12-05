import express from 'express';
import { query } from '../db/init.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let TIPS_DATA = { tips: [] };
try {
  const tipsPath = join(__dirname, '../data/tips.json');
  TIPS_DATA = JSON.parse(readFileSync(tipsPath, 'utf8'));
} catch (err) {
  console.error('Failed to load tips data:', err);
}

const getTodaysTipIndex = () => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % TIPS_DATA.tips.length;
};

router.get('/today', async (req, res) => {
  try {
    const tipIndex = getTodaysTipIndex();
    const tip = TIPS_DATA.tips[tipIndex];

    if (!tip) {
      return res.status(404).json({ error: 'No tip available' });
    }

    let isSaved = false;
    if (req.userId) {
      const savedCheck = await query(
        `SELECT id FROM user_favorites 
         WHERE user_id = $1 AND item_type = 'tip' AND item_id = $2`,
        [req.userId, tip.id]
      );
      isSaved = savedCheck.rows.length > 0;
    }

    res.json({
      tip: {
        ...tip,
        isSaved
      },
      tipNumber: tipIndex + 1,
      totalTips: TIPS_DATA.tips.length
    });
  } catch (err) {
    console.error('Get today tip error:', err);
    res.status(500).json({ error: 'Failed to get tip' });
  }
});

router.get('/layer/:layer', async (req, res) => {
  try {
    const { layer } = req.params;
    let layerTips = TIPS_DATA.tips.filter(tip => tip.layer === layer);

    if (req.userId) {
      const savedTips = await query(
        `SELECT item_id FROM user_favorites 
         WHERE user_id = $1 AND item_type = 'tip'`,
        [req.userId]
      );
      const savedIds = new Set(savedTips.rows.map(r => r.item_id));
      
      layerTips = layerTips.map(tip => ({
        ...tip,
        isSaved: savedIds.has(tip.id)
      }));
    }

    res.json({
      layer,
      tips: layerTips,
      count: layerTips.length
    });
  } catch (err) {
    console.error('Get layer tips error:', err);
    res.status(500).json({ error: 'Failed to get tips' });
  }
});

router.get('/all', async (req, res) => {
  try {
    let tips = TIPS_DATA.tips.map(tip => ({ ...tip }));

    if (req.userId) {
      const savedTips = await query(
        `SELECT item_id FROM user_favorites 
         WHERE user_id = $1 AND item_type = 'tip'`,
        [req.userId]
      );
      const savedIds = new Set(savedTips.rows.map(r => r.item_id));
      
      tips = tips.map(tip => ({
        ...tip,
        isSaved: savedIds.has(tip.id)
      }));
    }

    const byLayer = {
      bioHardware: tips.filter(t => t.layer === 'bioHardware'),
      internalOS: tips.filter(t => t.layer === 'internalOS'),
      culturalSoftware: tips.filter(t => t.layer === 'culturalSoftware'),
      socialInstance: tips.filter(t => t.layer === 'socialInstance'),
      consciousUser: tips.filter(t => t.layer === 'consciousUser')
    };

    res.json({
      tips,
      byLayer,
      total: tips.length
    });
  } catch (err) {
    console.error('Get all tips error:', err);
    res.status(500).json({ error: 'Failed to get tips' });
  }
});

router.post('/save/:tipId', async (req, res) => {
  try {
    const tipId = parseInt(req.params.tipId);
    
    const tip = TIPS_DATA.tips.find(t => t.id === tipId);
    if (!tip) {
      return res.status(404).json({ error: 'Tip not found' });
    }

    await query(
      `INSERT INTO user_favorites (user_id, item_type, item_id)
       VALUES ($1, 'tip', $2)
       ON CONFLICT (user_id, item_type, item_id) DO NOTHING`,
      [req.userId, tipId]
    );

    res.json({
      success: true,
      message: 'Tip saved',
      tipId
    });
  } catch (err) {
    console.error('Save tip error:', err);
    res.status(500).json({ error: 'Failed to save tip' });
  }
});

router.delete('/save/:tipId', async (req, res) => {
  try {
    const tipId = parseInt(req.params.tipId);

    await query(
      `DELETE FROM user_favorites 
       WHERE user_id = $1 AND item_type = 'tip' AND item_id = $2`,
      [req.userId, tipId]
    );

    res.json({
      success: true,
      message: 'Tip unsaved',
      tipId
    });
  } catch (err) {
    console.error('Unsave tip error:', err);
    res.status(500).json({ error: 'Failed to unsave tip' });
  }
});

router.get('/saved', async (req, res) => {
  try {
    const savedResult = await query(
      `SELECT item_id, created_at FROM user_favorites 
       WHERE user_id = $1 AND item_type = 'tip'
       ORDER BY created_at DESC`,
      [req.userId]
    );

    const savedTips = savedResult.rows.map(row => {
      const tip = TIPS_DATA.tips.find(t => t.id === row.item_id);
      return tip ? { ...tip, savedAt: row.created_at, isSaved: true } : null;
    }).filter(Boolean);

    res.json({
      savedTips,
      count: savedTips.length
    });
  } catch (err) {
    console.error('Get saved tips error:', err);
    res.status(500).json({ error: 'Failed to get saved tips' });
  }
});

router.get('/random', async (req, res) => {
  try {
    const { layer } = req.query;
    
    let tipPool = TIPS_DATA.tips;
    if (layer) {
      tipPool = tipPool.filter(t => t.layer === layer);
    }

    if (tipPool.length === 0) {
      return res.status(404).json({ error: 'No tips available' });
    }

    const randomIndex = Math.floor(Math.random() * tipPool.length);
    const tip = tipPool[randomIndex];

    let isSaved = false;
    if (req.userId) {
      const savedCheck = await query(
        `SELECT id FROM user_favorites 
         WHERE user_id = $1 AND item_type = 'tip' AND item_id = $2`,
        [req.userId, tip.id]
      );
      isSaved = savedCheck.rows.length > 0;
    }

    res.json({
      tip: { ...tip, isSaved }
    });
  } catch (err) {
    console.error('Get random tip error:', err);
    res.status(500).json({ error: 'Failed to get random tip' });
  }
});

router.get('/share/:tipId', async (req, res) => {
  try {
    const tipId = parseInt(req.params.tipId);
    const tip = TIPS_DATA.tips.find(t => t.id === tipId);
    
    if (!tip) {
      return res.status(404).json({ error: 'Tip not found' });
    }

    const shareData = {
      text: `${tip.title}: ${tip.content}\n\nAction Step: ${tip.actionStep}\n\n- From Akↄfa Fixit`,
      url: `https://akofa-fixit.app/tips/${tipId}`,
      title: `Akↄfa Tip: ${tip.title}`
    };

    res.json({
      tip,
      shareData
    });
  } catch (err) {
    console.error('Get share tip error:', err);
    res.status(500).json({ error: 'Failed to get share data' });
  }
});

export default router;
