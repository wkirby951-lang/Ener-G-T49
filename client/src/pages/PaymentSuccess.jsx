import React from 'react';
import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
        <p className="text-gray-600 mb-2">
          Thank you for your purchase. Your subscription or download is now active.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          You can now access all the content included in your plan from your dashboard.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}