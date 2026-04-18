import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DEFAULT_STATE = {
  stage: 0,
  lastCompletedDay: 0,
  lastSessionTimestamp: null
};

export function useJourney() {
  const { isLoaded: userLoaded } = useUser();
  const { getToken, userId } = useAuth();

  const [journey, setJourney] = useState(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);

  // Load journey data from backend
  const fetchState = useCallback(async () => {
    if (!userLoaded || !userId) {
      setLoading(false);
      return;
    }
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/journey/state`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setJourney({
          stage: data.stage ?? 0,
          lastCompletedDay: data.lastCompletedDay ?? 0,
          lastSessionTimestamp: data.lastSessionTimestamp
        });
      }
    } catch (err) {
      console.error("Failed to load journey state", err);
    } finally {
      setLoading(false);
    }
  }, [userLoaded, userId, getToken]);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  // Derived state: check if journey is locked for today
  const isLocked = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('dev') === 'true') return false; 
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

  const advanceStage = async (nextStage) => {
    setJourney(prev => ({ ...prev, stage: nextStage }));
    try {
      const token = await getToken();
      await fetch(`${API_URL}/journey/advance`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nextStage })
      });
    } catch (err) {
      console.error("Failed to advance stage", err);
    }
  };

  const completeDay = async (dayIndex) => {
    const nextCompletedDay = Math.max(journey.lastCompletedDay, dayIndex);
    const ts = new Date().toISOString();
    
    setJourney(prev => ({
      ...prev,
      lastCompletedDay: nextCompletedDay,
      lastSessionTimestamp: ts
    }));

    try {
      const token = await getToken();
      await fetch(`${API_URL}/journey/advance`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dayIndex })
      });
    } catch (err) {
      console.error("Failed to complete day", err);
    }
  };

  const resetJourney = async () => {
    setJourney(DEFAULT_STATE);
    try {
      const token = await getToken();
      await fetch(`${API_URL}/journey/advance`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reset: true })
      });
    } catch (err) {
      console.error("Failed to reset journey", err);
    }
  };

  const currentDay = journey.lastCompletedDay + 1;

  return { 
    stage: journey.stage, 
    lastCompletedDay: journey.lastCompletedDay,
    currentDay,
    isLocked,
    advanceStage, 
    completeDay,
    resetJourney,
    loading
  };
}
