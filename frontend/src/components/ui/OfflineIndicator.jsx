import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { syncPendingActions, getPendingCount } from '../../utils/offlineStorage';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      handleSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    checkPendingActions();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkPendingActions = async () => {
    try {
      const count = await getPendingCount();
      setPendingCount(count);
    } catch (err) {
      console.error('Error checking pending actions:', err);
    }
  };

  const handleSync = async () => {
    if (syncing || !isOnline) return;
    
    setSyncing(true);
    setSyncResult(null);
    
    try {
      const token = localStorage.getItem('akofa_token');
      const result = await syncPendingActions(API_URL, token);
      setSyncResult(result);
      await checkPendingActions();
      
      setTimeout(() => setSyncResult(null), 3000);
    } catch (err) {
      console.error('Sync error:', err);
      setSyncResult({ error: true });
    } finally {
      setSyncing(false);
    }
  };

  if (isOnline && pendingCount === 0 && !showStatus) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div 
        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all cursor-pointer ${
          isOnline 
            ? 'bg-green-900/90 border border-green-500/50' 
            : 'bg-red-900/90 border border-red-500/50'
        }`}
        onClick={() => setShowStatus(!showStatus)}
      >
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-400" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-400" />
        )}
        <span className={`text-sm font-medium ${isOnline ? 'text-green-300' : 'text-red-300'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
        
        {pendingCount > 0 && (
          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
            {pendingCount} pending
          </span>
        )}
      </div>

      {showStatus && (
        <div className="absolute bottom-12 left-0 w-64 bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-4">
          <h3 className="font-medium text-white mb-3 flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            Connection Status
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Status:</span>
              <span className={isOnline ? 'text-green-400' : 'text-red-400'}>
                {isOnline ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Pending Actions:</span>
              <span className={pendingCount > 0 ? 'text-yellow-400' : 'text-gray-300'}>
                {pendingCount}
              </span>
            </div>

            {!isOnline && (
              <p className="text-xs text-gray-500 bg-slate-700/50 p-2 rounded">
                Your changes are saved locally and will sync when you're back online.
              </p>
            )}

            {isOnline && pendingCount > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleSync(); }}
                disabled={syncing}
                className="w-full py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {syncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Sync Now
                  </>
                )}
              </button>
            )}

            {syncResult && (
              <div className={`flex items-center gap-2 text-sm p-2 rounded ${
                syncResult.error 
                  ? 'bg-red-500/20 text-red-400' 
                  : 'bg-green-500/20 text-green-400'
              }`}>
                {syncResult.error ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Sync failed
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Synced {syncResult.synced} items
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
