import React, { useState } from 'react';
import { Users, Plus, Trash2, BarChart2, UserPlus } from 'lucide-react';
import { getScoreEmoji, getScoreLabel } from '../../config/useCaseTemplates';

const GroupAnalysis = ({ assessmentData, purpose, onGroupScoreUpdate }) => {
  const [members, setMembers] = useState([
    { id: 1, name: 'You', scores: assessmentData, isMain: true }
  ]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');

  const addMember = () => {
    if (!newMemberName.trim()) return;
    
    const newMember = {
      id: Date.now(),
      name: newMemberName.trim(),
      scores: {
        bioHardware: 5,
        internalOS: 5,
        culturalSoftware: 5,
        socialInstance: 5,
        consciousUser: 5
      },
      isMain: false
    };
    
    setMembers([...members, newMember]);
    setNewMemberName('');
    setShowAddMember(false);
  };

  const removeMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const updateMemberScore = (memberId, scoreKey, value) => {
    setMembers(members.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          scores: { ...m.scores, [scoreKey]: parseInt(value) }
        };
      }
      return m;
    }));
  };

  const calculateGroupAverage = (key) => {
    const total = members.reduce((sum, m) => sum + (m.scores[key] || 0), 0);
    return (total / members.length).toFixed(1);
  };

  const calculateOverallGroupScore = () => {
    const keys = ['bioHardware', 'internalOS', 'culturalSoftware', 'socialInstance', 'consciousUser'];
    const total = keys.reduce((sum, key) => sum + parseFloat(calculateGroupAverage(key)), 0);
    return (total / keys.length).toFixed(1);
  };

  const scoreLabels = {
    bioHardware: { name: 'Money/Resources', icon: '💰' },
    internalOS: { name: 'Team', icon: '👥' },
    culturalSoftware: { name: 'Systems', icon: '⚙️' },
    socialInstance: { name: 'Communication', icon: '📱' },
    consciousUser: { name: 'Vision', icon: '🎯' }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Group Analysis</h3>
            <p className="text-sm text-gray-400">Analyze together as family or team</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddMember(true)}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition flex items-center gap-2 text-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {showAddMember && (
        <div className="p-4 bg-slate-700/50 border-b border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Enter name (e.g., Spouse, Partner, Team member)"
              className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:border-purple-500 outline-none"
              onKeyPress={(e) => e.key === 'Enter' && addMember()}
            />
            <button
              onClick={addMember}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddMember(false)}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {members.map((member) => (
          <div key={member.id} className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{member.name}</span>
                {member.isMain && (
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                    Main
                  </span>
                )}
              </div>
              {!member.isMain && (
                <button
                  onClick={() => removeMember(member.id)}
                  className="p-1 text-red-400 hover:bg-red-500/20 rounded transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(scoreLabels).map(([key, label]) => (
                <div key={key} className="text-center">
                  <div className="text-lg mb-1">{label.icon}</div>
                  <select
                    value={member.scores[key]}
                    onChange={(e) => updateMemberScore(member.id, key, e.target.value)}
                    disabled={member.isMain}
                    className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-center text-sm disabled:opacity-50"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {members.length > 1 && (
        <div className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-t border-purple-500/30">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-purple-400" />
            <h4 className="font-semibold text-white">Group Average</h4>
          </div>
          
          <div className="grid grid-cols-5 gap-4 mb-4">
            {Object.entries(scoreLabels).map(([key, label]) => {
              const avg = parseFloat(calculateGroupAverage(key));
              return (
                <div key={key} className="text-center">
                  <div className="text-xl mb-1">{label.icon}</div>
                  <div className="text-lg font-bold text-white">{avg}</div>
                  <div className="text-xs text-gray-400">{getScoreEmoji(avg)}</div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-400 mb-1">Overall Group Score</div>
            <div className="text-3xl font-bold text-white">
              {calculateOverallGroupScore()}
              <span className="text-lg ml-2">{getScoreEmoji(parseFloat(calculateOverallGroupScore()))}</span>
            </div>
            <div className="text-sm text-purple-400 mt-1">
              {getScoreLabel(parseFloat(calculateOverallGroupScore()))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupAnalysis;
