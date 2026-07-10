import React from 'react';
import { Link } from 'react-router-dom';
import { openStripeCheckout } from '../stripe';

const PRICING = [
  { id: 'monthly', name: 'Monthly', price: '$9.99', period: '/month', desc: 'Full access, cancel anytime', stripeId: 'monthly' },
  { id: 'quarterly', name: '3 Months', price: '$23', period: '', desc: '$7.67/mo — save 23%', stripeId: 'quarterly' },
  { id: 'semi-annual', name: '6 Months', price: '$42', period: '', desc: '$7/mo — save 30%', popular: true, stripeId: 'semi-annual' },
  { id: 'annual', name: '1 Year', price: '$69.99', period: '', desc: '$5.83/mo — save 42%', bestValue: true, stripeId: 'annual' },
  { id: 'annual-renewal', name: 'Annual Renewal', price: '$50', period: '/year', desc: 'Renew at a discounted rate', stripeId: 'annual-renewal' },
  { id: 'lifetime', name: 'Lifetime', price: '$99.99', period: '', desc: 'One-time payment, forever access', stripeId: 'lifetime' },
];

export default function PricingCards() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2A3A] mb-4 font-[Montserrat]">Choose Your Plan</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with a <strong>30-day free trial</strong>. No credit card required. Cancel anytime.
          </p>
          {/* Money-back guarantee badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium mt-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            30-Day Money-Back Guarantee on All Paid Plans
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING.map((plan, i) => {
            const isBestValue = plan.bestValue;
            const isPopular = plan.popular;
            const row2 = i >= 3;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-sm border flex flex-col transition-all hover:shadow-lg ${
                  isBestValue
                    ? 'border-[#2C6E9C] ring-2 ring-[#2C6E9C]/20 scale-105 z-10'
                    : isPopular
                    ? 'border-gray-300'
                    : 'border-gray-200'
                } ${row2 ? 'lg:col-span-1' : ''}`}
              >
                {/* Best Value badge (prominent) */}
                {isBestValue && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#2C6E9C] to-[#4A9E8E] text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    🏆 Best Value — Save 42%
                  </div>
                )}

                {/* Most Popular badge */}
                {isPopular && !isBestValue && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="p-6 pb-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-600">{plan.desc}</p>
                </div>

                {/* Savings badge for annual */}
                {isBestValue && (
                  <div className="mx-6 mt-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                    <p className="text-xs text-blue-700 font-medium">Save $50 compared to monthly</p>
                  </div>
                )}

                <div className="p-6 mt-auto space-y-2">
                  <button
                    onClick={() => openStripeCheckout(plan.stripeId)}
                    className={`w-full text-center py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 ${
                      isBestValue
                        ? 'bg-gradient-to-r from-[#2C6E9C] to-[#4A9E8E] hover:shadow-lg hover:shadow-blue-200 text-white'
                        : isPopular
                        ? 'bg-gray-800 hover:bg-gray-900 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    Buy Now — {plan.price}{plan.period}
                  </button>
                  <Link
                    to="/signup"
                    className="block w-full text-center py-2.5 rounded-lg text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors border border-blue-200 hover:border-blue-400"
                  >
                    Or start your free 30-day trial →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-gray-500">
            All plans include full access to all 7 modalities.
            <Link to="/signup" className="text-blue-600 hover:underline ml-1">Try 30 days free →</Link>
          </p>
          <p className="text-xs text-gray-400 mt-1">Individual guided meditations &amp; literature: $5 each (a la carte)</p>
          <p className="text-xs text-green-600 mt-2 font-medium">✓ 30-day money-back guarantee on all paid plans</p>
        </div>
      </div>
    </section>
  );
}