import express from 'express';
import { query } from '../db/init.js';

const router = express.Router();

const reflectionPrompts = [
  "What pattern did you notice in your thoughts today?",
  "What cultural belief influenced a decision you made?",
  "How did your energy levels affect your interactions?",
  "What assumption did you challenge today?",
  "What relationship dynamic stood out to you?",
  "What habit served you well today?",
  "What mental model helped you navigate a situation?",
  "How did your physical state affect your mood?",
  "What social influence shaped your behavior today?",
  "What belief system did you operate from unconsciously?"
];

const getRandomPrompt = () => reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)];

// Get today's check-in
router.get('/today', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM daily_checkins 
       WHERE user_id = $1 AND checkin_date = CURRENT_DATE`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.json({ 
        hasCheckedIn: false,
        prompt: getRandomPrompt()
      });
    }

    const checkin = result.rows[0];
    res.json({
      hasCheckedIn: true,
      checkin: {
        id: checkin.id,
        bioHardware: checkin.bio_hardware,
        internalOS: checkin.internal_os,
        culturalSoftware: checkin.cultural_software,
        socialInstance: checkin.social_instance,
        consciousUser: checkin.conscious_user,
        culturalBug: checkin.cultural_bug,
        mood: checkin.mood,
        energyLevel: checkin.energy_level,
        dailyWin: checkin.daily_win,
        symptomLog: checkin.symptom_log,
        reflectionPrompt: checkin.reflection_prompt,
        reflectionResponse: checkin.reflection_response
      }
    });
  } catch (err) {
    console.error('Get today checkin error:', err);
    res.status(500).json({ error: 'Failed to get check-in' });
  }
});

// Submit daily check-in
router.post('/', async (req, res) => {
  try {
    const {
      bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser,
      culturalBug, mood, energyLevel, dailyWin, symptomLog, reflectionPrompt, reflectionResponse
    } = req.body;

    // Check if already checked in today
    const existing = await query(
      `SELECT id FROM daily_checkins WHERE user_id = $1 AND checkin_date = CURRENT_DATE`,
      [req.userId]
    );

    let result;
    if (existing.rows.length > 0) {
      // Update existing
      result = await query(
        `UPDATE daily_checkins SET
          bio_hardware = $2, internal_os = $3, cultural_software = $4,
          social_instance = $5, conscious_user = $6, cultural_bug = $7,
          mood = $8, energy_level = $9, daily_win = $10, symptom_log = $11,
          reflection_prompt = $12, reflection_response = $13
        WHERE user_id = $1 AND checkin_date = CURRENT_DATE
        RETURNING *`,
        [req.userId, bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser,
         culturalBug, mood, energyLevel, dailyWin, symptomLog, reflectionPrompt, reflectionResponse]
      );
    } else {
      // Insert new
      result = await query(
        `INSERT INTO daily_checkins 
          (user_id, bio_hardware, internal_os, cultural_software, social_instance, conscious_user,
           cultural_bug, mood, energy_level, daily_win, symptom_log, reflection_prompt, reflection_response)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [req.userId, bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser,
         culturalBug, mood, energyLevel, dailyWin, symptomLog, reflectionPrompt, reflectionResponse]
      );

      // Update user streak
      await updateStreak(req.userId);
    }

    res.json({ success: true, checkin: result.rows[0] });
  } catch (err) {
    console.error('Submit checkin error:', err);
    res.status(500).json({ error: 'Failed to submit check-in' });
  }
});

// Get check-in history
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const result = await query(
      `SELECT * FROM daily_checkins 
       WHERE user_id = $1 
       ORDER BY checkin_date DESC 
       LIMIT $2`,
      [req.userId, limit]
    );

    const checkins = result.rows.map(c => ({
      id: c.id,
      date: c.checkin_date,
      bioHardware: c.bio_hardware,
      internalOS: c.internal_os,
      culturalSoftware: c.cultural_software,
      socialInstance: c.social_instance,
      consciousUser: c.conscious_user,
      mood: c.mood,
      energyLevel: c.energy_level
    }));

    res.json({ checkins });
  } catch (err) {
    console.error('Get checkin history error:', err);
    res.status(500).json({ error: 'Failed to get history' });
  }
});

// Get streak info
router.get('/streak', async (req, res) => {
  try {
    const result = await query(
      `SELECT current_streak, longest_streak, total_checkins FROM users WHERE id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    
    // Get streak calendar (last 30 days)
    const calendarResult = await query(
      `SELECT checkin_date FROM daily_checkins 
       WHERE user_id = $1 AND checkin_date >= CURRENT_DATE - INTERVAL '30 days'
       ORDER BY checkin_date DESC`,
      [req.userId]
    );

    res.json({
      currentStreak: user.current_streak || 0,
      longestStreak: user.longest_streak || 0,
      totalCheckins: user.total_checkins || 0,
      checkinDates: calendarResult.rows.map(r => r.checkin_date)
    });
  } catch (err) {
    console.error('Get streak error:', err);
    res.status(500).json({ error: 'Failed to get streak' });
  }
});

// Helper function to update streak
async function updateStreak(userId) {
  try {
    // Get last check-in before today
    const lastCheckin = await query(
      `SELECT checkin_date FROM daily_checkins 
       WHERE user_id = $1 AND checkin_date < CURRENT_DATE 
       ORDER BY checkin_date DESC LIMIT 1`,
      [userId]
    );

    const user = await query(
      `SELECT current_streak, longest_streak, total_checkins FROM users WHERE id = $1`,
      [userId]
    );

    let currentStreak = user.rows[0]?.current_streak || 0;
    let longestStreak = user.rows[0]?.longest_streak || 0;
    let totalCheckins = (user.rows[0]?.total_checkins || 0) + 1;

    if (lastCheckin.rows.length > 0) {
      const lastDate = new Date(lastCheckin.rows[0].checkin_date);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      if (lastDate.getTime() === yesterday.getTime()) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    await query(
      `UPDATE users SET current_streak = $2, longest_streak = $3, total_checkins = $4, updated_at = NOW()
       WHERE id = $1`,
      [userId, currentStreak, longestStreak, totalCheckins]
    );

    // Check for streak badges
    await checkStreakBadges(userId, currentStreak, totalCheckins);
  } catch (err) {
    console.error('Update streak error:', err);
  }
}

// Check and award streak badges
async function checkStreakBadges(userId, streak, totalCheckins) {
  const badges = [];
  
  if (streak >= 7) badges.push({ type: 'streak', name: 'Week Warrior', desc: '7-day streak achieved!' });
  if (streak >= 30) badges.push({ type: 'streak', name: 'Monthly Master', desc: '30-day streak achieved!' });
  if (streak >= 100) badges.push({ type: 'streak', name: 'Century Champion', desc: '100-day streak achieved!' });
  if (totalCheckins >= 10) badges.push({ type: 'milestone', name: 'Getting Started', desc: '10 check-ins completed!' });
  if (totalCheckins >= 50) badges.push({ type: 'milestone', name: 'Committed', desc: '50 check-ins completed!' });
  if (totalCheckins >= 100) badges.push({ type: 'milestone', name: 'Dedicated', desc: '100 check-ins completed!' });

  for (const badge of badges) {
    try {
      await query(
        `INSERT INTO user_badges (user_id, badge_type, badge_name, badge_description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, badge_type, badge_name) DO NOTHING`,
        [userId, badge.type, badge.name, badge.desc]
      );
    } catch (err) {
      // Badge already exists, ignore
    }
  }
}

export default router;
