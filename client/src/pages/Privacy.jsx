import React from 'react';
import SEOHead from '../components/SEOHead';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="bg-white py-16">
      <SEOHead title="Privacy Policy" path="/privacy" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm mb-6 inline-block">&larr; Back to Home</Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1A2A3A] mb-8 font-[Montserrat]">Privacy Policy</h1>
        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p>Last updated: June 2026</p>
          <h2 className="text-xl font-semibold text-[#1A2A3A] mt-6">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including your name, email address, and age segment when you create an account. We also collect session usage data to improve our service and personalize your experience.</p>
          <h2 className="text-xl font-semibold text-[#1A2A3A] mt-6">2. How We Use Your Information</h2>
          <p>Your information is used to provide and improve the Ener-G-T-49 service, personalize your sessions, send occasional wellness tips (if subscribed), and ensure the security of our platform.</p>
          <h2 className="text-xl font-semibold text-[#1A2A3A] mt-6">3. Data Security</h2>
          <p>We implement industry-standard security measures including SSL encryption, secure token-based authentication, and regular security audits. Your session data is stored securely and never shared with third parties.</p>
          <h2 className="text-xl font-semibold text-[#1A2A3A] mt-6">4. Your Rights</h2>
          <p>You may request deletion of your account and associated data at any time by contacting support@energt49.com. You may opt out of marketing communications at any time.</p>
          <h2 className="text-xl font-semibold text-[#1A2A3A] mt-6">5. Contact</h2>
          <p>For privacy-related inquiries: support@energt49.com</p>
        </div>
      </div>
    </div>
  );
}