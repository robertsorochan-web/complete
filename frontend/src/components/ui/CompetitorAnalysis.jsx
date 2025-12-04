import React, { useState, useEffect } from 'react';
import { Target, Plus, Edit2, Trash2, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

const CompetitorAnalysis = () => {
  const [competitors, setCompetitors] = useState(() => {
    const saved = localStorage.getItem('akofa_competitors');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCompetitor, setNewCompetitor] = useState({
    name: '',
    location: '',
    strengths: '',
    weaknesses: '',
    priceLevel: 'same',
    threat: 'medium'
  });

  useEffect(() => {
    localStorage.setItem('akofa_competitors', JSON.stringify(competitors));
  }, [competitors]);

  const addOrUpdateCompetitor = () => {
    if (!newCompetitor.name) return;
    
    const competitor = {
      ...newCompetitor,
      id: editingId || Date.now()
    };

    if (editingId) {
      setCompetitors(prev => prev.map(c => c.id === editingId ? competitor : c));
      setEditingId(null);
    } else {
      setCompetitors(prev => [...prev, competitor]);
    }

    setNewCompetitor({ name: '', location: '', strengths: '', weaknesses: '', priceLevel: 'same', threat: 'medium' });
    setShowForm(false);
  };

  const startEdit = (competitor) => {
    setNewCompetitor({
      name: competitor.name,
      location: competitor.location || '',
      strengths: competitor.strengths || '',
      weaknesses: competitor.weaknesses || '',
      priceLevel: competitor.priceLevel || 'same',
      threat: competitor.threat || 'medium'
    });
    setEditingId(competitor.id);
    setShowForm(true);
  };

  const deleteCompetitor = (id) => {
    setCompetitors(prev => prev.filter(c => c.id !== id));
  };

  const getThreatColor = (threat) => {
    switch (threat) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-500/30';
      default: return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
    }
  };

  const getPriceIcon = (price) => {
    switch (price) {
      case 'higher': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'lower': return <TrendingDown className="w-4 h-4 text-green-400" />;
      default: return <Minus className="w-4 h-4 text-yellow-400" />;
    }
  };

  const highThreat = competitors.filter(c => c.threat === 'high').length;
  const mediumThreat = competitors.filter(c => c.threat === 'medium').length;
  const lowThreat = competitors.filter(c => c.threat === 'low').length;

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Competitor Analysis</h3>
            <p className="text-sm text-gray-400">Know your competition</p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setNewCompetitor({ name: '', location: '', strengths: '', weaknesses: '', priceLevel: 'same', threat: 'medium' });
          }}
          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {competitors.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-red-900/20 rounded-lg p-2 text-center border border-red-500/30">
            <div className="text-lg font-bold text-red-400">{highThreat}</div>
            <div className="text-xs text-gray-400">High Threat</div>
          </div>
          <div className="bg-yellow-900/20 rounded-lg p-2 text-center border border-yellow-500/30">
            <div className="text-lg font-bold text-yellow-400">{mediumThreat}</div>
            <div className="text-xs text-gray-400">Medium</div>
          </div>
          <div className="bg-green-900/20 rounded-lg p-2 text-center border border-green-500/30">
            <div className="text-lg font-bold text-green-400">{lowThreat}</div>
            <div className="text-xs text-gray-400">Low Threat</div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-slate-700/50 rounded-xl p-4 mb-4 border border-slate-600">
          <h4 className="font-semibold text-white mb-3">{editingId ? 'Edit Competitor' : 'Add Competitor'}</h4>
          <div className="space-y-3">
            <input
              type="text"
              value={newCompetitor.name}
              onChange={(e) => setNewCompetitor(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Competitor name"
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400"
            />
            <input
              type="text"
              value={newCompetitor.location}
              onChange={(e) => setNewCompetitor(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Location"
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400"
            />
            <textarea
              value={newCompetitor.strengths}
              onChange={(e) => setNewCompetitor(prev => ({ ...prev, strengths: e.target.value }))}
              placeholder="Their strengths (what dem do well)"
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 h-16 resize-none"
            />
            <textarea
              value={newCompetitor.weaknesses}
              onChange={(e) => setNewCompetitor(prev => ({ ...prev, weaknesses: e.target.value }))}
              placeholder="Their weaknesses (where you fit beat dem)"
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 h-16 resize-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Their Prices</label>
                <select
                  value={newCompetitor.priceLevel}
                  onChange={(e) => setNewCompetitor(prev => ({ ...prev, priceLevel: e.target.value }))}
                  className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white"
                >
                  <option value="higher">Higher than yours</option>
                  <option value="same">Same as yours</option>
                  <option value="lower">Lower than yours</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Threat Level</label>
                <select
                  value={newCompetitor.threat}
                  onChange={(e) => setNewCompetitor(prev => ({ ...prev, threat: e.target.value }))}
                  className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white"
                >
                  <option value="high">High - Big threat</option>
                  <option value="medium">Medium - Watch dem</option>
                  <option value="low">Low - No worry</option>
                </select>
              </div>
            </div>
            <button
              onClick={addOrUpdateCompetitor}
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition"
            >
              {editingId ? 'Update Competitor' : 'Add Competitor'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {competitors.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No competitors tracked yet</p>
            <p className="text-sm">Add your competitors to analyze them</p>
          </div>
        ) : (
          competitors.map(competitor => (
            <div key={competitor.id} className={`p-4 rounded-xl border ${getThreatColor(competitor.threat)}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{competitor.name}</span>
                    {getPriceIcon(competitor.priceLevel)}
                  </div>
                  {competitor.location && (
                    <div className="text-xs text-gray-400">{competitor.location}</div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(competitor)}
                    className="p-1.5 hover:bg-blue-500/20 rounded transition"
                  >
                    <Edit2 className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => deleteCompetitor(competitor.id)}
                    className="p-1.5 hover:bg-red-500/20 rounded transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              
              {competitor.strengths && (
                <div className="text-sm mb-1">
                  <span className="text-green-400">👍 Strengths:</span>
                  <span className="text-gray-300 ml-1">{competitor.strengths}</span>
                </div>
              )}
              {competitor.weaknesses && (
                <div className="text-sm">
                  <span className="text-red-400">👎 Weaknesses:</span>
                  <span className="text-gray-300 ml-1">{competitor.weaknesses}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {competitors.length > 0 && (
        <div className="mt-4 bg-purple-900/20 rounded-xl p-4 border border-purple-500/30">
          <h4 className="font-semibold text-purple-400 mb-2">💡 How to Beat Your Competition</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p>1. Focus on what you do better than them</p>
            <p>2. Fill gaps they leave - their weakness be your opportunity</p>
            <p>3. Build relationships customers value</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitorAnalysis;
