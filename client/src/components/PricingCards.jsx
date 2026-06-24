import React from 'react';
import { Link } from 'react-router-dom';

const PRICING = [
  { id: 'monthly', name: 'Monthly', price: '$9.99', period: '/month', desc: 'Full access, cancel anytime' },
  { id: 'quarterly', name: '3 Months', price: '$23', period: '', desc: '$7.67/mo — save 23%', popular: false },
  { id: 'semi-annual', name: '6 Months', price: '$42', period: '', desc: '$7/mo — save 30%', popular: true },
  { id: 'annual', name: '1 Year', price: '$69.99', period: '', desc: '$5.83/mo — save 42%', popular: false },
  { id: 'annual-renewal', name: 'Annual Renewal', price: '$50', period: '/year', desc: 'Renew at a discounted rate' },
  { id: 'lifetime', name: 'Lifetime', price: '$99.99', period: '', desc: 'One-time payment, forever access', badge: 'Best Value' },
];

export default function PricingCards() {
  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with a 30-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING.map((plan, i) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-sm border ${plan.popular ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'} p-6 flex flex-col hover:shadow-md transition-shadow ${i >= 3 ? 'lg:col-span-1' : ''}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}
              {plan.popular && !plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-gray-600 mb-6 flex-1">{plan.desc}</p>
              {plan.id === 'lifetime' && (
                <p className="text-xs text-amber-600 mb-4 font-medium">✓ One-time payment, lifetime access</p>
              )}
              <Link
                to="/signup"
                className={`text-center py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  plan.popular || plan.id === 'lifetime'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                Start Free Trial
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-gray-500">
            All plans include full access to all 7 modalities. 
            <Link to="/signup" className="text-blue-600 hover:underline ml-1">Try 30 days free →</Link>
          </p>
          <p className="text-xs text-gray-400 mt-2">Individual guided meditations &amp; literature: $5 each (a la carte)</p>
        </div>
      </div>
    </section>
  );
}