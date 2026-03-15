import React, { useState, useEffect } from 'react';
import { timersApi } from '../api/timersApi';

const Timer = () => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [status, setStatus] = useState('waiting');

  useEffect(() => {
    // Basic polling mechanism for timer sync
    const fetchTimer = async () => {
      try {
        const res = await timersApi.getGlobalTimer();
        if (res.data) {
          setStatus(res.data.status);
          const endTime = new Date(res.data.endTime).getTime();
          const now = Date.now();
          const rem = Math.max(0, endTime - now);
          if (res.data.status === 'running') {
             setTimeRemaining(rem);
          } else if (res.data.status === 'paused') {
             setTimeRemaining(res.data.remainingTime || 0);
          }
        }
      } catch (err) {
        // error handling
      }
    };
    
    fetchTimer();
    const interval = setInterval(() => {
      if (status === 'running') {
        setTimeRemaining(prev => Math.max(0, prev - 1000));
      }
    }, 1000);
    
    // Poll server every 30s to sync
    const syncInterval = setInterval(fetchTimer, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(syncInterval);
    };
  }, [status]);

  const formatTime = (ms) => {
    if (!ms || ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-box animate-in">
      <div className="timer-section">
        <span className="timer-label">Time Remaining</span>
        <div className="timer-value">
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      <div className="timer-divider" />

      <div className="timer-section">
        <span className="timer-label">Status</span>
        <div className="status-badge">
          <div className="status-dot" style={{
            backgroundColor: 
              status === 'running' ? 'var(--success)' : 
              status === 'paused' ? 'var(--warning)' : 
              'var(--slate-600)',
            boxShadow: status === 'running' ? '0 0 12px var(--success)' : 'none'
          }} />
          <span className={`status-text status-${status}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Timer;
