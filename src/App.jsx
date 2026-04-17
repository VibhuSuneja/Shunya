import { useState } from 'react';

// Hooks
import { useThetaAudio } from './hooks/useThetaAudio';
import { useJourney } from './hooks/useJourney';

// Components
import OnboardingFlow from './components/OnboardingFlow';
import StageOneJagrat from './components/StageOneJagrat';
import StageTwoSvapna from './components/StageTwoSvapna';
import DailyLock from './components/DailyLock';

export default function App() {
  const { stage, advanceStage, isLocked, currentDay } = useJourney();
  const audio = useThetaAudio();
  const [mute, setMute] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const handleOnboardingComplete = () => {
    advanceStage(1);
    setHasEntered(true);
  };

  const handleStageOneComplete = () => {
    advanceStage(2);
  };

  const toggleMute = () => {
    audio.toggleMute();
    setMute(!mute);
  };

  const handleEntrance = () => {
    setHasEntered(true);
    // Trigger audio initialization on user interaction
    if (audio && !audio.isPlaying) {
      audio.start(); 
    }
  };

  // Logic: Stages 1 and 2 require the lockout check
  const isCurrentlyLocked = (stage === 1 || stage === 2) && isLocked;

  // Determine if we need to show the entry gate
  // If we are at stage 0, the onboarding flow handles the "first interaction"
  // If we are resumed at stage 1 or 2, we need a click.
  const showEntryGate = stage > 0 && !hasEntered && !isCurrentlyLocked;

  return (
    <main className="w-full h-full relative overflow-hidden cosmic-bg flex items-center justify-center">
      
      {/* Audio Mute Toggle (Subtle) */}
      {(stage > 0 || hasEntered) && (
        <button
          onClick={toggleMute}
          className="absolute top-6 right-6 z-50 p-2 opacity-20 hover:opacity-100 transition-opacity duration-1000"
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--parchment)', cursor: 'pointer' }}
          aria-label={mute ? "Unmute audio" : "Mute audio"}
        >
          {mute ? '<s>♪</s>' : '♪'}
        </button>
      )}

      {/* Ritual Lockout */}
      {isCurrentlyLocked ? (
        <DailyLock />
      ) : showEntryGate ? (
        <div className="flex flex-col items-center space-y-12 animate-fade-in">
          <button
            onClick={handleEntrance}
            className="sacred-button px-12 py-4 text-parchment/60 tracking-[0.4em] uppercase text-sm"
          >
            Step into the Shunya
          </button>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {stage === 0 && <OnboardingFlow onComplete={handleOnboardingComplete} audio={audio} />}
          {stage === 1 && <StageOneJagrat day={currentDay} onComplete={handleStageOneComplete} />}
          {stage === 2 && <StageTwoSvapna day={currentDay} />}
        </div>
      )}
      
    </main>
  );
}
