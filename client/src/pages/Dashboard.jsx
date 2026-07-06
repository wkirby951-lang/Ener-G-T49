import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { openStripeCheckout } from '../stripe';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome{user?.fullName ? `, ${user.fullName}` : ''}</h1>
        <p className="text-gray-600 mt-1">Here's your wellness overview.</p>
      </div>

      {data?.user?.trialExpired && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-center justify-between">
          <p className="text-amber-800 text-sm">Your free trial has ended. <Link to="/dashboard?tab=subscription" className="underline font-medium">Upgrade to continue</Link></p>
        </div>
      )}

      {data?.user?.isTrialing && data?.user?.daysLeft > 0 && data?.user?.daysLeft <= 7 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="text-blue-800 text-sm">Your free trial ends in <strong>{data.user.daysLeft} days</strong>. <Link to="/dashboard?tab=subscription" className="underline font-medium">Choose a plan</Link></p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Sessions Completed', value: data?.stats?.totalSessions || 0, color: 'bg-blue-50 text-blue-700' },
          { label: 'Minutes Practiced', value: data?.stats?.totalMinutes || 0, color: 'bg-green-50 text-green-700' },
          { label: 'Modalities Used', value: data?.stats?.uniqueModalities || 0, color: 'bg-purple-50 text-purple-700' },
          { label: 'Day Streak', value: data?.stats?.currentStreak || 0, color: 'bg-amber-50 text-amber-700' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl p-5 ${stat.color}`}>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm mt-1 opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/content" className="bg-blue-50 hover:bg-blue-100 rounded-xl p-4 text-center transition-colors">
              <span className="text-2xl block mb-1">📚</span>
              <span className="text-sm font-medium text-blue-700">Browse Library</span>
            </Link>
            <Link to="/content?filter=session" className="bg-green-50 hover:bg-green-100 rounded-xl p-4 text-center transition-colors">
              <span className="text-2xl block mb-1">🎧</span>
              <span className="text-sm font-medium text-green-700">Start Session</span>
            </Link>
            <Link to="/content?modality=emdr" className="bg-purple-50 hover:bg-purple-100 rounded-xl p-4 text-center transition-colors">
              <span className="text-2xl block mb-1">🫣</span>
              <span className="text-sm font-medium text-purple-700">EMDR</span>
            </Link>
            <Link to="/content?modality=eft-tapping" className="bg-amber-50 hover:bg-amber-100 rounded-xl p-4 text-center transition-colors">
              <span className="text-2xl block mb-1">👆</span>
              <span className="text-sm font-medium text-amber-700">EFT Tapping</span>
            </Link>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Plan</span>
              <span className="font-medium capitalize">{data?.user?.subscriptionPlan || 'Trial'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Trial ends</span>
              <span className="font-medium">{data?.user?.trialEnd ? new Date(data.user.trialEnd).toLocaleDateString() : '—'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Days remaining</span>
              <span className="font-medium">{data?.user?.daysLeft || 0} days</span>
            </div>
            <hr className="border-gray-100" />
            <p className="text-xs text-gray-500 font-medium">Select a plan to upgrade:</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => openStripeCheckout('monthly')} className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-medium transition-colors">
                $9.99/mo
              </button>
              <button onClick={() => openStripeCheckout('quarterly')} className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-medium transition-colors">
                $23 / 3mo
              </button>
              <button onClick={() => openStripeCheckout('semi-annual')} className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-xs font-medium transition-colors">
                $42 / 6mo
              </button>
              <button onClick={() => openStripeCheckout('annual')} className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-xs font-medium transition-colors">
                $69.99 / yr
              </button>
              <button onClick={() => openStripeCheckout('annual-renewal')} className="bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-xl text-xs font-medium transition-colors">
                $50 / yr renewal
              </button>
              <button onClick={() => openStripeCheckout('lifetime')} className="bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-xl text-xs font-medium transition-colors">
                $99.99 Lifetime
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-1">Opens Stripe checkout in a new tab</p>
          </div>
        </div>
      </div>

      {/* Session History */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h2>
        {data?.sessionHistory?.length > 0 ? (
          <div className="space-y-3">
            {data.sessionHistory.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-800 text-sm capitalize">{s.modality_id.replace('-', ' ')}</p>
                  <p className="text-xs text-gray-500">{new Date(s.completed_at).toLocaleDateString()} · {s.duration_minutes} min</p>
                </div>
                <Link to={`/content/${s.content_id}`} className="text-blue-600 text-sm hover:underline">View</Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No sessions yet. <Link to="/content" className="text-blue-600 hover:underline">Browse the library</Link> to start your first session.</p>
        )}
      </div>
    </div>
  );
}