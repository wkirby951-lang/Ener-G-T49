import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ContentLibrary from './pages/ContentLibrary';
import ContentView from './pages/ContentView';
import SessionPlayer from './pages/SessionPlayer';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user, loading } = useAuth();

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
        </Routes>
      </main>
      <Footer />
    </div>
  );
}