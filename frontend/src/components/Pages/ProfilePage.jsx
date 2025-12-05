import React, { useState, useEffect } from 'react';
import { User, Award, Settings, Bell, Shield, LogOut, Crown, Zap, Calendar, Target, Heart, Brain, Code, Users as UsersIcon, Eye, Check, Download, Upload, FileJson, FileText } from 'lucide-react';
import { exportToJSON, exportToCSV } from '../../utils/exportData';
import { useLanguage } from '../../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const tierInfo = {
  free: { name: 'Free', color: 'from-gray-400 to-gray-600', icon: User },
  pro: { name: 'Pro', color: 'from-purple-500 to-pink-500', icon: Crown },
  teams: { name: 'Teams', color: 'from-blue-500 to-cyan-500', icon: UsersIcon },
  enterprise: { name: 'Enterprise', color: 'from-yellow-400 to-orange-500', icon: Shield }
};

const layerIcons = {
  bioHardware: Heart,
  internalOS: Brain,
  culturalSoftware: Code,
  socialInstance: UsersIcon,
  consciousUser: Eye
};

export default function ProfilePage({ user, onLogout }) {
  const { t, getSection } = useLanguage();
  const profileText = getSection('profile');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('akofa_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/profile`, { headers: getAuthHeaders() });
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/profile/notifications`, { headers: getAuthHeaders() });
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const updateNotifications = async (updates) => {
    setSaving(true);
    try {
      await fetch(`${API_URL}/api/profile/notifications`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      setNotifications(prev => ({ ...prev, ...updates }));
    } catch (err) {
      console.error('Failed to update notifications:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tier = tierInfo[profile?.tier] || tierInfo.free;
  const TierIcon = tier.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${tier.color} p-1`}>
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {profile?.name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-white">{profile?.name || 'User'}</h1>
            <p className="text-gray-400">{profile?.email}</p>
            <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
              <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${tier.color} text-white text-sm font-medium flex items-center gap-1`}>
                <TierIcon className="w-4 h-4" />
                {tier.name}
              </span>
              <span className="text-gray-500 text-sm">
                Member since {new Date(profile?.memberSince).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold text-white">{profile?.stackScore || 300}</p>
            <p className="text-gray-400 text-sm">StackScore</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
          <p className="text-3xl font-bold text-orange-400">{profile?.currentStreak || 0}</p>
          <p className="text-gray-400 text-sm">Current Streak</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
          <p className="text-3xl font-bold text-purple-400">{profile?.totalCheckins || 0}</p>
          <p className="text-gray-400 text-sm">Total Check-ins</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
          <p className="text-3xl font-bold text-green-400">{profile?.completedChallenges || 0}</p>
          <p className="text-gray-400 text-sm">Challenges Done</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
          <p className="text-3xl font-bold text-blue-400">{profile?.groupsJoined || 0}</p>
          <p className="text-gray-400 text-sm">Groups Joined</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['overview', 'badges', 'export', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'bg-purple-500 text-white' 
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* AI Usage */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                AI Insights Usage
              </h3>
              <span className="text-gray-400 text-sm">Resets monthly</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Used this month</span>
                  <span className="text-white">
                    {profile?.aiInsightsUsed || 0} / {profile?.aiInsightsLimit === Infinity ? '∞' : profile?.aiInsightsLimit}
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                    style={{ 
                      width: profile?.aiInsightsLimit === Infinity 
                        ? '10%' 
                        : `${Math.min(100, (profile?.aiInsightsUsed / profile?.aiInsightsLimit) * 100)}%` 
                    }}
                  />
                </div>
              </div>
              {profile?.tier === 'free' && (
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium">
                  Upgrade
                </button>
              )}
            </div>
          </div>

          {/* Tier Features */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              Your Plan Features
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { label: 'AI Insights', value: profile?.tierFeatures?.aiInsights === Infinity ? 'Unlimited' : `${profile?.tierFeatures?.aiInsights}/month` },
                { label: 'Daily Check-in Layers', value: profile?.tierFeatures?.dailyCheckinLayers },
                { label: 'Community Access', value: profile?.tierFeatures?.communityAccess },
                { label: 'Data Export', value: profile?.tierFeatures?.dataExport ? 'Yes' : 'No' },
                { label: 'Custom Notifications', value: profile?.tierFeatures?.customNotifications ? 'Yes' : 'No' },
                { label: 'Challenges', value: profile?.tierFeatures?.challenges === Infinity ? 'Unlimited' : profile?.tierFeatures?.challenges }
              ].map((feature, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-400">{feature.label}</span>
                  <span className="text-white font-medium">{feature.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Your Badges ({profile?.badges?.length || 0})
          </h3>
          {profile?.badges?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profile.badges.map((badge, i) => (
                <div key={i} className="bg-slate-700/50 rounded-xl p-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white font-medium">{badge.badge_name}</p>
                  <p className="text-gray-400 text-sm">{badge.badge_description}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    {new Date(badge.earned_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Award className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No badges earned yet. Keep going!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-cyan-400" />
              Export Your Data
            </h3>
            <p className="text-gray-400 mb-6">Download your personal data in various formats. This includes your check-ins, assessments, mood entries, and progress history.</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={async () => {
                  const token = localStorage.getItem('akofa_token');
                  await exportToJSON(token);
                }}
                className="p-4 bg-slate-700/50 rounded-xl border border-slate-600 hover:border-cyan-500/50 transition flex items-center gap-4"
              >
                <div className="p-3 rounded-lg bg-cyan-500/20">
                  <FileJson className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Full Export (JSON)</p>
                  <p className="text-gray-400 text-sm">All data in JSON format</p>
                </div>
              </button>

              <button
                onClick={async () => {
                  const token = localStorage.getItem('akofa_token');
                  await exportToCSV(token, 'checkins');
                }}
                className="p-4 bg-slate-700/50 rounded-xl border border-slate-600 hover:border-green-500/50 transition flex items-center gap-4"
              >
                <div className="p-3 rounded-lg bg-green-500/20">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Check-ins (CSV)</p>
                  <p className="text-gray-400 text-sm">Daily check-in history</p>
                </div>
              </button>

              <button
                onClick={async () => {
                  const token = localStorage.getItem('akofa_token');
                  await exportToCSV(token, 'moods');
                }}
                className="p-4 bg-slate-700/50 rounded-xl border border-slate-600 hover:border-purple-500/50 transition flex items-center gap-4"
              >
                <div className="p-3 rounded-lg bg-purple-500/20">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Mood History (CSV)</p>
                  <p className="text-gray-400 text-sm">Mood and energy logs</p>
                </div>
              </button>

              <button
                onClick={async () => {
                  const token = localStorage.getItem('akofa_token');
                  await exportToCSV(token, 'assessments');
                }}
                className="p-4 bg-slate-700/50 rounded-xl border border-slate-600 hover:border-yellow-500/50 transition flex items-center gap-4"
              >
                <div className="p-3 rounded-lg bg-yellow-500/20">
                  <FileText className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Assessments (CSV)</p>
                  <p className="text-gray-400 text-sm">StackScore assessments</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Data Privacy
            </h3>
            <p className="text-gray-400 mb-4">Your data belongs to you. We never sell or share your personal information.</p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                All exports are encrypted during transfer
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Data is stored securely on our servers
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                You can request data deletion anytime
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'settings' && notifications && (
        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-400" />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Push Notifications</p>
                  <p className="text-gray-400 text-sm">Receive daily reminder notifications</p>
                </div>
                <button
                  onClick={() => updateNotifications({ pushEnabled: !notifications.pushEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications.pushEnabled ? 'bg-purple-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifications.pushEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-gray-400 text-sm">Receive weekly progress reports</p>
                </div>
                <button
                  onClick={() => updateNotifications({ emailEnabled: !notifications.emailEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications.emailEnabled ? 'bg-purple-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifications.emailEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Daily Reminder Time</p>
                  <p className="text-gray-400 text-sm">When to send check-in reminder</p>
                </div>
                <input
                  type="time"
                  value={notifications.dailyReminderTime || '09:00'}
                  onChange={(e) => updateNotifications({ dailyReminderTime: e.target.value })}
                  className="bg-slate-600 text-white rounded-lg px-3 py-1 border border-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-400" />
              Account
            </h3>
            <button
              onClick={onLogout}
              className="w-full py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
