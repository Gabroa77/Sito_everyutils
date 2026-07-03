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
    <div className="agenda-container">
      <div className="agenda-header">Elenco Eventi - {currentDate.toLocaleString('it-IT', { month: 'long', year: 'numeric' })}</div>
      <div className="agenda-list">
        {days.map(day => {
          const isoKey = dateToISOKey(day.date);
          const dayEvents = events[isoKey] || [];

          return (
            <div
              key={isoKey}
              className={`agenda-row ${day.isToday ? 'today' : ''}`}
              onClick={() => onDayClick(day.date)}
            >
              <div className="date-box">
                <span className="day-name">{getDayName(day.date.getDay()).slice(0, 3)}</span>
                <span className="day-val">{day.date.getDate()}</span>
              </div>
              <div className="content-box">
                {dayEvents.length === 0 ? (
                  <span className="no-events">--</span>
                ) : (
                  dayEvents.map(event => (
                    <div key={event.id} className="event-row">
                      {event.time && <span className="time">{event.time}</span>}
                      <span className="title">{event.title}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .agenda-container {
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: #fff;
          overflow: hidden;
        }
        .agenda-header {
          background-color: #f8f9fa;
          padding: 12px 16px;
          font-weight: 700;
          border-bottom: 1px solid var(--border-color);
          color: #34495e;
        }
        .agenda-row {
          display: flex;
          border-bottom: 1px solid #eee;
          cursor: pointer;
        }
        .agenda-row:hover { background-color: #f9f9f9; }
        .agenda-row.today { background-color: #fff9db; }
        .date-box {
          width: 80px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-right: 1px solid #eee;
          background-color: #fafafa;
        }
        .day-name { font-size: 11px; text-transform: uppercase; color: #7f8c8d; font-weight: 600; }
        .day-val { font-size: 20px; font-weight: 700; color: #2c3e50; }
        .content-box { padding: 12px 16px; flex-grow: 1; display: flex; flex-direction: column; gap: 8px; justify-content: center; }
        .no-events { color: #bdc3c7; font-size: 14px; }
        .event-row { display: flex; gap: 12px; align-items: center; }
        .time { font-size: 12px; font-weight: 700; color: var(--accent-color); background: #ebf5ff; padding: 2px 6px; border-radius: 4px; }
        .title { font-size: 14px; font-weight: 500; }
      `}</style>
    </div>
  );
};
