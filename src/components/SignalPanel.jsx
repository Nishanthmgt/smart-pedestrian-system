import React from 'react';
import { Hand, PersonStanding } from 'lucide-react';

/**
 * SignalPanel: Dual-Housing Traffic Control System
 * Features a 3-light Vehicle Signal (Red/Yellow/Green) and a 2-light Pedestrian Signal.
 * Now includes support for the WARNING mode (Safety Buffer).
 */
export function SignalPanel({ mode, timer }) {
  const isPedestrian = mode === 'PEDESTRIAN';
  const isWarning = mode === 'WARNING';
  const isVehicle = mode === 'VEHICLE';

  const LensOverlay = () => (
    <div className="absolute inset-0 rounded-full opacity-30 mix-blend-overlay pointer-events-none"
      style={{
        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
        backgroundSize: '4px 4px'
      }}
    />
  );

  return (
    <div className="glass-panel p-6 flex flex-col items-center gap-8">
      <div className="text-neon-blue font-mono text-[9px] tracking-[0.4em] opacity-40 uppercase">
        Infrastructure // Safety_Buffer_Enabled
      </div>

      <div className="flex gap-12 items-start justify-center w-full">
        
        {/* VEHICLE SIGNAL HOUSING (3-LIGHT) */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-[10px] font-mono text-white/40 mb-1">VEHICLE</div>
          <div className="w-24 py-6 bg-[#15151a] rounded-[2.5rem] border-4 border-[#25252a] shadow-2xl flex flex-col items-center gap-4 relative">
            <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
            
            {/* Red (STOP) */}
            <div className={`relative w-12 h-12 rounded-full border-2 transition-all duration-700
              ${isPedestrian ? 'bg-neon-red border-neon-red shadow-[0_0_30px_rgba(255,0,60,0.6)]' : 'bg-neon-red/5 border-neon-red/10'}`}>
              <LensOverlay />
              {isPedestrian && <div className="absolute inset-0 bg-white/10 rounded-full blur-sm animate-pulse" />}
            </div>

            {/* Yellow (WARNING) */}
            <div className={`relative w-12 h-12 rounded-full border-2 transition-all duration-700
              ${isWarning ? 'bg-yellow-500 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.6)]' : 'bg-yellow-500/5 border-yellow-500/10'}`}>
              <LensOverlay />
              {isWarning && <div className="absolute inset-0 bg-white/10 rounded-full blur-sm animate-pulse" />}
            </div>

            {/* Green (GO) */}
            <div className={`relative w-12 h-12 rounded-full border-2 transition-all duration-700
              ${isVehicle ? 'bg-neon-green border-neon-green shadow-[0_0_30px_rgba(57,255,20,0.6)]' : 'bg-neon-green/5 border-neon-green/10'}`}>
              <LensOverlay />
              {isVehicle && <div className="absolute inset-0 bg-white/10 rounded-full blur-sm animate-pulse" />}
            </div>
          </div>
        </div>

        {/* PEDESTRIAN SIGNAL HOUSING (2-LIGHT) */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-[10px] font-mono text-white/40 mb-1">PEDESTRIAN</div>
          <div className="w-24 py-6 bg-[#15151a] rounded-[2.5rem] border-4 border-[#25252a] shadow-2xl flex flex-col items-center gap-6 relative">
            <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />

            {/* STOP / WAIT */}
            <div className={`relative w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-700
              ${!isPedestrian ? 'bg-neon-red border-neon-red shadow-[0_0_30px_rgba(255,0,60,0.6)]' : 'bg-neon-red/5 border-neon-red/10'}`}>
              <LensOverlay />
              <Hand className={`w-8 h-8 ${!isPedestrian ? 'text-white' : 'text-neon-red/20'}`} />
            </div>

            {/* WALK */}
            <div className={`relative w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-700
              ${isPedestrian ? 'bg-neon-blue border-neon-blue shadow-[0_0_30px_rgba(0,243,255,0.6)]' : 'bg-neon-blue/5 border-neon-blue/10'}`}>
              <LensOverlay />
              <PersonStanding className={`w-8 h-8 ${isPedestrian ? 'text-white' : 'text-neon-blue/20'} ${isPedestrian ? 'animate-bounce' : ''}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Unified Control Display */}
      <div className="w-full">
        <div className={`p-4 rounded-xl border-2 transition-all duration-700 flex flex-col items-center bg-dark-bg/90
          ${isPedestrian ? 'border-neon-blue/40 shadow-[0_0_20px_rgba(0,243,255,0.1)]' : isWarning ? 'border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-neon-red/40 shadow-[0_0_20px_rgba(255,0,60,0.1)]'}`}
        >
          {isPedestrian ? (
            <div className="flex flex-col items-center">
              <span className="text-neon-blue text-4xl font-bold font-mono tracking-tighter text-glow mb-1">
                {timer}
              </span>
              <span className="text-[9px] font-mono text-neon-blue/60 tracking-widest uppercase">Cross Now Safely</span>
            </div>
          ) : isWarning ? (
             <div className="flex flex-col items-center">
              <span className="text-yellow-500 text-4xl font-bold font-mono tracking-tighter text-glow mb-1">
                {timer}
              </span>
              <span className="text-[9px] font-mono text-yellow-500/60 tracking-widest uppercase text-center">Caution // Vehicle Stop Pending</span>
            </div>
          ) : (
            <div className="flex flex-col items-center py-2">
              <span className="text-neon-red font-bold font-mono text-sm tracking-widest animate-pulse uppercase">Vehicle Flow active</span>
              <span className="text-[8px] font-mono text-white/30 mt-1 uppercase">Standing by for demand</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
