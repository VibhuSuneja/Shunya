import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useJourney } from '../hooks/useJourney';
import { useVoiceover } from '../hooks/useVoiceover';
import StoryEngine from './StoryEngine';
import SilenceGap from './SilenceGap';

const SVAPNA_CONTENT = {
  8: [
    { text: "You have sat in the cosmic silence for seven days.", audio: "/audio/voice/svapna-day8-1.mp3" },
    { text: "The mind attempted to fill the void, as it always does.", audio: "/audio/voice/svapna-day8-2.mp3" },
    { text: "The void was never empty. It is pregnant with the beginning of all things.", audio: "/audio/voice/svapna-day8-3.mp3" },
    { text: "For the next fourteen days, we slow down further. The discomfort you feel in silence is simply withdrawal.", audio: "/audio/voice/svapna-day8-4.mp3" }
  ],
  9: [
    { text: "Awareness is not something you do. It is what you are.", audio: "" },
    { text: "The 'I' that is tired is just a thought being observed by the 'I' that is forever awake.", audio: "" },
    { text: "Watch the fatigue as if it were a cloud passing over a mountain peak.", audio: "" }
  ],
  // More days can be added here following the same structure
};

export default function StageTwoSvapna({ day, onComplete }) {
  const [phase, setPhase] = useState('story'); // 'story', 'silence', 'done'
  const { completeDay } = useJourney();
  const { playVoice } = useVoiceover();

  // If we don't have content for this specific day yet, fallback to a default or loop
  const currentStories = SVAPNA_CONTENT[day] || SVAPNA_CONTENT[8];

  const handleStoryComplete = () => {
    setPhase('silence');
  };

  const handleSilenceComplete = () => {
    playVoice('/audio/voice/svapna-day-integrated.mp3');
    
    // If it's the last day of Svapna, move to Stage 3
    if (day >= 21) {
      if (onComplete) onComplete();
    } else {
      completeDay(day); // Marks today as finished
    }
    
    setPhase('done');
  };


  return (
    <div className="w-full h-full relative flex items-center justify-center p-8 z-20">
      <AnimatePresence mode="wait">
        {phase === 'story' && (
          <motion.div key="story-container" className="w-full h-full flex items-center justify-center">
            <StoryEngine 
              paragraphs={currentStories} 
              onComplete={handleStoryComplete} 
            />
          </motion.div>
        )}
        
        {phase === 'silence' && (
          <SilenceGap 
            key="silence-gap" 
            durationSeconds={30} 
            onComplete={handleSilenceComplete} 
          />
        )}

        {phase === 'done' && (
          <motion.div 
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 4 }}
            className="text-center"
          >
            <p className="font-display text-2xl text-parchment/80 tracking-widest uppercase mb-4">
              Stillness Witnessed.
            </p>
            <p className="font-body text-sm text-parchment/40 tracking-[0.2em] uppercase">
              Return tomorrow for Day {day + 1}.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
