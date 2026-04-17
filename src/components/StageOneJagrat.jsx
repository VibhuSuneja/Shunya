import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../hooks/useJourney';
import { useVoiceover } from '../hooks/useVoiceover';
import SacredText from './SacredText';
import CosmicBackground from './CosmicBackground';

const QUESTIONS = [
  { text: "If you disappeared right now — what would actually be lost?", audio: "/audio/voice/jagrat-q1.mp3" },
  { text: "Who were you before you had a name?", audio: "/audio/voice/jagrat-q2.mp3" },
  { text: "Are you breathing, or are you being breathed?", audio: "/audio/voice/jagrat-q3.mp3" },
  { text: "What is the space between your thoughts?", audio: "/audio/voice/jagrat-q4.mp3" }
];

export default function StageOneJagrat({ day }) {
  const [content, setContent] = useState(null);
  const [phase, setPhase] = useState('question'); // 'question', 'done'
  const { completeDay, advanceStage } = useJourney();
  const { playVoice } = useVoiceover();

  useEffect(() => {
    // Select a random question content for the session
    const randomContent = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    setContent(randomContent);
    
    // Play the voiceover for the question
    if (randomContent.audio) {
      playVoice(randomContent.audio);
    }
  }, [playVoice]);

  const handleComplete = () => {
    // Play completion voice
    playVoice('/audio/voice/jagrat-day-integrated.mp3');

    // Stage 1 is Days 1-7. 
    // If they complete day 7, they should advance to Stage 2.
    if (day >= 7) {
      advanceStage(2);
    } else {
      completeDay(day);
    }
    setPhase('done');
  };

  return (
    <motion.div 
      className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 4, ease: [0.37, 0, 0.63, 1] }}
    >
      <CosmicBackground />
      
      <div className="z-10 relative max-w-2xl px-4 flex flex-col items-center space-y-16">
        <AnimatePresence mode="wait">
          {phase === 'question' && (
            <motion.div 
              key="q-container"
              className="flex flex-col items-center space-y-16"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 2 }}
            >
              {content && <SacredText key="jagrat-q" text={content.text} delay={2} />}
              
              <motion.button
                onClick={handleComplete}
                className="font-display text-xs tracking-[0.4em] uppercase text-parchment/30 hover:text-parchment/80 transition-colors duration-1000 cursor-pointer pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 8, duration: 3 }}
              >
                Sink into Stillness
              </motion.button>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div 
              key="done-msg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 4 }}
              className="space-y-4"
            >
              <p className="font-display text-2xl text-parchment/80 tracking-widest uppercase">
                Day {day} Integrated.
              </p>
              <p className="font-body text-sm text-parchment/40 tracking-[0.2em] uppercase">
                Return tomorrow to continue the Sakshi.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {phase === 'question' && (
        <motion.div 
          className="absolute bottom-12 text-[var(--parchment)] opacity-30 text-xs sm:text-sm tracking-[0.3em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 10, duration: 4 }}
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Stage 1 • Jagrat • Day {day}
        </motion.div>
      )}
    </motion.div>
  );
}
