import { useState, useEffect, useRef, useCallback } from 'react';
import { parseScript, cleanForTTS } from './tts';

const VOICE_PREF_KEY = 'ener-g-t-49-voice-pref';
const SPEED_PREF_KEY = 'ener-g-t-49-speed-pref';

/**
 * Custom hook for browser-based TTS narration with pause/stop/speed/voice control.
 */
export default function useTTS(body) {
  const [segments, setSegments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speed, setSpeed] = useState(() => parseFloat(localStorage.getItem(SPEED_PREF_KEY)) || 1);
  const [supported, setSupported] = useState(true);

  const synthRef = useRef(null);
  const utterRef = useRef(null);
  const queueRef = useRef([]);
  const queueIndexRef = useRef(0);
  const stoppedRef = useRef(false);
  const pausedRef = useRef(false);

  // Parse script into segments on body change
  useEffect(() => {
    if (body) {
      const segs = parseScript(body);
      setSegments(segs);
    }
  }, [body]);

  // Check support and load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      const available = synthRef.current.getVoices();
      if (available.length) {
        setVoices(available);
        // Try to find a calm female voice
        const preferred = available.find(v =>
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('google uk') ||
          v.name.toLowerCase().includes('google female')
        );
        const savedId = localStorage.getItem(VOICE_PREF_KEY);
        if (savedId) {
          const saved = available.find(v => v.voiceURI === savedId);
          if (saved) setSelectedVoice(saved);
          else if (preferred) setSelectedVoice(preferred);
          else setSelectedVoice(available[0]);
        } else if (preferred) {
          setSelectedVoice(preferred);
        } else if (available.length) {
          setSelectedVoice(available[0]);
        }
      }
    };

    loadVoices();
    // Chrome loads voices asynchronously
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Speak next segment in queue
  const speakNext = useCallback(() => {
    if (stoppedRef.current) return;

    const queue = queueRef.current;
    const idx = queueIndexRef.current;

    if (idx >= queue.length) {
      setIsSpeaking(false);
      setCurrentIndex(-1);
      return;
    }

    const segment = queue[idx];

    if (segment.type === 'pause') {
      setCurrentIndex(segment.segmentIndex);
      pausedRef.current = false;
      const ms = Math.max(500, segment.seconds * 1000);
      setTimeout(() => {
        if (!stoppedRef.current) {
          queueIndexRef.current++;
          speakNext();
        }
      }, ms);
      return;
    }

    if (segment.type === 'speak') {
      setCurrentIndex(segment.segmentIndex);
      const utterance = new SpeechSynthesisUtterance(cleanForTTS(segment.text));
      utterance.rate = speed;
      utterance.volume = 1;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterRef.current = utterance;

      utterance.onend = () => {
        if (!stoppedRef.current) {
          queueIndexRef.current++;
          speakNext();
        }
      };

      utterance.onerror = () => {
        if (!stoppedRef.current) {
          queueIndexRef.current++;
          speakNext();
        }
      };

      pausedRef.current = false;
      synthRef.current.speak(utterance);
    }
  }, [speed, selectedVoice]);

  // Build queue from segments
  const buildQueue = useCallback((segs) => {
    const queue = [];
    segs.forEach((seg, i) => {
      if (seg.type === 'speak' && seg.text.trim()) {
        queue.push({ ...seg, segmentIndex: i });
      } else if (seg.type === 'pause') {
        queue.push({ ...seg, segmentIndex: i });
      }
    });
    return queue;
  }, []);

  const start = useCallback(() => {
    if (!synthRef.current || segments.length === 0) return;

    synthRef.current.cancel();
    stoppedRef.current = false;

    const queue = buildQueue(segments);
    queueRef.current = queue;
    queueIndexRef.current = 0;
    setIsSpeaking(true);
    setIsPaused(false);
    speakNext();
  }, [segments, buildQueue, speakNext]);

  const pause = useCallback(() => {
    if (!synthRef.current) return;
    pausedRef.current = true;
    setIsPaused(true);
    synthRef.current.cancel();
  }, []);

  const resume = useCallback(() => {
    if (!synthRef.current) return;
    setIsPaused(false);
    pausedRef.current = false;
    speakNext();
  }, [speakNext]);

  const stop = useCallback(() => {
    if (!synthRef.current) return;
    stoppedRef.current = true;
    pausedRef.current = false;
    synthRef.current.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentIndex(-1);
    queueRef.current = [];
    queueIndexRef.current = 0;
  }, []);

  const changeVoice = useCallback((voice) => {
    setSelectedVoice(voice);
    if (voice) {
      localStorage.setItem(VOICE_PREF_KEY, voice.voiceURI);
    }
  }, []);

  const changeSpeed = useCallback((newSpeed) => {
    setSpeed(newSpeed);
    localStorage.setItem(SPEED_PREF_KEY, String(newSpeed));
  }, []);

  return {
    supported,
    isSpeaking,
    isPaused,
    currentIndex,
    segments,
    voices,
    selectedVoice,
    speed,
    start,
    pause,
    resume,
    stop,
    changeVoice,
    changeSpeed,
  };
}