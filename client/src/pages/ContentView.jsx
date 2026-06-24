import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

export default function ContentView() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getContentById(id)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  if (!data) return <div className="text-center py-20 text-gray-500">Content not found.</div>;

  const { item, body } = data;

  // Render markdown-like content to HTML (basic converter)
  const renderBody = (md) => {
    if (!md) return '';
    let html = md
      // Headers
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-3">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="my-6 border-gray-200" />')
      // List items
      .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc text-gray-700 mb-1">$1</li>')
      // Numbered lists
      .replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-5 list-decimal text-gray-700 mb-1">$1</li>')
      // Paragraphs (double newlines)
      .replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-4">')
      // Single newlines within paragraphs
      .replace(/\n/g, '<br />');
    
    return '<p class="text-gray-700 leading-relaxed mb-4">' + html + '</p>';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link to="/content" className="text-blue-600 text-sm hover:underline">← Back to Library</Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              item.type === 'session' ? 'bg-green-100 text-green-700' :
              item.type === 'introduction' ? 'bg-blue-100 text-blue-700' :
              item.type === 'cheatsheet' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {item.type === 'session' ? 'Guided Session' : item.type === 'introduction' ? 'Guide' : 'Cheat Sheet'}
            </span>
            {item.ageSegment && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">{item.ageSegment?.replace('-', '–')}</span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{item.title}</h1>

          {item.duration && <p className="text-sm text-gray-500 mb-1">Duration: {item.duration}</p>}
          {item.focus && <p className="text-sm text-gray-500 mb-1">Focus: {item.focus}</p>}
          {item.goal && <p className="text-sm text-gray-500 mb-4">Goal: {item.goal}</p>}

          {item.type === 'session' && (
            <Link to={`/play/${item.id}`} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors mb-8">
              <span>▶</span> Start Session
            </Link>
          )}

          <div className="prose prose-gray max-w-none mt-6 content-scroll" dangerouslySetInnerHTML={{ __html: renderBody(body || '') }} />
        </div>
      </div>
    </div>
  );
}