import React from 'react';
import { LogOut } from 'lucide-react';
import { getHeaderTitle, getPurposeConfig } from '../../config/purposeConfig';
import ShareResults from '../ui/ShareResults';

const Header = ({ currentPage, user, onLogout, assessmentData }) => {
  const purpose = user?.purpose || 'personal';
  const purposeConfig = getPurposeConfig(purpose);
  const pageTitle = getHeaderTitle(purpose, currentPage);

  const showShare = ['dashboard', 'analysis'].includes(currentPage);

  return (
    <header className="header bg-slate-900 text-white p-4 border-b border-white/10 flex items-center justify-between">
      <div className="text-lg font-semibold">
        {pageTitle}
      </div>
      <div className="flex items-center gap-4">
        {showShare && assessmentData && (
          <ShareResults assessmentData={assessmentData} purpose={purpose} />
        )}
        {user && (
          <div className="text-sm text-right">
            <div className="text-gray-300">{user.name}</div>
            <div className="text-xs text-gray-500">{purposeConfig.name}</div>
          </div>
        )}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
        {user && onLogout && (
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-red-400 transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
