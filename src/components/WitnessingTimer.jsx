import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * WitnessingTimer — Presence, Not Countdown
 * 
 * This timer does not count down. It simply witnesses.
 * It shows elapsed time in a barely-visible, journal-like format.
 * Its purpose is to say: "Time has passed. You were here."
 * 
 * "Not counting down, just present."
 */
export default function WitnessingTimer({ active = true }) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (!active) return;

    startRef.current = Date.now();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [active]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: 'clamp(2rem, 5vh, 3.5rem)',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-body)',
        fontStyle: 'italic',
        fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
        color: 'rgba(245, 240, 232, 0.08)',
        letterSpacing: '0.2em',
        userSelect: 'none',
        fontVariantNumeric: 'tabular-nums',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 6,
        delay: 2,
        ease: [0.37, 0, 0.63, 1],
      }}
      aria-label={`${minutes} minutes and ${seconds} seconds of witnessing`}
      aria-live="off"
    >
      {display}
    </motion.div>
  );
}
