import React, { useState, useEffect } from 'react';
import { timersApi } from '../../api/timersApi';

const TimerControl = () => {
  const [timerStatus, setTimerStatus] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await timersApi.getGlobalTimer();
      setTimerStatus(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-inner" style={{maxWidth: '56rem'}}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Timer Control</h1>
          <p className="page-subtitle">Manage the global hackathon countdown</p>
        </div>
      </div>

      <div className="timer-container animate-in">
        <div className="status-card">
          <div>
            <span className="filter-label" style={{display: 'block', marginBottom: '0.5rem'}}>System Status</span>
            <div className="status-indicator">
              <div className={`status-dot ${
                timerStatus?.status === 'running' ? 'status-running' : 
                timerStatus?.status === 'paused' ? 'status-paused' : 
                'status-idle'
              }`} />
              <span className="status-text">
                {timerStatus ? timerStatus.status : 'Connecting...'}
              </span>
            </div>
          </div>
          
          <div className="timer-display">
            <span className="filter-label" style={{display: 'block', marginBottom: '0.25rem'}}>Time Remaining</span>
            <div className="timer-digits">
              {timerStatus?.remainingTime ? (
                <span>{Math.floor(timerStatus.remainingTime / 3600)}h {Math.floor((timerStatus.remainingTime % 3600) / 60)}m</span>
              ) : '--h --m'}
            </div>
          </div>
        </div>

        <div className="timer-actions-grid">
          <button 
            className="btn-timer btn-start"
            onClick={() => timersApi.start().then(fetchStatus)}
          >
            Start Timer
          </button>
          <button 
            className="btn-timer btn-pause"
            onClick={() => timersApi.pause().then(fetchStatus)}
          >
            Pause Timer
          </button>
          <button 
            className="btn-timer btn-resume"
            onClick={() => timersApi.resume().then(fetchStatus)}
          >
            Resume Timer
          </button>
          <button 
            className="btn-timer btn-finish"
            onClick={() => timersApi.finish().then(fetchStatus)}
          >
            Finish Hackathon
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerControl;
