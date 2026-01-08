import React, { useState, useCallback, useEffect } from 'react';
import { supabase } from './utils/supabase';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        console.log('✅ User already authenticated:', session.user.email);
      }
      setIsLoading(false);
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogin = useCallback(() => setIsAuthenticated(true), []);
  
  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    console.log('✅ Logged out successfully');
  }, []);

  const AppContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      );
    }
    if (!isAuthenticated) {
      return <LoginPage onLogin={handleLogin} />;
    }
    return <DashboardLayout onLogout={handleLogout} />;
  };

  return (
    <div className="min-h-screen h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      <AppContent />
    </div>
  );
};

export default App;