import React, { useState, useEffect } from 'react';
import { timersApi } from '../api/timersApi';
import { useTranslation } from 'react-i18next';

const Timer = () => {
  const { t } = useTranslation();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [status, setStatus] = useState('waiting');
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const res = await timersApi.getGlobalTimer();
        if (res.data) {
          const { status: newStatus, endTime, remainingSeconds, serverTime } = res.data;
          
          // Calculate offset: how much faster/slower client is vs server
          if (serverTime) {
            const serverMs = new Date(serverTime).getTime();
            const clientMs = Date.now();
            setOffset(serverMs - clientMs);
          }

          setStatus(newStatus);

          if (newStatus === 'running' && endTime) {
            const endMs = new Date(endTime).getTime();
            const nowAdjusted = Date.now() + (serverTime ? (new Date(serverTime).getTime() - Date.now()) : offset);
            setTimeRemaining(Math.max(0, endMs - nowAdjusted));
          } else {
            setTimeRemaining((remainingSeconds || 0) * 1000);
          }
        }
      } catch (err) {
        console.error("Timer Sync Error:", err);
      }
    };
    
    fetchTimer();
    const syncInterval = setInterval(fetchTimer, 15000);

    return () => clearInterval(syncInterval);
  }, []);

  useEffect(() => {
    let interval;
    if (status === 'running') {
      interval = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);


  const formatTime = (ms) => {
    if (!ms || ms <= 0) return '00:00:00';
    const totalSeconds = Math.round(ms / 1000);
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
            {t(status) || status.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Timer;
