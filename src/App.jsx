import React, { useState, useEffect } from 'react';
import { CameraFeed } from './components/CameraFeed';
import { SignalPanel } from './components/SignalPanel';
import { StatusDisplay } from './components/StatusDisplay';
import { AlertPanel } from './components/AlertPanel';
import { useCamera } from './hooks/useCamera';
import { useTrafficController } from './hooks/useTrafficController';
import { useTrafficVoice } from './hooks/useTrafficVoice';
import { ShieldAlert } from 'lucide-react';

import { CrossingHistory } from './components/CrossingHistory';

function App() {
  // Hooks must be at the top level, outside of try/catch
  const { videoRef, stream, error: cameraError, devices, currentDeviceId, switchCamera, startCamera, isActive } = useCamera();
  
  const [peopleCount, setPeopleCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [maxInCurrentCycle, setMaxInCurrentCycle] = useState(0);

  const { mode, timer, isWaiting } = useTrafficController(peopleCount);
  useTrafficVoice(mode, timer);

  // Track max people during a crossing cycle & Save to History
  useEffect(() => {
    if (mode === 'PEDESTRIAN') {
      if (peopleCount > maxInCurrentCycle) {
        setMaxInCurrentCycle(peopleCount);
      }
    } else if (mode === 'VEHICLE' && maxInCurrentCycle > 0) {
      // Pedestrian phase just ended, save the record
      const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      const newEntry = {
        id: generateId(),
        timestamp: new Date().toLocaleTimeString(),
        count: maxInCurrentCycle,
        duration: 15, // matches PEDESTRIAN_CROSSING_TIME_S
      };
      setHistory(prev => [...prev, newEntry]);
      setMaxInCurrentCycle(0); // Reset for next cycle
    }
  }, [mode, peopleCount, maxInCurrentCycle]);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col font-sans max-w-[1800px] mx-auto bg-dark-bg/50 overflow-x-hidden">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-neon-blue/50 to-transparent"></div>
        <div className="flex items-center gap-4">
          <div className="p-3 glass-panel-neon bg-neon-blue/10 text-neon-blue">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-mono text-white tracking-widest text-glow uppercase">
              Smart Pedestrian Sys
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Large Column (8): Camera & Status */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          <div className="relative group overflow-hidden">
            {/* Corner Decorative Elements */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-neon-blue z-40"></div>
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-neon-blue z-40"></div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-neon-blue z-40"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-neon-blue z-40"></div>
            
            <CameraFeed 
              videoRef={videoRef} 
              stream={stream} 
              error={cameraError} 
              onDetectedCount={setPeopleCount} 
              devices={devices}
              switchCamera={switchCamera}
              currentDeviceId={currentDeviceId}
              startCamera={startCamera}
              isActive={isActive}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <StatusDisplay mode={mode} peopleCount={peopleCount} isWaiting={isWaiting} />
          </div>
        </div>

        {/* Small Column (4): Control, History, Logs */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          <SignalPanel mode={mode} timer={timer} />
          
          <div className="grid grid-cols-1 gap-6 flex-1">
             <CrossingHistory history={history} />
          </div>

          <AlertPanel mode={mode} timer={timer} />
        </div>
        
      </main>
      
    </div>
  );
}

export default App;
