import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp, MessageCircle, Book, Lightbulb, Shield, Users, Target, Mail, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function HelpPage() {
  const { t, getSection } = useLanguage();
  const helpText = getSection('helpPage');
  const commonText = getSection('common');
  
  const faqs = [
    {
      category: helpText.gettingStarted || 'Getting Started',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500',
      questions: [
        { q: helpText.faqWhatIs || 'What is Akofa Fixit?', a: helpText.faqWhatIsAnswer || '' },
        { q: helpText.faqHowWorks || 'How does the assessment work?', a: helpText.faqHowWorksAnswer || '' },
        { q: helpText.faqIsFree || 'Is Akofa free to use?', a: helpText.faqIsFreeAnswer || '' },
        { q: helpText.faqHowLong || 'How long does the assessment take?', a: helpText.faqHowLongAnswer || '' }
      ]
    },
    {
      category: helpText.usingAkofa || 'Using Akofa',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      questions: [
        { q: helpText.faqLayers || 'What are the 5 areas/layers?', a: helpText.faqLayersAnswer || '' },
        { q: helpText.faqHowOften || 'How often should I check in?', a: helpText.faqHowOftenAnswer || '' },
        { q: helpText.faqStackScore || 'What is the Stack Score?', a: helpText.faqStackScoreAnswer || '' },
        { q: helpText.faqBusiness || 'Can I use Akofa for my business or team?', a: helpText.faqBusinessAnswer || '' }
      ]
    },
    {
      category: helpText.streaksAndChallenges || 'Streaks & Challenges',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      questions: [
        { q: helpText.faqStreaksWork || 'How do streaks work?', a: helpText.faqStreaksWorkAnswer || '' },
        { q: helpText.faqWhatChallenges || 'What are challenges?', a: helpText.faqWhatChallengesAnswer || '' },
        { q: helpText.faqMultipleChallenges || 'Can I do multiple challenges at once?', a: helpText.faqMultipleChallengesAnswer || '' }
      ]
    },
    {
      category: helpText.communityCategory || 'Community',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      questions: [
        { q: helpText.faqPrivate || 'Is my data private?', a: helpText.faqPrivateAnswer || '' },
        { q: helpText.faqPartner || 'What is an accountability partner?', a: helpText.faqPartnerAnswer || '' },
        { q: helpText.faqGroups || 'How do I join groups?', a: helpText.faqGroupsAnswer || '' }
      ]
    },
    {
      category: helpText.accountSettings || 'Account & Settings',
      icon: Shield,
      color: 'from-red-500 to-pink-500',
      questions: [
        { q: helpText.faqLanguage || 'How do I change my language?', a: helpText.faqLanguageAnswer || '' },
        { q: helpText.faqDelete || 'Can I delete my account?', a: helpText.faqDeleteAnswer || '' },
        { q: helpText.faqExport || 'How do I export my data?', a: helpText.faqExportAnswer || '' }
      ]
    }
  ];

  const guides = [
    {
      title: helpText.guideCheckIns || 'Getting the Most from Daily Check-ins',
      description: helpText.guideCheckInsDesc || 'Learn how to use daily check-ins effectively to track your progress and identify patterns.',
      icon: '📊'
    },
    {
      title: helpText.guideStackScore || 'Understanding Your Stack Score',
      description: helpText.guideStackScoreDesc || 'A deep dive into what your Stack Score means and how to improve it over time.',
      icon: '📈'
    },
    {
      title: helpText.guideChallenges || 'Choosing the Right Challenges',
      description: helpText.guideChallengesDesc || 'How to select challenges that align with your goals and maximize your growth.',
      icon: '🎯'
    },
    {
      title: helpText.guideStreaks || 'Building Consistency with Streaks',
      description: helpText.guideStreaksDesc || 'Tips and strategies for maintaining your check-in streak even when life gets busy.',
      icon: '🔥'
    }
  ];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(0);
  const [expandedQuestions, setExpandedQuestions] = useState({});

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
          {helpText.title || 'Help Center'}
        </h1>
        <p className="text-gray-400">{helpText.subtitle || 'Find answers to common questions and learn how to use Akofa'}</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={helpText.searchPlaceholder || "Search for help..."}
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
          {helpText.faq || 'Frequently Asked Questions'}
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
                  <span className="text-gray-500 text-sm">({category.questions.length} {helpText.questions || 'questions'})</span>
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
            {(helpText.noResults || 'No results found for "{query}". Try a different search term.').replace('{query}', searchQuery)}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-8 border border-purple-500/30 text-center">
        <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">{helpText.stillHaveQuestions || 'Still have questions?'}</h3>
        <p className="text-gray-400 mb-6">
          {helpText.cantFind || 'Cannot find what you are looking for? We are here to help!'}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="mailto:hello@akofa.app"
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-white font-medium transition-colors"
          >
            <Mail className="w-5 h-5" />
            {helpText.emailSupport || 'Email Support'}
          </a>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors">
            <MessageCircle className="w-5 h-5" />
            {helpText.chatWithUs || 'Chat with Us'}
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 py-4">
        {t('disclaimer', 'footer')}
      </div>
    </div>
  );
}
