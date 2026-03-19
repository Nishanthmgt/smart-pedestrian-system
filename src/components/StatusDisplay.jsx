import React from 'react';
import { Activity, Users, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

export function StatusDisplay({ mode, peopleCount, isWaiting }) {
  const isPedestrian = mode === 'PEDESTRIAN';

  return (
    <div className="glass-panel-neon p-6 grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
      <StatusItem 
        icon={<Activity className="w-5 h-5 text-neon-blue" />}
        label="SYSTEM STATUS"
        value="ONLINE"
        valueColor="text-neon-blue"
        pulse
      />
      
      <StatusItem 
        icon={<Users className="w-5 h-5 text-purple-400" />}
        label="DETECTED ENTITIES"
        value={peopleCount}
        valueColor={peopleCount >= 3 ? "text-yellow-400" : "text-purple-400"}
      />
      
      <StatusItem 
        icon={<ShieldCheck className="w-5 h-5 text-green-400" />}
        label="CONTROL MODE"
        value={mode}
        valueColor={isPedestrian ? "text-neon-blue" : "text-green-400"}
      />

      <StatusItem 
        icon={<AlertTriangle className={`w-5 h-5 ${isWaiting ? 'text-yellow-500' : 'text-gray-500'}`} />}
        label="TRIGGER STATE"
        value={isWaiting ? "ANALYZING..." : "STANDBY"}
        valueColor={isWaiting ? "text-yellow-500 animate-pulse" : "text-gray-500"}
      />
    </div>
  );
}

function StatusItem({ icon, label, value, valueColor, pulse }) {
  return (
    <div className="bg-black/40 border border-neon-blue/20 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden group hover:border-neon-blue/50 transition-colors">
      <div className="absolute top-0 left-0 w-1 h-full bg-neon-blue opacity-20 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-mono text-gray-400 tracking-wider">{label}</span>
      </div>
      
      <div className={`text-xl font-bold font-mono tracking-widest ${valueColor} text-glow flex items-center gap-2`}>
        {pulse && <div className="w-2 h-2 rounded-full bg-current animate-pulse-fast"></div>}
        {value}
      </div>
    </div>
  );
}
