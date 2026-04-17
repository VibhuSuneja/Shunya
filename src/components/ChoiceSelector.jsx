import { motion } from 'framer-motion';

/**
 * ChoiceSelector — Three Gentle Options
 * 
 * "What did you notice?"
 * Silence. Thoughts. Something else.
 * 
 * No buttons. Just words. A soft ripple on selection.
 * After choosing — all three gently fade out.
 * Whatever is chosen leads to the same truth.
 */
export default function ChoiceSelector({ onSelect }) {
  const choices = ['Silence', 'Thoughts', 'Something else'];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 1.2,
        delayChildren: 0.5,
      },
    },
  };

  const choiceVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 0.6,
      y: 0,
      transition: {
        duration: 1.5,
        ease: [0.37, 0, 0.63, 1],
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-8"
      style={{ marginTop: 'clamp(2rem, 6vh, 4rem)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {choices.map((choice, i) => (
        <motion.button
          key={choice}
          variants={choiceVariants}
          whileHover={{
            opacity: 1,
            textShadow: '0 0 30px rgba(78, 205, 196, 0.3)',
            transition: { duration: 0.8 },
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={() => onSelect(choice)}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--parchment)',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            padding: '0.5em 1.5em',
            position: 'relative',
            outline: 'none',
          }}
          id={`choice-${choice.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {choice}

          {/* Ripple underline on hover */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: '0.2em',
              left: '50%',
              height: '1px',
              backgroundColor: 'rgba(78, 205, 196, 0.3)',
              transformOrigin: 'center',
            }}
            initial={{ width: 0, x: '-50%' }}
            whileHover={{
              width: '80%',
              x: '-50%',
              transition: { duration: 0.8, ease: [0.37, 0, 0.63, 1] },
            }}
          />
        </motion.button>
      ))}
    </motion.div>
  );
}
