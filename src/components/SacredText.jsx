import { motion } from 'framer-motion';

/**
 * SacredText — Breath-Paced Text Reveal
 * 
 * Text appears character by character, synchronized to the breath rhythm.
 * Each character fades in with a staggered delay creating a flowing,
 * meditative reading experience.
 * 
 * "Text that arrives like a slow exhale."
 */
export default function SacredText({
  text,
  className = '',
  delay = 0,
  italic = false,
  fontSize,
  onComplete,
}) {
  const characters = text.split('');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: delay,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 2,
        ease: [0.37, 0, 0.63, 1],
      },
    },
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      y: 4,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.37, 0, 0.63, 1],
      },
    },
  };

  return (
    <motion.p
      className={`sacred-text ${italic ? 'sacred-text-emphasis' : ''} ${className}`}
      style={{
        fontSize: fontSize || 'clamp(1.2rem, 3.5vw, 2rem)',
        color: 'var(--parchment)',
        textAlign: 'center',
        maxWidth: '80vw',
        lineHeight: 1.8,
        letterSpacing: '0.04em',
        textShadow: '0 0 40px rgba(78, 205, 196, 0.08)',
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onAnimationComplete={() => onComplete?.()}
    >
      {characters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={charVariants}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.p>
  );
}
