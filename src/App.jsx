import { useState } from 'react';
import { SignedIn, SignedOut, UserButton, useUser, SignInButton } from '@clerk/clerk-react';

// Hooks
import { useThetaAudio } from './hooks/useThetaAudio';
import { useJourney } from './hooks/useJourney';

// Components
import OnboardingFlow from './components/OnboardingFlow';
import StageOneJagrat from './components/StageOneJagrat';
import StageTwoSvapna from './components/StageTwoSvapna';
import StageThreeSushupti from './components/StageThreeSushupti';
import StageFourTuriya from './components/StageFourTuriya';
import StageFiveKevala from './components/StageFiveKevala';
import DailyLock from './components/DailyLock';

import LandingPage from './components/LandingPage';

export default function App() {
  const { stage, advanceStage, isLocked, currentDay } = useJourney();
  const { isLoaded: clerkLoaded } = useUser();
  const audio = useThetaAudio();
  const [mute, setMute] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  if (!clerkLoaded) {
    return (
      <main className="w-full h-full cosmic-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-t-2 border-[#4ecdc4] animate-spin opacity-20" />
      </main>
    );
  }

  const handleOnboardingComplete = () => {
    advanceStage(1);
    setHasEntered(true);
  };

  const handleStageOneComplete = () => advanceStage(2);
  const handleStageTwoComplete = () => advanceStage(3);
  const handleStageThreeComplete = () => advanceStage(4);

  const toggleMute = () => {
    audio.toggleMute();
    setMute(!mute);
  };

  const handleEntrance = () => {
    setHasEntered(true);
    if (audio && !audio.isPlaying) {
      audio.start();
    }
  };

  const isCurrentlyLocked = (stage >= 1 && stage <= 4) && isLocked;
  const showEntryGate = stage > 0 && !hasEntered && !isCurrentlyLocked;

  // The landing page should be scrollable, but the ritual should be fixed
  const isLanding = stage === 0 && !isStarting;

  return (
    <main className={`w-full h-full relative ${isLanding ? '' : 'overflow-hidden'} cosmic-bg flex items-center justify-center`}>

      <div className="fixed top-6 left-6 z-50 opacity-50 hover:opacity-100 transition-opacity duration-500">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      {/* Mute Toggle */}
      {(stage > 0 || hasEntered || isStarting) && (
        <button
          onClick={toggleMute}
          className="fixed top-6 right-6 z-50 p-2 opacity-20 hover:opacity-100 transition-opacity duration-1000"
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--parchment)', cursor: 'pointer' }}
          aria-label={mute ? "Unmute" : "Mute"}
        >
          {mute ? '♪̶' : '♪'}
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
          {stage === 0 && (
            !isStarting ? (
              <LandingPage onBegin={() => setIsStarting(true)} />
            ) : (
              <SignedIn>
                 <OnboardingFlow onComplete={handleOnboardingComplete} audio={audio} />
              </SignedIn>
            )
          )}
          {stage === 1 && (
            <SignedIn>
              <StageOneJagrat day={currentDay} onComplete={handleStageOneComplete} />
            </SignedIn>
          )}
          {stage === 2 && (
            <SignedIn>
              <StageTwoSvapna day={currentDay} onComplete={handleStageTwoComplete} />
            </SignedIn>
          )}
          {stage === 3 && (
            <SignedIn>
              <StageThreeSushupti day={currentDay} onComplete={handleStageThreeComplete} />
            </SignedIn>
          )}
          {stage === 4 && (
            <SignedIn>
              <StageFourTuriya day={currentDay} />
            </SignedIn>
          )}
          {stage === 5 && (
            <SignedIn>
              <StageFiveKevala />
            </SignedIn>
          )}

          {stage > 0 && (
            <SignedOut>
              <div className="flex flex-col items-center space-y-8">
                <p className="font-display text-2xl text-parchment/60">Your journey requires your presence.</p>
                <SignInButton mode="modal">
                  <button className="sacred-button px-8 py-3">Identify Yourself</button>
                </SignInButton>
              </div>
            </SignedOut>
          )}
        </div>
      )}
    </main>
  );
}

