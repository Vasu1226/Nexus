import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';

// Pages
import Landing from './pages/Landing';
import Features from './pages/Features';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import CustomCursor from './components/CustomCursor';
import LoginModal from './components/LoginModal';

// Temporary Mock Components until real ones are built
const Placeholder = ({ title }) => (
  <div className="min-h-screen pt-20 flex items-center justify-center">
    <h1 className="text-4xl font-bold text-gradient">{title} Component is under construction</h1>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  // Using simple condition, user state should ideally wait for initial auth check
  if (!localStorage.getItem('token')) {
    return <Navigate to="/?login=true" replace />;
  }
  return children;
};

function AppContent() {
  const { isDarkMode } = useAppContext();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <CustomCursor />
      <Navbar />
      <LoginModal />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
