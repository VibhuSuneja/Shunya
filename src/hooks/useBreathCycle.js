import { useState, useEffect, useRef } from 'react';

/**
 * useBreathCycle — Synchronized Breath Rhythm
 * 
 * Returns a value 0→1→0 following a sine wave at the sacred breath rhythm.
 * 4 seconds inhale (0→1), 4 seconds exhale (1→0). 8 seconds total.
 * 
 * All animated components can subscribe to this shared rhythm
 * to create organic, unified motion across the entire experience.
 * 
 * @param {number} cycleDuration - Full breath cycle in ms (default 8000)
 * @returns {{ value: number, phase: 'inhale'|'exhale' }}
 */
export function useBreathCycle(cycleDuration = 8000) {
  const [breath, setBreath] = useState({ value: 0, phase: 'inhale' });
  const frameRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      
      // Sine wave: 0 → 1 → 0
      const progress = (elapsed % cycleDuration) / cycleDuration;
      const sineValue = (Math.sin(progress * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      const phase = progress < 0.5 ? 'inhale' : 'exhale';

      setBreath({ value: sineValue, phase });
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [cycleDuration]);

  return breath;
}
