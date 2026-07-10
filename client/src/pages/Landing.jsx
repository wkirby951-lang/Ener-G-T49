import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PricingCards from '../components/PricingCards';
import SEOHead from '../components/SEOHead';

// ─── Data ────────────────────────────────────────────────────────

const MODALITIES = [
  { name: 'EMDR', icon: '🫣', desc: 'Bilateral stimulation to reprocess traumatic memories', avgTime: '15–25 min', bestFor: 'Trauma processing, PTSD, phobias' },
  { name: 'EFT Tapping', icon: '👆', desc: 'Acupressure tapping to calm the amygdala', avgTime: '5–15 min', bestFor: 'Anxiety relief, stress, cravings' },
  { name: 'Faster EFT', icon: '⚡', desc: 'Accelerated tapping for rapid relief', avgTime: '10–20 min', bestFor: 'Rapid intervention, acute stress' },
  { name: 'TFT Tapping', icon: '🧠', desc: 'Algorithm-based tapping sequences', avgTime: '10–20 min', bestFor: 'Structured anxiety, specific triggers' },
  { name: 'Silva Mind Control', icon: '🌌', desc: 'Alpha-state visualization techniques', avgTime: '15–30 min', bestFor: 'Deep relaxation, mental clarity, focus' },
  { name: 'Havening', icon: '🤲', desc: 'Touch-based trauma clearing', avgTime: '10–20 min', bestFor: 'Trauma clearing, comfort, soothing' },
  { name: 'Deep Breathing', icon: '🌬️', desc: 'Structured breathwork for instant calm', avgTime: '3–10 min', bestFor: 'Instant calm, grounding, sleep prep' },
];

const AGE_SEGMENTS = [
  {
    title: 'Teens (14–18)',
    icon: '🌟',
    accent: 'from-teal-400 to-teal-600',
    bgAccent: 'bg-teal-50',
    borderAccent: 'border-teal-200',
    btnClass: 'bg-teal-500 hover:bg-teal-600 text-white',
    issues: 'School stress, social anxiety, exam pressure',
    approaches: 'Short sessions, relatable language, grounding techniques',
  },
  {
    title: 'Young Adults (19–36)',
    icon: '🔥',
    accent: 'from-blue-500 to-blue-700',
    bgAccent: 'bg-blue-50',
    borderAccent: 'border-blue-200',
    btnClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    issues: 'Career stress, relationship anxiety, burnout',
    approaches: 'Deep trauma processing, mindfulness habits, performance optimization',
  },
  {
    title: 'Adults (37–65+)',
    icon: '🌿',
    accent: 'from-emerald-500 to-emerald-700',
    bgAccent: 'bg-emerald-50',
    borderAccent: 'border-emerald-200',
    btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    issues: 'Chronic stress, grief, life transitions, sleep',
    approaches: 'Grief processing, sleep support, long-term emotional wellness',
  },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', age: '16', quote: 'I used to have panic attacks before every test. The EFT tapping sessions got me through finals week without a single one.', rating: 5, modality: 'EFT Tapping', segment: 'Teens' },
  { name: 'James K.', age: '28', quote: 'After my divorce, I couldn\'t sleep through the night. The Havening and deep breathing exercises literally changed my life.', rating: 5, modality: 'Havening', segment: 'Young Adults' },
  { name: 'Maria L.', age: '52', quote: 'I\'ve tried meditation apps before but nothing stuck. The EMDR sessions for grief processing helped me in ways I didn\'t think were possible.', rating: 5, modality: 'EMDR', segment: 'Adults' },
  { name: 'David R.', age: '22', quote: 'Career anxiety was crushing me. Silva Mind Control gave me the mental clarity to nail my job interviews.', rating: 5, modality: 'Silva Mind Control', segment: 'Young Adults' },
  { name: 'Elena T.', age: '45', quote: 'The age-tailored approach makes all the difference. Sessions actually speak to where I am in life right now.', rating: 4, modality: 'Multiple', segment: 'Adults' },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Choose Your Modality', icon: '🧘', desc: 'Pick from 7 science-backed techniques — EMDR, EFT Tapping, Havening, Silva Mind Control, and more.' },
  { step: 2, title: 'Select Your Age Group', icon: '🎯', desc: 'Sessions tailored for teens (14–18), young adults (19–36), or adults (37–65+).' },
  { step: 3, title: 'Start Your Session', icon: '▶️', desc: 'Follow guided audio narration with on-screen visual cues. Pause, replay, or switch anytime.' },
];

const FAQS = [
  { q: 'Is there really a free trial?', a: 'Yes! You get full, unrestricted access to all 7 modalities and every session for 30 days. No credit card required. Cancel anytime during your trial with zero charges.' },
  { q: 'Can I cancel my subscription?', a: 'Absolutely. You can cancel anytime from your dashboard. Your access continues through the end of your billing period. No questions asked.' },
  { q: 'Which modality should I start with?', a: 'Most users start with Deep Breathing (3–10 min sessions) or EFT Tapping (5–15 min). You can explore all 7 and switch freely — there\'s no wrong choice.' },
  { q: 'Is this a replacement for therapy?', a: 'Ener-G-T-49 is a wellness tool for self-guided emotional regulation, not a substitute for professional mental health care. If you are in crisis, please contact a licensed professional or emergency services.' },
  { q: 'How do the age segments work?', a: 'Sessions are written with age-appropriate language, scenarios, and duration. Teens get shorter sessions with relatable examples. Adults get deeper processing and life-transition support.' },
];

const TRUST_BADGES = [
  'No credit card required', '30-day free trial', 'Cancel anytime', 'SSL secured',
];

// ─── Components ──────────────────────────────────────────────────

function StarRating({ rating }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? 'text-amber-400' : 'text-gray-300'}>★</span>
      ))}
    </span>
  );
}

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {FAQS.map((faq, idx) => (
        <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900">{faq.q}</span>
            <span className={`text-gray-400 text-xl transition-transform ${openIndex === idx ? 'rotate-45' : ''}`}>+</span>
          </button>
          {openIndex === idx && (
            <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CompareModalities() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-8 text-center">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        {open ? 'Hide' : 'Compare'} Modalities
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="p-3 font-semibold text-gray-900">Modality</th>
                <th className="p-3 font-semibold text-gray-900">Avg Session</th>
                <th className="p-3 font-semibold text-gray-900">Best For</th>
                <th className="p-3 font-semibold text-gray-900 hidden sm:table-cell">Description</th>
              </tr>
            </thead>
            <tbody>
              {MODALITIES.map((m) => (
                <tr key={m.name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{m.icon} {m.name}</td>
                  <td className="p-3 text-gray-600">{m.avgTime}</td>
                  <td className="p-3 text-gray-600">{m.bestFor}</td>
                  <td className="p-3 text-gray-500 text-xs hidden sm:table-cell">{m.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────

export default function Landing() {
  return (
    <div>
      <SEOHead />

      {/* ═══════════════════════════════════════════════════════════
         HERO SECTION
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">
        {/* Background with brand gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A2A3A] via-[#1A2A3A] to-[#2C6E9C]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(42,110,156,0.3),transparent_50%)]" />

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[#4A9E8E]/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#7CA982]/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-[#E8D5C4] px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/10">
              <span>🧘</span> Seven Modalities • One App • Your Peace
            </div>

            {/* Headline — pain point + solution */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 font-[Montserrat]">
              Anxiety Doesn't Have to<br className="hidden sm:block" />
              Control Your Life
            </h1>
            <p className="text-xl sm:text-2xl text-[#C8D8E8] mb-6 max-w-3xl mx-auto leading-relaxed">
              The first all-in-one wellness app combining <strong className="text-white">EMDR, EFT Tapping, Havening, Silva Mind Control, TFT, Faster EFT, and Deep Breathing</strong> — guided, science-backed, and personalized for your age.
            </p>

            {/* Social proof */}
            <p className="text-sm text-[#9BB8D4] mb-8">
              <span className="inline-flex items-center gap-1">⭐ 4.8/5 from 1,200+ users</span>
              <span className="mx-3 opacity-30">•</span>
              <span>Join thousands who've found relief</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="bg-[#2C6E9C] hover:bg-[#1A5A80] text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-blue-900/30 transition-all hover:shadow-xl hover:-translate-y-0.5 font-[Montserrat]"
              >
                Start Your Free 30-Day Trial
              </Link>
              <a
                href="#how-it-works"
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-10 py-4 rounded-2xl text-lg font-semibold transition-all hover:-translate-y-0.5"
              >
                See How It Works
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              {TRUST_BADGES.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 text-xs text-[#9BB8D4] bg-white/5 px-3 py-1.5 rounded-full">
                  <svg className="w-3.5 h-3.5 text-[#4A9E8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         STATS BANNER
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[#1A2A3A] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white font-[Montserrat]">50,000+</div>
              <div className="text-xs text-[#9BB8D4] mt-1">Guided Sessions Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white font-[Montserrat]">7</div>
              <div className="text-xs text-[#9BB8D4] mt-1">Science-Backed Modalities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white font-[Montserrat]">3</div>
              <div className="text-xs text-[#9BB8D4] mt-1">Age-Tailored Programs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white font-[Montserrat]">4.8⭐</div>
              <div className="text-xs text-[#9BB8D4] mt-1">Average User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         HOW IT WORKS
         ═══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 bg-[#F5F0EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2A3A] mb-4 font-[Montserrat]">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to start feeling better. Most users feel a difference after their first session.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#2C6E9C] text-white text-sm font-bold flex items-center justify-center shadow-md">
                  {step.step}
                </div>
                <div className="text-5xl mb-4 mt-2">{step.icon}</div>
                <h3 className="text-xl font-bold text-[#1A2A3A] mb-3 font-[Montserrat]">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         MODALITIES SHOWCASE
         ═══════════════════════════════════════════════════════════ */}
      <section id="modalities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2A3A] mb-4 font-[Montserrat]">Seven Science-Backed Modalities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each technique is rooted in clinical research and presented in guided, easy-to-follow sessions tailored to your age.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {MODALITIES.map((mod) => (
              <div key={mod.name} className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-[#2C6E9C]/30 hover:shadow-lg transition-all cursor-default relative overflow-hidden">
                {/* Hover accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2C6E9C] to-[#4A9E8E] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                <span className="text-3xl mb-3 block">{mod.icon}</span>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{mod.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{mod.desc}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                    ⏱ {mod.avgTime}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md">
                    🎯 {mod.bestFor.split(',')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Compare Modalities */}
          <CompareModalities />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         AGE SEGMENTS
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#F5F0EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2A3A] mb-4 font-[Montserrat]">Personalized for Your Stage of Life</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sessions written with age-appropriate language, scenarios, and duration. One size doesn't fit all — yours shouldn't either.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {AGE_SEGMENTS.map((seg) => (
              <div key={seg.title} className={`relative ${seg.bgAccent} rounded-2xl p-8 border ${seg.borderAccent} hover:shadow-lg transition-shadow`}>
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${seg.accent} text-white text-2xl mb-5`}>
                  {seg.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-[Montserrat]">{seg.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold text-gray-800">Focus:</span> {seg.issues}
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  <span className="font-semibold text-gray-800">Approach:</span> {seg.approaches}
                </p>
                <Link
                  to="/signup"
                  className={`inline-block ${seg.btnClass} px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         TESTIMONIALS
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2A3A] mb-4 font-[Montserrat]">Real Stories from Real Users</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how Ener-G-T-49 has helped people of all ages find relief.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-[#F5F0EB] rounded-2xl p-6 border border-gray-100 relative">
                <StarRating rating={t.rating} />
                <p className="text-gray-700 mt-3 mb-4 text-sm leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">Age {t.age} • {t.segment}</p>
                  </div>
                  <span className="text-xs bg-white px-2.5 py-1 rounded-full text-gray-600 border border-gray-200">
                    {t.modality}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         PRICING
         ═══════════════════════════════════════════════════════════ */}
      <PricingCards />

      {/* ═══════════════════════════════════════════════════════════
         FAQ
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#F5F0EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2A3A] mb-4 font-[Montserrat]">Frequently Asked Questions</h2>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         FINAL CTA
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-[#1A2A3A] to-[#2C6E9C] relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#4A9E8E]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#7CA982]/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[Montserrat]">
            Start Your Wellness Journey Today
          </h2>
          <p className="text-xl text-[#C8D8E8] mb-8">
            30-day free trial. Full access to all 7 modalities. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-block bg-white text-[#1A2A3A] px-10 py-4 rounded-2xl text-lg font-bold hover:bg-[#F5F0EB] transition-all shadow-xl hover:-translate-y-0.5 font-[Montserrat]"
            >
              Get Started Free
            </Link>
            <a
              href="#pricing"
              className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all hover:-translate-y-0.5"
            >
              View Plans
            </a>
          </div>
          <p className="text-sm text-[#9BB8D4] mt-6">
            No credit card required. 30-day money-back guarantee on all paid plans.
          </p>
        </div>
      </section>
    </div>
  );
}