import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useJourney } from '../hooks/useJourney';
import { useVoiceover } from '../hooks/useVoiceover';
import StoryEngine from './StoryEngine';
import SilenceGap from './SilenceGap';

const SVAPNA_CONTENT = {
  8: [
    { text: "You have sat in the cosmic silence for seven days. The mind attempted to fill the void, as it always does.", audio: "/audio/voice/svapna-day8-1.mp3" },
    { text: "The void was never empty. It is pregnant with the beginning of all things.", audio: "/audio/voice/svapna-day8-2.mp3" },
    { text: "For the next fourteen days, we slow down further. The discomfort you feel in silence is simply withdrawal.", audio: "/audio/voice/svapna-day8-3.mp3" }
  ],
  9: [
    { text: "Awareness is not something you do. It is what you are.", audio: "/audio/voice/svapna-day9-1.mp3" },
    { text: "The 'I' that is tired is just a thought being observed by the 'I' that is forever awake. Watch the fatigue as if it were a cloud passing over a mountain peak.", audio: "/audio/voice/svapna-day9-2.mp3" }
  ],
  10: [
    { text: "Your brain is starving for the noise it used to have. The dopamine ghost is calling.", audio: "/audio/voice/svapna-day10-1.mp3" },
    { text: "Do not feed it. Sit with the hunger. The hunger is the work.", audio: "/audio/voice/svapna-day10-2.mp3" }
  ],
  11: [
    { text: "Thoughts are like guests. Let them come, let them go. But do not serve them tea.", audio: "/audio/voice/svapna-day11-1.mp3" },
    { text: "You are the house. The guests do not change the architecture of the host.", audio: "/audio/voice/svapna-day11-2.mp3" }
  ],
  12: [
    { text: "The gap between your inhale and exhale. That is Shunya.", audio: "/audio/voice/svapna-day12-1.mp3" },
    { text: "Notice that small pause. That which is still in the pause, is always still.", audio: "/audio/voice/svapna-day12-2.mp3" }
  ],
  13: [
    { text: "Resistance is not an obstacle. It is the compass.", audio: "/audio/voice/svapna-day13-1.mp3" },
    { text: "The part of you that wants to quit is the part that is being transformed.", audio: "/audio/voice/svapna-day13-2.mp3" }
  ],
  14: [
    { text: "Boredom is the last defense of the ego. It wants you to do something, anything, to avoid being.", audio: "/audio/voice/svapna-day14-1.mp3" },
    { text: "Be bored deeply. Be bored until boredom itself becomes interesting.", audio: "/audio/voice/svapna-day14-2.mp3" }
  ],
  15: [
    { text: "You have walked halfway through the gateway of dreams.", audio: "/audio/voice/svapna-day15-1.mp3" },
    { text: "Recall your first day. The noise has not changed, but your relationship to it has.", audio: "/audio/voice/svapna-day15-2.mp3" }
  ],
  16: [
    { text: "There is a voice in your head that never stops talking. It is narrating your life to you.", audio: "/audio/voice/svapna-day16-1.mp3" },
    { text: "Stop. Notice that you are the one hearing it. You are not the narrator.", audio: "/audio/voice/svapna-day16-2.mp3" }
  ],
  17: [
    { text: "The body is a collection of sensations. A cloud of points in the dark.", audio: "/audio/voice/svapna-day17-1.mp3" },
    { text: "Where exactly does 'you' begin? Investigate the edges of your skin.", audio: "/audio/voice/svapna-day17-2.mp3" }
  ],
  18: [
    { text: "Sound is just vibration. Meaning is a layer you add later.", audio: "/audio/voice/svapna-day18-1.mp3" },
    { text: "Strip the meaning. Hear the world as raw resonance.", audio: "/audio/voice/svapna-day18-2.mp3" }
  ],
  19: [
    { text: "The silence is getting louder. Do not try to quiet the mind.", audio: "/audio/voice/svapna-day19-1.mp3" },
    { text: "Trying to quiet the mind is like trying to flatten ripples with a flat iron. Just step away from the pool.", audio: "/audio/voice/svapna-day19-2.mp3" }
  ],
  20: [
    { text: "Tomorrow we enter Sushupti. Deep sleep while awake.", audio: "/audio/voice/svapna-day20-1.mp3" },
    { text: "Prepare to drop even the observer. Prepare for the absence of presence.", audio: "/audio/voice/svapna-day20-2.mp3" }
  ],
  21: [
    { text: "Twenty-one days of witnessing. You are no longer the one who walked in.", audio: "/audio/voice/svapna-day21-1.mp3" },
    { text: "The door is open. Walk into the deep sleep.", audio: "/audio/voice/svapna-day21-2.mp3" }
  ],
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
