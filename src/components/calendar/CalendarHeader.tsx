import React from 'react';
import { getMonthName } from '@/lib/calendar';

interface CalendarHeaderProps {
  currentDate: Date;
  view: string;
  setView: (view: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onDateChange: (date: Date) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  setView,
  onPrev,
  onNext,
  onToday,
  onDateChange,
}) => {
  const views = [
    { id: 'month', label: 'Mese' },
    { id: 'week', label: 'Settimana' },
    { id: 'day', label: 'Giorno' },
    { id: 'year', label: 'Anno' },
    { id: 'agenda', label: 'Agenda' },
  ];

  return (
    <div className="calendar-header-container">
      <div className="view-switcher-row">
        <div className="segmented-control">
          {views.map((v) => (
            <button
              key={v.id}
              className={`seg-btn ${view === v.id ? 'active' : ''}`}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="navigation-row">
        <div className="nav-controls">
          <button className="calc-btn icon-btn" onClick={onPrev} aria-label="Precedente">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="calc-btn text-btn" onClick={onToday}>Oggi</button>
          <button className="calc-btn icon-btn" onClick={onNext} aria-label="Successivo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div className="current-selection">
          <span className="current-date-display">
            {view === 'year' ? currentDate.getFullYear() : `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`}
          </span>
          <input
            type="month"
            className="date-picker-input"
            value={`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split('-').map(Number);
              onDateChange(new Date(y, m - 1, 1));
            }}
          />
        </div>
      </div>

      <style jsx>{`
        .calendar-header-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
        }
        .view-switcher-row {
          display: flex;
          justify-content: center;
        }
        .navigation-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .nav-controls {
          display: flex;
          gap: 8px;
        }
        .icon-btn {
          width: 36px;
          height: 36px;
          padding: 0;
        }
        .text-btn {
          padding: 0 12px;
          height: 36px;
          font-size: 14px;
        }
        .current-selection {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }
        .current-date-display {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .date-picker-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
