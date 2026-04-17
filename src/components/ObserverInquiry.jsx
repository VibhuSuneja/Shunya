import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVoiceover } from '../hooks/useVoiceover';

/**
 * ObserverInquiry — The Sakshi Question
 *
 * Unlike SacredText — this question is not read passively.
 * It is an active pointer. It must land differently.
 *
 * Design:
 * - Question appears whole — not character by character
 * - Very slow fade. 4 second arrival.
 * - A subtle vertical line appears above it — like a pointer from the cosmos
 * - No answer is expected. Just noticing.
 * - After 18 seconds — a soft prompt: "Sit with this in silence"
 * - After 24 seconds — moves to silence phase automatically
 */
export default function ObserverInquiry({ text, audio, onComplete }) {
  const { playVoice } = useVoiceover();

  const isDevMode = new URLSearchParams(window.location.search).get('dev') === 'true';
  const INQUIRY_DURATION = isDevMode ? 6000 : 24000;

  useEffect(() => {
    if (audio) playVoice(audio);

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, INQUIRY_DURATION);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center text-center max-w-2xl px-8 gap-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 4, ease: [0.37, 0, 0.63, 1] }}
    >
      {/* Descending pointer line */}
      <motion.div
        style={{
          width: '1px',
          background: 'linear-gradient(to bottom, transparent, rgba(78, 205, 196, 0.25), transparent)',
          transformOrigin: 'top',
        }}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 60, opacity: 1 }}
        transition={{ delay: 1, duration: 3, ease: [0.37, 0, 0.63, 1] }}
      />

      {/* The observer question */}
      <motion.p
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 300,
          fontSize: 'clamp(1.15rem, 3.2vw, 2rem)',
          color: 'var(--parchment)',
          lineHeight: 1.75,
          letterSpacing: '0.03em',
          textShadow: '0 0 80px rgba(78, 205, 196, 0.08)',
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 4, ease: [0.37, 0, 0.63, 1] }}
      >
        {text}
      </motion.p>

      {/* Sanskrit echo — Sakshi */}
      <motion.p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          color: 'rgba(78, 205, 196, 0.2)',
          letterSpacing: '0.2em',
          fontStyle: 'italic',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5, duration: 4 }}
      >
        साक्षी
      </motion.p>

      {/* Soft directive */}
      <motion.p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          color: 'rgba(245, 240, 232, 0.12)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 9, duration: 4 }}
      >
        do not answer — only notice
      </motion.p>
    </motion.div>
  );
}
