import { motion } from 'framer-motion';

/**
 * ShunyaCircle — The Core Visual Motif
 * 
 * Shunya = zero = ○
 * 
 * A bioluminescent teal ring that breathes with the universal rhythm.
 * Multiple layered rings with staggered timing create cosmic depth.
 * This is the visual heartbeat of the entire application.
 * 
 * "The void containing infinite potential."
 */
export default function ShunyaCircle({
  size = 'clamp(120px, 30vw, 200px)',
  intensity = 1,
  showInner = true,
  className = '',
}) {
  const baseOpacity = 0.25 * intensity;
  const glowOpacity = 0.1 * intensity;

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.5 }}
      transition={{
        duration: 3,
        ease: [0.37, 0, 0.63, 1],
      }}
    >
      {/* Outermost ring — slowest breath */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-30%',
          borderRadius: '50%',
          border: `1px solid rgba(78, 205, 196, ${baseOpacity * 0.3})`,
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.05, 0.15],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 24,
          ease: 'linear',
          repeat: Infinity,
        }}
      />

      {/* Middle ring */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-15%',
          borderRadius: '50%',
          border: `1px solid rgba(78, 205, 196, ${baseOpacity * 0.5})`,
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.08, 0.2],
        }}
        transition={{
          duration: 8,
          ease: [0.37, 0, 0.63, 1],
          repeat: Infinity,
          delay: 1,
        }}
      />

      {/* Primary ring — the circle itself */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `1.5px solid rgba(78, 205, 196, ${baseOpacity})`,
          boxShadow: `
            0 0 20px rgba(78, 205, 196, ${glowOpacity}),
            0 0 60px rgba(78, 205, 196, ${glowOpacity * 0.5}),
            inset 0 0 20px rgba(78, 205, 196, ${glowOpacity * 0.3})
          `,
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 8,
          ease: [0.37, 0, 0.63, 1],
          repeat: Infinity,
        }}
      />

      {/* Center presence — the witness point */}
      {showInner && (
        <motion.div
          style={{
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            backgroundColor: `rgba(78, 205, 196, ${baseOpacity * 2})`,
            boxShadow: `0 0 10px rgba(78, 205, 196, ${glowOpacity})`,
          }}
          animate={{
            opacity: [0.3, 0.9, 0.3],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: 4,
            ease: [0.37, 0, 0.63, 1],
            repeat: Infinity,
          }}
        />
      )}

      {/* Pulse rings — occasional expanding rings */}
      <PulseRing delay={0} baseOpacity={baseOpacity} />
      <PulseRing delay={4} baseOpacity={baseOpacity} />
    </motion.div>
  );
}

/**
 * PulseRing — Expanding ring that fades out
 * Like a stone dropped in still water.
 */
function PulseRing({ delay, baseOpacity }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        border: `1px solid rgba(78, 205, 196, ${baseOpacity * 0.4})`,
      }}
      animate={{
        scale: [1, 2.5],
        opacity: [baseOpacity * 0.4, 0],
      }}
      transition={{
        duration: 8,
        ease: [0.37, 0, 0.63, 1],
        repeat: Infinity,
        delay,
      }}
    />
  );
}
