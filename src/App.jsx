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
  const { videoRef, stream, error, devices, currentDeviceId, switchCamera } = useCamera();
  
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
      const newEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        count: maxInCurrentCycle,
        duration: 15, // matches PEDESTRIAN_CROSSING_TIME_S
      };
      setHistory(prev => [...prev, newEntry]);
      setMaxInCurrentCycle(0); // Reset for next cycle
    }
  }, [mode, peopleCount, maxInCurrentCycle]);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col font-sans max-w-[1800px] mx-auto bg-dark-bg/50">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-neon-blue/50 to-transparent"></div>
        <div className="flex items-center gap-4">
          <div className="p-3 glass-panel-neon bg-neon-blue/10 text-neon-blue">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-mono text-white tracking-widest text-glow">
              SMART PEDESTRIAN SYS
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Large Column (8): Camera & Status */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="relative group">
            {/* Corner Decorative Elements */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-neon-blue z-40 transition-all group-hover:w-12 group-hover:h-12"></div>
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-neon-blue z-40 transition-all group-hover:w-12 group-hover:h-12"></div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-neon-blue z-40 transition-all group-hover:w-12 group-hover:h-12"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-neon-blue z-40 transition-all group-hover:w-12 group-hover:h-12"></div>
            
            <CameraFeed 
              videoRef={videoRef} 
              stream={stream} 
              error={error} 
              onDetectedCount={setPeopleCount} 
              devices={devices}
              switchCamera={switchCamera}
              currentDeviceId={currentDeviceId}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <StatusDisplay mode={mode} peopleCount={peopleCount} isWaiting={isWaiting} />
          </div>
        </div>

        {/* Small Column (4): Control, History, Logs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
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
