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
  onPrint: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  setView,
  onPrev,
  onNext,
  onToday,
  onDateChange,
  onPrint,
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
      <div className="header-top-bar">
        <h2 className="header-title">
          {view === 'year' ? currentDate.getFullYear() : `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`}
        </h2>
        <div className="nav-group">
          <button className="nav-btn" onClick={onPrev}>&laquo;</button>
          <button className="nav-btn today-btn" onClick={onToday}>Oggi</button>
          <button className="nav-btn" onClick={onNext}>&raquo;</button>
        </div>
      </div>

      <div className="header-bottom-bar">
        <div className="view-selector">
          {views.map((v) => (
            <button
              key={v.id}
              className={`view-btn ${view === v.id ? 'active' : ''}`}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="action-group">
          <button className="icon-btn" onClick={onPrint} title="Stampa o Salva PDF">🖨️</button>
          <input
            type="month"
            className="month-picker"
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
          background-color: #ffffff;
          border-bottom: 1px solid var(--border-color);
          padding: 16px 24px;
        }
        .header-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .header-title { font-size: 22px; font-weight: 700; color: #2c3e50; }
        .nav-group { display: flex; gap: 4px; }
        .nav-btn { padding: 6px 12px; border: 1px solid var(--border-color); background-color: #f8f9fa; cursor: pointer; font-weight: 600; border-radius: 4px; }
        .nav-btn:hover { background-color: var(--hover-bg); }
        .today-btn { min-width: 60px; }
        .header-bottom-bar { display: flex; justify-content: space-between; align-items: center; }
        .view-selector { display: flex; border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden; }
        .view-btn { padding: 8px 16px; border: none; background: #ffffff; cursor: pointer; font-size: 13px; font-weight: 500; border-right: 1px solid var(--border-color); }
        .view-btn:last-child { border-right: none; }
        .view-btn.active { background-color: var(--accent-color); color: #ffffff; }
        .action-group { display: flex; gap: 12px; align-items: center; }
        .icon-btn { background: none; border: 1px solid var(--border-color); padding: 5px 8px; border-radius: 4px; cursor: pointer; font-size: 16px; }
        .icon-btn:hover { background: #f8f9fa; }
        .month-picker { padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 13px; outline: none; }
        @media print { .calendar-header-container { border: none; } .view-selector, .action-group, .nav-group { display: none; } .header-top-bar { justify-content: center; } }
      `}</style>
    </div>
  );
};
