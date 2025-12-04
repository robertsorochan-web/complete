import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Phone, MessageCircle, Search, Star, StarOff } from 'lucide-react';

const CustomerCRM = () => {
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('akofa_customers');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    lastPurchase: '',
    isVIP: false
  });

  useEffect(() => {
    localStorage.setItem('akofa_customers', JSON.stringify(customers));
  }, [customers]);

  const addOrUpdateCustomer = () => {
    if (!newCustomer.name) return;
    
    const customer = {
      ...newCustomer,
      id: editingId || Date.now(),
      createdAt: editingId ? customers.find(c => c.id === editingId)?.createdAt : new Date().toISOString()
    };

    if (editingId) {
      setCustomers(prev => prev.map(c => c.id === editingId ? customer : c));
      setEditingId(null);
    } else {
      setCustomers(prev => [...prev, customer]);
    }

    setNewCustomer({ name: '', phone: '', email: '', notes: '', lastPurchase: '', isVIP: false });
    setShowForm(false);
  };

  const startEdit = (customer) => {
    setNewCustomer({
      name: customer.name,
      phone: customer.phone || '',
      email: customer.email || '',
      notes: customer.notes || '',
      lastPurchase: customer.lastPurchase || '',
      isVIP: customer.isVIP || false
    });
    setEditingId(customer.id);
    setShowForm(true);
  };

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const toggleVIP = (id) => {
    setCustomers(prev => prev.map(c => 
      c.id === id ? { ...c, isVIP: !c.isVIP } : c
    ));
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    (customer.phone && customer.phone.includes(search))
  );

  const vipCustomers = customers.filter(c => c.isVIP);

  const callCustomer = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const messageCustomer = (phone) => {
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank');
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Customer Database</h3>
            <p className="text-sm text-gray-400">Simple CRM for your business</p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setNewCustomer({ name: '', phone: '', email: '', notes: '', lastPurchase: '', isVIP: false });
          }}
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-700/50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-white">{customers.length}</div>
          <div className="text-xs text-gray-400">Total Customers</div>
        </div>
        <div className="bg-yellow-900/20 rounded-xl p-3 text-center border border-yellow-500/30">
          <div className="text-xl font-bold text-yellow-400">{vipCustomers.length}</div>
          <div className="text-xs text-gray-400">VIP Customers</div>
        </div>
      </div>

      {showForm && (
        <div className="bg-slate-700/50 rounded-xl p-4 mb-4 border border-slate-600">
          <h4 className="font-semibold text-white mb-3">{editingId ? 'Edit Customer' : 'Add Customer'}</h4>
          <div className="space-y-3">
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Customer name"
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400"
            />
            <input
              type="tel"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Phone number"
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400"
            />
            <input
              type="email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email (optional)"
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400"
            />
            <textarea
              value={newCustomer.notes}
              onChange={(e) => setNewCustomer(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes (e.g., likes spicy food, prefers morning delivery)"
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 h-20 resize-none"
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newCustomer.isVIP}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, isVIP: e.target.checked }))}
                className="w-5 h-5 rounded border-slate-500"
              />
              <span className="text-yellow-400">Mark as VIP Customer</span>
            </label>
            <button
              onClick={addOrUpdateCustomer}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition"
            >
              {editingId ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </div>
      )}

      {customers.length > 3 && (
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 text-sm"
          />
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No customers yet</p>
            <p className="text-sm">Add your first customer</p>
          </div>
        ) : (
          filteredCustomers.map(customer => (
            <div key={customer.id} className={`p-3 rounded-lg ${
              customer.isVIP ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-slate-700/50'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{customer.name}</span>
                    {customer.isVIP && (
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>
                  {customer.phone && (
                    <div className="text-sm text-gray-400 mt-1">{customer.phone}</div>
                  )}
                  {customer.notes && (
                    <div className="text-xs text-gray-500 mt-1">{customer.notes}</div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {customer.phone && (
                    <>
                      <button
                        onClick={() => callCustomer(customer.phone)}
                        className="p-2 hover:bg-green-500/20 rounded-lg transition"
                        title="Call"
                      >
                        <Phone className="w-4 h-4 text-green-400" />
                      </button>
                      <button
                        onClick={() => messageCustomer(customer.phone)}
                        className="p-2 hover:bg-green-500/20 rounded-lg transition"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 text-green-400" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => toggleVIP(customer.id)}
                    className="p-2 hover:bg-yellow-500/20 rounded-lg transition"
                    title={customer.isVIP ? 'Remove VIP' : 'Make VIP'}
                  >
                    {customer.isVIP ? (
                      <StarOff className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <Star className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(customer)}
                    className="p-2 hover:bg-blue-500/20 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => deleteCustomer(customer.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition"
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

export default CustomerCRM;
