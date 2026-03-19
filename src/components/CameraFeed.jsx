import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Camera, Settings } from 'lucide-react';

export function CameraFeed({ videoRef, stream, error, onDetectedCount, devices, switchCamera, currentDeviceId }) {
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);

  // Load COCO-SSD Model on Mount
  useEffect(() => {
    async function loadModel() {
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load({
          base: 'lite_mobilenet_v2' 
        });
        setModel(loadedModel);
        setIsModelLoading(false);
      } catch (err) {
        console.error('Failed to load AI model:', err);
      }
    }
    loadModel();
  }, []);

  // Real AI Logic: Detect pedestrians
  useEffect(() => {
    if (!stream || !canvasRef.current || !videoRef.current || !model) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;
    
    let animationFrameId;

    const runDetection = async () => {
      if (video.readyState === 4) { 
        if (video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const predictions = await model.detect(video);
        const pedestrians = predictions.filter(p => p.class === 'person');
        onDetectedCount(pedestrians.length);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pedestrians.forEach(person => {
          const [x, y, width, height] = person.bbox;
          const score = Math.round(person.score * 100);

          ctx.strokeStyle = '#00f3ff';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);
          
          ctx.fillStyle = '#00f3ff';
          const cLen = 15;
          ctx.fillRect(x, y, cLen, 3);
          ctx.fillRect(x, y, 3, cLen);
          ctx.fillRect(x + width - cLen, y, cLen, 3);
          ctx.fillRect(x + width - 3, y, 3, cLen);
          ctx.fillRect(x, y + height - 3, cLen, 3);
          ctx.fillRect(x, y + height - cLen, 3, cLen);
          ctx.fillRect(x + width - cLen, y + height - 3, cLen, 3);
          ctx.fillRect(x + width - 3, y + height - cLen, 3, cLen);
          
          ctx.fillStyle = 'rgba(0, 243, 255, 0.2)';
          ctx.fillRect(x, y - 25, 120, 25);
          
          ctx.fillStyle = '#00f3ff';
          ctx.font = 'bold 14px "JetBrains Mono", monospace';
          ctx.fillText(`PEDESTRIAN ${score}%`, x + 5, y - 8);
        });
      }
      
      animationFrameId = requestAnimationFrame(runDetection);
    };

    runDetection();

    return () => cancelAnimationFrame(animationFrameId);
  }, [stream, model, onDetectedCount]);

  if (error) {
    return (
      <div className="glass-panel w-full aspect-video flex items-center justify-center text-red-500 font-mono text-center p-4">
        <div>
          <div className="text-4xl mb-2">⚠️</div>
          <div>{error}</div>
          <div className="text-sm opacity-70 mt-2">Check Windows Settings &gt; Privacy &gt; Camera</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden glass-panel-neon border-2 border-neon-blue/30 shadow-[0_0_30px_rgba(0,243,255,0.15)] bg-black">
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline-overlay z-20"></div>
      
      {(!stream || isModelLoading) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-neon-blue bg-black/80 z-40 backdrop-blur-sm">
          <div className="text-2xl animate-pulse flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-neon-blue animate-ping"></div>
             {isModelLoading ? 'AI CORE LOADING...' : 'SEARCHING CAMERA...'}
          </div>
        </div>
      )}

      {/* RAW VIDEO FEED (No Filters for troubleshooting) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover z-0" 
      />
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      />

      {/* Decorative UI elements overlay */}
      <div className="absolute top-4 left-4 z-30 font-mono text-xs text-neon-blue flex flex-col gap-1 tracking-wider opacity-80 mix-blend-screen">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        </div>
      </div>

      {/* Camera Selection Dropdown */}
      <div className="absolute bottom-4 left-4 z-50 flex items-center gap-2">
        <div className="p-2 bg-black/60 border border-neon-blue/50 rounded-md backdrop-blur-sm flex items-center gap-2 text-neon-blue pointer-events-auto">
            <Camera className="w-4 h-4" />
            <select 
              value={currentDeviceId}
              onChange={(e) => switchCamera(e.target.value)}
              className="bg-transparent font-mono text-[10px] outline-none border-none cursor-pointer"
            >
              {devices.map(d => (
                <option key={d.deviceId} value={d.deviceId} className="bg-black text-neon-blue">
                   {d.label || `Camera ${d.deviceId.slice(0, 4)}`}
                </option>
              ))}
            </select>
        </div>
      </div>
      
    </div>
  );
}
