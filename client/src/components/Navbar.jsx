import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🧘</span>
            <span className="font-bold text-xl text-[#1A2A3A] group-hover:text-[#2C6E9C] transition-colors font-[Montserrat]">Ener-G-T-49</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/content" className="text-gray-600 hover:text-[#2C6E9C] text-sm font-medium transition-colors">Library</Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-[#2C6E9C] text-sm font-medium transition-colors">Dashboard</Link>
                <button onClick={logout} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-[#2C6E9C] text-sm font-medium transition-colors">Log In</Link>
                <Link to="/signup" className="bg-[#2C6E9C] hover:bg-[#1A5A80] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-200">
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