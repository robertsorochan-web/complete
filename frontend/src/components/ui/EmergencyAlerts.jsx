import React, { useState, useEffect } from 'react';
import { AlertTriangle, Fuel, Cloud, TrendingUp, TrendingDown, X, Bell, RefreshCw } from 'lucide-react';

const EmergencyAlerts = ({ region = 'Greater Accra', sector = 'general' }) => {
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const sampleAlerts = [
    {
      id: 1,
      type: 'fuel',
      title: 'Fuel Price Update',
      message: 'Petrol price has increased to GHS 15.50 per litre',
      change: '+5%',
      isIncrease: true,
      icon: Fuel,
      color: 'orange',
      priority: 'medium',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      type: 'weather',
      title: 'Weather Alert',
      message: 'Heavy rain expected tomorrow morning - plan your travel',
      icon: Cloud,
      color: 'blue',
      priority: 'high',
      timestamp: new Date().toISOString()
    },
    {
      id: 3,
      type: 'market',
      title: 'Market Update',
      message: 'Tomato prices have dropped at Madina Market',
      change: '-15%',
      isIncrease: false,
      icon: TrendingDown,
      color: 'green',
      priority: 'low',
      timestamp: new Date().toISOString()
    }
  ];

  const sectorAlerts = {
    fishing: [
      {
        id: 4,
        type: 'weather',
        title: 'Sea Condition',
        message: 'Waves calm today - good for fishing',
        icon: Cloud,
        color: 'green',
        priority: 'high',
        timestamp: new Date().toISOString()
      }
    ],
    farming: [
      {
        id: 5,
        type: 'weather',
        title: 'Farming Weather',
        message: 'Good planting conditions for next 3 days',
        icon: Cloud,
        color: 'green',
        priority: 'medium',
        timestamp: new Date().toISOString()
      }
    ],
    business: [
      {
        id: 6,
        type: 'market',
        title: 'Dollar Rate',
        message: 'Dollar is at GHS 15.80 today',
        icon: TrendingUp,
        color: 'blue',
        priority: 'medium',
        timestamp: new Date().toISOString()
      }
    ]
  };

  useEffect(() => {
    loadAlerts();
  }, [region, sector]);

  const loadAlerts = () => {
    setLoading(true);
    setTimeout(() => {
      let allAlerts = [...sampleAlerts];
      if (sectorAlerts[sector]) {
        allAlerts = [...allAlerts, ...sectorAlerts[sector]];
      }
      setAlerts(allAlerts.filter(a => !dismissed.includes(a.id)));
      setLastUpdated(new Date());
      setLoading(false);
    }, 500);
  };

  const dismissAlert = (id) => {
    setDismissed([...dismissed, id]);
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const getColorClasses = (color, priority) => {
    const colors = {
      orange: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        icon: 'text-orange-400',
        badge: 'bg-orange-500'
      },
      blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        icon: 'text-blue-400',
        badge: 'bg-blue-500'
      },
      green: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        icon: 'text-green-400',
        badge: 'bg-green-500'
      },
      red: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        icon: 'text-red-400',
        badge: 'bg-red-500'
      }
    };
    return colors[color] || colors.blue;
  };

  const activeAlerts = alerts.filter(a => a.priority === 'high');

  if (alerts.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-white">Alerts & Updates</h3>
          {activeAlerts.length > 0 && (
            <span className="px-2 py-0.5 bg-red-500 rounded-full text-xs font-medium">
              {activeAlerts.length} urgent
            </span>
          )}
        </div>
        <button
          onClick={loadAlerts}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          const colors = getColorClasses(alert.color, alert.priority);
          
          return (
            <div
              key={alert.id}
              className={`${colors.bg} ${colors.border} border rounded-lg p-3 relative`}
            >
              <button
                onClick={() => dismissAlert(alert.id)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-start gap-3 pr-6">
                <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white text-sm">{alert.title}</h4>
                    {alert.priority === 'high' && (
                      <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm">{alert.message}</p>
                  {alert.change && (
                    <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                      alert.isIncrease ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {alert.isIncrease ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {alert.change}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {lastUpdated && (
        <p className="text-xs text-gray-500 text-center">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default EmergencyAlerts;
