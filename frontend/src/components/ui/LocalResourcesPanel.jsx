import React, { useState } from 'react';
import { MapPin, Phone, Globe, ChevronDown, ChevronUp, Building, Users, Landmark, Wallet } from 'lucide-react';
import { getResourcesBySector, getAllEmergencyContacts } from '../../config/localResources';

const ResourceCard = ({ resource, type }) => {
  const icons = {
    cooperatives: <Users className="w-5 h-5 text-green-400" />,
    associations: <Building className="w-5 h-5 text-blue-400" />,
    government: <Landmark className="w-5 h-5 text-purple-400" />,
    finance: <Wallet className="w-5 h-5 text-yellow-400" />
  };

  return (
    <div className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition">
      <div className="flex items-start gap-3">
        <div className="mt-1">{icons[type]}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-white">{resource.name}</h4>
          <p className="text-sm text-gray-400 mt-1">{resource.description}</p>
          <div className="flex items-center gap-2 mt-2 text-sm">
            {resource.contact && (
              <span className="flex items-center gap-1 text-purple-400">
                <Phone className="w-3 h-3" />
                {resource.contact}
              </span>
            )}
            {resource.website && (
              <a 
                href={`https://${resource.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:underline"
              >
                <Globe className="w-3 h-3" />
                {resource.website}
              </a>
            )}
          </div>
          {resource.region && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <MapPin className="w-3 h-3" />
              {resource.region}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LocalResourcesPanel = ({ sector = 'business', expanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [activeTab, setActiveTab] = useState('all');
  const resources = getResourcesBySector(sector);
  const emergencyContacts = getAllEmergencyContacts();

  const tabs = [
    { id: 'all', label: 'All Resources' },
    { id: 'cooperatives', label: 'Cooperatives' },
    { id: 'associations', label: 'Associations' },
    { id: 'government', label: 'Government' },
    { id: 'finance', label: 'Finance' },
    { id: 'emergency', label: 'Emergency' }
  ];

  const renderResources = () => {
    if (activeTab === 'emergency') {
      return (
        <div className="space-y-3">
          {emergencyContacts.map((contact, i) => (
            <div key={i} className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">{contact.name}</h4>
                  <p className="text-sm text-gray-400">{contact.description}</p>
                </div>
                {contact.number && (
                  <a 
                    href={`tel:${contact.number}`}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-lg transition"
                  >
                    {contact.number}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'all') {
      return (
        <div className="space-y-6">
          {Object.entries(resources).map(([type, items]) => (
            items.length > 0 && (
              <div key={type}>
                <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </h4>
                <div className="space-y-2">
                  {items.slice(0, 3).map((resource, i) => (
                    <ResourceCard key={i} resource={resource} type={type} />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      );
    }

    const items = resources[activeTab] || [];
    return (
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((resource, i) => (
            <ResourceCard key={i} resource={resource} type={activeTab} />
          ))
        ) : (
          <p className="text-gray-400 text-center py-4">No resources found for this category</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white">Local Resources & Support</h3>
            <p className="text-sm text-gray-400">Cooperatives, associations, and government programs</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 pt-0">
          <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-slate-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {renderResources()}

          <div className="mt-4 pt-4 border-t border-slate-700 text-center">
            <p className="text-xs text-gray-500">
              These resources are for Ghana. For other countries, contact your local associations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalResourcesPanel;
