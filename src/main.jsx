import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('--- [AI-SYSTEM-MOUNT-INIT] ---');

// Global Error Tracker for Production
window.onerror = (msg, url, lineNo, columnNo, error) => {
  console.error('CRITICAL_MOUNT_ERROR:', msg, error);
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `<div style="padding: 20px; color: #ff003c; font-family: monospace; background: #000;">
      [SYSTEM_CRASH] ${msg}<br/>
      Please check device compatibility or camera permissions.
    </div>`;
  }
  return false;
};

try {
  const container = document.getElementById('root');
  if (!container) throw new Error('Root element not found');
  
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('--- [AI-SYSTEM-RENDER-QUEUED] ---');
} catch (err) {
  console.error('Mount failure:', err);
}
