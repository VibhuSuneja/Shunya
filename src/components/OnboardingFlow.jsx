import { useReducer, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useVoiceover } from '../hooks/useVoiceover';

// Components
import SacredEntry from './SacredEntry';
import SacredText from './SacredText';
import ShunyaCircle from './ShunyaCircle';
import WitnessingTimer from './WitnessingTimer';
import ChoiceSelector from './ChoiceSelector';
import DikshaCeremony from './DikshaCeremony';

/* ── State Machine definitions ── */
const PHASES = {
  ENTRY: 'entry',               // Step 1 + doorway
  DARKNESS: 'darkness',         // Pre-audio darkness
  QUESTION_1: 'question_1',     // "Who is reading this?"
  SILENCE_1: 'silence_1',       // Let Q1 linger
  BREATH_PULSE: 'breath_pulse', // Shunya circle appears
  QUESTION_2: 'question_2',     // "That which is asking..."
  WITNESSING: 'witnessing',     // The 7-min (or dev) silence
  QUESTION_3: 'question_3',     // "What did you notice?"
  CHOICE: 'choice',             // The options
  REVELATION: 'revelation',     // The Diksha component handles the rest
};

const initialState = {
  phase: PHASES.ENTRY,
};

function reducer(state, action) {
  switch (action.type) {
    case 'NEXT_PHASE':
      return { ...state, phase: action.payload };
    default:
      return state;
  }
}

export default function OnboardingFlow({ onComplete, audio }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { playVoice } = useVoiceover();

  // URL Params for dev mode (fast forward the 7 min timer to 15s)
  const isDevMode = new URLSearchParams(window.location.search).get('dev') === 'true';
  const WITNESS_DURATION = isDevMode ? 15000 : 420000; // 15s or 7m

  // Voiceover Orchestrator
  useEffect(() => {
    switch (state.phase) {
      case PHASES.QUESTION_1:
         playVoice('/audio/voice/ob-who-is-reading-this.mp3');
         break;
      case PHASES.QUESTION_2:
         playVoice('/audio/voice/ob-that-which-is-asking.mp3');
         break;
      case PHASES.QUESTION_3:
         playVoice('/audio/voice/ob-what-did-you-notice.mp3');
         break;
      default:
         break;
    }
  }, [state.phase, playVoice]);

  // Orchestrator Effect
  useEffect(() => {
    let timer;

    const next = (phase, delay) => {
      timer = setTimeout(() => dispatch({ type: 'NEXT_PHASE', payload: phase }), delay);
    };

    switch (state.phase) {
      case PHASES.DARKNESS:
        next(PHASES.QUESTION_1, 5000);
        break;
      case PHASES.QUESTION_1:
        next(PHASES.SILENCE_1, 10000);
        break;
      case PHASES.SILENCE_1:
        next(PHASES.BREATH_PULSE, 6000);
        break;
      case PHASES.BREATH_PULSE:
        next(PHASES.QUESTION_2, 8000);
        break;
      case PHASES.QUESTION_2:
        next(PHASES.WITNESSING, 10000);
        break;
      case PHASES.WITNESSING:
        next(PHASES.QUESTION_3, WITNESS_DURATION);
        break;
      case PHASES.QUESTION_3:
        next(PHASES.CHOICE, 4000);
        break;
      default:
        break;
    }

    return () => clearTimeout(timer);
  }, [state.phase, WITNESS_DURATION]);

  const handleEnter = () => {
    if (audio && audio.start) {
      audio.start();
    }
    dispatch({ type: 'NEXT_PHASE', payload: PHASES.DARKNESS });
  };

  const handleChoice = () => {
    dispatch({ type: 'NEXT_PHASE', payload: PHASES.REVELATION });
  };
  
  const handleDikshaComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <>
      {/* Primary Transition Group */}
      <AnimatePresence>
        
        {/* Step 1: Entry doorway */}
        {state.phase === PHASES.ENTRY && (
          <SacredEntry key="entry" onEnter={handleEnter} />
        )}

        {/* Step 3: First Question */}
        {state.phase === PHASES.QUESTION_1 && (
          <motion.div key="q1" className="z-20 text-center w-full px-4 fixed inset-0 flex items-center justify-center pointer-events-none"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 2, ease: [0.37, 0, 0.63, 1] }}
          >
            <SacredText text="Who is reading this?" />
          </motion.div>
        )}

        {/* Step 4-8: The Breathing Center */}
        {([
          PHASES.BREATH_PULSE,
          PHASES.QUESTION_2,
          PHASES.WITNESSING,
          PHASES.QUESTION_3,
          PHASES.CHOICE
        ].includes(state.phase)) && (
          <motion.div
            key="center-anchor"
            className="z-20 flex flex-col items-center w-full relative fixed inset-0 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: [0.37, 0, 0.63, 1] }}
          >
            {/* The primary circle is present through these stages */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
              <ShunyaCircle />
            </div>

            <AnimatePresence mode="wait">
              {state.phase === PHASES.QUESTION_2 && (
                 <SacredText key="q2" text="That which is asking — is the answer." delay={1} />
              )}
              {state.phase === PHASES.QUESTION_3 && (
                 <SacredText key="q3" text="What did you notice?" delay={1} />
              )}
              {state.phase === PHASES.CHOICE && (
                <motion.div key="choice-wrap" className="flex flex-col items-center">
                  <SacredText text="What did you notice?" />
                  <ChoiceSelector onSelect={handleChoice} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Step 9-11: Revelation and Diksha */}
        {state.phase === PHASES.REVELATION && (
          <DikshaCeremony key="diksha" onComplete={handleDikshaComplete} />
        )}
      </AnimatePresence>

      {/* The Witnessing Timer runs continuously from QUESTION_2 until CHOICE */}
      <WitnessingTimer
        active={
          state.phase === PHASES.QUESTION_2 ||
          state.phase === PHASES.WITNESSING
        }
      />
    </>
  );
}
