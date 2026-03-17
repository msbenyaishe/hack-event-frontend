import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';

const Countdown = ({ startDate }) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!startDate) return;

    const targetDate = new Date(startDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsStarted(true);
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  if (!startDate) return null;

  return (
    <div className={`countdown-premium ${isStarted ? 'started' : ''} animate-in`}>
      <div className="countdown-header-icon flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <Calendar size={18} className={isStarted ? 'text-success' : 'text-primary'} />
          <span className="font-black tracking-widest text-slate-400 uppercase text-[10px]">
            {isStarted ? t('event_in_progress') || 'Event in Progress' : t('time_until_start') || 'Time Until Start'}
          </span>
        </div>
        {isStarted && <div className="live-badge-mini">{t('live_label') || 'LIVE'}</div>}
      </div>
      
      <div className="countdown-timer-row mt-4">
        <div className="countdown-block">
          <span className="val">{isStarted ? '00' : timeLeft.days.toString().padStart(2, '0')}</span>
          <span className="lab">{t('days')}</span>
        </div>
        <span className="sep">:</span>
        <div className="countdown-block">
          <span className="val">{isStarted ? '00' : timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className="lab">{t('hours')}</span>
        </div>
        <span className="sep">:</span>
        <div className="countdown-block">
          <span className="val">{isStarted ? '00' : timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className="lab">{t('minutes')}</span>
        </div>
        <span className="sep">:</span>
        <div className="countdown-block">
          <span className="val">{isStarted ? '00' : timeLeft.seconds.toString().padStart(2, '0')}</span>
          <span className="lab">{t('seconds')}</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
