import React from 'react';
import logo from '../../assets/logo.png';
import { getNavItems, getPurposeConfig } from '../../config/purposeConfig';

const Sidebar = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const purpose = user?.purpose || 'personal';
  const navItems = getNavItems(purpose);
  const purposeConfig = getPurposeConfig(purpose);

  return (
    <aside className="sidebar w-72 bg-slate-800 p-6 text-white flex flex-col">
      <div className="logo flex items-center gap-3 mb-8">
        {logo ? <img src={logo} alt="logo" className="w-10 h-10 rounded-md" /> : <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold">A</div>}
        <div className="text-2xl font-bold">Akↄfa Fixit</div>
      </div>

      <nav className="flex-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${currentPage === item.id ? 'bg-purple-600' : 'hover:bg-white/5'}`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="space-y-3 border-t border-slate-700 pt-4 mt-6">
        {user && (
          <div className="text-xs bg-slate-700 rounded p-3">
            <div className="font-semibold">{user.name}</div>
            <div className="text-gray-400">{purposeConfig.name}</div>
          </div>
        )}
        {user && onLogout && (
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition text-sm"
          >
            🚪 Logout
          </button>
        )}
      </div>

      <footer className="mt-6 text-xs text-gray-400">
        <div>Free — Akↄfa Fixit</div>
      </footer>
    </aside>
  );
};

export default Sidebar;
