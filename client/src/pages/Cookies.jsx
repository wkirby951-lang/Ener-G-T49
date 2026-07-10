import React from 'react';
import SEOHead from '../components/SEOHead';
import { Link } from 'react-router-dom';

export default function Cookies() {
  return (
    <div className="bg-white py-16">
      <SEOHead title="Cookie Policy" path="/cookies" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm mb-6 inline-block">&larr; Back to Home</Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1A2A3A] mb-8 font-[Montserrat]">Cookie Policy</h1>
        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p>Last updated: June 2026</p>
          <h2 className="text-xl font-semibold text-[#1A2A3A] mt-6">1. What Are Cookies</h2>
          <p>Cookies are small text files stored on your device to help websites function properly and improve user experience.</p>
          <h2 className="text-xl font-semibold text-[#1A2A3A] mt-6">2. How We Use Cookies</h2>
          <p>We use essential cookies for authentication and security. We do not use tracking cookies or third-party advertising cookies. Local storage is used to remember your preferences (e.g., voice selection, theme).</p>
          <h2 className="text-xl font-semibold text-[#1A2A3A] mt-6">3. Your Choices</h2>
          <p>You can disable cookies in your browser settings, though this may affect certain features of the platform.</p>
          <h2 className="text-xl font-semibold text-[#1A2A3A] mt-6">4. Contact</h2>
          <p>For cookie-related questions: support@energt49.com</p>
        </div>
      </div>
    </div>
  );
}