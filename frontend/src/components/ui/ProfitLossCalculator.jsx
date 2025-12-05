import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Minus, TrendingUp, TrendingDown, Save, Trash2 } from 'lucide-react';

const ProfitLossCalculator = () => {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('akofa_profit_loss');
    return saved ? JSON.parse(saved) : {
      income: [],
      expenses: []
    };
  });
  
  const [newIncome, setNewIncome] = useState({ description: '', amount: '' });
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    localStorage.setItem('akofa_profit_loss', JSON.stringify(entries));
  }, [entries]);

  const addIncome = () => {
    if (newIncome.description && newIncome.amount) {
      setEntries(prev => ({
        ...prev,
        income: [...prev.income, { ...newIncome, id: Date.now(), date: new Date().toISOString() }]
      }));
      setNewIncome({ description: '', amount: '' });
    }
  };

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      setEntries(prev => ({
        ...prev,
        expenses: [...prev.expenses, { ...newExpense, id: Date.now(), date: new Date().toISOString() }]
      }));
      setNewExpense({ description: '', amount: '' });
    }
  };

  const removeEntry = (type, id) => {
    setEntries(prev => ({
      ...prev,
      [type]: prev[type].filter(entry => entry.id !== id)
    }));
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to delete everything?')) {
      setEntries({ income: [], expenses: [] });
    }
  };

  const totalIncome = entries.income.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  const totalExpenses = entries.expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  const profit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? ((profit / totalIncome) * 100).toFixed(1) : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', { 
      style: 'currency', 
      currency: 'GHS',
      minimumFractionDigits: 2 
    }).format(amount);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Calculator className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Profit & Loss</h3>
            <p className="text-sm text-gray-400">Track your money in and out</p>
          </div>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-sm"
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-700/50">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Money In</div>
          <div className="text-lg font-bold text-green-400">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Money Out</div>
          <div className="text-lg font-bold text-red-400">{formatCurrency(totalExpenses)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">
            {profit >= 0 ? 'Profit' : 'Loss'}
          </div>
          <div className={`text-lg font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(Math.abs(profit))}
          </div>
        </div>
      </div>

      {profit !== 0 && (
        <div className={`px-4 py-2 text-sm flex items-center justify-center gap-2 ${
          profit >= 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
        }`}>
          {profit >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>
            {profit >= 0 
              ? `You are making ${profitMargin}% profit margin` 
              : `You are losing money! Review your expenses.`
            }
          </span>
        </div>
      )}

      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Plus className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Add Income</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="What you sell? (e.g., Fish, Bread)"
              value={newIncome.description}
              onChange={(e) => setNewIncome({...newIncome, description: e.target.value})}
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="GHS"
              value={newIncome.amount}
              onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
              className="w-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={addIncome}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition"
            >
              Add
            </button>
          </div>
          
          {entries.income.length > 0 && (
            <div className="mt-2 space-y-1">
              {entries.income.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-green-900/20 rounded-lg text-sm">
                  <span className="text-gray-300">{item.description}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-medium">{formatCurrency(item.amount)}</span>
                    <button onClick={() => removeEntry('income', item.id)} className="text-gray-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Minus className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">Add Expense</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="What you spend on? (e.g., Stock, Transport)"
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="GHS"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              className="w-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={addExpense}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
            >
              Add
            </button>
          </div>
          
          {entries.expenses.length > 0 && (
            <div className="mt-2 space-y-1">
              {entries.expenses.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-red-900/20 rounded-lg text-sm">
                  <span className="text-gray-300">{item.description}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-medium">{formatCurrency(item.amount)}</span>
                    <button onClick={() => removeEntry('expenses', item.id)} className="text-gray-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-slate-700 flex justify-between">
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-gray-400 transition"
        >
          Clear All
        </button>
        <button
          onClick={() => alert('Saved! Your data is safe.')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium flex items-center gap-2 transition"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfitLossCalculator;
