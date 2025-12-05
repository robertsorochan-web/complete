import express from 'express';
import { query } from '../db/init.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { moodScore, energyScore, notes, tags } = req.body;
    
    if (!moodScore || moodScore < 1 || moodScore > 5) {
      return res.status(400).json({ error: 'Mood score must be between 1 and 5' });
    }

    const hour = new Date().getHours();
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else if (hour >= 21 || hour < 6) timeOfDay = 'night';

    const result = await query(
      `INSERT INTO mood_logs (user_id, mood_score, energy_score, notes, tags, time_of_day)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.userId, moodScore, energyScore || null, notes || null, tags || [], timeOfDay]
    );

    res.json({
      success: true,
      moodLog: {
        id: result.rows[0].id,
        moodScore: result.rows[0].mood_score,
        energyScore: result.rows[0].energy_score,
        notes: result.rows[0].notes,
        tags: result.rows[0].tags,
        timeOfDay: result.rows[0].time_of_day,
        loggedAt: result.rows[0].logged_at
      }
    });
  } catch (err) {
    console.error('Log mood error:', err);
    res.status(500).json({ error: 'Failed to log mood' });
  }
});

router.get('/today', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM mood_logs 
       WHERE user_id = $1 AND DATE(logged_at) = CURRENT_DATE
       ORDER BY logged_at DESC`,
      [req.userId]
    );

    res.json({
      logs: result.rows.map(l => ({
        id: l.id,
        moodScore: l.mood_score,
        energyScore: l.energy_score,
        notes: l.notes,
        tags: l.tags,
        timeOfDay: l.time_of_day,
        loggedAt: l.logged_at
      }))
    });
  } catch (err) {
    console.error('Get today mood error:', err);
    res.status(500).json({ error: 'Failed to get mood logs' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    
    const result = await query(
      `SELECT * FROM mood_logs 
       WHERE user_id = $1 AND logged_at >= CURRENT_DATE - INTERVAL '${days} days'
       ORDER BY logged_at DESC`,
      [req.userId]
    );

    res.json({
      logs: result.rows.map(l => ({
        id: l.id,
        moodScore: l.mood_score,
        energyScore: l.energy_score,
        notes: l.notes,
        tags: l.tags,
        timeOfDay: l.time_of_day,
        loggedAt: l.logged_at
      }))
    });
  } catch (err) {
    console.error('Get mood history error:', err);
    res.status(500).json({ error: 'Failed to get mood history' });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;

    const avgByTime = await query(
      `SELECT time_of_day, 
              ROUND(AVG(mood_score)::numeric, 2) as avg_mood,
              ROUND(AVG(energy_score)::numeric, 2) as avg_energy,
              COUNT(*) as count
       FROM mood_logs 
       WHERE user_id = $1 AND logged_at >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY time_of_day`,
      [req.userId]
    );

    const dailyAvg = await query(
      `SELECT DATE(logged_at) as date,
              ROUND(AVG(mood_score)::numeric, 2) as avg_mood,
              ROUND(AVG(energy_score)::numeric, 2) as avg_energy
       FROM mood_logs 
       WHERE user_id = $1 AND logged_at >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY DATE(logged_at)
       ORDER BY date DESC`,
      [req.userId]
    );

    const correlation = await query(
      `SELECT 
        CORR(mood_score, energy_score) as mood_energy_correlation
       FROM mood_logs 
       WHERE user_id = $1 AND energy_score IS NOT NULL`,
      [req.userId]
    );

    const tagStats = await query(
      `SELECT unnest(tags) as tag, 
              ROUND(AVG(mood_score)::numeric, 2) as avg_mood,
              COUNT(*) as count
       FROM mood_logs 
       WHERE user_id = $1 AND logged_at >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY tag
       ORDER BY count DESC
       LIMIT 10`,
      [req.userId]
    );

    const checkinCorrelation = await query(
      `SELECT 
        dc.bio_hardware, dc.internal_os, dc.cultural_software, dc.social_instance, dc.conscious_user,
        ml.mood_score
       FROM mood_logs ml
       INNER JOIN daily_checkins dc ON ml.user_id = dc.user_id AND DATE(ml.logged_at) = dc.checkin_date
       WHERE ml.user_id = $1 AND ml.logged_at >= CURRENT_DATE - INTERVAL '${days} days'`,
      [req.userId]
    );

    let layerCorrelations = {};
    if (checkinCorrelation.rows.length >= 5) {
      const moods = checkinCorrelation.rows.map(r => r.mood_score);
      const layers = ['bio_hardware', 'internal_os', 'cultural_software', 'social_instance', 'conscious_user'];
      
      layers.forEach(layer => {
        const layerScores = checkinCorrelation.rows.map(r => r[layer]);
        const correlation = calculateCorrelation(moods, layerScores);
        layerCorrelations[layer] = Math.round(correlation * 100) / 100;
      });
    }

    res.json({
      byTimeOfDay: avgByTime.rows,
      dailyTrend: dailyAvg.rows,
      moodEnergyCorrelation: parseFloat(correlation.rows[0]?.mood_energy_correlation) || 0,
      tagAnalysis: tagStats.rows,
      layerCorrelations,
      insights: generateInsights(avgByTime.rows, layerCorrelations)
    });
  } catch (err) {
    console.error('Get mood analytics error:', err);
    res.status(500).json({ error: 'Failed to get mood analytics' });
  }
});

function calculateCorrelation(arr1, arr2) {
  if (arr1.length !== arr2.length || arr1.length === 0) return 0;
  
  const n = arr1.length;
  const sum1 = arr1.reduce((a, b) => a + b, 0);
  const sum2 = arr2.reduce((a, b) => a + b, 0);
  const sum1Sq = arr1.reduce((a, b) => a + b * b, 0);
  const sum2Sq = arr2.reduce((a, b) => a + b * b, 0);
  const sumProd = arr1.reduce((a, b, i) => a + b * arr2[i], 0);
  
  const num = sumProd - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  return den === 0 ? 0 : num / den;
}

function generateInsights(timeData, layerCorrelations) {
  const insights = [];
  
  const bestTime = timeData.reduce((best, curr) => 
    (parseFloat(curr.avg_mood) > parseFloat(best.avg_mood)) ? curr : best, 
    timeData[0] || { time_of_day: 'morning', avg_mood: 0 }
  );
  
  if (bestTime && parseFloat(bestTime.avg_mood) > 0) {
    insights.push({
      type: 'positive',
      message: `Your mood tends to be best in the ${bestTime.time_of_day} (avg ${bestTime.avg_mood}/5)`
    });
  }

  if (Object.keys(layerCorrelations).length > 0) {
    const strongestLayer = Object.entries(layerCorrelations)
      .reduce((best, [layer, corr]) => Math.abs(corr) > Math.abs(best[1]) ? [layer, corr] : best, ['', 0]);
    
    if (Math.abs(strongestLayer[1]) > 0.3) {
      const layerName = strongestLayer[0].replace('_', ' ');
      const direction = strongestLayer[1] > 0 ? 'positively' : 'negatively';
      insights.push({
        type: strongestLayer[1] > 0 ? 'positive' : 'warning',
        message: `Your ${layerName} scores are ${direction} correlated with your mood`
      });
    }
  }

  return insights;
}

export default router;
