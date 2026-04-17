import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../hooks/useJourney';
import { useVoiceover } from '../hooks/useVoiceover';
import CosmicBackground from './CosmicBackground';
import PresenceField from './PresenceField';
import ResonanceFeed from './ResonanceFeed';
import ObservationShare from './ObservationShare';
import SilenceGap from './SilenceGap';

/**
 * StageFourTuriya — The Fourth State / The Community Mirror
 * Days 46–90
 *
 * "You are not alone in this."
 *
 * No comments. No likes. No followers.
 * Only resonance — a gentle pulse meaning "I felt this too."
 * Responses take 24 hours minimum. Intentional friction.
 *
 * Phases per session:
 * 1. ARRIVAL     — Brief arrival with presence field
 * 2. FEED        — Read one inner observation from the community
 * 3. SILENCE     — 45s silence before you can respond
 * 4. SHARE       — Option to share your own inner observation (or not)
 * 5. DONE        — Integration
 */

const PHASES = {
  ARRIVAL: 'arrival',
  FEED: 'feed',
  SILENCE: 'silence',
  SHARE: 'share',
  DONE: 'done',
};

export default function StageFourTuriya({ day }) {
  const [phase, setPhase] = useState(PHASES.ARRIVAL);
  const { completeDay, advanceStage } = useJourney();
  const { playVoice } = useVoiceover();

  const isDevMode = new URLSearchParams(window.location.search).get('dev') === 'true';
  const SILENCE_DURATION = isDevMode ? 8 : 45;

  useEffect(() => {
    if (phase === PHASES.ARRIVAL) {
      const timer = setTimeout(() => setPhase(PHASES.FEED), 4000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleFeedComplete = () => setPhase(PHASES.SILENCE);
  const handleSilenceComplete = () => setPhase(PHASES.SHARE);

  const handleShareComplete = () => {
    if (day >= 90) {
      advanceStage(5); // Graduation
    } else {
      completeDay(day);
    }
    setPhase(PHASES.DONE);
  };

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 5, ease: [0.37, 0, 0.63, 1] }}
    >
      <CosmicBackground />

      {/* Stage label */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 4, delay: 2 }}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.65rem',
          color: 'var(--parchment)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
        }}
      >
        Stage IV · Turiya · Day {day}
      </motion.div>

      {/* Presence field — persists through feed and silence */}
      <AnimatePresence>
        {(phase === PHASES.ARRIVAL || phase === PHASES.FEED || phase === PHASES.SILENCE) && (
          <PresenceField key="presence-turiya" />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">

          {phase === PHASES.ARRIVAL && (
            <motion.div
              key="turiya-arrival"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3 }}
            >
              <motion.p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                  color: 'rgba(245, 240, 232, 0.3)',
                  letterSpacing: '0.1em',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 3 }}
              >
                others have been sitting too
              </motion.p>
            </motion.div>
          )}

          {phase === PHASES.FEED && (
            <ResonanceFeed key="feed" day={day} onComplete={handleFeedComplete} />
          )}

          {phase === PHASES.SILENCE && (
            <motion.div
              key="turiya-silence"
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3 }}
            >
              <SilenceGap durationSeconds={SILENCE_DURATION} onComplete={handleSilenceComplete} />
              <motion.p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontStyle: 'italic',
                  fontSize: '0.75rem',
                  color: 'rgba(245, 240, 232, 0.1)',
                  letterSpacing: '0.15em',
                  marginTop: '55vh',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5, duration: 4 }}
              >
                let it settle
              </motion.p>
            </motion.div>
          )}

          {phase === PHASES.SHARE && (
            <ObservationShare key="share" day={day} onComplete={handleShareComplete} />
          )}

          {phase === PHASES.DONE && (
            <motion.div
              key="turiya-done"
              className="text-center space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 5 }}
            >
              <motion.p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                  fontWeight: 300,
                  color: 'rgba(245, 240, 232, 0.75)',
                  letterSpacing: '0.1em',
                }}
              >
                The mirror held.
              </motion.p>
              <motion.p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  color: 'rgba(245, 240, 232, 0.25)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 3 }}
              >
                {day >= 90 ? 'Your Sakshi is complete.' : `Return tomorrow · Day ${day + 1}`}
              </motion.p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}
