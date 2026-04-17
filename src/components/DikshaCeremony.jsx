import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceover } from '../hooks/useVoiceover';
import SacredText from './SacredText';
import ShunyaCircle from './ShunyaCircle';

/**
 * DikshaCeremony — The Final Revelation
 * 
 * "Yes. That was you."
 * 
 * After the user makes their choice — whatever it was —
 * the same sacred truth is revealed:
 * 
 * The observer IS the observed.
 * The question IS the answer.
 * 
 * Then: the Shunya circle expands to fill the screen,
 * the void transforms to cosmic indigo,
 * and the Diksha (sacred initiation) is complete.
 */
export default function DikshaCeremony({ choice, onComplete }) {
  const [phase, setPhase] = useState('revelation'); // revelation → expansion → arrival
  const { playVoice } = useVoiceover();

  // Voiceover triggers for the ceremony
  useEffect(() => {
    if (phase === 'revelation') {
      playVoice('/audio/voice/ob-yes-that-was-you.mp3');
    } else if (phase === 'arrival') {
      // Small timeout so the audio hits perfectly when "Your Sakshi begins" fades in alongside the Sanskrit title
      setTimeout(() => {
        playVoice('/audio/voice/ob-shunya-sakshi-begins.mp3');
      }, 1500);
    }
  }, [phase, playVoice]);

  // Phase timing
  useEffect(() => {
    let mounted = true;
    const timers = [
      setTimeout(() => mounted && setPhase('expansion'), 6000),
      setTimeout(() => mounted && setPhase('arrival'), 10000),
      setTimeout(() => mounted && onComplete?.(), 15000),
    ];

    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'var(--void-black)',
      }}
      animate={{
        background: phase === 'arrival'
          ? 'linear-gradient(180deg, #0f0f2a 0%, #1a1a3e 50%, #0f0f2a 100%)'
          : '#050508',
      }}
      transition={{ duration: 4, ease: [0.37, 0, 0.63, 1] }}
    >
      <div className="starfield" />

      <AnimatePresence mode="wait">
        {/* Phase 1: Revelation */}
        {phase === 'revelation' && (
          <motion.div
            key="revelation"
            className="flex flex-col items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: [0.37, 0, 0.63, 1] }}
          >
            <SacredText
              text="Yes. That was you."
              italic
              fontSize="clamp(1.5rem, 4.5vw, 2.8rem)"
              delay={0.5}
            />
          </motion.div>
        )}

        {/* Phase 2: Circle Expansion */}
        {phase === 'expansion' && (
          <motion.div
            key="expansion"
            className="flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: [0.37, 0, 0.63, 1] }}
          >
            <motion.div
              animate={{
                scale: [1, 12],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 5,
                ease: [0.37, 0, 0.63, 1],
              }}
            >
              <ShunyaCircle size="clamp(120px, 30vw, 200px)" intensity={1.5} />
            </motion.div>
          </motion.div>
        )}

        {/* Phase 3: Arrival */}
        {phase === 'arrival' && (
          <motion.div
            key="arrival"
            className="flex flex-col items-center justify-center gap-8 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, ease: [0.37, 0, 0.63, 1] }}
          >
            {/* Sanskrit title */}
            <motion.h1
              className="sacred-text"
              style={{
                fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                fontWeight: 300,
                color: 'var(--parchment)',
                textShadow: '0 0 60px rgba(78, 205, 196, 0.15)',
                letterSpacing: '0.08em',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, delay: 0.5, ease: [0.37, 0, 0.63, 1] }}
            >
              शून्य
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="sacred-text-emphasis"
              style={{
                fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
                color: 'var(--parchment-dim)',
                letterSpacing: '0.12em',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 2, delay: 1.5, ease: [0.37, 0, 0.63, 1] }}
            >
              Your Sakshi begins.
            </motion.p>

            {/* New Shunya circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3, delay: 2, ease: [0.37, 0, 0.63, 1] }}
            >
              <ShunyaCircle size="clamp(60px, 15vw, 100px)" intensity={0.8} />
            </motion.div>

            {/* Stage 1 begins text */}
            <motion.p
              style={{
                position: 'absolute',
                bottom: 'clamp(2rem, 5vh, 3rem)',
                fontSize: '0.7rem',
                color: 'rgba(245, 240, 232, 0.12)',
                letterSpacing: '0.15em',
                fontFamily: 'var(--font-body)',
                textTransform: 'uppercase',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 3, delay: 4 }}
            >
              stage i — jagrat — begins
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
