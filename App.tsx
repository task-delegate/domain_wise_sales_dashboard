import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = useCallback(() => setIsAuthenticated(true), []);
  const handleLogout = useCallback(() => {
    // Note: userId is intentionally persisted in localStorage across sign out/in
    // This ensures users see their data on sign-in without losing it
    // If users want a fresh session, they can manually clear localStorage
    setIsAuthenticated(false);
  }, []);

  const AppContent = () => {
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