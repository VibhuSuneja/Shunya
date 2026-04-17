import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../hooks/useJourney';
import { useVoiceover } from '../hooks/useVoiceover';
import ShunyaCircle from './ShunyaCircle';
import CosmicBackground from './CosmicBackground';
import ObserverInquiry from './ObserverInquiry';
import PresenceField from './PresenceField';
import SilenceGap from './SilenceGap';

/**
 * StageThreeSushupti — Deep Sleep / The Observer
 * Days 22–45
 *
 * First real contact with Sakshi — the witness.
 * "Right now — are you the thought or the one watching the thought?"
 *
 * Three sub-phases per session:
 * 1. ARRIVAL    — Shunya circle + collective presence field appears
 * 2. INQUIRY    — Observer question, no answer expected, just noticing
 * 3. SILENCE    — Longer silence gap (60s) for actual witnessing
 * 4. REFLECTION — A single sentence that lands after the silence
 * 5. DONE       — Day integrated
 */

const SUSHUPTI_CONTENT = {
  // Days 22–28: First week — introducing the observer concept
  22: {
    inquiry: "Right now — are you the thought or the one watching the thought?",
    reflection: "The one who noticed the thought... was never the thought.",
    audio: { inquiry: "/audio/voice/sushupti-22-inquiry.mp3", reflection: "/audio/voice/sushupti-22-reflection.mp3" }
  },
  23: {
    inquiry: "When you feel anxious — who is aware of the anxiety?",
    reflection: "Awareness itself is never anxious. It simply holds.",
    audio: { inquiry: "/audio/voice/sushupti-23-inquiry.mp3", reflection: "/audio/voice/sushupti-23-reflection.mp3" }
  },
  24: {
    inquiry: "Can the eye see itself? Can the mind know itself directly?",
    reflection: "The Knower cannot be the known. And yet — it knows.",
    audio: { inquiry: "/audio/voice/sushupti-24-inquiry.mp3", reflection: "/audio/voice/sushupti-24-reflection.mp3" }
  },
  25: {
    inquiry: "Where do your thoughts come from — and where do they go?",
    reflection: "Between each thought — a gap. That gap is what you are.",
    audio: { inquiry: "/audio/voice/sushupti-25-inquiry.mp3", reflection: "/audio/voice/sushupti-25-reflection.mp3" }
  },
  26: {
    inquiry: "Are you having an experience, or are you the space in which experience happens?",
    reflection: "The screen does not become the movie. Yet without it — no movie.",
    audio: { inquiry: "/audio/voice/sushupti-26-inquiry.mp3", reflection: "/audio/voice/sushupti-26-reflection.mp3" }
  },
  27: {
    inquiry: "When you sleep deeply — no thoughts, no self. Who sleeps?",
    reflection: "Something persists through all three states. Ramana called it the I-I.",
    audio: { inquiry: "/audio/voice/sushupti-27-inquiry.mp3", reflection: "/audio/voice/sushupti-27-reflection.mp3" }
  },
  28: {
    inquiry: "If you lost all your memories tonight — would you still exist?",
    reflection: "Existence does not depend on the story of the one who exists.",
    audio: { inquiry: "/audio/voice/sushupti-28-inquiry.mp3", reflection: "/audio/voice/sushupti-28-reflection.mp3" }
  },
  // Days 29–35: Second week — deepening into Advaita
  29: {
    inquiry: "The Gita says you are neither the body nor the mind. Then — what are you?",
    reflection: "That which cannot be cut by weapons, burned by fire, or drowned by water.",
    audio: { inquiry: "/audio/voice/sushupti-29-inquiry.mp3", reflection: "/audio/voice/sushupti-29-reflection.mp3" }
  },
  30: {
    inquiry: "You have been breathing all day without trying. Who breathes?",
    reflection: "The universe breathes through what you call yourself. You are the breath.",
    audio: { inquiry: "/audio/voice/sushupti-30-inquiry.mp3", reflection: "/audio/voice/sushupti-30-reflection.mp3" }
  },
  31: {
    inquiry: "In this moment — are you reading, or is reading happening through you?",
    reflection: "The river does not flow. Flow is what the river is.",
    audio: { inquiry: "/audio/voice/sushupti-31-inquiry.mp3", reflection: "/audio/voice/sushupti-31-reflection.mp3" }
  },
  32: {
    inquiry: "Buddha said there is no fixed self. Ramana said there is only Self. Are they contradicting?",
    reflection: "The fixed 'me' is empty. The vast 'I AM' is everything. Both are pointing at the same truth.",
    audio: { inquiry: "/audio/voice/sushupti-32-inquiry.mp3", reflection: "/audio/voice/sushupti-32-reflection.mp3" }
  },
  33: {
    inquiry: "When you say 'I am tired' — which part is tired? Is the 'I' also tired?",
    reflection: "The witness is never tired. It simply witnesses tiredness, as the sun witnesses clouds.",
    audio: { inquiry: "/audio/voice/sushupti-33-inquiry.mp3", reflection: "/audio/voice/sushupti-33-reflection.mp3" }
  },
  34: {
    inquiry: "What if the sense of being a separate self is itself just another thought being observed?",
    reflection: "The cage is made of the same light as the bird. Look closely.",
    audio: { inquiry: "/audio/voice/sushupti-34-inquiry.mp3", reflection: "/audio/voice/sushupti-34-reflection.mp3" }
  },
  35: {
    inquiry: "Can you find the boundary where 'you' end and the rest of the world begins?",
    reflection: "The skin is a meeting point — not a wall. You are more porous than you think.",
    audio: { inquiry: "/audio/voice/sushupti-35-inquiry.mp3", reflection: "/audio/voice/sushupti-35-reflection.mp3" }
  },
  // Days 36–45: Third week — the observer stabilizing
  36: {
    inquiry: "Right now — notice the noticing. Who notices the noticer?",
    reflection: "The regression stops. The final noticer is not an object. It is the subject itself.",
    audio: { inquiry: "/audio/voice/sushupti-36-inquiry.mp3", reflection: "/audio/voice/sushupti-36-reflection.mp3" }
  },
  37: {
    inquiry: "The universe is 13.8 billion years old. You are made of its matter. How old are you — really?",
    reflection: "Your atoms have been stars. Stars have been your atoms. The universe is experiencing itself through you.",
    audio: { inquiry: "/audio/voice/sushupti-37-inquiry.mp3", reflection: "/audio/voice/sushupti-37-reflection.mp3" }
  },
  38: {
    inquiry: "When you are in deep flow — who is there?",
    reflection: "Flow is what happens when the separate self dissolves into the doing. That is Sakshi in action.",
    audio: { inquiry: "/audio/voice/sushupti-38-inquiry.mp3", reflection: "/audio/voice/sushupti-38-reflection.mp3" }
  },
  39: {
    inquiry: "If all your thoughts are objects in awareness — what is awareness itself?",
    reflection: "Awareness has no shape, no color, no weight. And yet it is the most intimate thing you know.",
    audio: { inquiry: "/audio/voice/sushupti-39-inquiry.mp3", reflection: "/audio/voice/sushupti-39-reflection.mp3" }
  },
  40: {
    inquiry: "Is there a single moment — right now — when you are not aware?",
    reflection: "Awareness is the one constant. Even in the awareness of sleep — awareness persists.",
    audio: { inquiry: "/audio/voice/sushupti-40-inquiry.mp3", reflection: "/audio/voice/sushupti-40-reflection.mp3" }
  },
};

// Fallback for unlisted days — cycles through core questions
const FALLBACK_CONTENT = [
  {
    inquiry: "Right now — are you the thought or the one watching the thought?",
    reflection: "The one who noticed the thought... was never the thought.",
    audio: { inquiry: "", reflection: "" }
  },
  {
    inquiry: "Can you notice the space between this word and the next?",
    reflection: "That space is where you actually live.",
    audio: { inquiry: "", reflection: "" }
  },
  {
    inquiry: "What remains when you subtract every thought you have about yourself?",
    reflection: "What remains — is what you are.",
    audio: { inquiry: "", reflection: "" }
  }
];

const PHASES = {
  ARRIVAL: 'arrival',
  INQUIRY: 'inquiry',
  SILENCE: 'silence',
  REFLECTION: 'reflection',
  DONE: 'done',
};

export default function StageThreeSushupti({ day }) {
  const [phase, setPhase] = useState(PHASES.ARRIVAL);
  const { completeDay, advanceStage } = useJourney();
  const { playVoice } = useVoiceover();

  const isDevMode = new URLSearchParams(window.location.search).get('dev') === 'true';
  const SILENCE_DURATION = isDevMode ? 8 : 60; // 8s dev / 60s real

  // Get content for this day
  const content = SUSHUPTI_CONTENT[day]
    || FALLBACK_CONTENT[day % FALLBACK_CONTENT.length];

  // Phase orchestration
  useEffect(() => {
    let timer;

    if (phase === PHASES.ARRIVAL) {
      // Let the presence field breathe for 5 seconds before inquiry
      timer = setTimeout(() => setPhase(PHASES.INQUIRY), 5000);
    }

    if (phase === PHASES.REFLECTION) {
      if (content.audio?.reflection) playVoice(content.audio.reflection);
      // After reflection lands — wait, then done
      timer = setTimeout(() => {
        const isLastDay = day >= 45;
        if (isLastDay) {
          advanceStage(4); // Move to Stage 4 — Turiya
        } else {
          completeDay(day);
        }
        setPhase(PHASES.DONE);
      }, 12000);
    }

    return () => clearTimeout(timer);
  }, [phase]);

  const handleInquiryComplete = () => {
    setPhase(PHASES.SILENCE);
  };

  const handleSilenceComplete = () => {
    setPhase(PHASES.REFLECTION);
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
      <AnimatePresence>
        {phase !== PHASES.DONE && (
          <motion.div
            className="absolute top-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, delay: 3 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.65rem',
              color: 'var(--parchment)',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            Stage III · Sushupti · Day {day}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Central Shunya Circle — always present */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-30">
        <ShunyaCircle size="clamp(200px, 50vw, 360px)" intensity={0.6} />
      </div>

      {/* Presence Field — collective awareness indicator */}
      <AnimatePresence>
        {(phase === PHASES.ARRIVAL || phase === PHASES.INQUIRY) && (
          <PresenceField key="presence" />
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">

          {/* Arrival — breathe with the circle */}
          {phase === PHASES.ARRIVAL && (
            <motion.div
              key="arrival"
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
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  color: 'rgba(245, 240, 232, 0.25)',
                  letterSpacing: '0.15em',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 3 }}
              >
                enter the witness
              </motion.p>
            </motion.div>
          )}

          {/* Inquiry — the observer question */}
          {phase === PHASES.INQUIRY && (
            <ObserverInquiry
              key="inquiry"
              text={content.inquiry}
              audio={content.audio?.inquiry}
              onComplete={handleInquiryComplete}
            />
          )}

          {/* Silence — pure witnessing */}
          {phase === PHASES.SILENCE && (
            <motion.div
              key="silence-container"
              className="flex flex-col items-center gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3 }}
            >
              <SilenceGap
                durationSeconds={SILENCE_DURATION}
                onComplete={handleSilenceComplete}
              />
              <motion.p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
                  color: 'rgba(245, 240, 232, 0.12)',
                  letterSpacing: '0.12em',
                  marginTop: '60vh',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 4 }}
              >
                sit with the question
              </motion.p>
            </motion.div>
          )}

          {/* Reflection — the truth that lands after silence */}
          {phase === PHASES.REFLECTION && (
            <ReflectionReveal key="reflection" text={content.reflection} />
          )}

          {/* Done */}
          {phase === PHASES.DONE && (
            <motion.div
              key="done"
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
                The Witness witnessed.
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
                Return tomorrow · Day {day + 1}
              </motion.p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/**
 * ReflectionReveal — The truth that lands after silence
 * Appears word by word, slower than SacredText
 */
function ReflectionReveal({ text }) {
  const words = text.split(' ');

  return (
    <motion.div
      className="text-center max-w-2xl px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <motion.p
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(1.1rem, 3vw, 1.7rem)',
          fontWeight: 300,
          color: 'var(--parchment)',
          lineHeight: 1.9,
          letterSpacing: '0.04em',
          textShadow: '0 0 60px rgba(78, 205, 196, 0.1)',
        }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            style={{ display: 'inline-block', marginRight: '0.3em' }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.18 + 0.5,
              duration: 1.2,
              ease: [0.37, 0, 0.63, 1],
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.p>

      {/* Subtle teal line beneath */}
      <motion.div
        style={{
          width: '1px',
          height: '40px',
          background: 'linear-gradient(to bottom, rgba(78, 205, 196, 0.3), transparent)',
          margin: '2rem auto 0',
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ delay: words.length * 0.18 + 2, duration: 2 }}
      />
    </motion.div>
  );
}
