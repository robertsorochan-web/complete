import React, { useState, useEffect } from 'react';
import { Smartphone, Plus, Trash2, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';

const MoMoTracker = () => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('akofa_momo_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newTx, setNewTx] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: 'sales',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    localStorage.setItem('akofa_momo_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    if (!newTx.amount || !newTx.description) return;
    
    const tx = {
      ...newTx,
      id: Date.now(),
      amount: parseFloat(newTx.amount)
    };
    
    setTransactions(prev => [tx, ...prev]);
    setNewTx({
      type: 'income',
      amount: '',
      description: '',
      category: 'sales',
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = totalIncome - totalExpense;

  const categories = {
    income: ['sales', 'payment', 'refund', 'gift', 'other'],
    expense: ['supplies', 'transport', 'food', 'airtime', 'bills', 'staff', 'other']
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">MoMo Tracker</h3>
            <p className="text-sm text-gray-400">Track your mobile money</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-green-900/20 rounded-xl p-3 text-center border border-green-500/30">
          <ArrowDownLeft className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-green-400">GHS {totalIncome.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Money In</div>
        </div>
        <div className="bg-red-900/20 rounded-xl p-3 text-center border border-red-500/30">
          <ArrowUpRight className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-red-400">GHS {totalExpense.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Money Out</div>
        </div>
        <div className={`rounded-xl p-3 text-center border ${balance >= 0 ? 'bg-blue-900/20 border-blue-500/30' : 'bg-orange-900/20 border-orange-500/30'}`}>
          {balance >= 0 ? <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" /> : <TrendingDown className="w-5 h-5 text-orange-400 mx-auto mb-1" />}
          <div className={`text-lg font-bold ${balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
            GHS {Math.abs(balance).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Balance</div>
        </div>
      </div>

      {showForm && (
        <div className="bg-slate-700/50 rounded-xl p-4 mb-4 border border-slate-600">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setNewTx(prev => ({ ...prev, type: 'income' }))}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                newTx.type === 'income' ? 'bg-green-600 text-white' : 'bg-slate-600 text-gray-300'
              }`}
            >
              Money In
            </button>
            <button
              onClick={() => setNewTx(prev => ({ ...prev, type: 'expense' }))}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                newTx.type === 'expense' ? 'bg-red-600 text-white' : 'bg-slate-600 text-gray-300'
              }`}
            >
              Money Out
            </button>
          </div>
          
          <div className="space-y-3">
            <input
              type="number"
              value={newTx.amount}
              onChange={(e) => setNewTx(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Amount (GHS)"
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400"
            />
            <input
              type="text"
              value={newTx.description}
              onChange={(e) => setNewTx(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description (e.g., Sold rice)"
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400"
            />
            <select
              value={newTx.category}
              onChange={(e) => setNewTx(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white"
            >
              {categories[newTx.type].map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
            <input
              type="date"
              value={newTx.date}
              onChange={(e) => setNewTx(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white"
            />
            <button
              onClick={addTransaction}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white transition"
            >
              Add Transaction
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-sm text-white"
        >
          <option value="all">All Transactions</option>
          <option value="income">Money In Only</option>
          <option value="expense">Money Out Only</option>
        </select>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Smartphone className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">Add your first transaction</p>
          </div>
        ) : (
          filteredTransactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {tx.type === 'income' ? (
                    <ArrowDownLeft className="w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{tx.description}</div>
                  <div className="text-xs text-gray-400">{tx.category} • {tx.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type === 'income' ? '+' : '-'}GHS {tx.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="p-1 hover:bg-red-500/20 rounded transition"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MoMoTracker;
