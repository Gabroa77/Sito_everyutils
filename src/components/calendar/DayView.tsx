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
    <div className="day-detail-view">
      <div className="day-header-banner">
         <h2>{formatDateExtended(currentDate)}</h2>
         <div className="stats-row">
            <span className="badge">Settimana {getISOWeek(currentDate)}</span>
            <span className="badge">Giorno {getDayOfYear(currentDate)} dell'anno</span>
         </div>
      </div>

      <div className="day-content">
         <div className="events-box">
            <div className="box-title">Eventi in programma</div>
            {dayEvents.length === 0 ? (
               <div className="empty-state">
                  <p>Non ci sono eventi registrati per oggi.</p>
                  <button className="btn-add" onClick={() => onAddEvent(currentDate)}>Aggiungi ora</button>
               </div>
            ) : (
               <div className="event-list">
                  {dayEvents.map(event => (
                     <div key={event.id} className="event-card">
                        <span className="ev-time">{event.time || '--:--'}</span>
                        <span className="ev-title">{event.title}</span>
                     </div>
                  ))}
                  <button className="btn-add small" onClick={() => onAddEvent(currentDate)}>+ Aggiungi altro</button>
               </div>
            )}
         </div>
      </div>

      <style jsx>{`
        .day-detail-view { display: flex; flex-direction: column; background: #fff; border-radius: 8px; overflow: hidden; }
        .day-header-banner { padding: 40px; background: #f8f9fa; border-bottom: 1px solid #eee; text-align: center; }
        .day-header-banner h2 { font-size: 28px; margin-bottom: 12px; color: #2c3e50; }
        .stats-row { display: flex; gap: 12px; justify-content: center; }
        .badge { font-size: 12px; font-weight: 700; color: #7f8c8d; background: #ebf0f1; padding: 4px 12px; border-radius: 20px; }
        .day-content { padding: 40px; max-width: 600px; margin: 0 auto; width: 100%; }
        .box-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #3498db; margin-bottom: 20px; }
        .empty-state { text-align: center; padding: 40px; border: 2px dashed #eee; border-radius: 8px; }
        .empty-state p { color: #bdc3c7; margin-bottom: 20px; }
        .btn-add { background: #3498db; color: #fff; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 700; cursor: pointer; }
        .btn-add.small { background: #f8f9fa; color: #3498db; border: 1px solid #3498db; padding: 8px 16px; margin-top: 20px; }
        .event-list { display: flex; flex-direction: column; gap: 12px; }
        .event-card { display: flex; gap: 20px; padding: 16px; background: #fdfdfd; border: 1px solid #eee; border-radius: 6px; border-left: 4px solid #3498db; }
        .ev-time { font-weight: 800; color: #2c3e50; }
        .ev-title { font-weight: 500; }
      `}</style>
    </div>
  );
};
