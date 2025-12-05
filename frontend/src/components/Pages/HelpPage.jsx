import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp, MessageCircle, Book, Lightbulb, Shield, Users, Target, Mail, ExternalLink } from 'lucide-react';
import { t, getCurrentLanguage } from '../../config/i18n';

const faqs = [
  {
    category: 'Getting Started',
    icon: Lightbulb,
    color: 'from-yellow-500 to-orange-500',
    questions: [
      {
        q: 'What is Akofa Fixit?',
        a: 'Akofa Fixit is a personal and business assessment tool that helps you identify what areas of your life or business need the most attention. By rating 5 key areas, you get insights into your root problems and actionable steps to fix them.'
      },
      {
        q: 'How does the assessment work?',
        a: 'You rate 5 core areas (Body/Resources, Mind/Beliefs, Values/Culture, People/Network, and Awareness) on a scale of 1-10. Akofa then analyzes your scores to identify your strengths and the areas that need the most work, giving you personalized recommendations.'
      },
      {
        q: 'Is Akofa free to use?',
        a: 'Yes! The basic assessment and daily check-ins are completely free. We may add premium features in the future, but the core functionality will always be accessible to everyone.'
      },
      {
        q: 'How long does the assessment take?',
        a: 'The initial assessment takes about 2 minutes. Daily check-ins take about 1 minute. We designed it to be quick so you can track your progress without taking too much time.'
      }
    ]
  },
  {
    category: 'Using Akofa',
    icon: Target,
    color: 'from-purple-500 to-pink-500',
    questions: [
      {
        q: 'What are the 5 areas/layers?',
        a: 'The 5 layers are: 1) Bio Hardware/Resources - your physical health, energy, and resources. 2) Internal OS/Beliefs - your mindset and mental models. 3) Cultural Software/Values - your values and cultural influences. 4) Social Instance/Network - your relationships and support system. 5) Conscious User/Awareness - your self-awareness and presence.'
      },
      {
        q: 'How often should I check in?',
        a: 'We recommend daily check-ins for the best results. This helps you track patterns over time and notice what affects your scores. Even if you miss a day, the streak system will encourage you to keep going.'
      },
      {
        q: 'What is the Stack Score?',
        a: 'Your Stack Score is the overall measure of how balanced and healthy your 5 areas are. It is calculated from your individual layer scores and gives you a quick view of your overall wellbeing.'
      },
      {
        q: 'Can I use Akofa for my business or team?',
        a: 'Yes! You can select different purposes (Personal, Team, Business) when you start. Each purpose adapts the questions and recommendations to fit your context.'
      }
    ]
  },
  {
    category: 'Streaks & Challenges',
    icon: Target,
    color: 'from-green-500 to-emerald-500',
    questions: [
      {
        q: 'How do streaks work?',
        a: 'When you complete your daily check-in, you add to your streak. If you miss a day, the streak resets. Longer streaks unlock achievements and show your commitment to growth.'
      },
      {
        q: 'What are challenges?',
        a: 'Challenges are structured programs that help you improve specific areas. They range from 7 to 30 days and focus on one layer. Complete challenges to earn points and achievements.'
      },
      {
        q: 'Can I do multiple challenges at once?',
        a: 'Yes, you can join multiple challenges. However, we recommend focusing on one at a time for better results. Quality over quantity!'
      }
    ]
  },
  {
    category: 'Community',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    questions: [
      {
        q: 'Is my data private?',
        a: 'Yes! Your assessment data is private by default. Only you can see your scores. When you share insights or stories, you control what information is visible to others.'
      },
      {
        q: 'What is an accountability partner?',
        a: 'An accountability partner is another Akofa user who you can connect with for mutual support. You can see each other\'s streaks and encourage each other on your journey.'
      },
      {
        q: 'How do I join groups?',
        a: 'Go to the Community page and click on the Groups tab. You can browse available groups based on your interests and join any that resonate with you.'
      }
    ]
  },
  {
    category: 'Account & Settings',
    icon: Shield,
    color: 'from-red-500 to-pink-500',
    questions: [
      {
        q: 'How do I change my language?',
        a: 'Click the globe icon in the navigation bar and select your preferred language. We support English, Pidgin, Twi, Ga, Yoruba, and Hausa.'
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes, you can delete your account from the Profile settings. Note that this will permanently delete all your data including check-in history, achievements, and community posts.'
      },
      {
        q: 'How do I export my data?',
        a: 'Go to your Profile page and click on Export Data. You can download your assessment history, check-ins, and other data as a JSON file.'
      }
    ]
  }
];

const guides = [
  {
    title: 'Getting the Most from Daily Check-ins',
    description: 'Learn how to use daily check-ins effectively to track your progress and identify patterns.',
    icon: '📊'
  },
  {
    title: 'Understanding Your Stack Score',
    description: 'A deep dive into what your Stack Score means and how to improve it over time.',
    icon: '📈'
  },
  {
    title: 'Choosing the Right Challenges',
    description: 'How to select challenges that align with your goals and maximize your growth.',
    icon: '🎯'
  },
  {
    title: 'Building Consistency with Streaks',
    description: 'Tips and strategies for maintaining your check-in streak even when life gets busy.',
    icon: '🔥'
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(0);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const lang = getCurrentLanguage();

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setExpandedQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <HelpCircle className="w-8 h-8 text-purple-400" />
          Help Center
        </h1>
        <p className="text-gray-400">Find answers to common questions and learn how to use Akofa</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for help..."
          className="w-full pl-12 pr-4 py-4 bg-slate-800 rounded-xl border border-slate-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {guides.map((guide, index) => (
          <div
            key={index}
            className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-purple-500/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{guide.icon}</div>
              <div>
                <h3 className="font-bold text-white mb-1">{guide.title}</h3>
                <p className="text-gray-400 text-sm">{guide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Book className="w-5 h-5 text-purple-400" />
          Frequently Asked Questions
        </h2>

        {filteredFaqs.map((category, categoryIndex) => {
          const Icon = category.icon;
          return (
            <div key={categoryIndex} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <button
                onClick={() => setExpandedCategory(expandedCategory === categoryIndex ? -1 : categoryIndex)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-white">{category.category}</span>
                  <span className="text-gray-500 text-sm">({category.questions.length} questions)</span>
                </div>
                {expandedCategory === categoryIndex ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedCategory === categoryIndex && (
                <div className="border-t border-slate-700">
                  {category.questions.map((question, questionIndex) => {
                    const key = `${categoryIndex}-${questionIndex}`;
                    const isExpanded = expandedQuestions[key];

                    return (
                      <div key={questionIndex} className="border-b border-slate-700 last:border-b-0">
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors text-left"
                        >
                          <span className="text-white">{question.q}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 ml-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-4" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-5 pb-4">
                            <p className="text-gray-400 bg-slate-700/30 rounded-lg p-4">{question.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {searchQuery && filteredFaqs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No results found for "{searchQuery}". Try a different search term.
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-8 border border-purple-500/30 text-center">
        <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
        <p className="text-gray-400 mb-6">
          Cannot find what you are looking for? We are here to help!
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="mailto:hello@akofa.app"
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-white font-medium transition-colors"
          >
            <Mail className="w-5 h-5" />
            Email Support
          </a>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors">
            <MessageCircle className="w-5 h-5" />
            Chat with Us
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 py-4">
        {t('footer.disclaimer', lang)}
      </div>
    </div>
  );
}
