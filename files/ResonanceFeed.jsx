import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ResonanceFeed — The Mirror
 *
 * One observation from the community. No author name. No timestamp.
 * Just the raw inner truth another traveler left behind.
 *
 * A single resonance button — a gentle pulse.
 * Meaning: "I felt this too."
 *
 * After resonating (or after 20s) — moves forward.
 * No pressure to respond. Witnessing is enough.
 *
 * In production: fetch from API. For now — curated seed content.
 */

// Seed observations — written in the authentic inner-voice of the practice
const SEED_OBSERVATIONS = [
  "I noticed I was afraid of silence today. Not the silence itself — but what might surface in it.",
  "I caught myself performing even when alone. Composing sentences no one will ever read. For an imaginary audience.",
  "The gap between my thoughts was longer today. For a moment — I couldn't find where 'I' was. It was not frightening. It was vast.",
  "I am learning that boredom is just withdrawal. The body demanding its dopamine tax. I sat with it until it dissolved.",
  "Something shifted in week three. I stopped fighting the silence. I started listening to it.",
  "I realized my loneliness was not about being alone. It was about not knowing how to be with myself.",
  "My mind kept pulling toward my phone. Each time I noticed — something deepened. The noticing itself became the practice.",
  "Today the question landed differently: who is tired? I looked. The witness was not tired. The witness was watching tiredness.",
  "I felt the collective stillness today. Knowing others are sitting — somewhere — it changed something in my chest.",
  "I stopped trying to feel peaceful. The moment I stopped trying — something like peace arrived on its own.",
  "Three weeks in. I don't scroll in bed anymore. The craving is still there, but quieter. Like a radio losing signal.",
  "I noticed I narrate my life to myself constantly. A running commentary. Today I turned it off for seven minutes. Seven minutes of just — being.",
  "The observer has no face. No history. No anxiety. I've started to suspect that's what I actually am.",
  "Being with people feels different now. Less performance. More presence. They notice something has changed. I don't explain.",
];

function getDailyObservation(day) {
  return SEED_OBSERVATIONS[day % SEED_OBSERVATIONS.length];
}

export default function ResonanceFeed({ day, onComplete }) {
  const [hasResonated, setHasResonated] = useState(false);
  const [resonanceCount] = useState(() => Math.floor(Math.random() * 40) + 12);
  const [showPulse, setShowPulse] = useState(false);

  const observation = getDailyObservation(day);

  const isDevMode = new URLSearchParams(window.location.search).get('dev') === 'true';

  // Auto-advance after 22s if no interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, isDevMode ? 8000 : 22000);
    return () => clearTimeout(timer);
  }, []);

  const handleResonate = () => {
    if (hasResonated) return;
    setHasResonated(true);
    setShowPulse(true);

    // Save to localStorage — queued for backend sync
    const resonances = JSON.parse(localStorage.getItem('shunya_resonances') || '[]');
    resonances.push({ day, timestamp: new Date().toISOString(), type: 'resonance' });
    localStorage.setItem('shunya_resonances', JSON.stringify(resonances));

    setTimeout(() => {
      if (onComplete) onComplete();
    }, isDevMode ? 3000 : 5000);
  };

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
        {observation}
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
        animate={{ opacity: 1 }}
        transition={{ delay: 5, duration: 3 }}
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
 * Not a like button. Not a heart. A pulse.
 * One gentle circle that expands on activation.
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
      {/* Core circle */}
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

      {/* Pulse ring — expands on resonance */}
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
