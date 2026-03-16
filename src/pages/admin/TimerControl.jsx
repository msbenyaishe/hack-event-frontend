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
    <div className="container-inner" style={{maxWidth: '64rem'}}>
      <div className="page-header" style={{marginBottom: '3rem'}}>
        <div>
          <h1 className="page-title">Timer Control</h1>
          <p className="page-subtitle">Manage the global hackathon countdown and status</p>
        </div>
        <div className={`status-indicator-pill ${timerStatus?.status === 'running' ? 'active' : ''}`}>
           <div className="pulse-dot" />
           <span>{timerStatus ? timerStatus.status.toUpperCase() : 'LOADING...'}</span>
        </div>
      </div>

      <div className="timer-control-grid">
        <div className="main-timer-card animate-in">
          <div className="timer-glass-hero">
            <span className="hero-label">TIME REMAINING</span>
            <div className="hero-timer-display">
              {timerStatus?.remainingTime ? (
                <>
                  <div className="time-unit">
                    <span className="unit-val">{Math.floor(timerStatus.remainingTime / 3600)}</span>
                    <span className="unit-label">HOURS</span>
                  </div>
                  <div className="time-sep">:</div>
                  <div className="time-unit">
                    <span className="unit-val">{Math.floor((timerStatus.remainingTime % 3600) / 60)}</span>
                    <span className="unit-label">MINUTES</span>
                  </div>
                </>
              ) : <span className="unit-val">-- : --</span>}
            </div>
          </div>

          <div className="timer-actions-premium">
            <button 
              className={`btn-timer-action btn-start ${timerStatus?.status === 'running' ? 'disabled' : ''}`}
              onClick={() => timersApi.start().then(fetchStatus)}
              disabled={timerStatus?.status === 'running'}
            >
              Start 
            </button>
            <button 
              className="btn-timer-action btn-pause"
              onClick={() => timersApi.pause().then(fetchStatus)}
            >
              Pause
            </button>
            <button 
              className="btn-timer-action btn-resume"
              onClick={() => timersApi.resume().then(fetchStatus)}
            >
              Resume
            </button>
            <button 
              className="btn-timer-action btn-finish"
              onClick={() => {
                if(window.confirm("Are you sure you want to finish the hackathon? This cannot be undone.")) {
                  timersApi.finish().then(fetchStatus);
                }
              }}
            >
              Finish
            </button>
          </div>
        </div>

        <div className="timer-info-sidebar animate-in" style={{animationDelay: '0.1s'}}>
          <div className="info-card-premium">
             <h4>System Info</h4>
             <div className="info-row">
                <span>Last Updated</span>
                <span>{new Date().toLocaleTimeString()}</span>
             </div>
             <div className="info-row">
                <span>Server Status</span>
                <span className="text-success">Online</span>
             </div>
          </div>
          
          <div className="info-card-premium warning">
             <h4>Danger Zone</h4>
             <p>Stopping or finishing the timer will affect all participants globally.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerControl;
