import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVoiceover } from '../hooks/useVoiceover';
import { useAuth } from '@clerk/clerk-react';

const API_URL = 'http://localhost:5000/api';

export default function ResonanceFeed({ day, onComplete }) {
  const [hasResonated, setHasResonated] = useState(false);
  const [observation, setObservation] = useState(null);
  const [resonanceCount, setResonanceCount] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [scriptOver, setScriptOver] = useState(false);
  
  const { getToken } = useAuth();
  const { playVoice } = useVoiceover();
  const isDevMode = new URLSearchParams(window.location.search).get('dev') === 'true';

  useEffect(() => {
    let active = true;
    async function loadObservation() {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch(`${API_URL}/resonance/feed?day=${day}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok && active) {
          const data = await res.json();
          if (data.observation) {
            setObservation(data.observation);
            setResonanceCount(data.observation.resonances || 0);
          }
        }
      } catch (err) {
        console.error("Failed to load observation", err);
      }
    }
    loadObservation();
    return () => { active = false };
  }, [day, getToken]);

  const obsIndex = day % 14; 

  // Play voiceover when observation appears
  useEffect(() => {
    if (observation) {
      setScriptOver(false); 
      playVoice(`/audio/voice/res-obs-${obsIndex}.mp3`);

      // Trigger button and prompt after first sentence (approx 6s)
      const timer = setTimeout(() => {
        setScriptOver(true);
        playVoice('/audio/voice/turiya-feed-transition.mp3');
      }, 6000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [observation, obsIndex, playVoice]);

  // Keep the listener as a fallback or for other events
  useEffect(() => {
    const handleScriptEnd = () => setScriptOver(true);
    window.addEventListener('shunya-unduck-audio', handleScriptEnd);
    return () => window.removeEventListener('shunya-unduck-audio', handleScriptEnd);
  }, []);

  // Auto-advance after 22s if no interaction
  useEffect(() => {
    if (!observation) return;
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, isDevMode ? 8000 : 22000);
    return () => clearTimeout(timer);
  }, [observation, isDevMode, onComplete]);

  const handleResonate = async () => {
    if (hasResonated || !observation) return;
    setHasResonated(true);
    setShowPulse(true);

    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${API_URL}/resonance/${observation._id}/pulse`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResonanceCount(data.resonances);
      }
    } catch (err) {
      console.error("Failed to pulse resonance", err);
    }

    setTimeout(() => {
      if (onComplete) onComplete();
    }, isDevMode ? 3000 : 5000);
  };

  if (!observation) return null;

  return (
    <motion.div
      className="flex flex-col items-center gap-12 max-w-xl text-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 4, ease: [0.37, 0, 0.63, 1] }}
    >
      {/* Observation text */}
      <motion.blockquote
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(1rem, 2.8vw, 1.5rem)',
          color: 'rgba(245, 240, 232, 0.7)',
          lineHeight: 1.85,
          letterSpacing: '0.02em',
          borderLeft: '1px solid rgba(78, 205, 196, 0.15)',
          paddingLeft: '1.5rem',
          textAlign: 'left',
        }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 4, ease: [0.37, 0, 0.63, 1] }}
      >
        {observation.text}
      </motion.blockquote>

      {/* Anonymous attribution */}
      <motion.p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.65rem',
          color: 'rgba(245, 240, 232, 0.1)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 3 }}
      >
        a fellow traveler · {resonanceCount} resonances
      </motion.p>

      {/* Resonance button */}
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: scriptOver ? 1 : 0 }}
        transition={{ duration: 3 }}
      >
        <ResonanceButton
          onResonate={handleResonate}
          hasResonated={hasResonated}
          showPulse={showPulse}
        />

        {!hasResonated && (
          <motion.p
            style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'italic',
              fontSize: '0.65rem',
              color: 'rgba(245, 240, 232, 0.12)',
              letterSpacing: '0.1em',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 8, duration: 3 }}
          >
            pulse if you felt this too
          </motion.p>
        )}

        {hasResonated && (
          <motion.p
            style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'italic',
              fontSize: '0.7rem',
              color: 'rgba(78, 205, 196, 0.4)',
              letterSpacing: '0.1em',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            felt
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}

/**
 * ResonanceButton — The single sacred interaction in Stage 4
 */
function ResonanceButton({ onResonate, hasResonated, showPulse }) {
  return (
    <motion.button
      onClick={onResonate}
      disabled={hasResonated}
      style={{
        background: 'none',
        border: 'none',
        cursor: hasResonated ? 'default' : 'pointer',
        padding: '1.5rem',
        position: 'relative',
        outline: 'none',
      }}
      whileHover={!hasResonated ? { scale: 1.1 } : {}}
      transition={{ duration: 0.8 }}
      aria-label="Resonate — I felt this too"
    >
      <motion.div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: `1.5px solid rgba(78, 205, 196, ${hasResonated ? 0.7 : 0.3})`,
          boxShadow: hasResonated
            ? '0 0 20px rgba(78, 205, 196, 0.2)'
            : 'none',
        }}
        animate={hasResonated
          ? { borderColor: 'rgba(78, 205, 196, 0.7)' }
          : { borderColor: ['rgba(78, 205, 196, 0.2)', 'rgba(78, 205, 196, 0.5)', 'rgba(78, 205, 196, 0.2)'] }
        }
        transition={hasResonated
          ? { duration: 1 }
          : { duration: 4, repeat: Infinity, ease: [0.37, 0, 0.63, 1] }
        }
      />

      {showPulse && (
        <>
          <motion.div
            style={{
              position: 'absolute',
              inset: '1.5rem',
              borderRadius: '50%',
              border: '1px solid rgba(78, 205, 196, 0.4)',
            }}
            animate={{ scale: [1, 3.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, ease: [0.37, 0, 0.63, 1] }}
          />
          <motion.div
            style={{
              position: 'absolute',
              inset: '1.5rem',
              borderRadius: '50%',
              border: '1px solid rgba(78, 205, 196, 0.2)',
            }}
            animate={{ scale: [1, 5], opacity: [0.3, 0] }}
            transition={{ duration: 3, delay: 0.3, ease: [0.37, 0, 0.63, 1] }}
          />
        </>
      )}
    </motion.button>
  );
}
