import React from 'react';
import { formatDateExtended, getISOWeek, getDayOfYear, dateToISOKey, CalendarEvent } from '@/lib/calendar';

interface DayViewProps {
  currentDate: Date;
  events: Record<string, CalendarEvent[]>;
  onAddEvent: (date: Date) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  onAddEvent,
}) => {
  const isoKey = dateToISOKey(currentDate);
  const dayEvents = events[isoKey] || [];

  return (
    <div className="day-view-container">
      <div className="day-card">
        <header className="day-header">
          <h2>{formatDateExtended(currentDate)}</h2>
          <div className="day-stats">
            <span className="stat-tag">Settimana {getISOWeek(currentDate)}</span>
            <span className="stat-tag">Giorno {getDayOfYear(currentDate)} del 365</span>
          </div>
        </header>

        <div className="events-section">
          <h3>Eventi</h3>
          {dayEvents.length === 0 ? (
            <div className="no-events">
              Nessun evento per oggi.
              <button className="calc-btn text-btn" onClick={() => onAddEvent(currentDate)}>Aggiungi evento</button>
            </div>
          ) : (
            <div className="events-list">
              {dayEvents.map(event => (
                <div key={event.id} className="event-detail">
                  <div className="event-time">{event.time || '--:--'}</div>
                  <div className="event-info">
                    <div className="event-title">{event.title}</div>
                  </div>
                </div>
              ))}
              <button className="calc-btn text-btn" onClick={() => onAddEvent(currentDate)}>Aggiungi altro</button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .day-view-container {
          display: flex;
          justify-content: center;
        }
        .day-card {
          width: 100%;
          max-width: 500px;
          background-color: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .day-header h2 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .day-stats {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }
        .stat-tag {
          font-size: 11px;
          background-color: var(--bg-sidebar);
          padding: 4px 8px;
          border-radius: 4px;
          color: var(--text-secondary);
        }
        .events-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .no-events {
          text-align: center;
          padding: 32px;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .events-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .event-detail {
          display: flex;
          gap: 16px;
          padding: 12px;
          background-color: var(--bg-sidebar);
          border-radius: 8px;
          border-left: 4px solid var(--accent-color);
        }
        .event-time {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          min-width: 45px;
        }
        .event-title {
          font-size: 14px;
          font-weight: 500;
        }
        .text-btn {
          margin-top: 8px;
          height: 32px;
          padding: 0 12px;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};
