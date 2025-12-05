import React, { useState } from 'react';
import { Sparkles, Target, Brain, Users, Heart, AlertCircle, TrendingUp, Users2, Zap, CheckCircle, ArrowRight, Mail, MessageSquare, Star, Send, Calendar, Trophy, Clock, ChevronRight } from 'lucide-react';
import { SuccessStoriesGrid } from '../ui/SuccessStories';
import { getAllUseCases } from '../../config/useCaseTemplates';
import LanguageToggle from '../ui/LanguageToggle';
import { useLanguage } from '../../context/LanguageContext';

const HomePage = ({ onNavigateToSignup, onNavigateToLogin }) => {
  const { t, getSection } = useLanguage();
  const homeText = getSection('home');
  const commonText = getSection('common');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setContactStatus(null);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactForm)
      });
      
      if (response.ok) {
        setContactStatus('success');
        setContactForm({ name: '', email: '', message: '' });
      } else {
        setContactStatus('error');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setContactStatus('error');
    } finally {
      setSubmitting(false);
      setTimeout(() => setContactStatus(null), 5000);
    }
  };

  return (
    <div className="homepage min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Akↄfa Fixit
        </div>
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <button 
            onClick={onNavigateToLogin}
            className="px-6 py-2 text-sm font-medium hover:text-purple-400 transition"
          >
            {homeText.navLogin || 'Login'}
          </button>
          <button 
            onClick={onNavigateToSignup}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
          >
            {homeText.navStartFree || 'Start Free'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="mb-6 inline-block">
          <Sparkles className="w-12 h-12 text-purple-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          {(homeText.title || 'Stop Chasing Symptoms. Fix The Real Problem').split('.').map((part, i) => (
            <React.Fragment key={i}>
              {part}{i === 0 && '.'}<br className={i === 0 ? '' : 'hidden'} />
            </React.Fragment>
          ))}
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          {homeText.subtitle || 'You try different things but nothing works? Akofa shows you exactly what holds you back - whether it\'s your life, your team, or your business. No more guessing. Real answers. Real change.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onNavigateToSignup}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold text-lg transition transform hover:scale-105"
          >
            {homeText.startFree || 'Start Free - Takes 2 Minutes'}
          </button>
          <button 
            onClick={onNavigateToLogin}
            className="px-8 py-4 border border-purple-500 hover:bg-purple-500/20 rounded-lg font-semibold text-lg transition"
          >
            {homeText.login || 'I Have Account Already'}
          </button>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center text-red-300">{homeText.soundFamiliar || 'Sound Familiar?'}</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-4xl mb-3">😩</div>
              <p className="text-gray-300">{homeText.problem1 || '"I try everything but nothing changes"'}</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-3">🔄</div>
              <p className="text-gray-300">{homeText.problem2 || '"Same problem keeps coming back"'}</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-3">😕</div>
              <p className="text-gray-300">{homeText.problem3 || '"I don\'t know where to start"'}</p>
            </div>
          </div>
          <p className="text-center text-gray-400 mt-6">
            {homeText.problemExplanation || 'This happens because you treat symptoms, not the root cause. Akofa shows you the real problem.'}
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-4 text-center">{homeText.howItWorks || 'How Akofa Works'}</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">{homeText.howItWorksSubtitle || 'Simple steps to finally understand what is happening'}</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 h-full">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold mb-6">1</div>
              <h3 className="text-xl font-semibold mb-3">{homeText.step1Title || 'Answer Simple Questions'}</h3>
              <p className="text-gray-400">{homeText.step1Desc || 'Just rate 5 areas of your life honestly. No long form. 2 minutes max.'}</p>
              <div className="mt-4 text-sm text-purple-400 flex items-center gap-2">
                <Clock className="w-4 h-4" /> {homeText.twoMinutesOnly || '2 Minutes Only'}
              </div>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
              <ArrowRight className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 h-full">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-6">2</div>
              <h3 className="text-xl font-semibold mb-3">{homeText.step2Title || 'See The Real Problem'}</h3>
              <p className="text-gray-400">{homeText.step2Desc || 'Akofa analyzes your answers and shows you exactly what holds you back.'}</p>
              <div className="mt-4 text-sm text-blue-400 flex items-center gap-2">
                <Target className="w-4 h-4" /> {homeText.findRootCause || 'Find Root Cause'}
              </div>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
              <ArrowRight className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div>
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 h-full">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-xl font-bold mb-6">3</div>
              <h3 className="text-xl font-semibold mb-3">{homeText.step3Title || 'Get Clear Steps'}</h3>
              <p className="text-gray-400">{homeText.step3Desc || 'Receive practical things you can do today - not theory. Real action steps.'}</p>
              <div className="mt-4 text-sm text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {homeText.startToday || 'Start Today'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Akↄfa Different */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl my-12 border border-purple-700">
        <h2 className="text-3xl font-bold mb-8 text-center">{homeText.whyDifferent || 'Why Akofa is Different'}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">❌</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{homeText.otherApps || 'Other Apps'}</h3>
                <p className="text-gray-400">{homeText.otherAppsDesc || 'Give you general advice that does not fit your situation. One-size-fits-all tips that everyone has heard before.'}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">❌</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{homeText.quickFixes || 'Quick Fixes'}</h3>
                <p className="text-gray-400">{homeText.quickFixesDesc || 'Make you feel good for a short time, then the same problem comes back again.'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Akↄfa</h3>
                <p className="text-gray-400">{homeText.akofaDesc || 'Analyzes YOUR specific situation and shows you YOUR specific problem - personalized for you.'}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{homeText.rootCauseFix || 'Root Cause Fix'}</h3>
                <p className="text-gray-400">{homeText.rootCauseFixDesc || 'Find the REAL problem - fix it once, everything else follows. No more band-aid solutions.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Case Templates */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl my-8">
        <h2 className="text-3xl font-bold mb-4 text-center">{homeText.whatProblem || 'What Kind of Problem Do You Have?'}</h2>
        <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">{homeText.selectSituation || 'Select your situation below and we will customize the analysis for you'}</p>
        
        <div className="grid md:grid-cols-4 gap-4">
          {getAllUseCases().slice(0, 8).map(useCase => (
            <button
              key={useCase.id}
              onClick={onNavigateToSignup}
              className="p-6 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 hover:border-purple-500 transition text-left group"
            >
              <div className="text-4xl mb-3">{useCase.icon}</div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-purple-400 transition">{useCase.name}</h3>
              <p className="text-sm text-gray-400">{useCase.description}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {useCase.examples.slice(0, 2).map((ex, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-slate-700 rounded-full text-gray-300">
                    {ex}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* The 5 Areas */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-4 text-center">{homeText.fiveAreasTitle || 'The 5 Things That Affect Everything'}</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">{homeText.fiveAreasSubtitle || 'Whether it is you personally, your team, or your business - these 5 areas are always connected'}</p>
        <div className="grid md:grid-cols-5 gap-4">
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700 text-center">
            <div className="text-4xl mb-3">💪</div>
            <h3 className="text-lg font-semibold mb-2">{homeText.bodyFoundation || 'Body/Foundation'}</h3>
            <p className="text-gray-400 text-sm">{homeText.bodyFoundationDesc || 'Your physical energy and resources'}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700 text-center">
            <div className="text-4xl mb-3">🧠</div>
            <h3 className="text-lg font-semibold mb-2">{homeText.mindBeliefs || 'Mind/Beliefs'}</h3>
            <p className="text-gray-400 text-sm">{homeText.mindBeliefsDesc || 'What you believe and tell yourself'}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700 text-center">
            <div className="text-4xl mb-3">❤️</div>
            <h3 className="text-lg font-semibold mb-2">{homeText.valuesCulture || 'Values/Culture'}</h3>
            <p className="text-gray-400 text-sm">{homeText.valuesCultureDesc || 'What matters most to you'}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700 text-center">
            <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
            <h3 className="text-lg font-semibold mb-2">{homeText.peopleNetwork || 'People/Network'}</h3>
            <p className="text-gray-400 text-sm">{homeText.peopleNetworkDesc || 'The people around you'}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700 text-center">
            <div className="text-4xl mb-3">👁️</div>
            <h3 className="text-lg font-semibold mb-2">{homeText.awareness || 'Awareness'}</h3>
            <p className="text-gray-400 text-sm">{homeText.awarenessDesc || 'How clearly you see things'}</p>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-8 text-sm">
          {homeText.weakAreaNote || 'When one area is weak, it pulls everything down. Akofa helps you find which one to fix first.'}
        </p>
      </section>

      {/* Daily Check-in Feature */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border border-green-500/30">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-6 h-6 text-green-400" />
                <span className="text-green-400 font-semibold">{homeText.dailyCheckin || 'Daily Check-in'}</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">{homeText.trackProgress || 'Track Your Progress Every Day'}</h2>
              <p className="text-gray-300 mb-6">
                {homeText.trackProgressDesc || 'One minute every morning. Answer 3 simple questions. Watch your life improve week by week. Akofa will remind you and celebrate your wins with you.'}
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{homeText.seeProgress || 'See your progress over time'}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span>{homeText.buildStreaks || 'Build streaks and stay motivated'}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span>{homeText.personalizedTips || 'Get personalized tips based on your mood'}</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="text-sm text-gray-400 mb-4">{homeText.checkinPreview || 'Daily Check-in Preview'}</div>
              <div className="space-y-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-sm mb-2">{homeText.howBodyToday || 'How is your body feeling today?'}</p>
                  <div className="flex gap-2">
                    {['😴', '😐', '😊', '💪', '🔥'].map((emoji, i) => (
                      <button key={i} className="w-10 h-10 bg-slate-600 hover:bg-purple-500 rounded-lg transition text-xl">
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-sm mb-2">{homeText.howMindToday || 'How is your mind feeling today?'}</p>
                  <div className="flex gap-2">
                    {['😰', '😔', '😐', '😊', '🧘'].map((emoji, i) => (
                      <button key={i} className="w-10 h-10 bg-slate-600 hover:bg-purple-500 rounded-lg transition text-xl">
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Solver Feature */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-2xl p-8 border border-orange-500/30">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 bg-slate-800 rounded-xl p-6">
              <div className="text-sm text-gray-400 mb-4">{homeText.problemSolverPreview || 'Problem Solver Preview'}</div>
              <div className="bg-slate-700 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400 mb-2">{homeText.you || 'You'}:</p>
                <p>"{homeText.exampleProblem || 'I am not sleeping well and it is affecting my work'}"</p>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                <p className="text-sm text-purple-400 mb-2">Akↄfa:</p>
                <p className="text-sm">{homeText.exampleResponse || 'Based on your scores, your Body (3/10) is affecting your Mind (5/10). Here are 3 things you can do THIS WEEK:'}</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  <li>1. {homeText.tip1 || 'Stop screen 1 hour before bed'}</li>
                  <li>2. {homeText.tip2 || 'Wake at the same time every day'}</li>
                  <li>3. {homeText.tip3 || 'No coffee after 2pm'}</li>
                </ul>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-6 h-6 text-orange-400" />
                <span className="text-orange-400 font-semibold">{homeText.problemSolver || 'Problem Solver'}</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">{homeText.tellProblem || 'Tell Akofa Your Problem. Get Real Solutions.'}</h2>
              <p className="text-gray-300 mb-6">
                {homeText.notChatbot || 'Not a chatbot that gives copy-paste answers. Akofa knows your scores, understands your situation, and gives you advice that actually fits YOUR life.'}
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{homeText.adviceBasedOn || 'Advice based on YOUR assessment'}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{homeText.practicalSteps || 'Practical steps, not theory'}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{homeText.followUp || 'Follow up on your progress'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">{homeText.whoCanHelp || 'Who Can Akofa Help'}</h2>
        
        {/* Personal */}
        <div className="mb-8 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Heart className="w-8 h-8 text-red-400" />
                {homeText.improveLife || 'If You Want to Improve Your Life'}
              </h3>
              <p className="text-gray-300 mb-6">
                {homeText.improveLifeDesc || 'You are trying but things are not moving? Sleep problems? Work stress? Relationship issues? Akofa shows you what is really causing it.'}
              </p>
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-sm font-semibold text-purple-400 mb-2">{homeText.realExample || 'REAL EXAMPLE'}</p>
                <p className="text-gray-300 text-sm">
                  {homeText.personalExample || '"Chioma scored 3/10 for sleep, 6/10 for work. She tried \'think positive\' but nothing worked. Akofa showed her that sleep was the root cause. Fixed sleep first, everything else followed. 3 weeks later: energy up, work better, peace of mind."'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🌟</div>
                <p className="text-gray-400">{homeText.personalGrowth || 'Personal Growth'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-8 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="flex items-center justify-center order-2 md:order-1">
              <div className="text-center">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-gray-400">{homeText.teamSuccess || 'Team Success'}</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users2 className="w-8 h-8 text-blue-400" />
                {homeText.manageTeam || 'If You Manage a Team'}
              </h3>
              <p className="text-gray-300 mb-6">
                {homeText.manageTeamDesc || 'Productivity low? People leaving? Projects failing? Akofa helps you find the real team problem - not just surface issues.'}
              </p>
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-400 mb-2">{homeText.realExample || 'REAL EXAMPLE'}</p>
                <p className="text-gray-300 text-sm">
                  {homeText.teamExample || '"Startup team was failing deliverables. They tried new tools, new processes - nothing worked. Akofa showed that Team Spirit was low (trust issue), not a process problem. Fixed trust first. 40% improvement in delivery."'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Business */}
        <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-8 h-8 text-green-400" />
                {homeText.runBusiness || 'If You Run a Business'}
              </h3>
              <p className="text-gray-300 mb-6">
                {homeText.runBusinessDesc || 'Business growing but something is not right? Hitting a ceiling? Staff problems? Akofa diagnoses your business like a doctor diagnoses a patient.'}
              </p>
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-400 mb-2">{homeText.realExample || 'REAL EXAMPLE'}</p>
                <p className="text-gray-300 text-sm">
                  {homeText.businessExample || '"E-commerce company - high revenue but losing money. Akofa found three problems: operations broken, team tired, values not aligned. Fixed all three together. Now profitable and team happy."'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📈</div>
                <p className="text-gray-400">{homeText.businessGrowth || 'Business Growth'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-4 text-center">{homeText.successStoriesTitle || 'Real People. Real Results.'}</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          {homeText.successStoriesSubtitle || 'See how people like you have used Akofa to fix their problems and improve their lives'}
        </p>
        <SuccessStoriesGrid category="all" limit={8} />
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{homeText.readyToFix || 'Ready to Finally Fix Things?'}</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            {homeText.stopGuessing || 'Stop guessing. Stop wasting time on things that do not work. Let Akofa show you the real problem so you can fix it once and for all.'}
          </p>
          <button 
            onClick={onNavigateToSignup}
            className="px-8 py-4 bg-white text-purple-600 hover:bg-gray-100 rounded-lg font-semibold text-lg transition transform hover:scale-105"
          >
            {homeText.startFreeNow || 'Start Free Now - 2 Minutes'}
          </button>
          <p className="text-purple-200 text-sm mt-4">{homeText.noCreditCard || 'No credit card. No long form. Just answers.'}</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">{homeText.questionsTitle || 'Questions? Talk to Us'}</h2>
              <p className="text-gray-400 mb-6">
                {homeText.questionsDesc || 'We are here to help. Whether you have a question about how Akofa works or want to share feedback, send us a message.'}
              </p>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <span>hello@akofa.app</span>
                </div>
              </div>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={homeText.yourName || 'Your Name'}
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 focus:border-purple-500 outline-none transition"
                required
              />
              <input
                type="email"
                placeholder={homeText.yourEmail || 'Your Email'}
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 focus:border-purple-500 outline-none transition"
                required
              />
              <textarea
                placeholder={homeText.yourMessage || 'Your Message'}
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 focus:border-purple-500 outline-none transition resize-none"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (commonText.loading || 'Sending...') : (
                  <>
                    <Send className="w-5 h-5" />
                    {homeText.sendMessage || 'Send Message'}
                  </>
                )}
              </button>
              {contactStatus === 'success' && (
                <p className="text-green-400 text-sm text-center">{homeText.messageSent || 'Message sent! We will reply soon.'}</p>
              )}
              {contactStatus === 'error' && (
                <p className="text-red-400 text-sm text-center">{homeText.messageError || 'Something went wrong. Please try again.'}</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Akↄfa Fixit
          </div>
          <p className="text-gray-500 text-sm">
            {homeText.footerTagline || 'Made with love to help you see clearly and fix what matters'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
