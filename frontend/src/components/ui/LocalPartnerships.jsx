import React from 'react';
import { Building2, Users, Handshake, ExternalLink } from 'lucide-react';

const partnerships = {
  fishing: [
    {
      id: 1,
      name: 'Ghana National Canoe Fishermen Council',
      type: 'Association',
      description: 'Support for artisanal fishermen',
      location: 'Nationwide',
      icon: '🎣'
    },
    {
      id: 2,
      name: 'Tema Fishing Cooperative',
      type: 'Cooperative',
      description: 'Joint marketing and equipment sharing',
      location: 'Tema',
      icon: '⚓'
    }
  ],
  business: [
    {
      id: 3,
      name: 'Ghana Traders Association',
      type: 'Association',
      description: 'Market traders support network',
      location: 'Nationwide',
      icon: '🏪'
    },
    {
      id: 4,
      name: 'Makola Market Union',
      type: 'Union',
      description: 'Accra market traders collective',
      location: 'Accra',
      icon: '🛒'
    },
    {
      id: 5,
      name: 'NBSSI',
      type: 'Government',
      description: 'Small business support and loans',
      location: 'Nationwide',
      icon: '🏛️'
    }
  ],
  farming: [
    {
      id: 6,
      name: 'Farmers Association of Ghana',
      type: 'Association',
      description: 'Advocacy and support for farmers',
      location: 'Nationwide',
      icon: '🌾'
    },
    {
      id: 7,
      name: 'Cocoa Board (COCOBOD)',
      type: 'Government',
      description: 'Cocoa farmers support',
      location: 'Nationwide',
      icon: '🍫'
    }
  ],
  community: [
    {
      id: 8,
      name: 'Ghana Community Network',
      type: 'NGO',
      description: 'Community development support',
      location: 'Nationwide',
      icon: '🤝'
    }
  ],
  general: [
    {
      id: 9,
      name: 'Mobile Money Agents',
      type: 'Service',
      description: 'MTN, Vodafone, AirtelTigo MoMo',
      location: 'Nationwide',
      icon: '📱'
    },
    {
      id: 10,
      name: 'Ghana Health Service',
      type: 'Government',
      description: 'Health centers and advice',
      location: 'Nationwide',
      icon: '🏥'
    }
  ]
};

const LocalPartnerships = ({ sector = 'general' }) => {
  const relevantPartners = [
    ...(partnerships[sector] || []),
    ...partnerships.general
  ].slice(0, 4);

  if (relevantPartners.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Handshake className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Local Support Networks</h3>
            <p className="text-sm text-gray-400">Organizations wey fit help you</p>
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        {relevantPartners.map((partner) => (
          <div
            key={partner.id}
            className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition cursor-pointer group"
          >
            <div className="text-2xl mb-2">{partner.icon}</div>
            <h4 className="font-medium text-white text-sm mb-1 group-hover:text-purple-400 transition">
              {partner.name}
            </h4>
            <p className="text-xs text-gray-400 mb-2">{partner.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 bg-slate-600 rounded-full text-gray-300">
                {partner.type}
              </span>
              <span className="text-xs text-gray-500">{partner.location}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-700/30 border-t border-slate-700">
        <p className="text-xs text-gray-400 text-center">
          These organizations dey help people like you. Reach out for support!
        </p>
      </div>
    </div>
  );
};

export default LocalPartnerships;
