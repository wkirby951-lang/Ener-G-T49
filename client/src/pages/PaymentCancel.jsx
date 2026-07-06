import React from 'react';
import { Link } from 'react-router-dom';

export default function PaymentCancel() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔄</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Cancelled</h1>
        <p className="text-gray-600 mb-2">
          Your payment was cancelled. No charges have been made.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          You can try again whenever you're ready, or continue with the free trial.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            View Plans
          </Link>
          <Link
            to="/dashboard"
            className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}