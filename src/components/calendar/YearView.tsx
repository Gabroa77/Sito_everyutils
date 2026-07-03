import React from 'react';
import { getMonthName, getDaysInMonth } from '@/lib/calendar';

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
    <div className="year-grid">
      {months.map(month => {
        const days = getDaysInMonth(year, month, 1).slice(0, 42);
        return (
          <div key={month} className="mini-month" onClick={() => onMonthClick(month)}>
            <div className="mini-header">{getMonthName(month)}</div>
            <div className="mini-days">
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
        .year-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
          padding: 20px;
        }
        .mini-month {
          background-color: #fff;
          border: 1px solid #eee;
          border-radius: 6px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .mini-month:hover { border-color: #3498db; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .mini-header { font-size: 14px; font-weight: 700; text-align: center; margin-bottom: 8px; color: #2c3e50; }
        .mini-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
        .mini-day { font-size: 9px; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 2px; }
        .mini-day.other { color: #eee; }
        .mini-day.today { background-color: #3498db; color: #fff; font-weight: 700; }
      `}</style>
    </div>
  );
};
