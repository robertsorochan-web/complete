import React, { useState } from 'react';
import { Users, MessageCircle, Star, MapPin, Briefcase, Search, X } from 'lucide-react';

const mentors = [
  {
    id: 1,
    name: 'Kofi Mensah',
    expertise: 'Retail Business',
    location: 'Accra',
    experience: '15 years',
    bio: 'Started from market stall, now own 3 shops in Accra. Happy to share wisdom with young entrepreneurs.',
    available: true,
    whatsapp: '+233200000001'
  },
  {
    id: 2,
    name: 'Abena Osei',
    expertise: 'Food & Catering',
    location: 'Kumasi',
    experience: '10 years',
    bio: 'Built catering business from small chop bar. Specialize in scaling food businesses.',
    available: true,
    whatsapp: '+233200000002'
  },
  {
    id: 3,
    name: 'Kwame Asante',
    expertise: 'Agriculture',
    location: 'Tamale',
    experience: '20 years',
    bio: 'Third generation farmer. Expert in modern farming techniques and market access.',
    available: false,
    whatsapp: '+233200000003'
  },
  {
    id: 4,
    name: 'Efua Darko',
    expertise: 'Fashion & Beauty',
    location: 'Takoradi',
    experience: '8 years',
    bio: 'Started tailoring shop, now train over 50 apprentices. Focus on creative businesses.',
    available: true,
    whatsapp: '+233200000004'
  },
  {
    id: 5,
    name: 'Yaw Boateng',
    expertise: 'Technology',
    location: 'Accra',
    experience: '12 years',
    bio: 'Help small businesses go digital. From social media to e-commerce.',
    available: true,
    whatsapp: '+233200000005'
  }
];

const MentorshipMatcher = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedMentor, setSelectedMentor] = useState(null);

  const expertiseAreas = ['all', 'Retail Business', 'Food & Catering', 'Agriculture', 'Fashion & Beauty', 'Technology'];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpertise = selectedExpertise === 'all' || mentor.expertise === selectedExpertise;
    return matchesSearch && matchesExpertise;
  });

  const connectWithMentor = (mentor) => {
    const message = encodeURIComponent(`Hello ${mentor.name}! I found you on Akↄfa Fixit and would like to connect with you for mentorship. My name is [Your Name] and I am interested in ${mentor.expertise}.`);
    window.open(`https://wa.me/${mentor.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="font-bold text-white">Find a Mentor</h3>
          <p className="text-sm text-gray-400">Connect with experienced business people</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, expertise, or location..."
            className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {expertiseAreas.map(area => (
            <button
              key={area}
              onClick={() => setSelectedExpertise(area)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition ${
                selectedExpertise === area 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {area === 'all' ? 'All Areas' : area}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredMentors.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No mentors found</p>
            <p className="text-sm">Try different search terms</p>
          </div>
        ) : (
          filteredMentors.map(mentor => (
            <div key={mentor.id} className={`p-4 rounded-xl border ${
              mentor.available 
                ? 'bg-slate-700/50 border-slate-600 hover:border-purple-500' 
                : 'bg-slate-700/30 border-slate-700 opacity-60'
            } transition cursor-pointer`} onClick={() => setSelectedMentor(mentor)}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{mentor.name}</span>
                      {mentor.available ? (
                        <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">Available</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded-full">Busy</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <Briefcase className="w-3 h-3" />
                      <span>{mentor.expertise}</span>
                      <span>•</span>
                      <MapPin className="w-3 h-3" />
                      <span>{mentor.location}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{mentor.experience} experience</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedMentor && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-800 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedMentor.name}</h3>
                  <p className="text-purple-400">{selectedMentor.expertise}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMentor(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedMentor.location}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> {selectedMentor.experience}</span>
              </div>

              <p className="text-gray-300">{selectedMentor.bio}</p>

              {selectedMentor.available ? (
                <button
                  onClick={() => connectWithMentor(selectedMentor)}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Connect via WhatsApp
                </button>
              ) : (
                <div className="w-full py-4 bg-slate-700 rounded-xl text-center text-gray-400">
                  This mentor is currently not available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 bg-amber-900/20 rounded-xl p-4 border border-amber-500/30">
        <p className="text-amber-400 text-sm">
          💡 Want to become a mentor? Help others grow! Contact us via WhatsApp.
        </p>
      </div>
    </div>
  );
};

export default MentorshipMatcher;
