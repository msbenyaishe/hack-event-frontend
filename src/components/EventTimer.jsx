import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Countdown from './Countdown';
import { timersApi } from '../api/timersApi';

const parseDateSafely = (value) => {
  if (!value) return null;
  // Normalize for consistent parsing across browsers.
  const safeString = String(value)
    .replace('T', ' ')
    .replace(/-/g, '/')
    .split('.')[0]
    .replace('Z', '');
  const ms = new Date(safeString).getTime();
  return Number.isFinite(ms) ? ms : null;
};

const formatTime = (ms) => {
  if (!ms || ms <= 0) return '00:00:00';
  const totalSeconds = Math.round(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
    .toString()
    .padStart(2, '0')}`;
};

const EventTimer = ({ startDate, endDate }) => {
  const { t } = useTranslation();
  const [timerStatus, setTimerStatus] = useState(null);
  const [timeRemainingMs, setTimeRemainingMs] = useState(0);

  const startMs = useMemo(() => parseDateSafely(startDate), [startDate]);
  const endMs = useMemo(() => parseDateSafely(endDate), [endDate]);

  useEffect(() => {
    let interval;

    const sync = async () => {
      try {
        const res = await timersApi.getGlobalTimer();
        const { status, endTime, remainingSeconds, serverTime } = res.data || {};

        setTimerStatus(status || null);

        // Prefer backend-provided remainingSeconds to avoid timezone parsing drift.
        if (typeof remainingSeconds === 'number') {
          setTimeRemainingMs(Math.max(0, remainingSeconds * 1000));
          return;
        }

        // Fallback: compute using endTime - serverTime (only if remainingSeconds is missing).
        if (status === 'running' && endTime && serverTime) {
          const endMsLocal = new Date(endTime).getTime();
          const serverMsLocal = new Date(serverTime).getTime();
          setTimeRemainingMs(Math.max(0, endMsLocal - serverMsLocal));
          return;
        }

        setTimeRemainingMs(0);
      } catch (err) {
        console.error('EventTimer sync error:', err);
      }
    };

    // Initial sync + periodic refresh to avoid drift.
    sync();
    const poll = setInterval(sync, 15000);

    // Smooth countdown while running (then corrected on next poll).
    interval = setInterval(() => {
      setTimeRemainingMs((prev) => {
        if (timerStatus !== 'running') return prev;
        return Math.max(0, prev - 1000);
      });
    }, 1000);

    return () => {
      clearInterval(poll);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerStatus]);

  // If backend global timer is in a "waiting/upcoming" state, use the event dates as fallback.
  // (This keeps the UI meaningful before the admin starts the global timer.)
  const normalizedStatus = timerStatus || 'waiting';
  const phase =
    normalizedStatus === 'running' || normalizedStatus === 'paused' || normalizedStatus === 'finished'
      ? normalizedStatus
      : startMs && endMs
        ? 'upcoming'
        : 'waiting';

  if (phase === 'upcoming' && startDate) {
    return <Countdown startDate={startDate} />;
  }

  const remainingMs =
    phase === 'finished' ? 0 : Math.max(0, timeRemainingMs || 0);

  const statusLabel =
    phase === 'running'
      ? t('event_in_progress') || 'Event in Progress'
      : phase === 'paused'
        ? t('paused') || 'Paused'
        : phase === 'finished'
          ? t('finished') || 'Finished'
          : t('waiting') || 'Waiting';

  return (
    <div className="timer-box animate-in">
      <div className="timer-section">
        <span className="timer-label">{t('time_remaining') || 'Time Remaining'}</span>
        <div className="timer-value">{formatTime(remainingMs)}</div>
      </div>

      <div className="timer-divider" />

      <div className="timer-section">
        <span className="timer-label">{t('status') || 'Status'}</span>
        <div className={`status-indicator-pill ${phase === 'running' ? 'active' : ''}`}>
          <span className="pulse-dot" />
          <span>{statusLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default EventTimer;

