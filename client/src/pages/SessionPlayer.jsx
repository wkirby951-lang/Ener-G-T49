import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import useTTS from '../useTTS';
import { getAudioUrl, audioExists } from '../audioManifest';
import { track } from '../analytics';

export default function SessionPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBilateral, setShowBilateral] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const timerRef = useRef(null);
  const scriptRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    api.getContentById(id)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Check for audio file once data is loaded
  useEffect(() => {
    if (!data?.item) return;
    (async () => {
      try {
        const exists = await audioExists(data.item);
        if (exists) {
          setAudioUrl(getAudioUrl(data.item));
        }
      } catch (e) {
        console.log('No audio file, using TTS');
      }
      setAudioLoading(false);
    })();
  }, [data]);

  const body = data?.body || '';
  const item = data?.item;

  const {
    supported,
    isSpeaking,
    isPaused: ttsPaused,
    currentIndex,
    segments,
    voices,
    selectedVoice,
    speed,
    start,
    pause: ttsPause,
    resume: ttsResume,
    stop: ttsStop,
    changeVoice,
    changeSpeed,
  } = useTTS(body);

  const useAudio = !!audioUrl;

  // Timer for elapsed time
  useEffect(() => {
    if ((isSpeaking || audioPlaying) && !ttsPaused) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isSpeaking, audioPlaying, ttsPaused]);

  // Auto-scroll to highlighted segment (TTS only)
  useEffect(() => {
    if (currentIndex >= 0 && scriptRef.current && !useAudio) {
      const el = scriptRef.current.querySelector(`[data-segment="${currentIndex}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentIndex, useAudio]);

  // Audio event handlers
  const handleAudioStart = () => {
    if (!audioRef.current) return;
    audioRef.current.play();
    setAudioPlaying(true);
    setShowBilateral(item?.modalityId === 'emdr');
    track('session_started', { contentId: id, modalityId: item?.modalityId, mode: 'audio' });
  };

  const handleAudioPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setAudioPlaying(true);
      track('session_resumed', { contentId: id });
    } else {
      audioRef.current.pause();
      setAudioPlaying(false);
      track('session_paused', { contentId: id });
    }
  };

  const handleAudioStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioPlaying(false);
    clearInterval(timerRef.current);
    setShowBilateral(false);
    track('session_abandoned', { contentId: id, modalityId: item?.modalityId });
  };

  const handleAudioEnded = () => {
    setAudioPlaying(false);
  };

  // TTS handlers
  const handleStart = () => {
    setShowBilateral(item?.modalityId === 'emdr');
    track('session_started', { contentId: id, modalityId: item?.modalityId, mode: 'tts' });
    start();
  };

  const handlePause = () => {
    if (ttsPaused) {
      track('session_resumed', { contentId: id });
      ttsResume();
    } else {
      track('session_paused', { contentId: id });
      ttsPause();
    }
  };

  const handleStop = () => {
    track('session_abandoned', { contentId: id, modalityId: item?.modalityId });
    ttsStop();
    clearInterval(timerRef.current);
    setShowBilateral(false);
  };

  const completeSession = async () => {
    track('session_completed', { contentId: id, modalityId: item?.modalityId, durationMinutes: Math.floor(elapsed / 60) });
    if (useAudio && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioPlaying(false);
    } else {
      ttsStop();
    }
    clearInterval(timerRef.current);
    try {
      await api.completeSession({
        contentId: id,
        modalityId: item.modalityId,
        durationMinutes: Math.floor(elapsed / 60),
      });
    } catch (e) {
      console.error('Failed to record session:', e);
    }
    navigate('/dashboard');
  };

  if (loading || audioLoading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  if (!data) return <div className="text-center py-20 text-gray-500">Session not found.</div>;
  if (item.type !== 'session') {
    navigate(`/content/${id}`);
    return null;
  }

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const isPlaying = audioPlaying || (isSpeaking && !ttsPaused);
  const isIdle = !isSpeaking && !audioPlaying;

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Hidden audio element */}
      {useAudio && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnded}
          onPlay={() => setAudioPlaying(true)}
          onPause={() => setAudioPlaying(false)}
          preload="auto"
        />
      )}

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
        {/* Mode indicator */}
        {useAudio && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm">
            <span className="text-green-600">🎧</span>
            <span className="text-green-800">Professional audio recording available</span>
          </div>
        )}

        {/* TTS Unsupported Warning (only when no audio) */}
        {!useAudio && !supported && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-amber-800 text-sm">⚠ Audio narration not available on this device. You can still follow the text script below.</p>
          </div>
        )}

        {/* Bilateral Stimulation (for EMDR) */}
        {showBilateral && isPlaying && (
          <div className="bg-gray-900 rounded-2xl p-8 mb-8 flex items-center justify-center overflow-hidden">
            <div className="relative w-64 h-16">
              <div className="bilateral-dot w-6 h-6 bg-blue-400 rounded-full absolute top-1/2 -translate-y-1/2 left-1/2 shadow-lg shadow-blue-400/50"></div>
            </div>
          </div>
        )}

        {/* Voice & Speed Controls (TTS mode, idle) */}
        {!useAudio && isIdle && supported && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-gray-500 mb-1">Voice</label>
                <select
                  value={selectedVoice?.voiceURI || ''}
                  onChange={(e) => {
                    const v = voices.find(v => v.voiceURI === e.target.value);
                    if (v) changeVoice(v);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                >
                  {voices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-28">
                <label className="block text-xs font-medium text-gray-500 mb-1">Speed</label>
                <select
                  value={speed}
                  onChange={(e) => changeSpeed(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                >
                  <option value={0.75}>0.75x (Slow)</option>
                  <option value={1}>1x (Normal)</option>
                  <option value={1.25}>1.25x (Fast)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Audio player controls (audio mode, idle) */}
        {useAudio && isIdle && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Track Preview</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <audio ref={audioRef} src={audioUrl} preload="auto" className="hidden" />
              </div>
            </div>
          </div>
        )}

        {/* Main Controls - Start Screen */}
        {isIdle ? (
          <div className="text-center py-8">
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
            <button
              onClick={useAudio ? handleAudioStart : handleStart}
              className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              ▶ Begin {useAudio ? 'Audio' : 'Guided'} Session
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={useAudio ? handleAudioPause : handlePause}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors text-sm"
              >
                {useAudio ? (audioPlaying ? '⏸ Pause' : '▶ Resume') : (ttsPaused ? '▶ Resume' : '⏸ Pause')}
              </button>
              <button
                onClick={useAudio ? handleAudioStop : handleStop}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors text-sm"
              >
                ⏹ Stop
              </button>
              <button
                onClick={completeSession}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors text-sm"
              >
                ✓ Complete Session
              </button>
            </div>

            {/* Audio seek bar */}
            {useAudio && audioPlaying && (
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>{Math.floor(audioRef.current?.currentTime || 0)}s</span>
                <input
                  type="range"
                  min={0}
                  max={audioRef.current?.duration || 0}
                  value={audioRef.current?.currentTime || 0}
                  onChange={(e) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = parseFloat(e.target.value);
                    }
                  }}
                  className="flex-1 h-2 rounded-full appearance-none bg-gray-200 accent-blue-600 cursor-pointer"
                />
                <span>{Math.floor(audioRef.current?.duration || 0)}s</span>
              </div>
            )}

            {/* Volume control (audio mode) */}
            {useAudio && audioPlaying && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>🔊</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  defaultValue={1}
                  onChange={(e) => {
                    if (audioRef.current) {
                      audioRef.current.volume = parseFloat(e.target.value);
                    }
                  }}
                  className="w-24 h-2 rounded-full appearance-none bg-gray-200 accent-blue-600 cursor-pointer"
                />
              </div>
            )}

            {/* TTS Voice & Speed Controls (during playback) */}
            {!useAudio && supported && (
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs">Voice:</span>
                  <select
                    value={selectedVoice?.voiceURI || ''}
                    onChange={(e) => {
                      const v = voices.find(v => v.voiceURI === e.target.value);
                      if (v) changeVoice(v);
                    }}
                    className="px-2 py-1 rounded border border-gray-200 text-xs bg-white"
                  >
                    {voices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs">Speed:</span>
                  <select
                    value={speed}
                    onChange={(e) => changeSpeed(parseFloat(e.target.value))}
                    className="px-2 py-1 rounded border border-gray-200 text-xs bg-white"
                  >
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                  </select>
                </div>
              </div>
            )}

            {/* Script with Line Highlighting */}
            {body && (
              <div
                ref={scriptRef}
                className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 max-h-[55vh] overflow-y-auto content-scroll"
              >
                <div className="space-y-3">
                  {segments.map((seg, idx) => {
                    const isActive = idx === currentIndex && !useAudio;
                    if (seg.type === 'pause') {
                      return (
                        <div
                          key={idx}
                          data-segment={idx}
                          className={`text-xs text-center py-1 px-3 rounded-full transition-colors ${
                            isActive
                              ? 'bg-indigo-100 text-indigo-700 font-medium'
                              : 'text-gray-400'
                          }`}
                        >
                          ⏱ {isActive ? `Pausing ${seg.seconds}s...` : `(${seg.seconds}s pause)`}
                        </div>
                      );
                    }
                    return (
                      <p
                        key={idx}
                        data-segment={idx}
                        className={`leading-relaxed text-sm px-3 py-1.5 rounded-lg transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-900 font-medium ring-1 ring-blue-200 shadow-sm'
                            : 'text-gray-700'
                        }`}
                      >
                        {seg.text}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Preparation notes */}
            {!ttsPaused && !audioPlaying && (
              <div className="text-center">
                <p className="text-sm text-gray-400">Follow the guided narration at your own pace.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}