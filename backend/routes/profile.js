import express from 'express';
import { query } from '../db/init.js';

const router = express.Router();

// Get user profile with all stats
router.get('/', async (req, res) => {
  try {
    const userResult = await query(
      `SELECT id, email, name, purpose, tier, stack_score, current_streak, longest_streak, 
              total_checkins, ai_insights_used, ai_insights_reset_date, created_at
       FROM users WHERE id = $1`,
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Get badges
    const badges = await query(
      `SELECT badge_type, badge_name, badge_description, earned_at
       FROM user_badges WHERE user_id = $1 ORDER BY earned_at DESC`,
      [req.userId]
    );

    // Get completed challenges count
    const challenges = await query(
      `SELECT COUNT(*) as completed FROM user_challenges 
       WHERE user_id = $1 AND status = 'completed'`,
      [req.userId]
    );

    // Get groups count
    const groups = await query(
      `SELECT COUNT(*) as joined FROM user_groups WHERE user_id = $1`,
      [req.userId]
    );

    // Get milestones
    const milestones = await query(
      `SELECT milestone_type, milestone_name, milestone_value, achieved_at
       FROM progress_milestones WHERE user_id = $1 ORDER BY achieved_at DESC LIMIT 10`,
      [req.userId]
    );

    // Check if AI insights should reset (monthly)
    const today = new Date();
    const resetDate = new Date(user.ai_insights_reset_date);
    if (today.getMonth() !== resetDate.getMonth() || today.getFullYear() !== resetDate.getFullYear()) {
      await query(
        `UPDATE users SET ai_insights_used = 0, ai_insights_reset_date = CURRENT_DATE WHERE id = $1`,
        [req.userId]
      );
      user.ai_insights_used = 0;
    }

    // Calculate tier limits
    const tierLimits = getTierLimits(user.tier);

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      purpose: user.purpose,
      tier: user.tier,
      stackScore: user.stack_score,
      currentStreak: user.current_streak,
      longestStreak: user.longest_streak,
      totalCheckins: user.total_checkins,
      aiInsightsUsed: user.ai_insights_used,
      aiInsightsLimit: tierLimits.aiInsights,
      memberSince: user.created_at,
      badges: badges.rows,
      completedChallenges: parseInt(challenges.rows[0].completed),
      groupsJoined: parseInt(groups.rows[0].joined),
      recentMilestones: milestones.rows,
      tierFeatures: tierLimits
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update profile
router.put('/', async (req, res) => {
  try {
    const { name, purpose } = req.body;

    await query(
      `UPDATE users SET name = COALESCE($2, name), purpose = COALESCE($3, purpose), updated_at = NOW()
       WHERE id = $1`,
      [req.userId, name, purpose]
    );

    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get badges
router.get('/badges', async (req, res) => {
  try {
    const result = await query(
      `SELECT badge_type, badge_name, badge_description, earned_at
       FROM user_badges WHERE user_id = $1 ORDER BY earned_at DESC`,
      [req.userId]
    );

    // Get available badges the user hasn't earned
    const allBadges = getAllPossibleBadges();
    const earnedBadgeNames = result.rows.map(b => b.badge_name);
    const lockedBadges = allBadges.filter(b => !earnedBadgeNames.includes(b.name));

    res.json({
      earned: result.rows,
      locked: lockedBadges
    });
  } catch (err) {
    console.error('Get badges error:', err);
    res.status(500).json({ error: 'Failed to get badges' });
  }
});

// Get notification preferences
router.get('/notifications', async (req, res) => {
  try {
    let result = await query(
      `SELECT * FROM notification_preferences WHERE user_id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      // Create default preferences
      await query(
        `INSERT INTO notification_preferences (user_id) VALUES ($1)`,
        [req.userId]
      );
      result = await query(
        `SELECT * FROM notification_preferences WHERE user_id = $1`,
        [req.userId]
      );
    }

    const prefs = result.rows[0];
    res.json({
      dailyReminderTime: prefs.daily_reminder_time,
      weeklyReviewDay: prefs.weekly_review_day,
      pushEnabled: prefs.push_enabled,
      emailEnabled: prefs.email_enabled
    });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: 'Failed to get notification preferences' });
  }
});

// Update notification preferences
router.put('/notifications', async (req, res) => {
  try {
    const { dailyReminderTime, weeklyReviewDay, pushEnabled, emailEnabled } = req.body;

    await query(
      `INSERT INTO notification_preferences (user_id, daily_reminder_time, weekly_review_day, push_enabled, email_enabled)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE SET
         daily_reminder_time = COALESCE($2, notification_preferences.daily_reminder_time),
         weekly_review_day = COALESCE($3, notification_preferences.weekly_review_day),
         push_enabled = COALESCE($4, notification_preferences.push_enabled),
         email_enabled = COALESCE($5, notification_preferences.email_enabled),
         updated_at = NOW()`,
      [req.userId, dailyReminderTime, weeklyReviewDay, pushEnabled, emailEnabled]
    );

    res.json({ success: true, message: 'Preferences updated' });
  } catch (err) {
    console.error('Update notifications error:', err);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Check AI insight usage
router.get('/ai-usage', async (req, res) => {
  try {
    const result = await query(
      `SELECT tier, ai_insights_used, ai_insights_reset_date FROM users WHERE id = $1`,
      [req.userId]
    );

    const user = result.rows[0];
    const tierLimits = getTierLimits(user.tier);

    res.json({
      used: user.ai_insights_used,
      limit: tierLimits.aiInsights,
      remaining: Math.max(0, tierLimits.aiInsights - user.ai_insights_used),
      isUnlimited: tierLimits.aiInsights === Infinity,
      resetsOn: getNextMonthStart()
    });
  } catch (err) {
    console.error('Get AI usage error:', err);
    res.status(500).json({ error: 'Failed to get AI usage' });
  }
});

// Increment AI usage
router.post('/ai-usage/increment', async (req, res) => {
  try {
    const result = await query(
      `SELECT tier, ai_insights_used FROM users WHERE id = $1`,
      [req.userId]
    );

    const user = result.rows[0];
    const tierLimits = getTierLimits(user.tier);

    if (tierLimits.aiInsights !== Infinity && user.ai_insights_used >= tierLimits.aiInsights) {
      return res.status(403).json({ 
        error: 'AI insight limit reached',
        upgradeRequired: true
      });
    }

    await query(
      `UPDATE users SET ai_insights_used = ai_insights_used + 1 WHERE id = $1`,
      [req.userId]
    );

    res.json({ 
      success: true, 
      remaining: tierLimits.aiInsights === Infinity ? 'unlimited' : tierLimits.aiInsights - user.ai_insights_used - 1
    });
  } catch (err) {
    console.error('Increment AI usage error:', err);
    res.status(500).json({ error: 'Failed to increment AI usage' });
  }
});

function getTierLimits(tier) {
  const tiers = {
    free: {
      aiInsights: 3,
      dailyCheckinLayers: 1,
      communityAccess: 'read-only',
      challenges: 1,
      dataExport: false,
      customNotifications: false
    },
    pro: {
      aiInsights: Infinity,
      dailyCheckinLayers: 5,
      communityAccess: 'full',
      challenges: Infinity,
      dataExport: true,
      customNotifications: true
    },
    teams: {
      aiInsights: Infinity,
      dailyCheckinLayers: 5,
      communityAccess: 'full',
      challenges: Infinity,
      dataExport: true,
      customNotifications: true,
      teamDashboard: true
    },
    enterprise: {
      aiInsights: Infinity,
      dailyCheckinLayers: 5,
      communityAccess: 'full',
      challenges: Infinity,
      dataExport: true,
      customNotifications: true,
      teamDashboard: true,
      api: true,
      whiteLabel: true
    }
  };

  return tiers[tier] || tiers.free;
}

function getAllPossibleBadges() {
  return [
    { type: 'streak', name: 'Week Warrior', description: '7-day streak' },
    { type: 'streak', name: 'Monthly Master', description: '30-day streak' },
    { type: 'streak', name: 'Century Champion', description: '100-day streak' },
    { type: 'milestone', name: 'Getting Started', description: '10 check-ins' },
    { type: 'milestone', name: 'Committed', description: '50 check-ins' },
    { type: 'milestone', name: 'Dedicated', description: '100 check-ins' },
    { type: 'score', name: 'Stack Novice', description: 'Reach 450 StackScore' },
    { type: 'score', name: 'Stack Practitioner', description: 'Reach 550 StackScore' },
    { type: 'score', name: 'Stack Adept', description: 'Reach 650 StackScore' },
    { type: 'score', name: 'Stack Master', description: 'Reach 750 StackScore' },
    { type: 'score', name: 'Stack Guru', description: 'Reach 850 StackScore' },
    { type: 'community', name: 'Team Player', description: 'Join 3 groups' },
    { type: 'community', name: 'Storyteller', description: 'Share a success story' },
    { type: 'community', name: 'Helpful', description: 'Share 5 insights' }
  ];
}

function getNextMonthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

export default router;
