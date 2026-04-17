import { useEffect } from 'react';
import { motion } from 'framer-motion';
import ShunyaCircle from './ShunyaCircle';

export default function SilenceGap({ durationSeconds = 30, onComplete }) {
  
  // URL Params for dev mode
  const isDevMode = new URLSearchParams(window.location.search).get('dev') === 'true';
  const durationMs = isDevMode ? 5000 : durationSeconds * 1000;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 4 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      {/* 
        Just a very faint circle in the void, providing a subtle anchor
        so the user knows the app is still alive, deliberately offering no interaction.
      */}
      <ShunyaCircle />
    </motion.div>
  );
}
