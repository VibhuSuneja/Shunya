import { useEffect } from 'react';
import { motion } from 'framer-motion';
import ShunyaCircle from './ShunyaCircle';
import { useVoiceover } from '../hooks/useVoiceover';

export default function DailyLock() {
  const { playVoice } = useVoiceover();

  useEffect(() => {
    // Play a gentle reminder that they must wait
    playVoice('/audio/voice/lockout-wait.mp3');
  }, [playVoice]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 4, ease: [0.37, 0, 0.63, 1] }}
      className="flex flex-col items-center justify-center space-y-12 text-center p-8"
    >
      <div className="relative">
         <ShunyaCircle size="120px" intensity={0.5} />
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-2x tracking-[0.2em] text-parchment/70 uppercase">
          Integration in Progress
        </h2>
        <p className="font-body text-parchment/40 max-w-md leading-relaxed">
          The sun has not yet set on today's stillness.<br />
          The ritual requires the passage of time to settle into the marrow.
        </p>
      </div>

      <p className="font-display text-sm tracking-[0.3em] text-parchment/20 uppercase pt-12">
        Return Tomorrow
      </p>
    </motion.div>
  );
}
