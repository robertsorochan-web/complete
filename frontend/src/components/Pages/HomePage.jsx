import React, { useState } from 'react';
import { Sparkles, Target, Brain, Users, Heart, AlertCircle, TrendingUp, Users2, Zap, CheckCircle, ArrowRight, Mail, MessageSquare, Star, Send, Calendar, Trophy, Clock, ChevronRight } from 'lucide-react';
import { SuccessStoriesGrid } from '../ui/SuccessStories';
import { getAllUseCases } from '../../config/useCaseTemplates';
import LanguageToggle from '../ui/LanguageToggle';

const HomePage = ({ onNavigateToSignup, onNavigateToLogin }) => {
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
            Login
          </button>
          <button 
            onClick={onNavigateToSignup}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="mb-6 inline-block">
          <Sparkles className="w-12 h-12 text-purple-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Stop Chasing Symptoms.<br />Fix The Real Problem.
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          You dey try different things but nothing dey work? Akↄfa shows you exactly what dey hold you back - whether na your life, your team, or your business. No more guessing. Real answers. Real change.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onNavigateToSignup}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold text-lg transition transform hover:scale-105"
          >
            Start Free - Takes 2 Minutes
          </button>
          <button 
            onClick={onNavigateToLogin}
            className="px-8 py-4 border border-purple-500 hover:bg-purple-500/20 rounded-lg font-semibold text-lg transition"
          >
            I Get Account Already
          </button>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center text-red-300">Sound Familiar?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-4xl mb-3">😩</div>
              <p className="text-gray-300">"I dey try everything but nothing dey change"</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-3">🔄</div>
              <p className="text-gray-300">"Same problem dey come back every time"</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-3">😕</div>
              <p className="text-gray-300">"I no know where to even start"</p>
            </div>
          </div>
          <p className="text-center text-gray-400 mt-6">
            This happen because you dey treat symptoms, not the root cause. Akↄfa go show you the real wahala.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-4 text-center">How Akↄfa Work</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Simple steps to finally understand wetin dey happen</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 h-full">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold mb-6">1</div>
              <h3 className="text-xl font-semibold mb-3">Answer Simple Questions</h3>
              <p className="text-gray-400">Just rate 5 areas of your life honestly. No long form. 2 minutes max.</p>
              <div className="mt-4 text-sm text-purple-400 flex items-center gap-2">
                <Clock className="w-4 h-4" /> 2 Minutes Only
              </div>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
              <ArrowRight className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 h-full">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-6">2</div>
              <h3 className="text-xl font-semibold mb-3">See The Real Problem</h3>
              <p className="text-gray-400">Akↄfa go analyze your answers and show you exactly wetin dey hold you back.</p>
              <div className="mt-4 text-sm text-blue-400 flex items-center gap-2">
                <Target className="w-4 h-4" /> Find Root Cause
              </div>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
              <ArrowRight className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div>
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 h-full">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-xl font-bold mb-6">3</div>
              <h3 className="text-xl font-semibold mb-3">Get Clear Steps</h3>
              <p className="text-gray-400">Receive practical things you fit do today - not theory. Real action steps.</p>
              <div className="mt-4 text-sm text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Start Today
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Akↄfa Different */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl my-12 border border-purple-700">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Akↄfa Different</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">❌</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Other Apps</h3>
                <p className="text-gray-400">Give you general advice wey no fit your situation. One-size-fits-all tips wey everybody don hear before.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">❌</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Quick Fixes</h3>
                <p className="text-gray-400">Make you feel good for small time, then same problem come back again.</p>
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
                <p className="text-gray-400">Analyze YOUR specific situation and show you YOUR specific problem - personalized for you.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Root Cause Fix</h3>
                <p className="text-gray-400">Find the REAL problem - fix am once, everything else go follow. No more band-aid solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Case Templates */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl my-8">
        <h2 className="text-3xl font-bold mb-4 text-center">What Kind of Problem You Get?</h2>
        <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">Select your situation below and we go customize the analysis for you</p>
        
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
        <h2 className="text-3xl font-bold mb-4 text-center">The 5 Things Wey Affect Everything</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Whether na you personally, your team, or your business - these 5 areas dey always connected</p>
        <div className="grid md:grid-cols-5 gap-4">
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700 text-center">
            <div className="text-4xl mb-3">💪</div>
            <h3 className="text-lg font-semibold mb-2">Body/Foundation</h3>
            <p className="text-gray-400 text-sm">Your physical energy and resources</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700 text-center">
            <div className="text-4xl mb-3">🧠</div>
            <h3 className="text-lg font-semibold mb-2">Mind/Beliefs</h3>
            <p className="text-gray-400 text-sm">What you believe and tell yourself</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700 text-center">
            <div className="text-4xl mb-3">❤️</div>
            <h3 className="text-lg font-semibold mb-2">Values/Culture</h3>
            <p className="text-gray-400 text-sm">What matters most to you</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700 text-center">
            <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
            <h3 className="text-lg font-semibold mb-2">People/Network</h3>
            <p className="text-gray-400 text-sm">The people around you</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700 text-center">
            <div className="text-4xl mb-3">👁️</div>
            <h3 className="text-lg font-semibold mb-2">Awareness</h3>
            <p className="text-gray-400 text-sm">How clearly you see things</p>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-8 text-sm">
          When one area weak, e dey pull everything down. Akↄfa help you find which one to fix first.
        </p>
      </section>

      {/* Daily Check-in Feature */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border border-green-500/30">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-6 h-6 text-green-400" />
                <span className="text-green-400 font-semibold">Daily Check-in</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">Track Your Progress Every Day</h2>
              <p className="text-gray-300 mb-6">
                One minute every morning. Answer 3 simple questions. Watch your life improve week by week. Akↄfa go remind you and celebrate your wins with you.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>See your progress over time</span>
                </li>
                <li className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span>Build streaks and stay motivated</span>
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span>Get personalized tips based on your mood</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="text-sm text-gray-400 mb-4">Daily Check-in Preview</div>
              <div className="space-y-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-sm mb-2">How your body dey today?</p>
                  <div className="flex gap-2">
                    {['😴', '😐', '😊', '💪', '🔥'].map((emoji, i) => (
                      <button key={i} className="w-10 h-10 bg-slate-600 hover:bg-purple-500 rounded-lg transition text-xl">
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-sm mb-2">How your mind dey today?</p>
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
              <div className="text-sm text-gray-400 mb-4">Problem Solver Preview</div>
              <div className="bg-slate-700 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400 mb-2">You:</p>
                <p>"I no dey sleep well and e dey affect my work"</p>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                <p className="text-sm text-purple-400 mb-2">Akↄfa:</p>
                <p className="text-sm">Based on your scores, your Body Matters (3/10) dey affect your Mind Talk (5/10). Here be 3 things you fit do THIS WEEK:</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  <li>1. Stop screen 1 hour before bed</li>
                  <li>2. Wake same time every day</li>
                  <li>3. No coffee after 2pm</li>
                </ul>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-6 h-6 text-orange-400" />
                <span className="text-orange-400 font-semibold">Problem Solver</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">Tell Akↄfa Your Problem. Get Real Solutions.</h2>
              <p className="text-gray-300 mb-6">
                No be chatbot wey go give you copy-paste answers. Akↄfa know your scores, understand your situation, and give you advice wey actually fit YOUR life.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Advice based on YOUR assessment</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Practical steps, not theory</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Follow up on your progress</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Who Akↄfa Fit Help</h2>
        
        {/* Personal */}
        <div className="mb-8 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Heart className="w-8 h-8 text-red-400" />
                If You Wan Improve Your Life
              </h3>
              <p className="text-gray-300 mb-6">
                You dey try but things no dey move? Sleep wahala? Work stress? Relationship problems? Akↄfa go show you wetin dey really cause am.
              </p>
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-sm font-semibold text-purple-400 mb-2">REAL EXAMPLE</p>
                <p className="text-gray-300 text-sm">
                  "Chioma score 3/10 for sleep, 6/10 for work. She been dey try 'think positive' but nothing work. Akↄfa show her say sleep na the root cause. Fix sleep first, everything else follow. 3 weeks later: energy up, work better, peace of mind."
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🌟</div>
                <p className="text-gray-400">Personal Growth</p>
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
                <p className="text-gray-400">Team Success</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users2 className="w-8 h-8 text-blue-400" />
                If You Dey Manage Team
              </h3>
              <p className="text-gray-300 mb-6">
                Productivity low? People dey leave? Projects dey fail? Akↄfa go help you find the real team problem - not just surface wahala.
              </p>
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-400 mb-2">REAL EXAMPLE</p>
                <p className="text-gray-300 text-sm">
                  "Startup team been dey fail deliverables. They try new tools, new processes - nothing work. Akↄfa show say Team Spirit low (trust wahala), not process problem. Fix trust first. 40% improvement for delivery."
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
                If You Dey Run Business
              </h3>
              <p className="text-gray-300 mb-6">
                Business dey grow but something no dey right? Hitting ceiling? Staff wahala? Akↄfa go diagnose your business like doctor diagnose patient.
              </p>
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-400 mb-2">REAL EXAMPLE</p>
                <p className="text-gray-300 text-sm">
                  "E-commerce company - high revenue but losing money. Akↄfa find three problems: operations broken, team tired, values not aligned. Fix all three together. Now profitable and team happy."
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📈</div>
                <p className="text-gray-400">Business Growth</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-4 text-center">Real Ghanaians. Real Results.</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          See how people like you don use Akↄfa to fix their problems and improve their lives
        </p>
        <SuccessStoriesGrid category="all" limit={8} />
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Finally Fix Things?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Stop guessing. Stop wasting time on things wey no work. Let Akↄfa show you the real problem so you fit fix am once and for all.
          </p>
          <button 
            onClick={onNavigateToSignup}
            className="px-8 py-4 bg-white text-purple-600 hover:bg-gray-100 rounded-lg font-semibold text-lg transition transform hover:scale-105"
          >
            Start Free Now - 2 Minutes
          </button>
          <p className="text-purple-200 text-sm mt-4">No credit card. No long form. Just answers.</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Questions? Talk to Us</h2>
              <p className="text-gray-400 mb-6">
                We dey here to help. Whether you get question about how Akↄfa work or you wan share feedback, send us message.
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
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 focus:border-purple-500 outline-none transition"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 focus:border-purple-500 outline-none transition"
                required
              />
              <textarea
                placeholder="Your Message"
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
                {submitting ? 'Sending...' : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
              {contactStatus === 'success' && (
                <p className="text-green-400 text-sm text-center">Message sent! We go reply soon.</p>
              )}
              {contactStatus === 'error' && (
                <p className="text-red-400 text-sm text-center">Something happen. Try again.</p>
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
            Made with ❤️ to help you see clearly and fix what matters
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
