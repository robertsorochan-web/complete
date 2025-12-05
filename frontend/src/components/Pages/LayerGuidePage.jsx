import React, { useState } from 'react';
import { Heart, Brain, Code, Users, Eye, ChevronRight, BookOpen, Dumbbell, Lightbulb, Play, Check, Target, Zap, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const layerData = {
  bioHardware: {
    name: 'Bio Hardware',
    icon: Heart,
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50',
    description: 'Your physical foundation - the body that carries everything else',
    overview: `Your Bio Hardware is the physical vessel that enables everything else in your life. Just like a computer needs good hardware to run software effectively, your body needs proper care to support your mental, emotional, and social functions.

This layer includes:
- Sleep quality and quantity
- Nutrition and hydration
- Physical movement and exercise
- Energy levels throughout the day
- Physical health markers`,
    exercises: [
      { title: 'Morning Body Scan', duration: '5 min', description: 'Start each day by checking in with your body from head to toe' },
      { title: 'Hydration Tracker', duration: 'All day', description: 'Aim for 8 glasses of water, notice how it affects your energy' },
      { title: 'Movement Breaks', duration: '2 min', description: 'Every hour, stand up and stretch or walk' },
      { title: 'Sleep Audit', duration: '1 week', description: 'Track your sleep patterns and quality for insights' }
    ],
    tips: [
      'Your body affects your thoughts - tired body often means foggy mind',
      'Start with small changes - even 10 minutes of walking counts',
      'Notice patterns between what you eat and how you feel',
      'Quality sleep is foundation - prioritize it above all else'
    ],
    questions: [
      'How many hours of sleep did you get last night?',
      'Rate your energy level right now (1-10)',
      'When did you last eat a nutritious meal?',
      'How much water have you had today?'
    ]
  },
  internalOS: {
    name: 'Internal OS',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/50',
    description: 'Your inner operating system - beliefs, thoughts, and emotional patterns',
    overview: `Your Internal OS is the mental and emotional programming that runs beneath the surface. Like a computer's operating system, it determines how you process information, respond to situations, and experience life.

This layer includes:
- Self-talk and inner dialogue
- Emotional regulation
- Limiting beliefs vs empowering beliefs
- Mental habits and thought patterns
- Confidence and self-esteem`,
    exercises: [
      { title: 'Thought Journaling', duration: '10 min', description: 'Write down recurring thoughts without judgment' },
      { title: 'Belief Audit', duration: '15 min', description: 'List beliefs about yourself - which serve you?' },
      { title: 'Emotion Naming', duration: '2 min', description: 'When feeling something, name the specific emotion' },
      { title: 'Reframe Practice', duration: '5 min', description: 'Take a negative thought and find alternative perspectives' }
    ],
    tips: [
      'Your thoughts are not facts - they can be observed and changed',
      'Emotions are information, not commands',
      'Old beliefs can be updated with new evidence',
      'Self-compassion accelerates growth more than self-criticism'
    ],
    questions: [
      'What story are you telling yourself today?',
      'What emotion keeps showing up for you?',
      'What belief might be holding you back?',
      'When was the last time you challenged a negative thought?'
    ]
  },
  culturalSoftware: {
    name: 'Cultural Software',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    description: 'Your values, worldview, and the cultural programs running your life',
    overview: `Your Cultural Software represents the values, beliefs, and worldviews that were installed through family, education, religion, media, and society. Like apps on a phone, some serve you well while others may need updating.

This layer includes:
- Core values and priorities
- Cultural and family influences
- Worldview and perspective
- Moral and ethical framework
- Life philosophy and meaning`,
    exercises: [
      { title: 'Values Discovery', duration: '20 min', description: 'Identify your top 5 values and how you live them' },
      { title: 'Cultural Inventory', duration: '15 min', description: 'List beliefs from family/culture - which do you keep?' },
      { title: 'Media Audit', duration: '1 week', description: 'Notice what media you consume and how it shapes you' },
      { title: 'Legacy Letter', duration: '30 min', description: 'Write what you want to be remembered for' }
    ],
    tips: [
      'Not all inherited beliefs serve your current life',
      'You can honor your culture while evolving beyond it',
      'Your values should guide your daily decisions',
      'Meaning comes from alignment with what matters most'
    ],
    questions: [
      'What values guide your biggest decisions?',
      'Which cultural belief do you question most?',
      'What gives your life meaning?',
      'Are your daily actions aligned with your stated values?'
    ]
  },
  socialInstance: {
    name: 'Social Instance',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    description: 'Your relationships and how you show up in the social world',
    overview: `Your Social Instance is how you exist in relationship to others. You are a unique instance of humanity, running in a network of other instances. The quality of these connections profoundly impacts your wellbeing.

This layer includes:
- Family relationships
- Friendships and social circle
- Professional relationships
- Community involvement
- Communication patterns`,
    exercises: [
      { title: 'Relationship Mapping', duration: '15 min', description: 'Draw your network - who energizes vs drains you?' },
      { title: 'Connection Audit', duration: '10 min', description: 'List 5 people you want to connect with more' },
      { title: 'Gratitude Expression', duration: '5 min', description: 'Tell someone specific why you appreciate them' },
      { title: 'Boundary Practice', duration: 'Ongoing', description: 'Identify one boundary you need to set or maintain' }
    ],
    tips: [
      'Quality of relationships matters more than quantity',
      'Healthy boundaries enable healthier connections',
      'You become like the 5 people you spend most time with',
      'Vulnerability builds deeper connections'
    ],
    questions: [
      'Who did you genuinely connect with today?',
      'Which relationship needs more attention?',
      'Where do you need to set better boundaries?',
      'How are you contributing to your community?'
    ]
  },
  consciousUser: {
    name: 'Conscious User',
    icon: Eye,
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50',
    description: 'The aware observer - the "you" that makes conscious choices',
    overview: `The Conscious User is the awareness that observes and directs all other layers. It's the part of you that can step back, see patterns, and make intentional choices rather than running on autopilot.

This layer includes:
- Self-awareness and metacognition
- Intentional decision-making
- Present moment awareness
- Goal setting and vision
- Personal growth orientation`,
    exercises: [
      { title: 'Observer Mode', duration: '10 min', description: 'Watch your thoughts without engaging - just notice' },
      { title: 'Decision Audit', duration: '15 min', description: 'Review recent decisions - conscious or reactive?' },
      { title: 'Vision Writing', duration: '30 min', description: 'Describe your ideal life 5 years from now' },
      { title: 'Daily Intention', duration: '2 min', description: 'Set one conscious intention each morning' }
    ],
    tips: [
      'Awareness is the first step to change',
      'You are not your thoughts - you observe them',
      'Pause before reacting to respond intentionally',
      'Regular reflection accelerates growth'
    ],
    questions: [
      'What patterns do you notice in yourself?',
      'When did you react vs respond today?',
      'What is one thing you want to change about yourself?',
      'How present were you today on a scale of 1-10?'
    ]
  }
};

export default function LayerGuidePage() {
  const [selectedLayer, setSelectedLayer] = useState('bioHardware');
  const [activeSection, setActiveSection] = useState('overview');
  const [completedExercises, setCompletedExercises] = useState({});
  
  const layer = layerData[selectedLayer];
  const LayerIcon = layer.icon;

  const toggleExercise = (index) => {
    setCompletedExercises(prev => ({
      ...prev,
      [`${selectedLayer}-${index}`]: !prev[`${selectedLayer}-${index}`]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <BookOpen className="w-8 h-8 text-purple-500" />
          Layer Deep Dive
        </h1>
        <p className="text-gray-400">Explore and understand each layer of the Stack</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {Object.entries(layerData).map(([key, data]) => {
          const Icon = data.icon;
          return (
            <button
              key={key}
              onClick={() => { setSelectedLayer(key); setActiveSection('overview'); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                selectedLayer === key 
                  ? `bg-gradient-to-r ${data.color} text-white` 
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{data.name}</span>
            </button>
          );
        })}
      </div>

      <div className={`bg-gradient-to-r ${layer.color} p-1 rounded-2xl`}>
        <div className="bg-slate-900 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl ${layer.bgColor}`}>
              <LayerIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{layer.name}</h2>
              <p className="text-gray-400">{layer.description}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['overview', 'exercises', 'tips', 'reflect'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeSection === section 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>

          {activeSection === 'overview' && (
            <div className="space-y-4">
              <div className="prose prose-invert max-w-none">
                {layer.overview.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-300 leading-relaxed">{para}</p>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-white">Key Focus Areas</h3>
                </div>
                <ul className="grid md:grid-cols-2 gap-2">
                  {layer.overview.split('\n').filter(line => line.startsWith('- ')).map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300">
                      <ChevronRight className="w-4 h-4 text-purple-400" />
                      {item.replace('- ', '')}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'exercises' && (
            <div className="space-y-4">
              <p className="text-gray-400 mb-4">Practice these exercises to strengthen this layer:</p>
              {layer.exercises.map((exercise, i) => (
                <div 
                  key={i}
                  className={`p-4 rounded-xl border transition-all ${
                    completedExercises[`${selectedLayer}-${i}`]
                      ? 'bg-green-500/10 border-green-500/50'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleExercise(i)}
                      className={`p-2 rounded-full transition-colors ${
                        completedExercises[`${selectedLayer}-${i}`]
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                      }`}
                    >
                      {completedExercises[`${selectedLayer}-${i}`] ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Dumbbell className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{exercise.title}</h4>
                        <span className="px-2 py-0.5 bg-slate-700 text-gray-400 text-xs rounded">
                          {exercise.duration}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{exercise.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'tips' && (
            <div className="space-y-4">
              <p className="text-gray-400 mb-4">Key insights for this layer:</p>
              {layer.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className={`p-2 rounded-lg ${layer.bgColor}`}>
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-gray-300 flex-1">{tip}</p>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'reflect' && (
            <div className="space-y-4">
              <p className="text-gray-400 mb-4">Reflection questions for deeper understanding:</p>
              {layer.questions.map((question, i) => (
                <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                      {i + 1}
                    </div>
                    <p className="text-white font-medium flex-1 pt-1">{question}</p>
                  </div>
                  <textarea
                    placeholder="Write your thoughts here..."
                    className="w-full p-3 bg-slate-700 rounded-lg text-white placeholder-gray-500 border border-slate-600 focus:border-purple-500 focus:outline-none min-h-[80px]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-yellow-400" />
          <h3 className="text-lg font-bold text-white">Quick Start Challenge</h3>
        </div>
        <p className="text-gray-400 mb-4">
          Ready to take action? Start with this simple exercise for the {layer.name} layer:
        </p>
        <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
          <Play className="w-10 h-10 text-purple-400" />
          <div className="flex-1">
            <h4 className="font-semibold text-white">{layer.exercises[0].title}</h4>
            <p className="text-gray-400 text-sm">{layer.exercises[0].description}</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition">
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
}
