import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ObservationShare — Leave Something for a Fellow Traveler
 *
 * Not a post. Not a status. An inner observation.
 * The prompt is always the same: "What did you notice today?"
 *
 * Constraints (intentional friction):
 * - Max 140 characters. Brevity demands truth.
 * - No editing after submission. The moment is the moment.
 * - Submission is queued for 24h before appearing in the feed.
 *   This enforces contemplation, not reaction.
 * - Completely optional. Silence is also a valid offering.
 *
 * The text area has no border, no box. Just words appearing
 * in the void — like thoughts themselves.
 */

const MAX_CHARS = 140;
const PLACEHOLDER_TEXTS = [
  "I noticed...",
  "Something shifted...",
  "The silence felt...",
  "I caught myself...",
  "For a moment...",
];

export default function ObservationShare({ day, onComplete }) {
  const [observation, setObservation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [placeholder] = useState(
    () => PLACEHOLDER_TEXTS[day % PLACEHOLDER_TEXTS.length]
  );

  const charsLeft = MAX_CHARS - observation.length;
  const isNearLimit = charsLeft < 20;

  const handleSubmit = () => {
    if (observation.trim().length === 0) {
      handleSkip();
      return;
    }

    // Queue for 24h delayed appearance
    const observations = JSON.parse(localStorage.getItem('shunya_observations') || '[]');
    observations.push({
      text: observation.trim(),
      day,
      timestamp: new Date().toISOString(),
      releaseAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
    localStorage.setItem('shunya_observations', JSON.stringify(observations));

    setSubmitted(true);
    setTimeout(() => onComplete(), 5000);
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-10 max-w-lg w-full px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 4, ease: [0.37, 0, 0.63, 1] }}
    >
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="share-form"
            className="w-full flex flex-col items-center gap-10"
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            {/* Prompt */}
            <motion.p
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                color: 'rgba(245, 240, 232, 0.4)',
                letterSpacing: '0.05em',
                textAlign: 'center',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 3 }}
            >
              What did you notice today?
            </motion.p>

            {/* Sacred text area */}
            <motion.div
              className="w-full relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 3 }}
            >
              {/* Horizontal line — the only UI affordance */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '10%',
                  right: '10%',
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, rgba(78, 205, 196, 0.2), transparent)',
                }}
              />

              <textarea
                value={observation}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) {
                    setObservation(e.target.value);
                  }
                }}
                placeholder={placeholder}
                rows={4}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                  color: 'rgba(245, 240, 232, 0.75)',
                  lineHeight: 1.8,
                  letterSpacing: '0.03em',
                  textAlign: 'center',
                  caretColor: 'rgba(78, 205, 196, 0.5)',
                  paddingBottom: '1rem',
                }}
                // Placeholder style via CSS class
                className="shunya-textarea"
              />
            </motion.div>

            {/* Char count — only shows when near limit */}
            <AnimatePresence>
              {isNearLimit && (
                <motion.p
                  key="char-count"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.65rem',
                    color: charsLeft <= 5
                      ? 'rgba(205, 78, 78, 0.4)'
                      : 'rgba(245, 240, 232, 0.15)',
                    letterSpacing: '0.15em',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {charsLeft}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Actions */}
            <motion.div
              className="flex gap-12 items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4, duration: 3 }}
            >
              {/* Skip — always present but very quiet */}
              <button
                onClick={handleSkip}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.65rem',
                  color: 'rgba(245, 240, 232, 0.12)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'color 1s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = 'rgba(245, 240, 232, 0.3)'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(245, 240, 232, 0.12)'}
              >
                silence is enough
              </button>

              {/* Submit — only appears if there is text */}
              <AnimatePresence>
                {observation.trim().length > 0 && (
                  <motion.button
                    key="submit-btn"
                    onClick={handleSubmit}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(78, 205, 196, 0.2)',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.65rem',
                      color: 'rgba(78, 205, 196, 0.5)',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      padding: '0.6em 1.5em',
                      transition: 'all 0.8s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = 'rgba(78, 205, 196, 0.5)';
                      e.target.style.color = 'rgba(78, 205, 196, 0.8)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'rgba(78, 205, 196, 0.2)';
                      e.target.style.color = 'rgba(78, 205, 196, 0.5)';
                    }}
                  >
                    offer
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 24h note */}
            <motion.p
              style={{
                fontFamily: 'var(--font-body)',
                fontStyle: 'italic',
                fontSize: '0.6rem',
                color: 'rgba(245, 240, 232, 0.08)',
                letterSpacing: '0.1em',
                textAlign: 'center',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 8, duration: 4 }}
            >
              observations rest for 24 hours before reaching another traveler
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="submitted"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
          >
            <motion.p
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                color: 'rgba(245, 240, 232, 0.4)',
                letterSpacing: '0.05em',
              }}
            >
              it will find the right traveler
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
