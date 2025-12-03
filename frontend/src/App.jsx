import React, { useState, useEffect } from 'react';
import { getCurrentUser, logout, updateUserAssessment, getUserAssessment } from './services/auth';
import HomePage from './components/Pages/HomePage';
import SignupForm from './components/Auth/SignupForm';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/layout/sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/Pages/Dashboard';
import Assessment from './components/Pages/Assessment';
import Analysis from './components/Pages/Analysis';
import Chat from './components/Pages/Chat';
import Diagnosis from './components/Pages/Diagnosis';
import './styles/globals.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState('home');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [assessmentData, setAssessmentData] = useState({
    bioHardware: 5,
    internalOS: 5,
    culturalSoftware: 5,
    socialInstance: 5,
    consciousUser: 5
  });
  const [loading, setLoading] = useState(true);

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
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleSignupSuccess = (user) => {
    setUser(user);
    setAuthPage('home');
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

  if (loading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;

  // Not logged in - show auth pages
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

  // Logged in - show main app
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
    <div className="app-container min-h-screen flex">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />
      <div className="main-content flex-1 flex flex-col">
        <Header currentPage={currentPage} user={user} onLogout={handleLogout} />
        <main className="content-area p-6 flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
