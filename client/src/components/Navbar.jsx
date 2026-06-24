import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🧘</span>
            <span className="font-bold text-xl text-gray-800">Ener-G-T-49</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/content" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Library</Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Dashboard</Link>
                <button onClick={logout} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Log In</Link>
                <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Start Free Trial
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}