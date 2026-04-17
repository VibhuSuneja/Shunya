/**
 * Shunya — Sacred Easing Functions
 * 
 * "Nothing snaps. Everything breathes."
 * All motion follows the sine wave — the breath of the universe.
 */

/**
 * Sine-wave easing (ease-in-out).
 * Maps a linear 0→1 progress to a smooth sine curve.
 * @param {number} t - Progress value between 0 and 1
 * @returns {number} Eased value between 0 and 1
 */
export const sineInOut = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * Sine-wave easing (ease-in only).
 * @param {number} t - Progress value between 0 and 1
 * @returns {number} Eased value between 0 and 1
 */
export const sineIn = (t) => 1 - Math.cos((t * Math.PI) / 2);

/**
 * Sine-wave easing (ease-out only).
 * @param {number} t - Progress value between 0 and 1
 * @returns {number} Eased value between 0 and 1
 */
export const sineOut = (t) => Math.sin((t * Math.PI) / 2);

/**
 * Breath cycle value.
 * Given elapsed time, returns a 0→1→0 sine wave value
 * synchronized to the sacred breath rhythm (8s cycle).
 * @param {number} elapsed - Elapsed time in milliseconds
 * @param {number} cycleDuration - Full breath cycle in ms (default 8000)
 * @returns {number} Value between 0 and 1
 */
export const breathValue = (elapsed, cycleDuration = 8000) => {
  const phase = (elapsed % cycleDuration) / cycleDuration;
  return (Math.sin(phase * Math.PI * 2 - Math.PI / 2) + 1) / 2;
};

/**
 * Framer Motion transition presets for Shunya.
 * Use these instead of raw config — ensures consistency.
 */
export const sacredTransition = {
  duration: 0.8,
  ease: [0.37, 0, 0.63, 1], // sine ease-in-out cubic-bezier
};

export const revealTransition = {
  duration: 2,
  ease: [0.37, 0, 0.63, 1],
};

export const slowTransition = {
  duration: 3,
  ease: [0.37, 0, 0.63, 1],
};

export const breathTransition = {
  duration: 4,
  ease: [0.37, 0, 0.63, 1],
  repeat: Infinity,
  repeatType: 'reverse',
};
