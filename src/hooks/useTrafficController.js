import { useState, useEffect, useRef } from 'react';

// Modes: VEHICLE, WARNING, PEDESTRIAN
const THRESHOLD = 3;
const WAIT_TIME_MS = 3000;
const WARNING_TIME_S = 5;
const PEDESTRIAN_CROSSING_TIME_S = 15;

export function useTrafficController(peopleCount) {
  const [mode, setMode] = useState('VEHICLE');
  const [timer, setTimer] = useState(0);
  
  // Track continuous time the count >= threshold
  const [timeAboveThreshold, setTimeAboveThreshold] = useState(0);

  useEffect(() => {
    // If currently in WARNING or PEDESTRIAN mode, manage countdown
    if (mode === 'WARNING' || mode === 'PEDESTRIAN') {
      if (timer > 0) {
        const interval = setInterval(() => {
          setTimer(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
      } else {
        // State transitions
        if (mode === 'WARNING') {
          // Warning ended, start pedestrian phase
          setMode('PEDESTRIAN');
          setTimer(PEDESTRIAN_CROSSING_TIME_S);
        } else {
          // Pedestrian ended, reset to vehicle
          setMode('VEHICLE');
          setTimeAboveThreshold(0); // reset tracking
        }
      }
    }
  }, [mode, timer]);

  useEffect(() => {
    let interval;
    if (mode === 'VEHICLE') {
      if (peopleCount >= THRESHOLD) {
        interval = setInterval(() => {
          setTimeAboveThreshold(prev => {
            const next = prev + 100;
            if (next >= WAIT_TIME_MS) {
              // Trigger WARNING mode instead of jumping to Pedestrian
              setMode('WARNING');
              setTimer(WARNING_TIME_S);
              return 0;
            }
            return next;
          });
        }, 100);
      } else {
        setTimeAboveThreshold(0);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, peopleCount]);

  return { mode, timer, isWaiting: timeAboveThreshold > 0 && mode === 'VEHICLE' };
}
