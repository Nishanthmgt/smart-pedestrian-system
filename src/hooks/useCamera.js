import { useState, useEffect, useRef } from 'react';

export function useCamera() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [currentDeviceId, setCurrentDeviceId] = useState('');
  const [isActive, setIsActive] = useState(false);

  // Get list of cameras (Labels may be empty until first permission)
  const getDevices = async () => {
    try {
      const devs = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = devs.filter(d => d.kind === 'videoinput');
      setDevices(videoDevs);
    } catch (err) {
      console.error('Error listing devices:', err);
    }
  };

  const startCamera = async (deviceId = null) => {
    // Stop old stream
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }

    const constraints = {
      video: deviceId 
        ? { deviceId: { exact: deviceId } } 
        : { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
    };

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsActive(true);
      setError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      // Now that we have permission, refresh device list to get labels
      await getDevices();
      
      // Set current device ID if not already set
      if (!currentDeviceId && mediaStream.getVideoTracks().length > 0) {
        const settings = mediaStream.getVideoTracks()[0].getSettings();
        if (settings.deviceId) setCurrentDeviceId(settings.deviceId);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      // Fallback: try without exact constraints
      if (deviceId) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { deviceId } });
          setStream(mediaStream);
          setIsActive(true);
          if (videoRef.current) videoRef.current.srcObject = mediaStream;
        } catch (innerErr) {
          setError('Camera access denied or device unavailable.');
        }
      } else {
        setError('Camera access denied. Please enable camera permissions.');
      }
    }
  };

  useEffect(() => {
    // Attempt auto-start on desktop, but mobile might need interaction
    if (!isActive) {
        startCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [currentDeviceId]);

  const switchCamera = (id) => {
    setCurrentDeviceId(id);
    startCamera(id);
  };

  return { videoRef, stream, error, devices, currentDeviceId, switchCamera, startCamera, isActive };
}
