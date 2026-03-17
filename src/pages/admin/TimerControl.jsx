import React, { useState, useEffect } from 'react';
import { timersApi } from '../../api/timersApi';
import { useTranslation } from 'react-i18next';
import { Play, Pause, RotateCcw, CheckCircle, Info, Clock, Square } from 'lucide-react';

const TimerControl = () => {
  const { t } = useTranslation();
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
      <div className="page-header" style={{marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem'}}>
        <div style={{minWidth: '280px'}}>
          <h1 className="page-title">{t('timer_control')}</h1>
          <p className="page-subtitle">{t('manage_timer')}</p>
        </div>
        <div className={`status-indicator-pill ${timerStatus?.status === 'running' ? 'active' : ''}`} style={{marginLeft: 'auto'}}>
           <div className="pulse-dot" />
           <span>{timerStatus ? t(timerStatus.status) || timerStatus.status.toUpperCase() : t('loading')}</span>
        </div>
      </div>

      <div className="timer-control-grid">
        <div className="main-timer-card animate-in">
          <div className="timer-glass-hero">
            <span className="hero-label">{t('time_remaining')}</span>
            <div className="hero-timer-display">
              <span className="unit-val">{formatTime(Math.round(timeRemaining / 1000))}</span>
            </div>
          </div>

          <div className="timer-config-premium">
             <div className="config-label">{t('set_duration')}</div>
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
                  placeholder={t('duration')}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                />
             </div>
          </div>

          <div className="timer-actions-premium" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem'}}>
            <button 
              className={`btn-timer-action btn-start ${timerStatus?.status === 'running' ? 'disabled' : ''}`}
              onClick={() => timersApi.start(duration).then(fetchStatus)}
              disabled={timerStatus?.status === 'running'}
            >
              <Play size={20} />
              {t('start')}
            </button>
            <button 
              className="btn-timer-action btn-pause"
              onClick={() => timersApi.pause().then(fetchStatus)}
            >
              <Pause size={20} />
              {t('pause')}
            </button>
            <button 
              className="btn-timer-action btn-resume"
              onClick={() => timersApi.resume().then(fetchStatus)}
            >
              <RotateCcw size={20} />
              {t('resume')}
            </button>
            <button 
              className="btn-timer-action btn-finish"
              onClick={() => {
                if(window.confirm(t('confirm_finish_hackathon'))) {
                  timersApi.finish().then(fetchStatus);
                }
              }}
            >
              <CheckCircle size={20} />
              {t('finish')}
            </button>
          </div>
        </div>

        <div className="timer-info-sidebar animate-in" style={{animationDelay: '0.1s'}}>
          <div className="info-card-premium">
             <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                <Info size={18} className="text-primary-600" />
                <h4 style={{margin: 0}}>{t('system_info')}</h4>
             </div>
             <div className="info-row">
                <span>{t('last_updated')}</span>
                <span>{new Date().toLocaleTimeString()}</span>
             </div>
             <div className="info-row">
                <span>{t('server_status')}</span>
                <span className="text-success" style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                  <div className="pulse-dot" style={{width: '6px', height: '6px'}} />
                  {t('online')}
                </span>
             </div>
          </div>
          
          <div className="info-card-premium warning">
             <h4 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Clock size={18} />
                {t('danger_zone')}
             </h4>
             <p>{t('timer_warning')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerControl;
