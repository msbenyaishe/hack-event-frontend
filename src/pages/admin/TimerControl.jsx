import React, { useState, useEffect } from 'react';
import { timersApi } from '../../api/timersApi';

const TimerControl = () => {
  const [duration, setDuration] = useState(86400); // 24h default
  const [timerStatus, setTimerStatus] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const fetchStatus = async () => {
    try {
      const res = await timersApi.getGlobalTimer();
      setTimerStatus(res.data);
      
      const { status, endTime, remainingSeconds, serverTime } = res.data;
      if (status === 'running' && endTime) {
        const endMs = new Date(endTime).getTime();
        const serverMs = new Date(serverTime).getTime();
        const clientMs = Date.now();
        const offset = serverMs - clientMs;
        setTimeRemaining(Math.max(0, endMs - (clientMs + offset)));
      } else {
        setTimeRemaining((remainingSeconds || 0) * 1000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const pollInterval = setInterval(fetchStatus, 15000);
    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    let interval;
    if (timerStatus?.status === 'running') {
      interval = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerStatus?.status]);

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return '00:00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
              <span className="unit-val">{formatTime(Math.floor(timeRemaining / 1000))}</span>
            </div>
          </div>

          <div className="timer-config-premium">
             <div className="config-label">SET DURATION</div>
             <div className="config-pills">
                {[7200, 14400, 28800, 43200, 86400].map(sec => (
                  <button 
                    key={sec} 
                    className={`pill ${duration === sec ? 'active' : ''}`}
                    onClick={() => setDuration(sec)}
                  >
                    {sec / 3600}h
                  </button>
                ))}
                <input 
                  type="number" 
                  className="duration-input" 
                  placeholder="Seconds..."
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                />
             </div>
          </div>

          <div className="timer-actions-premium">
            <button 
              className={`btn-timer-action btn-start ${timerStatus?.status === 'running' ? 'disabled' : ''}`}
              onClick={() => timersApi.start(duration).then(fetchStatus)}
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
