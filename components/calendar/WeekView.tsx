import React from 'react';
import { getDaysInWeek, getISOWeek, dateToISOKey, CalendarEvent } from '../../lib/calendar';

interface WeekViewProps {
  currentDate: Date;
  startDayOfWeek: number;
  events: Record<string, CalendarEvent[]>;
  onDayClick: (date: Date) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  startDayOfWeek,
  events,
  onDayClick,
}) => {
  const days = getDaysInWeek(currentDate, startDayOfWeek);
  const weekNum = getISOWeek(currentDate);

  return (
    <div className="week-view-container">
      <div className="week-header">
        Settimana {weekNum}
      </div>
      <div className="week-grid">
        {days.map(day => {
          const isoKey = dateToISOKey(day.date);
          const dayEvents = events[isoKey] || [];
          return (
            <div
              key={day.date.getTime()}
              className={`week-day-cell ${day.isToday ? 'today' : ''} ${day.isWeekend ? 'weekend' : ''}`}
              onClick={() => onDayClick(day.date)}
            >
              <span className="weekday-name">
                {day.date.toLocaleDateString('it-IT', { weekday: 'short' })}
              </span>
              <span className="day-num">{day.date.getDate()}</span>

              <div className="day-events-list">
                {dayEvents.map(event => (
                  <div key={event.id} className="event-item">
                    <span className="event-dot" />
                    <span className="event-title">{event.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .week-view-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .week-header {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          padding: 0 4px;
        }
        .week-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background-color: #ffffff;
          overflow: hidden;
        }
        .week-day-cell {
          min-height: 120px;
          padding: 8px;
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
        }
        .week-day-cell:last-child { border-right: none; }
        .week-day-cell:hover { background-color: var(--hover-bg); }
        .week-day-cell.today { background-color: var(--accent-light); }
        .week-day-cell.weekend { background-color: #fcfcfc; }
        .weekday-name {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .day-num {
          font-size: 18px;
          font-weight: 500;
        }
        .day-events-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 4px;
          overflow-y: auto;
        }
        .event-item {
          display: flex;
          align-items: center;
          gap: 4px;
          background-color: #ffffff;
          padding: 2px 4px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
        }
        .event-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--accent-color);
          flex-shrink: 0;
        }
        .event-title {
          font-size: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (max-width: 768px) {
          .week-grid { grid-template-columns: 1fr; }
          .week-day-cell {
            min-height: auto;
            border-right: none;
            border-bottom: 1px solid var(--border-color);
          }
          .week-day-cell:last-child { border-bottom: none; }
        }
      `}</style>
    </div>
  );
};
