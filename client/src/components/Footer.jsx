import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | 'loading'

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      await api.post('/api/newsletter', { email: email.trim() });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A2A3A] text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="text-white font-bold text-xl mb-3 inline-block">
              <span className="mr-2">🧘</span>Ener-G-T-49
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your unified wellness companion. Seven science-backed techniques for anxiety relief, trauma processing, and emotional regulation — personalized for your age.
            </p>
            {/* Social links (placeholder) */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>
          </div>

          {/* Modalities */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Modalities</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="hover:text-white transition-colors cursor-default">EMDR</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">EFT Tapping</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">Faster EFT</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">TFT Tapping</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">Silva Mind Control</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">Havening</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">Deep Breathing</span></li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Users</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/signup" className="hover:text-white transition-colors">Start Free Trial</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Log In</Link></li>
              <li><Link to="/#pricing" className="hover:text-white transition-colors">View Pricing</Link></li>
              <li><Link to="/#modalities" className="hover:text-white transition-colors">Explore Modalities</Link></li>
              <li><a href="/#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter + Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-3">Get wellness tips and new session alerts.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2C6E9C] focus:ring-1 focus:ring-[#2C6E9C]"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#2C6E9C] hover:bg-[#1A5A80] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? '...' : '→'}
              </button>
            </form>
            {status === 'success' && (
              <p className="text-xs text-green-400 mt-2">✓ You're subscribed! Welcome aboard.</p>
            )}
            {status === 'error' && (
              <p className="text-xs text-red-400 mt-2">Something went wrong. Try again.</p>
            )}

            {/* Contact */}
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Contact</h4>
              <p className="text-sm text-gray-400">support@energt49.com</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/cookies" className="hover:text-gray-300 transition-colors">Cookie Policy</Link>
          </div>
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Ener-G-T-49. For educational purposes only. Not a substitute for professional care.
          </p>
        </div>
      </div>
    </footer>
  );
}