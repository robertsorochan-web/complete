import express from 'express';
import { query } from '../db/init.js';

const router = express.Router();

const ACHIEVEMENTS = {
  streak: [
    { id: 'streak_3', name: 'First Steps', description: 'Complete a 3-day streak', icon: 'flame', requirement: 3, xpReward: 25, rarity: 'common' },
    { id: 'streak_7', name: 'Week Warrior', description: 'Complete a 7-day streak', icon: 'fire', requirement: 7, xpReward: 75, rarity: 'common' },
    { id: 'streak_14', name: 'Fortnight Fighter', description: 'Complete a 14-day streak', icon: 'zap', requirement: 14, xpReward: 150, rarity: 'uncommon' },
    { id: 'streak_30', name: 'Monthly Master', description: 'Complete a 30-day streak', icon: 'trophy', requirement: 30, xpReward: 300, rarity: 'rare' },
    { id: 'streak_60', name: 'Two Month Titan', description: 'Complete a 60-day streak', icon: 'crown', requirement: 60, xpReward: 500, rarity: 'epic' },
    { id: 'streak_100', name: 'Century Champion', description: 'Complete a 100-day streak', icon: 'gem', requirement: 100, xpReward: 1000, rarity: 'legendary' },
    { id: 'streak_365', name: 'Year of Growth', description: 'Complete a 365-day streak', icon: 'star', requirement: 365, xpReward: 5000, rarity: 'mythic' }
  ],
  checkins: [
    { id: 'checkin_1', name: 'First Check-in', description: 'Complete your first daily check-in', icon: 'check-circle', requirement: 1, xpReward: 10, rarity: 'common' },
    { id: 'checkin_10', name: 'Getting Started', description: 'Complete 10 check-ins', icon: 'clipboard-check', requirement: 10, xpReward: 50, rarity: 'common' },
    { id: 'checkin_50', name: 'Committed', description: 'Complete 50 check-ins', icon: 'calendar-check', requirement: 50, xpReward: 150, rarity: 'uncommon' },
    { id: 'checkin_100', name: 'Centurion', description: 'Complete 100 check-ins', icon: 'award', requirement: 100, xpReward: 300, rarity: 'rare' },
    { id: 'checkin_500', name: 'Half Millennium', description: 'Complete 500 check-ins', icon: 'medal', requirement: 500, xpReward: 1000, rarity: 'epic' },
    { id: 'checkin_1000', name: 'Thousand Strong', description: 'Complete 1000 check-ins', icon: 'gem', requirement: 1000, xpReward: 2500, rarity: 'legendary' }
  ],
  levels: [
    { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: 'star', requirement: 5, xpReward: 0, rarity: 'common' },
    { id: 'level_10', name: 'Double Digits', description: 'Reach level 10', icon: 'trending-up', requirement: 10, xpReward: 0, rarity: 'uncommon' },
    { id: 'level_25', name: 'Quarter Century', description: 'Reach level 25', icon: 'target', requirement: 25, xpReward: 0, rarity: 'rare' },
    { id: 'level_50', name: 'Half Way Hero', description: 'Reach level 50', icon: 'shield', requirement: 50, xpReward: 0, rarity: 'epic' },
    { id: 'level_75', name: 'Elite Status', description: 'Reach level 75', icon: 'crown', requirement: 75, xpReward: 0, rarity: 'legendary' },
    { id: 'level_100', name: 'Maximum Level', description: 'Reach level 100', icon: 'gem', requirement: 100, xpReward: 0, rarity: 'mythic' }
  ],
  challenges: [
    { id: 'challenge_1', name: 'Challenger', description: 'Complete your first challenge', icon: 'flag', requirement: 1, xpReward: 50, rarity: 'common' },
    { id: 'challenge_5', name: 'Challenge Seeker', description: 'Complete 5 challenges', icon: 'mountain', requirement: 5, xpReward: 150, rarity: 'uncommon' },
    { id: 'challenge_10', name: 'Challenge Master', description: 'Complete 10 challenges', icon: 'summit', requirement: 10, xpReward: 300, rarity: 'rare' },
    { id: 'challenge_25', name: 'Unstoppable', description: 'Complete 25 challenges', icon: 'rocket', requirement: 25, xpReward: 750, rarity: 'epic' }
  ],
  social: [
    { id: 'first_group', name: 'Community Member', description: 'Join your first community group', icon: 'users', requirement: 1, xpReward: 25, rarity: 'common' },
    { id: 'groups_3', name: 'Social Butterfly', description: 'Join 3 community groups', icon: 'heart', requirement: 3, xpReward: 75, rarity: 'uncommon' },
    { id: 'first_insight', name: 'Insight Sharer', description: 'Share your first insight', icon: 'lightbulb', requirement: 1, xpReward: 25, rarity: 'common' },
    { id: 'insights_10', name: 'Wisdom Giver', description: 'Share 10 insights', icon: 'brain', requirement: 10, xpReward: 150, rarity: 'uncommon' },
    { id: 'friend_challenge_1', name: 'Friendly Competition', description: 'Complete your first friend challenge', icon: 'handshake', requirement: 1, xpReward: 100, rarity: 'rare' }
  ],
  layers: [
    { id: 'bio_master', name: 'Bio Hardware Expert', description: 'Rate Bio Hardware at 9+ for 7 consecutive days', icon: 'heart-pulse', layer: 'bioHardware', requirement: 7, xpReward: 200, rarity: 'rare' },
    { id: 'os_master', name: 'Internal OS Expert', description: 'Rate Internal OS at 9+ for 7 consecutive days', icon: 'cpu', layer: 'internalOS', requirement: 7, xpReward: 200, rarity: 'rare' },
    { id: 'culture_master', name: 'Cultural Software Expert', description: 'Rate Cultural Software at 9+ for 7 consecutive days', icon: 'code', layer: 'culturalSoftware', requirement: 7, xpReward: 200, rarity: 'rare' },
    { id: 'social_master', name: 'Social Instance Expert', description: 'Rate Social Instance at 9+ for 7 consecutive days', icon: 'users', layer: 'socialInstance', requirement: 7, xpReward: 200, rarity: 'rare' },
    { id: 'conscious_master', name: 'Conscious User Expert', description: 'Rate Conscious User at 9+ for 7 consecutive days', icon: 'brain', layer: 'consciousUser', requirement: 7, xpReward: 200, rarity: 'rare' },
    { id: 'balanced_stack', name: 'Balanced Stack', description: 'Have all 5 layers rated 7+ in a single check-in', icon: 'scale', requirement: 1, xpReward: 100, rarity: 'uncommon' },
    { id: 'perfect_stack', name: 'Perfect Stack', description: 'Have all 5 layers rated 10 in a single check-in', icon: 'sparkles', requirement: 1, xpReward: 500, rarity: 'legendary' }
  ],
  stackscore: [
    { id: 'score_400', name: 'Score Rising', description: 'Reach a StackScore of 400', icon: 'chart-line', requirement: 400, xpReward: 50, rarity: 'common' },
    { id: 'score_500', name: 'Half Way There', description: 'Reach a StackScore of 500', icon: 'chart-bar', requirement: 500, xpReward: 100, rarity: 'uncommon' },
    { id: 'score_600', name: 'High Achiever', description: 'Reach a StackScore of 600', icon: 'trending-up', requirement: 600, xpReward: 200, rarity: 'rare' },
    { id: 'score_700', name: 'Stack Champion', description: 'Reach a StackScore of 700', icon: 'trophy', requirement: 700, xpReward: 500, rarity: 'epic' },
    { id: 'score_800', name: 'Elite Stacker', description: 'Reach a StackScore of 800', icon: 'crown', requirement: 800, xpReward: 1000, rarity: 'legendary' }
  ],
  special: [
    { id: 'early_bird', name: 'Early Bird', description: 'Complete a check-in before 7 AM', icon: 'sunrise', requirement: 1, xpReward: 50, rarity: 'uncommon' },
    { id: 'night_owl', name: 'Night Owl', description: 'Complete a check-in after 11 PM', icon: 'moon', requirement: 1, xpReward: 50, rarity: 'uncommon' },
    { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Complete check-ins on 10 weekends', icon: 'calendar', requirement: 10, xpReward: 100, rarity: 'rare' },
    { id: 'full_reflector', name: 'Deep Thinker', description: 'Write 10 reflection responses', icon: 'pen', requirement: 10, xpReward: 100, rarity: 'uncommon' },
    { id: 'mood_logger', name: 'Mood Master', description: 'Log your mood 50 times', icon: 'smile', requirement: 50, xpReward: 150, rarity: 'rare' }
  ]
};

const RARITY_COLORS = {
  common: '#9CA3AF',
  uncommon: '#22C55E',
  rare: '#3B82F6',
  epic: '#A855F7',
  legendary: '#F59E0B',
  mythic: '#EF4444'
};

router.get('/', async (req, res) => {
  try {
    const earnedBadges = await query(
      `SELECT badge_type, badge_name, badge_description, earned_at 
       FROM user_badges WHERE user_id = $1`,
      [req.userId]
    );

    const earnedIds = new Set(earnedBadges.rows.map(b => b.badge_name.toLowerCase().replace(/\s+/g, '_')));

    const allAchievements = [];
    Object.entries(ACHIEVEMENTS).forEach(([category, achievements]) => {
      achievements.forEach(ach => {
        allAchievements.push({
          ...ach,
          category,
          earned: earnedIds.has(ach.id),
          earnedAt: earnedBadges.rows.find(b => 
            b.badge_name.toLowerCase().replace(/\s+/g, '_') === ach.id
          )?.earned_at || null,
          rarityColor: RARITY_COLORS[ach.rarity]
        });
      });
    });

    const earned = allAchievements.filter(a => a.earned);
    const unearned = allAchievements.filter(a => !a.earned);

    const totalPoints = earned.reduce((sum, a) => sum + a.xpReward, 0);

    const byRarity = {
      common: earned.filter(a => a.rarity === 'common').length,
      uncommon: earned.filter(a => a.rarity === 'uncommon').length,
      rare: earned.filter(a => a.rarity === 'rare').length,
      epic: earned.filter(a => a.rarity === 'epic').length,
      legendary: earned.filter(a => a.rarity === 'legendary').length,
      mythic: earned.filter(a => a.rarity === 'mythic').length
    };

    res.json({
      achievements: allAchievements,
      earned,
      unearned,
      stats: {
        totalEarned: earned.length,
        totalAvailable: allAchievements.length,
        totalPoints,
        percentComplete: Math.round((earned.length / allAchievements.length) * 100),
        byRarity
      }
    });
  } catch (err) {
    console.error('Get achievements error:', err);
    res.status(500).json({ error: 'Failed to get achievements' });
  }
});

router.get('/check', async (req, res) => {
  try {
    const userResult = await query(
      `SELECT current_streak, longest_streak, total_checkins, stack_score FROM users WHERE id = $1`,
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    const levelResult = await query(
      `SELECT current_level FROM user_xp WHERE user_id = $1`,
      [req.userId]
    );
    const currentLevel = levelResult.rows[0]?.current_level || 1;

    const challengesResult = await query(
      `SELECT COUNT(*) as completed FROM user_challenges 
       WHERE user_id = $1 AND status = 'completed'`,
      [req.userId]
    );
    const completedChallenges = parseInt(challengesResult.rows[0]?.completed || 0);

    const groupsResult = await query(
      `SELECT COUNT(*) as joined FROM user_groups WHERE user_id = $1`,
      [req.userId]
    );
    const groupsJoined = parseInt(groupsResult.rows[0]?.joined || 0);

    const insightsResult = await query(
      `SELECT COUNT(*) as shared FROM shared_insights WHERE user_id = $1`,
      [req.userId]
    );
    const insightsShared = parseInt(insightsResult.rows[0]?.shared || 0);

    const moodLogsResult = await query(
      `SELECT COUNT(*) as logged FROM mood_logs WHERE user_id = $1`,
      [req.userId]
    );
    const moodLogs = parseInt(moodLogsResult.rows[0]?.logged || 0);

    const reflectionsResult = await query(
      `SELECT COUNT(*) as written FROM daily_checkins 
       WHERE user_id = $1 AND reflection_response IS NOT NULL AND reflection_response != ''`,
      [req.userId]
    );
    const reflections = parseInt(reflectionsResult.rows[0]?.written || 0);

    const existingBadges = await query(
      `SELECT badge_name FROM user_badges WHERE user_id = $1`,
      [req.userId]
    );
    const existingBadgeNames = new Set(existingBadges.rows.map(b => b.badge_name));

    const newlyUnlocked = [];

    const checkAndAward = async (category, checkValue, valueGetter = (a) => a.requirement) => {
      for (const achievement of ACHIEVEMENTS[category]) {
        const requirement = valueGetter(achievement);
        if (checkValue >= requirement && !existingBadgeNames.has(achievement.name)) {
          await query(
            `INSERT INTO user_badges (user_id, badge_type, badge_name, badge_description)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT DO NOTHING`,
            [req.userId, category, achievement.name, achievement.description]
          );
          
          if (achievement.xpReward > 0) {
            await query(
              `INSERT INTO xp_transactions (user_id, xp_amount, action_type, description)
               VALUES ($1, $2, 'achievement', $3)`,
              [req.userId, achievement.xpReward, `Unlocked: ${achievement.name}`]
            );
            
            await query(
              `UPDATE user_xp SET total_xp = total_xp + $2, lifetime_xp = lifetime_xp + $2
               WHERE user_id = $1`,
              [req.userId, achievement.xpReward]
            );
          }
          
          newlyUnlocked.push({
            ...achievement,
            category,
            rarityColor: RARITY_COLORS[achievement.rarity]
          });
        }
      }
    };

    await checkAndAward('streak', user.longest_streak);
    await checkAndAward('checkins', user.total_checkins);
    await checkAndAward('levels', currentLevel);
    await checkAndAward('challenges', completedChallenges);
    await checkAndAward('stackscore', user.stack_score);
    
    for (const achievement of ACHIEVEMENTS.social) {
      let checkValue = 0;
      if (achievement.id.includes('group')) checkValue = groupsJoined;
      else if (achievement.id.includes('insight')) checkValue = insightsShared;
      
      if (checkValue >= achievement.requirement && !existingBadgeNames.has(achievement.name)) {
        await query(
          `INSERT INTO user_badges (user_id, badge_type, badge_name, badge_description)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT DO NOTHING`,
          [req.userId, 'social', achievement.name, achievement.description]
        );
        
        if (achievement.xpReward > 0) {
          await query(
            `INSERT INTO xp_transactions (user_id, xp_amount, action_type, description)
             VALUES ($1, $2, 'achievement', $3)`,
            [req.userId, achievement.xpReward, `Unlocked: ${achievement.name}`]
          );
          
          await query(
            `UPDATE user_xp SET total_xp = total_xp + $2, lifetime_xp = lifetime_xp + $2
             WHERE user_id = $1`,
            [req.userId, achievement.xpReward]
          );
        }
        
        newlyUnlocked.push({
          ...achievement,
          category: 'social',
          rarityColor: RARITY_COLORS[achievement.rarity]
        });
      }
    }

    for (const achievement of ACHIEVEMENTS.special) {
      let checkValue = 0;
      if (achievement.id === 'full_reflector') checkValue = reflections;
      else if (achievement.id === 'mood_logger') checkValue = moodLogs;
      
      if (checkValue >= achievement.requirement && !existingBadgeNames.has(achievement.name)) {
        await query(
          `INSERT INTO user_badges (user_id, badge_type, badge_name, badge_description)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT DO NOTHING`,
          [req.userId, 'special', achievement.name, achievement.description]
        );
        
        if (achievement.xpReward > 0) {
          await query(
            `INSERT INTO xp_transactions (user_id, xp_amount, action_type, description)
             VALUES ($1, $2, 'achievement', $3)`,
            [req.userId, achievement.xpReward, `Unlocked: ${achievement.name}`]
          );
          
          await query(
            `UPDATE user_xp SET total_xp = total_xp + $2, lifetime_xp = lifetime_xp + $2
             WHERE user_id = $1`,
            [req.userId, achievement.xpReward]
          );
        }
        
        newlyUnlocked.push({
          ...achievement,
          category: 'special',
          rarityColor: RARITY_COLORS[achievement.rarity]
        });
      }
    }

    res.json({
      checked: true,
      newlyUnlocked,
      stats: {
        streak: user.longest_streak,
        checkins: user.total_checkins,
        level: currentLevel,
        challenges: completedChallenges,
        stackScore: user.stack_score
      }
    });
  } catch (err) {
    console.error('Check achievements error:', err);
    res.status(500).json({ error: 'Failed to check achievements' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = Object.entries(ACHIEVEMENTS).map(([key, achievements]) => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      count: achievements.length,
      achievements: achievements.map(a => ({
        ...a,
        rarityColor: RARITY_COLORS[a.rarity]
      }))
    }));

    res.json({ categories });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await query(
      `SELECT badge_type, badge_name, badge_description, earned_at 
       FROM user_badges 
       WHERE user_id = $1 
       ORDER BY earned_at DESC 
       LIMIT $2`,
      [req.userId, limit]
    );

    const recent = result.rows.map(badge => {
      let achievement = null;
      const badgeId = badge.badge_name.toLowerCase().replace(/\s+/g, '_');
      
      Object.values(ACHIEVEMENTS).forEach(categoryAchievements => {
        const found = categoryAchievements.find(a => a.id === badgeId);
        if (found) achievement = found;
      });

      return {
        ...badge,
        icon: achievement?.icon || 'award',
        rarity: achievement?.rarity || 'common',
        rarityColor: RARITY_COLORS[achievement?.rarity || 'common'],
        xpReward: achievement?.xpReward || 0
      };
    });

    res.json({ recent });
  } catch (err) {
    console.error('Get recent achievements error:', err);
    res.status(500).json({ error: 'Failed to get recent achievements' });
  }
});

export default router;
