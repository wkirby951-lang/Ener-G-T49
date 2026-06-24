import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function SessionPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showBilateral, setShowBilateral] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    api.getContentById(id)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, isPaused]);

  const startSession = () => {
    setIsPlaying(true);
    setIsPaused(false);
    if (data?.item?.modalityId === 'emdr') {
      setShowBilateral(true);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const completeSession = async () => {
    clearInterval(timerRef.current);
    try {
      await api.completeSession({
        contentId: id,
        modalityId: data.item.modalityId,
        durationMinutes: Math.floor(elapsed / 60),
      });
    } catch (e) {
      console.error('Failed to record session:', e);
    }
    navigate('/dashboard');
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  if (!data) return <div className="text-center py-20 text-gray-500">Session not found.</div>;

  const { item, body } = data;
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  // Show a simpler view for non-session content
  if (item.type !== 'session') {
    navigate(`/content/${id}`);
    return null;
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Player Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/content" className="text-sm text-gray-500 hover:text-gray-700">← Back</Link>
            <h1 className="font-semibold text-gray-900 mt-1">{item.title}</h1>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800 font-mono">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <p className="text-xs text-gray-500">{item.duration || 'Self-paced'}</p>
          </div>
        </div>
      </div>

      {/* Player Body */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Bilateral Stimulation (for EMDR) */}
        {showBilateral && isPlaying && !isPaused && (
          <div className="bg-gray-900 rounded-2xl p-8 mb-8 flex items-center justify-center overflow-hidden">
            <div className="relative w-64 h-16">
              <div className="bilateral-dot w-6 h-6 bg-blue-400 rounded-full absolute top-1/2 -translate-y-1/2 left-1/2 shadow-lg shadow-blue-400/50"></div>
            </div>
          </div>
        )}

        {/* Session Controls */}
        {!isPlaying ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">
              {item.modalityId === 'emdr' ? '🫣' :
               item.modalityId === 'eft-tapping' ? '👆' :
               item.modalityId === 'faster-eft' ? '⚡' :
               item.modalityId === 'tft-tapping' ? '🧠' :
               item.modalityId === 'silva-mind-control' ? '🌌' :
               item.modalityId === 'havening' ? '🤲' : '🌬️'}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Begin?</h2>
            <p className="text-gray-600 mb-6">Find a quiet, comfortable space. Have water nearby.</p>
            <button onClick={startSession} className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              ▶ Begin Session
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pause/Resume Button */}
            <div className="flex justify-center gap-4">
              <button onClick={togglePause} className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
                {isPaused ? '▶ Resume' : '⏸ Pause'}
              </button>
              <button onClick={completeSession} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
                ✓ Complete Session
              </button>
            </div>

            {/* Session Script */}
            {body && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 max-h-[60vh] overflow-y-auto content-scroll">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm">
                  {body}
                </pre>
              </div>
            )}

            {/* Preparation notes */}
            {!isPaused && (
              <div className="text-center">
                <p className="text-sm text-gray-400">Take your time. Follow the guidance at your own pace.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}