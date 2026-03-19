import React from 'react';
import { History, Users, Clock, Calendar } from 'lucide-react';

export function CrossingHistory({ history }) {
  return (
    <div className="glass-panel-neon flex flex-col h-full overflow-hidden border-neon-blue/20">
      <div className="p-4 border-b border-neon-blue/30 bg-neon-blue/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-neon-blue" />
          <h2 className="font-mono font-bold tracking-widest text-sm text-neon-blue">CROSSING_LOGS (Ω)</h2>
        </div>
        <div className="text-[10px] font-mono text-gray-500">AUTO_SAVE: ON</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {history.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-600 font-mono text-xs italic">
            &gt; NO RECENT CROSSING DATA...
          </div>
        ) : (
          history.slice().reverse().map((event, index) => (
            <div 
              key={event.id} 
              className="bg-black/40 border-l-2 border-neon-blue/40 p-3 rounded-r-lg group hover:bg-neon-blue/5 transition-all duration-300 animate-in fade-in slide-in-from-right-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono p-1 bg-neon-blue/10 text-neon-blue rounded">
                    ID_{event.id.slice(0,4)}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">
                    {event.timestamp}
                  </span>
                </div>
                <div className="text-neon-blue font-bold text-xs flex items-center gap-1">
                   <Users className="w-3 h-3" />
                   {event.count} PERS
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  DUR: {event.duration}s
                </div>
                <div className="text-green-500/80">
                  STATUS: COMPLETED
                </div>
              </div>
              
              {/* Decorative progress-like bar */}
              <div className="w-full h-px bg-gray-800 mt-2 relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-neon-blue opacity-40 shadow-[0_0_5px_rgba(0,243,255,0.5)]"
                  style={{ width: `${(event.count / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-3 border-t border-neon-blue/20 bg-black/20 text-[9px] font-mono text-gray-500 text-center tracking-widest">
        SYSTEM ENCRYPTED // END TO END
      </div>
    </div>
  );
}
