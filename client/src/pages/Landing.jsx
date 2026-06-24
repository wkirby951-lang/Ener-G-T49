import React from 'react';
import { Link } from 'react-router-dom';
import PricingCards from '../components/PricingCards';

const MODALITIES_PREVIEW = [
  { name: 'EMDR', icon: '🫣', desc: 'Bilateral stimulation to reprocess traumatic memories' },
  { name: 'EFT Tapping', icon: '👆', desc: 'Acupressure tapping to calm the amygdala' },
  { name: 'Faster EFT', icon: '⚡', desc: 'Accelerated tapping for rapid relief' },
  { name: 'TFT Tapping', icon: '🧠', desc: 'Algorithm-based tapping sequences' },
  { name: 'Silva Mind Control', icon: '🌌', desc: 'Alpha-state visualization techniques' },
  { name: 'Havening', icon: '🤲', desc: 'Touch-based trauma clearing' },
  { name: 'Deep Breathing', icon: '🌬️', desc: 'Structured breathwork for instant calm' },
];

const AGE_SEGMENTS = [
  {
    title: 'Teens (14–18)',
    icon: '🌟',
    color: 'from-blue-400 to-blue-600',
    issues: 'School stress, social anxiety, exam pressure',
    approaches: 'Short sessions, relatable language, grounding techniques',
  },
  {
    title: 'Young Adults (19–36)',
    icon: '🔥',
    color: 'from-green-400 to-green-600',
    issues: 'Career stress, relationship anxiety, burnout',
    approaches: 'Deep trauma processing, mindfulness habits, performance optimization',
  },
  {
    title: 'Adults (37–65+)',
    icon: '🌿',
    color: 'from-amber-400 to-amber-600',
    issues: 'Chronic stress, grief, life transitions, sleep',
    approaches: 'Grief processing, sleep support, long-term emotional wellness',
  },
];

export default function Landing() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span>🧘</span> Seven modalities. One app. Your peace.
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              The First Unified<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
                Wellness Toolkit
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              EMDR, EFT Tapping, Faster EFT, TFT Tapping, Silva Mind Control, Havening, 
              and Deep Breathing — all in one guided platform. Science-backed relief for 
              anxiety, trauma, and emotional wellness.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl text-lg font-semibold shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:-translate-y-0.5">
                Start Free Trial — 30 Days
              </Link>
              <a href="#modalities" className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:-translate-y-0.5">
                Explore Modalities
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-4">No credit card required. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Age Segments */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Personalized for Your Stage of Life</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tailored sessions and approaches for every age group.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {AGE_SEGMENTS.map((seg) => (
              <div key={seg.title} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${seg.color} text-white text-2xl mb-5`}>
                  {seg.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{seg.title}</h3>
                <p className="text-sm text-gray-500 mb-3"><span className="font-semibold">Focus:</span> {seg.issues}</p>
                <p className="text-sm text-gray-500"><span className="font-semibold">Approach:</span> {seg.approaches}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modalities Preview */}
      <section id="modalities" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Seven Science-Backed Modalities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each technique is rooted in clinical research and presented in guided, easy-to-follow sessions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {MODALITIES_PREVIEW.map((mod) => (
              <div key={mod.name} className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all cursor-default">
                <span className="text-2xl mb-2 block">{mod.icon}</span>
                <h3 className="font-semibold text-gray-900">{mod.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingCards />

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Start Your Wellness Journey Today</h2>
          <p className="text-xl text-blue-100 mb-8">30-day free trial. Full access. Cancel anytime.</p>
          <Link to="/signup" className="inline-block bg-white text-blue-700 px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-colors shadow-xl">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}