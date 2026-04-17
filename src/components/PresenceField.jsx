import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PresenceField — Collective Witnessing
 *
 * "847 people are sitting in stillness right now."
 *
 * Not social. Not gamified. Not a follower count.
 * Just — the felt sense that you are not alone in choosing this.
 *
 * Design:
 * - Appears in the lower portion of the screen. Unobtrusive.
 * - A soft constellation of dots — each one a presence.
 * - The count is semi-random (seeded by time of day for consistency)
 *   but fluctuates gently to feel alive.
 * - No names. No avatars. No identity. Pure presence.
 * - Dots breathe at slightly different rates — they are not synchronized.
 *   Each dot is a unique consciousness.
 */

// Seed-based pseudo-random — same "base count" for a given hour
function getBaseCount() {
  const hour = new Date().getHours();
  // Peak hours: morning (6-9am) and evening (7-10pm)
  const seeds = [
    120, 98, 76, 54, 43, 38, 52, 134, 287, 412,
    389, 334, 298, 276, 254, 231, 219, 334, 512, 623,
    589, 498, 387, 234
  ];
  return seeds[hour] || 200;
}

function usePresenceCount() {
  const [count, setCount] = useState(getBaseCount());

  useEffect(() => {
    // Gently fluctuate ±8 every 12–20 seconds
    const interval = setInterval(() => {
      const base = getBaseCount();
      const delta = Math.floor(Math.random() * 17) - 8;
      setCount(Math.max(base + delta, 10));
    }, 12000 + Math.random() * 8000);

    return () => clearInterval(interval);
  }, []);

  return count;
}

// Generate dot positions — a soft organic cluster
function generateDots(count) {
  return Array.from({ length: Math.min(count, 24) }, (_, i) => ({
    id: i,
    x: 20 + Math.sin(i * 2.4) * 35 + Math.cos(i * 1.7) * 25,
    y: 20 + Math.cos(i * 2.4) * 35 + Math.sin(i * 1.2) * 20,
    size: 1.5 + Math.random() * 1.5,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 5,
  }));
}

export default function PresenceField() {
  const count = usePresenceCount();
  const dots = generateDots(count);

  return (
    <motion.div
      className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 6, delay: 2, ease: [0.37, 0, 0.63, 1] }}
    >
      {/* Dot constellation */}
      <div
        style={{
          position: 'relative',
          width: '120px',
          height: '80px',
        }}
      >
        {dots.map((dot) => (
          <motion.div
            key={dot.id}
            style={{
              position: 'absolute',
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              borderRadius: '50%',
              backgroundColor: 'rgba(78, 205, 196, 0.5)',
              boxShadow: `0 0 ${dot.size * 3}px rgba(78, 205, 196, 0.2)`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              opacity: [0.15, 0.7, 0.15],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: dot.duration,
              delay: dot.delay,
              repeat: Infinity,
              ease: [0.37, 0, 0.63, 1],
            }}
          />
        ))}
      </div>

      {/* Count text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={count}
          style={{
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
            fontSize: 'clamp(0.7rem, 1.5vw, 0.82rem)',
            color: 'rgba(245, 240, 232, 0.18)',
            letterSpacing: '0.08em',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3 }}
        >
          {count.toLocaleString()} sitting in stillness right now
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
