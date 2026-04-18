import { useRef, useCallback, useState, useEffect } from 'react';

/**
 * useThetaAudio — Theta Wave Binaural Beat Generator
 * 
 * Creates a 6Hz theta binaural beat using Web Audio API.
 * Left ear: 200Hz carrier, Right ear: 206Hz → 6Hz difference = theta state.
 * 
 * Theta waves (4-8Hz) are associated with:
 * - Deep meditation and relaxation
 * - Enhanced creativity and intuition
 * - The hypnagogic state between waking and sleep
 * 
 * ⚠️ Requires headphones for binaural effect.
 * ⚠️ Must be triggered by user gesture (browser autoplay policy).
 */
export function useThetaAudio() {
  const audioCtxRef = useRef(null);
  const oscLeftRef = useRef(null);
  const oscRightRef = useRef(null);
  const gainRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const CARRIER_FREQ = 200;   // Hz — base frequency
  const BEAT_FREQ = 6;        // Hz — theta range
  const MAX_VOLUME = 0.07;    // Subtle — barely perceptible
  const FADE_DURATION = 5;    // seconds

  /**
   * Initialize and start the theta wave audio.
   * Must be called from a user gesture event handler.
   */
  const start = useCallback(async () => {
    if (audioCtxRef.current) return; // Already running

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;

      // Resume if suspended (browser policy)
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Master gain node for volume control
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.connect(ctx.destination);
      gainRef.current = gain;

      // Left oscillator — carrier frequency
      const oscLeft = ctx.createOscillator();
      const panLeft = ctx.createStereoPanner();
      oscLeft.type = 'sine';
      oscLeft.frequency.setValueAtTime(CARRIER_FREQ, ctx.currentTime);
      panLeft.pan.setValueAtTime(-1, ctx.currentTime);
      oscLeft.connect(panLeft);
      panLeft.connect(gain);
      oscLeftRef.current = oscLeft;

      // Right oscillator — carrier + theta beat
      const oscRight = ctx.createOscillator();
      const panRight = ctx.createStereoPanner();
      oscRight.type = 'sine';
      oscRight.frequency.setValueAtTime(CARRIER_FREQ + BEAT_FREQ, ctx.currentTime);
      panRight.pan.setValueAtTime(1, ctx.currentTime);
      oscRight.connect(panRight);
      panRight.connect(gain);
      oscRightRef.current = oscRight;

      // Start oscillators
      oscLeft.start();
      oscRight.start();

      // Smooth fade in — over FADE_DURATION seconds
      gain.gain.exponentialRampToValueAtTime(
        MAX_VOLUME,
        ctx.currentTime + FADE_DURATION
      );

      setIsPlaying(true);
    } catch (err) {
      console.warn('Shunya: Audio initialization failed —', err.message);
    }
  }, []);

  /**
   * Fade in the audio (if already started but faded out).
   */
  const fadeIn = useCallback((duration = FADE_DURATION) => {
    const ctx = audioCtxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;

    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(gain.gain.value || 0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      MAX_VOLUME,
      ctx.currentTime + duration
    );
  }, []);

  /**
   * Fade out the audio gracefully.
   */
  const fadeOut = useCallback((duration = FADE_DURATION) => {
    const ctx = audioCtxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;

    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + duration
    );
  }, []);

  /**
   * Duck audio (lower volume momentarily, e.g. for voiceover)
   */
  const duckAudio = useCallback(() => {
    const ctx = audioCtxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain || !isPlaying) return;

    // Use max to avoid exponential ramp to 0, which is an error in some browers.
    const targetVolume = Math.max(MAX_VOLUME * 0.3, 0.001);
    
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.001), ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(targetVolume, ctx.currentTime + 1);
  }, [isPlaying]);

  /**
   * Restore audio after ducking
   */
  const unduckAudio = useCallback(() => {
    const ctx = audioCtxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain || !isPlaying) return;

    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.001), ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(MAX_VOLUME, ctx.currentTime + 2);
  }, [isPlaying]);

  useEffect(() => {
    window.addEventListener('shunya-duck-audio', duckAudio);
    window.addEventListener('shunya-unduck-audio', unduckAudio);
    return () => {
      window.removeEventListener('shunya-duck-audio', duckAudio);
      window.removeEventListener('shunya-unduck-audio', unduckAudio);
    };
  }, [duckAudio, unduckAudio]);

  /**
   * Stop and clean up all audio resources.
   */
  const stop = useCallback(() => {
    const ctx = audioCtxRef.current;
    const gain = gainRef.current;

    if (gain && ctx) {
      // Fade out before stopping to prevent click
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

      setTimeout(() => {
        try {
          oscLeftRef.current?.stop();
          oscRightRef.current?.stop();
          ctx.close();
        } catch (e) {
          // Already stopped
        }
        audioCtxRef.current = null;
        oscLeftRef.current = null;
        oscRightRef.current = null;
        gainRef.current = null;
        setIsPlaying(false);
      }, 1100);
    }
  }, []);

  /**
   * Toggle mute without stopping oscillators.
   */
  const toggleMute = useCallback(() => {
    const ctx = audioCtxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;

    if (gain.gain.value > 0.005) {
      fadeOut(1);
    } else {
      fadeIn(1);
    }
  }, [fadeIn, fadeOut]);

  return { start, stop, fadeIn, fadeOut, toggleMute, isPlaying };
}
