import React, { useState, useEffect } from 'react';
import { getCurrentUser, logout, updateUserAssessment, getUserAssessment } from './services/auth';
import { initGA, trackPageView } from './utils/analytics';
import HomePage from './components/Pages/HomePage';
import SignupForm from './components/Auth/SignupForm';
import LoginForm from './components/Auth/LoginForm';
import Onboarding from './components/Pages/Onboarding';
import Sidebar from './components/layout/sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/Pages/Dashboard';
import Assessment from './components/Pages/Assessment';
import Analysis from './components/Pages/Analysis';
import Chat from './components/Pages/Chat';
import Diagnosis from './components/Pages/Diagnosis';
import WelcomeOverlay from './components/ui/WelcomeOverlay';
import FloatingWhatsAppButton from './components/ui/FloatingWhatsAppButton';
import './styles/globals.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState('home');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  const [assessmentData, setAssessmentData] = useState({
    bioHardware: 5,
    internalOS: 5,
    culturalSoftware: 5,
    socialInstance: 5,
    consciousUser: 5
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initGA();
    trackPageView('home');
  }, []);

  useEffect(() => {
    if (user) {
      trackPageView(showOnboarding ? 'onboarding' : currentPage);
    } else {
      trackPageView(authPage);
    }
  }, [currentPage, user, authPage, showOnboarding]);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        try {
          const savedAssessment = await getUserAssessment(currentUser.id);
          if (savedAssessment) {
            setAssessmentData(savedAssessment);
          }
        } catch (err) {
          console.error('Failed to load assessment:', err);
        }
        
        const hasSeenWelcome = localStorage.getItem('akofa_seen_welcome');
        const hasCompletedOnboarding = localStorage.getItem('akofa_completed_onboarding');
        if (!hasSeenWelcome && !hasCompletedOnboarding) {
          setShowWelcomeOverlay(true);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleSignupSuccess = (user) => {
    setUser(user);
    const hasSeenWelcome = localStorage.getItem('akofa_seen_welcome');
    if (!hasSeenWelcome) {
      setShowWelcomeOverlay(true);
    } else {
      setShowOnboarding(true);
    }
    setAuthPage('home');
  };

  const handleUseCaseSelect = (purpose, useCase) => {
    setSelectedUseCase(useCase);
    localStorage.setItem('akofa_seen_welcome', 'true');
    localStorage.setItem('akofa_selected_usecase', JSON.stringify(useCase));
    setShowWelcomeOverlay(false);
    if (user) {
      setUser({ ...user, purpose: purpose });
    }
    setShowOnboarding(true);
  };

  const handleSkipWelcome = () => {
    localStorage.setItem('akofa_seen_welcome', 'true');
    setShowWelcomeOverlay(false);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = async (onboardingAssessmentData) => {
    setAssessmentData(onboardingAssessmentData);
    setShowOnboarding(false);
    localStorage.setItem('akofa_completed_onboarding', 'true');
    if (user) {
      try {
        await updateUserAssessment(user.id, onboardingAssessmentData);
      } catch (err) {
        console.error('Failed to save onboarding assessment:', err);
      }
    }
  };

  const handleLoginSuccess = async (user) => {
    setUser(user);
    try {
      const savedAssessment = await getUserAssessment(user.id);
      if (savedAssessment) {
        setAssessmentData(savedAssessment);
      }
    } catch (err) {
      console.error('Failed to load assessment:', err);
    }
    setAuthPage('home');
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setAuthPage('home');
    setCurrentPage('dashboard');
    setShowOnboarding(false);
  };

  const handleAssessmentUpdate = async (data) => {
    setAssessmentData(data);
    if (user) {
      try {
        await updateUserAssessment(user.id, data);
      } catch (err) {
        console.error('Failed to update assessment:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authPage === 'home') {
      return <HomePage 
        onNavigateToSignup={() => setAuthPage('signup')} 
        onNavigateToLogin={() => setAuthPage('login')}
      />;
    }
    if (authPage === 'signup') {
      return <SignupForm 
        onSignupSuccess={handleSignupSuccess}
        onSwitchToLogin={() => setAuthPage('login')}
      />;
    }
    if (authPage === 'login') {
      return <LoginForm 
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setAuthPage('signup')}
      />;
    }
  }

  if (showWelcomeOverlay) {
    return (
      <WelcomeOverlay 
        onSelectUseCase={handleUseCaseSelect}
        onSkip={handleSkipWelcome}
      />
    );
  }

  if (showOnboarding) {
    return (
      <Onboarding 
        user={user}
        purpose={user?.purpose}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard assessmentData={assessmentData} purpose={user?.purpose} />;
      case 'assessment': return <Assessment assessmentData={assessmentData} setAssessmentData={handleAssessmentUpdate} purpose={user?.purpose} />;
      case 'analysis': return <Analysis assessmentData={assessmentData} purpose={user?.purpose} />;
      case 'chat': return <Chat assessmentData={assessmentData} purpose={user?.purpose} />;
      case 'diagnosis': return <Diagnosis assessmentData={assessmentData} purpose={user?.purpose} />;
      default: return <Dashboard assessmentData={assessmentData} />;
    }
  };

  return (
    <div className="app-container min-h-screen flex flex-col md:flex-row">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />
      <div className="main-content flex-1 flex flex-col min-h-screen">
        <Header currentPage={currentPage} user={user} onLogout={handleLogout} assessmentData={assessmentData} />
        <main className="content-area p-4 md:p-6 flex-1 overflow-auto pb-20 md:pb-6">
          {renderPage()}
        </main>
      </div>
      <FloatingWhatsAppButton 
        phoneNumber="+233000000000" 
        message="Hello! I need help with Akↄfa Fixit"
      />
    </div>
  );
}
