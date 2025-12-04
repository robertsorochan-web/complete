import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, AlertTriangle, Search } from 'lucide-react';

const InventoryTracker = () => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('akofa_inventory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unitPrice: '',
    minStock: '5',
    category: 'general'
  });

  useEffect(() => {
    localStorage.setItem('akofa_inventory', JSON.stringify(items));
  }, [items]);

  const addOrUpdateItem = () => {
    if (!newItem.name || !newItem.quantity) return;
    
    const item = {
      ...newItem,
      id: editingId || Date.now(),
      quantity: parseInt(newItem.quantity),
      unitPrice: parseFloat(newItem.unitPrice) || 0,
      minStock: parseInt(newItem.minStock) || 5,
      lastUpdated: new Date().toISOString()
    };

    if (editingId) {
      setItems(prev => prev.map(i => i.id === editingId ? item : i));
      setEditingId(null);
    } else {
      setItems(prev => [...prev, item]);
    }

    setNewItem({ name: '', quantity: '', unitPrice: '', minStock: '5', category: 'general' });
    setShowForm(false);
  };

  const startEdit = (item) => {
    setNewItem({
      name: item.name,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      minStock: item.minStock.toString(),
      category: item.category
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockItems = items.filter(item => item.quantity <= item.minStock);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const categories = ['general', 'food', 'drinks', 'clothing', 'electronics', 'cosmetics', 'other'];

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Inventory Tracker</h3>
            <p className="text-sm text-gray-400">Track your stock levels</p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setNewItem({ name: '', quantity: '', unitPrice: '', minStock: '5', category: 'general' });
          }}
          className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-700/50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-white">{items.length}</div>
          <div className="text-xs text-gray-400">Total Items</div>
        </div>
        <div className="bg-blue-900/20 rounded-xl p-3 text-center border border-blue-500/30">
          <div className="text-xl font-bold text-blue-400">GHS {totalValue.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Stock Value</div>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-orange-900/20 rounded-xl p-3 mb-4 border border-orange-500/30">
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold text-sm">Low Stock Alert!</span>
          </div>
          <div className="text-sm text-gray-300">
            {lowStockItems.map(item => item.name).join(', ')} need restocking
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-slate-700/50 rounded-xl p-4 mb-4 border border-slate-600">
          <h4 className="font-semibold text-white mb-3">{editingId ? 'Edit Item' : 'Add New Item'}</h4>
          <div className="space-y-3">
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Item name (e.g., Rice 50kg)"
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Quantity"
                className="p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400"
              />
              <input
                type="number"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: e.target.value }))}
                placeholder="Price (GHS)"
                className="p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={newItem.minStock}
                onChange={(e) => setNewItem(prev => ({ ...prev, minStock: e.target.value }))}
                placeholder="Min stock level"
                className="p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400"
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                className="p-3 bg-slate-600 border border-slate-500 rounded-lg text-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            <button
              onClick={addOrUpdateItem}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white transition"
            >
              {editingId ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </div>
      )}

      {items.length > 3 && (
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 text-sm"
          />
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No items yet</p>
            <p className="text-sm">Add your first inventory item</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg ${
              item.quantity <= item.minStock ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-slate-700/50'
            }`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{item.name}</span>
                  {item.quantity <= item.minStock && (
                    <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full">Low Stock</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {item.category} • GHS {item.unitPrice} each • Min: {item.minStock}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`text-lg font-bold ${item.quantity <= item.minStock ? 'text-orange-400' : 'text-white'}`}>
                    {item.quantity}
                  </div>
                  <div className="text-xs text-gray-400">GHS {(item.quantity * item.unitPrice).toLocaleString()}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-1.5 hover:bg-blue-500/20 rounded transition"
                  >
                    <Edit2 className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-1.5 hover:bg-red-500/20 rounded transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryTracker;
