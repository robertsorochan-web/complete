import React, { useState } from 'react';
import { Menu, X, Home, ClipboardList, Search, Wrench, MessageCircle, LogOut, Briefcase, CheckSquare, TrendingUp, Users, Trophy, Calendar, User, HelpCircle } from 'lucide-react';
import logo from '../../assets/logo.png';
import { getNavItems, getPurposeConfig } from '../../config/purposeConfig';

const navIcons = {
  dashboard: Home,
  assessment: ClipboardList,
  analysis: Search,
  diagnosis: Wrench,
  chat: MessageCircle,
  tools: Briefcase,
  checkin: CheckSquare,
  stackscore: TrendingUp,
  community: Users,
  challenges: Trophy,
  timeline: Calendar,
  profile: User,
  help: HelpCircle
};

const Sidebar = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const purpose = user?.purpose || 'personal';
  const navItems = getNavItems(purpose);
  const purposeConfig = getPurposeConfig(purpose);

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setMobileOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-slate-800 rounded-lg shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        sidebar bg-slate-800 text-white flex flex-col
        fixed md:relative inset-y-0 left-0 z-50
        w-72 p-6
        transform transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-8">
          <div className="logo flex items-center gap-3">
            {logo ? (
              <img src={logo} alt="logo" className="w-10 h-10 rounded-md" />
            ) : (
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold">A</div>
            )}
            <div className="text-xl font-bold">Akↄfa Fixit</div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = navIcons[item.id] || Home;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                  currentPage === item.id 
                    ? 'bg-purple-600 shadow-lg shadow-purple-500/20' 
                    : 'hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-slate-700 pt-4 mt-6">
          {user && (
            <div className="bg-slate-700/50 rounded-xl p-4">
              <div className="font-semibold text-white">{user.name}</div>
              <div className="text-sm text-gray-400">{purposeConfig.name}</div>
            </div>
          )}
          {user && onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>

        <footer className="mt-6 text-xs text-gray-500 text-center">
          <div>Free — Akↄfa Fixit</div>
        </footer>
      </aside>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 z-30 safe-area-bottom">
        <nav className="flex justify-around py-2">
          {navItems.slice(0, 5).map(item => {
            const Icon = navIcons[item.id] || Home;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                  currentPage === item.id 
                    ? 'text-purple-400' 
                    : 'text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
