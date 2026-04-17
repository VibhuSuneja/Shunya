import { useState } from 'react';

// Hooks
import { useThetaAudio } from './hooks/useThetaAudio';
import { useJourney } from './hooks/useJourney';

// Components
import OnboardingFlow from './components/OnboardingFlow';
import StageOneJagrat from './components/StageOneJagrat';
import StageTwoSvapna from './components/StageTwoSvapna';
import StageThreeSushupti from './components/StageThreeSushupti';
import StageFourTuriya from './components/StageFourTuriya';
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

  return (
    <main className="w-full h-full relative overflow-hidden cosmic-bg flex items-center justify-center">

      {/* Mute Toggle */}
      {(stage > 0 || hasEntered) && (
        <button
          onClick={toggleMute}
          className="absolute top-6 right-6 z-50 p-2 opacity-20 hover:opacity-100 transition-opacity duration-1000"
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
            <OnboardingFlow onComplete={handleOnboardingComplete} audio={audio} />
          )}
          {stage === 1 && (
            <StageOneJagrat day={currentDay} onComplete={handleStageOneComplete} />
          )}
          {stage === 2 && (
            <StageTwoSvapna day={currentDay} onComplete={handleStageTwoComplete} />
          )}
          {stage === 3 && (
            <StageThreeSushupti day={currentDay} onComplete={handleStageThreeComplete} />
          )}
          {stage === 4 && (
            <StageFourTuriya day={currentDay} />
          )}
        </div>
      )}
    </main>
  );
}
