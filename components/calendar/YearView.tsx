import React from 'react';
import { getMonthName, getDaysInMonth } from '../../lib/calendar';

interface YearViewProps {
  currentDate: Date;
  onMonthClick: (month: number) => void;
}

export const YearView: React.FC<YearViewProps> = ({
  currentDate,
  onMonthClick,
}) => {
  const year = currentDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="year-view-grid">
      {months.map(month => {
        const days = getDaysInMonth(year, month, 1).slice(0, 42);
        return (
          <div key={month} className="mini-month" onClick={() => onMonthClick(month)}>
            <div className="mini-month-header">{getMonthName(month)}</div>
            <div className="mini-month-grid">
              {days.map((day, idx) => (
                <div
                  key={idx}
                  className={`mini-day ${!day.isCurrentMonth ? 'other' : ''} ${day.isToday ? 'today' : ''}`}
                >
                  {day.date.getDate()}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <style jsx>{`
        .year-view-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 24px;
        }
        .mini-month {
          background-color: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .mini-month:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .mini-month-header {
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 8px;
        }
        .mini-month-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .mini-day {
          font-size: 8px;
          text-align: center;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
        }
        .mini-day.other { color: var(--border-color); }
        .mini-day.today {
          background-color: var(--accent-color);
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};
