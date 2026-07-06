import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { openStripeCheckout } from '../stripe';

const MODALITY_ICONS = {
  emdr: '🫣', 'eft-tapping': '👆', 'faster-eft': '⚡',
  'tft-tapping': '🧠', 'silva-mind-control': '🌌', 'havening': '🤲', 'deep-breathing': '🌬️',
};

export default function ContentLibrary() {
  const [searchParams] = useSearchParams();
  const [grouped, setGrouped] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModality, setActiveModality] = useState(searchParams.get('modality') || null);
  const [activeSegment, setActiveSegment] = useState(searchParams.get('ageSegment') || null);
  const [filterType, setFilterType] = useState(searchParams.get('filter') || 'all');

  useEffect(() => {
    api.getContentByModality()
      .then((data) => setGrouped(data.grouped))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;

  // Filter items
  const filteredModalities = Object.entries(grouped || {}).filter(([id, mod]) => {
    if (activeModality && id !== activeModality) return false;
    if (filterType === 'session') {
      mod.items = mod.items.filter(i => i.type === 'session');
    } else if (filterType === 'literature') {
      mod.items = mod.items.filter(i => i.type !== 'session');
    }
    if (activeSegment) {
      mod.items = mod.items.filter(i => i.ageSegment === activeSegment || i.type !== 'session');
    }
    return mod.items.length > 0 || !activeModality;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Content Library</h1>
        <p className="text-gray-600 mt-1">Browse guided sessions and literature across all 7 modalities.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setActiveModality(null); }} className={`px-3 py-1.5 rounded-lg text-sm ${!activeModality ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
          {Object.entries(grouped || {}).map(([id, mod]) => (
            <button key={id} onClick={() => setActiveModality(activeModality === id ? null : id)} className={`px-3 py-1.5 rounded-lg text-sm ${activeModality === id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {MODALITY_ICONS[id] || '📋'} {mod.modality.name}
            </button>
          ))}
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 border-0">
          <option value="all">All Content</option>
          <option value="session">Sessions Only</option>
          <option value="literature">Literature Only</option>
        </select>
        <select value={activeSegment || ''} onChange={(e) => setActiveSegment(e.target.value || null)} className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 border-0">
          <option value="">All Ages</option>
          <option value="teens">Teens (14-18)</option>
          <option value="young-adults">Young Adults (19-36)</option>
          <option value="adults">Adults (37-65+)</option>
        </select>
      </div>

      {/* Content Grid */}
      {filteredModalities.map(([id, mod]) => (
        <div key={id} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{MODALITY_ICONS[id] || '📋'}</span>
            <h2 className="text-xl font-bold text-gray-900">{mod.modality.name}</h2>
            <span className="text-sm text-gray-500">· {mod.items.length} items</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mod.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <Link to={item.type === 'session' ? `/play/${item.id}` : `/content/${item.id}`}>
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      item.type === 'session' ? 'bg-green-100 text-green-700' :
                      item.type === 'introduction' ? 'bg-blue-100 text-blue-700' :
                      item.type === 'cheatsheet' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {item.type === 'session' ? '🎧 Session' : item.type === 'introduction' ? '📖 Guide' : '📋 Reference'}
                    </span>
                    {item.ageSegment && (
                      <span className="text-xs text-gray-400">{item.ageSegment}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{item.title}</h3>
                  {item.duration && <p className="text-xs text-gray-500 mb-1">{item.duration}</p>}
                  {item.focus && <p className="text-xs text-gray-500 mb-1">Focus: {item.focus}</p>}
                  <p className="text-xs text-gray-400 line-clamp-2 mt-2">{item.abstract}</p>
                </Link>
                <button
                  onClick={(e) => { e.stopPropagation(); openStripeCheckout('a-la-carte'); }}
                  className="mt-3 w-full text-center py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
                >
                  $5 Download
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredModalities.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No content found matching your filters.</p>
        </div>
      )}
    </div>
  );
}