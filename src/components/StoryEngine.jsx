import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceover } from '../hooks/useVoiceover';

export default function StoryEngine({ paragraphs, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { playVoice } = useVoiceover();

  // Play audio for the initial paragraph on mount, and then for subsequent paragraphs
  useEffect(() => {
    if (currentIndex < paragraphs.length) {
      const currentContent = paragraphs[currentIndex];
      
      // If the paragraph has a specific audio file assigned, play it.
      // E.g., currentContent.audio = '/audio/voice/day8-1.mp3'
      if (currentContent?.audio) {
        playVoice(currentContent.audio);
      }

      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 8000);
      
      return () => clearTimeout(timer);
    } else {
      // Finished all paragraphs, wait a bit then complete
      const finishTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 5000);
      return () => clearTimeout(finishTimer);
    }
  }, [currentIndex, paragraphs, playVoice, onComplete]);

  return (
    <div className="max-w-2xl w-full flex flex-col space-y-12 items-center justify-center pointer-events-none">
      <AnimatePresence>
        {paragraphs.slice(0, currentIndex + 1).map((content, idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 4, ease: [0.37, 0, 0.63, 1] }}
            className="font-body text-xl md:text-2xl text-parchment/80 leading-relaxed text-center"
          >
            {content.text || content}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
}
