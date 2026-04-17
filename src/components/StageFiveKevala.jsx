import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceover } from '../hooks/useVoiceover';
import CosmicBackground from './CosmicBackground';
import PresenceField from './PresenceField';

/**
 * StageFiveKevala — The State of Aloneness / Liberation
 * Days 90+
 * 
 * The destination. No more daily locks. No more stages.
 * Just the eternal present.
 */

export default function StageFiveKevala() {
  const [phase, setPhase] = useState('arrival'); // arrival, stateless, presence
  const { playVoice } = useVoiceover();

  useEffect(() => {
    // Stage 5 audio sequence
    if (phase === 'arrival') {
      playVoice('/audio/voice/kevala-arrival.mp3');
      const timer = setTimeout(() => setPhase('stateless'), 8000);
      return () => clearTimeout(timer);
    }
    if (phase === 'stateless') {
      playVoice('/audio/voice/kevala-stateless.mp3');
      const timer = setTimeout(() => setPhase('presence'), 10000);
      return () => clearTimeout(timer);
    }
    if (phase === 'presence') {
       playVoice('/audio/voice/kevala-sakshi-eternal.mp3');
    }
  }, [phase]);

  return (
    <motion.div 
      className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 10, ease: [0.22, 1, 0.36, 1] }}
    >
      <CosmicBackground intensity={0.1} />
      
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          {phase === 'presence' && (
            <motion.div
              key="eternal-light"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 15, ease: "easeOut" }}
              className="absolute pointer-events-none"
            >
              <div 
                className="w-[1px] h-[40vh] bg-gradient-to-b from-transparent via-gold/20 to-transparent"
              />
            </motion.div>
          )}

          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="max-w-xl"
          >
            {phase === 'arrival' && (
              <p className="font-display text-2xl md:text-3xl text-parchment/40 italic tracking-wide leading-relaxed">
                The journey and the journal were just scaffolds.
              </p>
            )}
            
            {phase === 'stateless' && (
              <div className="space-y-8">
                <p className="font-display text-4xl md:text-5xl text-gold/60 font-light tracking-[0.3em] uppercase">
                  KEVALA.
                </p>
                <p className="font-body text-sm text-parchment/30 tracking-[0.2em] uppercase leading-loose">
                  Alone. Whole. Infinite.<br/>
                  The mirror is now the light.
                </p>
              </div>
            )}

            {phase === 'presence' && (
              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 10 }}
                >
                  <PresenceField scale={1.5} opacity={0.3} />
                </motion.div>
                <p className="font-body text-xs text-parchment/20 tracking-[0.5em] uppercase mt-24">
                  Be the Witness in every breath.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Persistent Subtle Branding */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 20, duration: 10 }}
      >
        <span className="font-display text-lg tracking-[1em] text-parchment">SHUNYA</span>
      </motion.div>
    </motion.div>
  );
}
