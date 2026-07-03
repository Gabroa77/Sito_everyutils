import React from 'react';
import { getDaysInMonth, dateToISOKey, CalendarEvent, getDayName } from '@/lib/calendar';

interface AgendaViewProps {
  currentDate: Date;
  events: Record<string, CalendarEvent[]>;
  onDayClick: (date: Date) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  currentDate,
  events,
  onDayClick,
}) => {
  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth(), 1)
    .filter(d => d.isCurrentMonth);

  return (
    <div className="agenda-view-container">
      {days.map(day => {
        const isoKey = dateToISOKey(day.date);
        const dayEvents = events[isoKey] || [];

        return (
          <div
            key={isoKey}
            className={`agenda-day-row ${day.isToday ? 'today' : ''}`}
            onClick={() => onDayClick(day.date)}
          >
            <div className="agenda-date-col">
              <span className="agenda-day-num">{day.date.getDate()}</span>
              <span className="agenda-day-name">{getDayName(day.date.getDay()).slice(0, 3)}</span>
            </div>
            <div className="agenda-events-col">
              {dayEvents.length === 0 ? (
                <span className="no-events-text">Nessun evento</span>
              ) : (
                dayEvents.map(event => (
                  <div key={event.id} className="agenda-event-item">
                    {event.time && <span className="event-time">{event.time}</span>}
                    <span className="event-title">{event.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}

      <style jsx>{`
        .agenda-view-container {
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        .agenda-day-row {
          display: flex;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: background-color 0.15s;
        }
        .agenda-day-row:last-child { border-bottom: none; }
        .agenda-day-row:hover { background-color: var(--hover-bg); }
        .agenda-day-row.today { background-color: var(--accent-light); }
        .agenda-date-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 40px;
          margin-right: 20px;
        }
        .agenda-day-num {
          font-size: 18px;
          font-weight: 700;
        }
        .agenda-day-name {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .agenda-events-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
          justify-content: center;
        }
        .no-events-text {
          font-size: 13px;
          color: var(--text-secondary);
          font-style: italic;
        }
        .agenda-event-item {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 14px;
        }
        .event-time {
          font-weight: 600;
          color: var(--accent-color);
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};
