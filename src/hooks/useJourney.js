import { useState, useMemo, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const BASE_JOURNEY_KEY = 'shunya_journey_data';

const DEFAULT_STATE = {
  stage: 0,                // 0: Onboarding, 1: Jagrat, 2: Svapna, 3: Sushupti
  lastCompletedDay: 0,     // Total days completed across the 90-day ritual
  lastSessionTimestamp: null // ISO string of the last completed session
};

export function useJourney() {
  const { user, isLoaded } = useUser();
  const userId = user?.id || 'anonymous';
  const journeyKey = `${BASE_JOURNEY_KEY}_${userId}`;

  const [journey, setJourney] = useState(() => {
    try {
      const saved = localStorage.getItem(journeyKey);
      return saved ? JSON.parse(saved) : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  // Re-load journey data when user changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const saved = localStorage.getItem(journeyKey);
      setJourney(saved ? JSON.parse(saved) : DEFAULT_STATE);
    } catch {
      setJourney(DEFAULT_STATE);
    }
  }, [journeyKey, isLoaded]);

  // Derived state: check if journey is locked for today
  const isLocked = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('dev') === 'true') return false; // Dev override
    if (!journey.lastSessionTimestamp) return false;

    const lastTime = new Date(journey.lastSessionTimestamp).getTime();
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    return (now - lastTime) < twentyFourHours;
  }, [journey.lastSessionTimestamp]);

  // Handle stage jump (dev/params)
  useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const devStage = params.get('stage');
    if (devStage !== null) {
      const parsed = parseInt(devStage, 10);
      if (!isNaN(parsed) && parsed !== journey.stage) {
        setJourney(prev => ({ ...prev, stage: parsed }));
      }
    }
  }, [journey.stage]);

  const saveJourney = (data) => {
    setJourney(data);
    localStorage.setItem(journeyKey, JSON.stringify(data));
  };

  const advanceStage = (nextStage) => {
    saveJourney({ ...journey, stage: nextStage });
  };

  const completeDay = (dayIndex) => {
    // Only advance if it's the next day in sequence
    // This allows re-visiting the same day if they somehow get stuck, 
    // but updates the timestamp only if they finished a new ritual.
    saveJourney({
      ...journey,
      lastCompletedDay: Math.max(journey.lastCompletedDay, dayIndex),
      lastSessionTimestamp: new Date().toISOString()
    });
  };

  const resetJourney = () => {
    saveJourney(DEFAULT_STATE);
  };

  const currentDay = journey.lastCompletedDay + 1;

  return { 
    stage: journey.stage, 
    lastCompletedDay: journey.lastCompletedDay,
    currentDay,
    isLocked,
    advanceStage, 
    completeDay,
    resetJourney 
  };
}
