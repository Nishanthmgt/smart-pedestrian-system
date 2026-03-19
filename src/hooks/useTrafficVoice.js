import { useEffect, useRef } from 'react';

export function useTrafficVoice(mode, timer) {
  const synth = window.speechSynthesis;
  const lastSpokenRef = useRef(null);

  useEffect(() => {
    if (!synth) return;

    const speak = (text) => {
      // Cancel any ongoing speech to avoid backlog
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1; // Slightly faster for urgency
      utterance.pitch = 0.9; // Lower pitch for an authoritative "AI" sound
      synth.speak(utterance);
      lastSpokenRef.current = text;
    };

    if (mode === 'WARNING') {
      // Warning countdown for vehicles
      if (timer <= 5 && timer > 0) {
        if (lastSpokenRef.current !== `warn-${timer}`) {
          speak(timer.toString());
          lastSpokenRef.current = `warn-${timer}`;
        }
      }
    } else if (mode === 'PEDESTRIAN') {
      // Countdown logic
      if (timer <= 5 && timer > 0) {
        if (lastSpokenRef.current !== `ped-${timer}`) {
          speak(timer.toString());
          lastSpokenRef.current = `ped-${timer}`;
        }
      } else if (timer === 0) {
        if (lastSpokenRef.current !== 'stop walking') {
          speak('Stop walking');
        }
      }
    } else {
        // Reset last spoken when in vehicle mode
        lastSpokenRef.current = null;
    }
  }, [mode, timer]);
}
