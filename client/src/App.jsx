import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { track, resetPageTracking } from './analytics';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ContentLibrary from './pages/ContentLibrary';
import ContentView from './pages/ContentView';
import SessionPlayer from './pages/SessionPlayer';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InstallPrompt from './components/InstallPrompt';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Track page views on navigation
  React.useEffect(() => {
    resetPageTracking();
    track('page_view', { page: location.pathname });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/content" element={<ProtectedRoute><ContentLibrary /></ProtectedRoute>} />
          <Route path="/content/:id" element={<ProtectedRoute><ContentView /></ProtectedRoute>} />
          <Route path="/play/:id" element={<ProtectedRoute><SessionPlayer /></ProtectedRoute>} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
        </Routes>
      </main>
      <InstallPrompt />
      <Footer />
    </div>
  );
}