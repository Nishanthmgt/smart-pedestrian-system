import React from 'react';
import { AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';

export function AlertPanel({ mode, timer }) {
  const isPedestrian = mode === 'PEDESTRIAN';
  const isWarning = mode === 'WARNING';

  return (
    <div className={`glass-panel p-4 flex items-center justify-between border-l-4 transition-all duration-500
      ${isPedestrian ? 'border-neon-blue bg-neon-blue/10 shadow-[0_0_15px_rgba(0,243,255,0.1)]' : 
        isWarning ? 'border-yellow-500 bg-yellow-500/10' : 
        'border-neutral-700 bg-neutral-900'}
    `}>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full transition-all duration-500
          ${isPedestrian ? 'bg-neon-blue/20 text-neon-blue animate-pulse' : 
            isWarning ? 'bg-yellow-500/20 text-yellow-500 animate-flicker' : 
            'bg-neutral-800 text-neutral-500'}`}
        >
          {isWarning ? <ShieldAlert className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
        </div>
        <div>
          <h3 className={`font-mono font-bold tracking-widest text-sm transition-all duration-500
            ${isPedestrian ? 'text-neon-blue text-glow' : 
              isWarning ? 'text-yellow-500' : 
              'text-neutral-400'}`}
          >
            {isPedestrian ? 'PEDESTRIAN CROSSING ACTIVE' : 
             isWarning ? 'VEHICLE STOP PENDING' : 
             'SYSTEM STANDBY'}
          </h3>
          <p className="text-[10px] text-neutral-500 font-mono mt-1 uppercase opacity-70">
            {isPedestrian ? 'Vehicles must stop. Pedestrians cross now.' : 
             isWarning ? 'Warning cycle initiated. Vehicles slow down.' : 
             'Monitoring for pedestrian arrival...'}
          </p>
        </div>
      </div>
      
      {(isPedestrian || isWarning) && (
        <div className="text-right flex items-center gap-4">
           <div className={`font-mono font-bold text-2xl text-glow tabular-nums transition-all duration-500
             ${isPedestrian ? 'text-neon-blue' : 'text-yellow-500'}`}>
             {timer.toString().padStart(2, '0')}s
           </div>
           <ArrowRight className={`w-6 h-6 ${isPedestrian ? 'text-neon-blue' : 'text-yellow-500'}`} />
        </div>
      )}
    </div>
  );
}
