import { motion } from 'framer-motion';
import { revealTransition, breathTransition } from '../utils/easing';

/**
 * SacredEntry — The Doorway
 * 
 * A completely dark screen with a single, barely-visible circle.
 * The user must consciously choose to enter — a sacred act that also
 * satisfies browser autoplay policy for the theta audio.
 * 
 * "Enter the stillness."
 */
export default function SacredEntry({ onEnter }) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer cosmic-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: [0.37, 0, 0.63, 1] }}
      onClick={onEnter}
      onKeyDown={(e) => e.key === 'Enter' && onEnter()}
      role="button"
      tabIndex={0}
      aria-label="Enter the stillness"
      id="sacred-entry"
    >
      {/* Starfield background */}
      <div className="starfield" />

      {/* The Circle — Shunya */}
      <motion.div
        className="relative"
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 8,
          ease: [0.37, 0, 0.63, 1],
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          style={{
            position: 'absolute',
            inset: '-20px',
            borderRadius: '50%',
            border: '1px solid rgba(78, 205, 196, 0.08)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 8,
            ease: [0.37, 0, 0.63, 1],
            repeat: Infinity,
            delay: 1,
          }}
        />

        {/* Second glow ring */}
        <motion.div
          style={{
            position: 'absolute',
            inset: '-40px',
            borderRadius: '50%',
            border: '1px solid rgba(78, 205, 196, 0.04)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.05, 0.2],
          }}
          transition={{
            duration: 8,
            ease: [0.37, 0, 0.63, 1],
            repeat: Infinity,
            delay: 2,
          }}
        />

        {/* Core circle */}
        <div
          style={{
            width: 'clamp(100px, 25vw, 160px)',
            height: 'clamp(100px, 25vw, 160px)',
            borderRadius: '50%',
            border: '1.5px solid rgba(78, 205, 196, 0.3)',
            boxShadow: `
              0 0 30px rgba(78, 205, 196, 0.08),
              inset 0 0 30px rgba(78, 205, 196, 0.03)
            `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Inner dot */}
          <motion.div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: 'rgba(78, 205, 196, 0.5)',
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4,
              ease: [0.37, 0, 0.63, 1],
              repeat: Infinity,
            }}
          />
        </div>
      </motion.div>

      {/* Entry text */}
      <motion.p
        className="sacred-text mt-12"
        style={{
          fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          color: 'var(--parchment-ghost)',
          letterSpacing: '0.15em',
          textTransform: 'lowercase',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0.3] }}
        transition={{
          duration: 6,
          delay: 3,
          ease: [0.37, 0, 0.63, 1],
        }}
      >
        enter the stillness
      </motion.p>

      {/* Headphone hint */}
      <motion.p
        style={{
          position: 'absolute',
          bottom: 'clamp(2rem, 6vh, 4rem)',
          fontSize: '0.7rem',
          color: 'rgba(245, 240, 232, 0.1)',
          letterSpacing: '0.1em',
          fontFamily: 'var(--font-body)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 4, delay: 6 }}
      >
        ♪ headphones recommended
      </motion.p>
    </motion.div>
  );
}
