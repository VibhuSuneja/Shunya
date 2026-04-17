import { useRef, useEffect, useCallback } from 'react';

/**
 * Global hook to play human-like pre-rendered audio voiceovers exactly
 * synced with the text fading onto the screen.
 * 
 * Works optimally with pre-rendered mp3 files from ElevenLabs/OpenAI
 * saved into `public/audio/voice/`
 */
export function useVoiceover() {
  const audioRef = useRef(new Audio());
  const playPromiseRef = useRef(null);

  const playVoice = useCallback((src) => {
    if (!src) return;
    
    const audio = audioRef.current;

    const startPlaying = () => {
      audio.src = src;
      audio.volume = 0.8;
      playPromiseRef.current = audio.play();
      
      playPromiseRef.current.catch(e => {
        if (e.name !== 'AbortError') {
          console.warn('Voiceover playback issue:', e);
        }
        playPromiseRef.current = null;
      });
    };

    // If there is an active play request, wait for it before changing src/pausing
    if (playPromiseRef.current) {
      playPromiseRef.current
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          startPlaying();
        })
        .catch(() => {
          // If the previous one failed (e.g. autoplay blocked), just try the next one
          startPlaying();
        });
    } else {
      audio.pause();
      audio.currentTime = 0;
      startPlaying();
    }
  }, []);

  const stopVoice = useCallback(() => {
    const audio = audioRef.current;
    if (playPromiseRef.current) {
      playPromiseRef.current.then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (playPromiseRef.current) {
        playPromiseRef.current.then(() => {
          audio.pause();
          audio.src = "";
        }).catch(() => {});
      } else {
        audio.pause();
        audio.src = "";
      }
    };
  }, []);

  return { playVoice, stopVoice };
}
