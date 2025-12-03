import React from 'react';
import { Sparkles, Target, Brain, Users, Heart, AlertCircle, TrendingUp, Users2, Zap } from 'lucide-react';

const HomePage = ({ onNavigateToSignup, onNavigateToLogin }) => {
  return (
    <div className="homepage min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Akↄfa Fixit
        </div>
        <div className="space-x-4">
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
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section - Universal Framework */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="mb-6 inline-block">
          <Sparkles className="w-12 h-12 text-purple-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Understand Any System. Fix Any Problem.
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Whether you're improving yourself, managing a team, scaling a business, or making policy—complex systems work the same way. The Akorfa Stack Framework diagnoses what's actually broken and gives you concrete steps to fix it.
        </p>
        <button 
          onClick={onNavigateToSignup}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold text-lg transition transform hover:scale-105"
        >
          Get Started Free
        </button>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl my-12 border border-purple-700">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
        <p className="text-lg text-gray-100 leading-relaxed max-w-4xl mx-auto text-center">
          Most problem-solving fails because people focus on symptoms, not causes. They treat single layers without understanding how everything connects. We built Akorfa to change that—to help people, teams, and organizations see the whole picture, identify root causes, and fix what actually matters.
        </p>
      </section>

      {/* The Framework Applies Everywhere */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">One Framework. Infinite Applications.</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700">
            <div className="text-3xl mb-3">🧬</div>
            <h3 className="text-lg font-semibold mb-2">Body & Health</h3>
            <p className="text-gray-400 text-sm">Sleep, exercise, nutrition, energy. Foundation of everything.</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="text-lg font-semibold mb-2">Inner Systems</h3>
            <p className="text-gray-400 text-sm">Psychology, culture, beliefs. What drives behavior (individual or organizational).</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-lg font-semibold mb-2">Values & Vision</h3>
            <p className="text-gray-400 text-sm">What actually matters. The north star that guides decisions.</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-lg font-semibold mb-2">Operations</h3>
            <p className="text-gray-400 text-sm">Daily execution. Where values become reality (or get lost).</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="text-lg font-semibold mb-2">Awareness</h3>
            <p className="text-gray-400 text-sm">Can you see what's happening? Can you intentionally change it?</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition border border-slate-700">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="text-lg font-semibold mb-2">The Connections</h3>
            <p className="text-gray-400 text-sm">How the layers affect each other. Where real power comes from.</p>
          </div>
        </div>
      </section>

      {/* Use Cases - All 4 Purposes */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Who Uses Akorfa</h2>
        
        {/* Personal Development */}
        <div className="mb-12 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Heart className="w-8 h-8 text-red-400" />
                Individuals & Personal Development
              </h3>
              <p className="text-gray-300 mb-6">
                You're stuck. Your life isn't working. You've tried everything but nothing sticks because you're only fixing one area while others fall apart.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">→</span>
                  <span className="text-gray-300">Rate yourself on your 5 life areas</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">→</span>
                  <span className="text-gray-300">See exactly which layers need help</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">→</span>
                  <span className="text-gray-300">Get a prioritized plan, not generic advice</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">→</span>
                  <span className="text-gray-300">Chat with Akↄfa coach tied to YOUR situation</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-lg p-6">
              <p className="text-sm font-semibold text-purple-400 mb-3">EXAMPLE</p>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                Sarah scored 3/10 on sleep, 6/10 on work, 4/10 on self-worth. She was drowning trying to "think positive." Akorfa showed her sleep was the bottleneck. Fix sleep first. Everything else improves. Three weeks later: energy up, work performance up, confidence returning.
              </p>
              <p className="text-xs text-gray-500">"Finally someone explained WHY my life wasn't working" - Sarah, 32</p>
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="mb-12 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="order-2 md:order-1 bg-slate-900 rounded-lg p-6">
              <p className="text-sm font-semibold text-blue-400 mb-3">EXAMPLE</p>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                Leadership team used Akorfa to diagnose why projects kept failing. Found: poor communication (operations layer broken), conflicting values (nobody on same page), burnout (health layer collapsing). Fixed all three simultaneously. Delivery improved 40%.
              </p>
              <p className="text-xs text-gray-500">"We finally understood the real problems" - CTO, Tech Startup</p>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users2 className="w-8 h-8 text-blue-400" />
                Teams & Organizations
              </h3>
              <p className="text-gray-300 mb-6">
                Your team is stuck. Productivity tanking. Turnover rising. You try new tools and processes but nothing fixes the root cause.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">→</span>
                  <span className="text-gray-300">Assess team health across 5 dimensions</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">→</span>
                  <span className="text-gray-300">Identify which layer is actually broken</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">→</span>
                  <span className="text-gray-300">Fix culture, not just processes</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">→</span>
                  <span className="text-gray-300">See how changes ripple across the system</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business */}
        <div className="mb-12 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-8 h-8 text-green-400" />
                Business & Organizations
              </h3>
              <p className="text-gray-300 mb-6">
                You're growing but hitting a ceiling. Scaling feels broken. You fix operational problems but new ones appear. The system itself is unbalanced.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-green-400 font-bold">→</span>
                  <span className="text-gray-300">Diagnose organizational bottlenecks</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 font-bold">→</span>
                  <span className="text-gray-300">Align strategy with actual execution</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 font-bold">→</span>
                  <span className="text-gray-300">Fix culture AND performance simultaneously</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 font-bold">→</span>
                  <span className="text-gray-300">Scenario planning for complex changes</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-lg p-6">
              <p className="text-sm font-semibold text-green-400 mb-3">EXAMPLE</p>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                E-commerce company was losing money despite high revenue. Used Akorfa: discovered operations layer was broken (systems falling apart), health layer critical (team exhausted), values layer misaligned (profit vs. impact). Restructured all three. Profitability returned, team stayed.
              </p>
              <p className="text-xs text-gray-500">"We finally fixed the real problem, not just the symptoms" - Founder</p>
            </div>
          </div>
        </div>

        {/* Policy & Research */}
        <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="order-2 md:order-1 bg-slate-900 rounded-lg p-6">
              <p className="text-sm font-semibold text-yellow-400 mb-3">EXAMPLE</p>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                Urban development team used Akorfa to analyze why community health initiatives failed. Found: economic layer broken (poverty), awareness layer low (people didn't know about programs), values misaligned (community didn't trust government). Changed entire approach. Now seeing real results.
              </p>
              <p className="text-xs text-gray-500">"The framework helped us see the full system" - Policy Researcher</p>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Brain className="w-8 h-8 text-yellow-400" />
                Policy Makers & Researchers
              </h3>
              <p className="text-gray-300 mb-6">
                Programs fail. Interventions backfire. You treat symptoms (education, health, economics) separately when they're deeply interconnected.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400 font-bold">→</span>
                  <span className="text-gray-300">Diagnose systemic problems, not just symptoms</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400 font-bold">→</span>
                  <span className="text-gray-300">See how interventions affect all layers</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400 font-bold">→</span>
                  <span className="text-gray-300">Model complex system interactions</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400 font-bold">→</span>
                  <span className="text-gray-300">Make evidence-based, systems-aware decisions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-slate-800 rounded-2xl my-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Why The Akorfa Stack Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-400" />
              Universal
            </h3>
            <p className="text-gray-300 text-sm">
              Works for individuals, teams, businesses, and systems. Same framework, different context.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-400" />
              Root Cause
            </h3>
            <p className="text-gray-300 text-sm">
              Finds what's actually broken. Not symptoms. Not guesses. Real diagnosis.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-green-400" />
              Actionable
            </h3>
            <p className="text-gray-300 text-sm">
              Concrete steps you can take TODAY. Not theory. Not motivation. Real change.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Fix What's Actually Broken?</h2>
        <p className="text-gray-300 mb-8 text-lg">
          Whether you're one person or an organization—get clarity on your real problems and concrete steps to fix them.
        </p>
        <button 
          onClick={onNavigateToSignup}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold text-lg transition transform hover:scale-105"
        >
          Start Your Assessment Free
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Akorfa</h3>
              <p className="text-gray-400 text-sm">
                The Akorfa Stack Framework helps people, teams, and organizations understand complex systems and achieve real change—one layer at a time.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Everyone</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>💡 Individuals</li>
                <li>👥 Teams & Managers</li>
                <li>🏢 Organizations</li>
                <li>📊 Policy Makers</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Questions?</h3>
              <p className="text-gray-400 mb-4 text-sm">We'd love to hear from you.</p>
              <a href="mailto:hello@akorfa.com" className="text-purple-400 hover:text-purple-300 transition font-medium text-sm">
                hello@akorfa.com
              </a>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2025 Akorfa Fixit. Understanding complexity. Achieving change.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
