import { useState, useEffect, useRef } from 'react';

export function useCamera() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [currentDeviceId, setCurrentDeviceId] = useState('');

  // Get list of cameras
  useEffect(() => {
    async function getDevices() {
      try {
        const devs = await navigator.mediaDevices.enumerateDevices();
        const videoDevs = devs.filter(d => d.kind === 'videoinput');
        setDevices(videoDevs);
        if (videoDevs.length > 0 && !currentDeviceId) {
          setCurrentDeviceId(videoDevs[0].deviceId);
        }
      } catch (err) {
        console.error('Error listing devices:', err);
      }
    }
    getDevices();
  }, []);

  useEffect(() => {
    if (!currentDeviceId) return;
    
    let activeStream = null;

    async function startCamera() {
      // Stop old stream
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            deviceId: { exact: currentDeviceId },
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          }
        });
        
        setStream(mediaStream);
        activeStream = mediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        // Fallback for some browsers that don't like 'exact'
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: currentDeviceId }
            });
            setStream(mediaStream);
            activeStream = mediaStream;
            if (videoRef.current) videoRef.current.srcObject = mediaStream;
        } catch (innerErr) {
            console.error('Error accessing camera:', err);
            setError(err.message || 'Failed to access camera');
        }
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [currentDeviceId]);

  const switchCamera = (id) => setCurrentDeviceId(id);

  return { videoRef, stream, error, devices, currentDeviceId, switchCamera };
}
