import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const VALID_ACTION_TYPES = [
  'checkin',
  'full_checkin',
  'mood_log',
  'reflection',
  'community_post',
  'share_insight',
  'challenge_start',
  'challenge_complete',
  'quest_complete',
  'first_assessment',
  'streak_day',
  'streak_week',
  'friend_challenge_win'
];

export default function useXP() {
  const [levelUpData, setLevelUpData] = useState(null);
  const [isAwarding, setIsAwarding] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('akofa_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const awardXP = useCallback(async (actionType) => {
    if (isAwarding) return null;
    
    if (!VALID_ACTION_TYPES.includes(actionType)) {
      console.error('Invalid action type:', actionType);
      return null;
    }

    setIsAwarding(true);

    try {
      const res = await fetch(`${API_URL}/api/leveling/award`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ actionType })
      });

      if (!res.ok) {
        throw new Error('Failed to award XP');
      }

      const data = await res.json();

      if (data.success && data.leveledUp) {
        setLevelUpData({
          newLevel: data.currentLevel,
          unlockedFeatures: data.newUnlocks || []
        });
      }

      return data;
    } catch (err) {
      console.error('Error awarding XP:', err);
      return null;
    } finally {
      setIsAwarding(false);
    }
  }, [isAwarding]);

  const dismissLevelUp = useCallback(() => {
    setLevelUpData(null);
  }, []);

  const getLevelStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/leveling/status`, {
        headers: getAuthHeaders()
      });
      
      if (!res.ok) throw new Error('Failed to get level status');
      
      return await res.json();
    } catch (err) {
      console.error('Error getting level status:', err);
      return null;
    }
  }, []);

  const getXPHistory = useCallback(async (limit = 20) => {
    try {
      const res = await fetch(`${API_URL}/api/leveling/history?limit=${limit}`, {
        headers: getAuthHeaders()
      });
      
      if (!res.ok) throw new Error('Failed to get XP history');
      
      return await res.json();
    } catch (err) {
      console.error('Error getting XP history:', err);
      return null;
    }
  }, []);

  return {
    awardXP,
    levelUpData,
    dismissLevelUp,
    getLevelStatus,
    getXPHistory,
    isAwarding,
    XP_VALUES
  };
}
