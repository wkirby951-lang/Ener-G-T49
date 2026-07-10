import React from 'react';
import SEOHead from '../components/SEOHead';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="bg-white py-16">
      <SEOHead title="Terms of Service" path="/terms" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm mb-6 inline-block">&larr; Back to Home</Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1A2A3A] mb-8 font-[Montserrat]">Terms of Service</h1>
        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p>Last updated: June 2026</p>
          <h2 className="text-xl font-semibold text-[#1A2A3A] mt-6">1. Acceptance of Terms</h2>
          <p>By using Ener-G-T-49, you agree to these terms. If you do not agree, please do not use the service.</p>
          <h2 className="text-xl font-semibold text-[#1A2A3A] mt-6">2. Medical Disclaimer</h2>
          <p>Ener-G-T-49 is a wellness tool for educational and self-guided emotional regulation purposes only. It is not a substitute for professional mental health care, therapy, or medical advice. If you are in crisis or experiencing a medical emergency, please contact a licensed professional or emergency services immediately.</p>
          <h2 className="text-xl font-semibold text-[#1A2A3A] mt-6">3. Subscriptions & Billing</h2>
          <p>All paid plans are billed upfront for the selected period. The 30-day free trial provides full access. Cancel anytime — you will not be charged following a cancellation. Refunds are handled on a case-by-case basis within 30 days of purchase.</p>
          <h2 className="text-xl font-semibold text-[#1A2A3A] mt-6">4. User Conduct</h2>
          <p>You agree not to misuse the platform, attempt unauthorized access, or share your account credentials with others.</p>
          <h2 className="text-xl font-semibold text-[#1A2A3A] mt-6">5. Limitation of Liability</h2>
          <p>Ener-G-T-49 and its creators are not liable for any direct, indirect, or consequential damages arising from the use of this platform.</p>
          <h2 className="text-xl font-semibold text-[#1A2A3A] mt-6">6. Contact</h2>
          <p>For questions about these terms: support@energt49.com</p>
        </div>
      </div>
    </div>
  );
}