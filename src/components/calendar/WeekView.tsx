import React from 'react';
import { getDaysInWeek, getISOWeek, dateToISOKey, CalendarEvent } from '@/lib/calendar';

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
    <div className="week-view">
      <div className="week-info">Settimana {weekNum}</div>
      <div className="week-columns">
        {days.map(day => {
          const isoKey = dateToISOKey(day.date);
          const dayEvents = events[isoKey] || [];
          return (
            <div
              key={day.date.getTime()}
              className={`week-col ${day.isToday ? 'today' : ''} ${day.isWeekend ? 'weekend' : ''}`}
              onClick={() => onDayClick(day.date)}
            >
              <div className="col-header">
                <span className="w-name">{day.date.toLocaleDateString('it-IT', { weekday: 'short' })}</span>
                <span className="w-num">{day.date.getDate()}</span>
              </div>
              <div className="col-events">
                {dayEvents.map(ev => (
                  <div key={ev.id} className="ev-pill" title={ev.title}>
                    {ev.time && <span className="t">{ev.time}</span>}
                    <span className="txt">{ev.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .week-view { display: flex; flex-direction: column; padding: 20px; }
        .week-info { font-size: 14px; font-weight: 700; color: #7f8c8d; margin-bottom: 20px; text-transform: uppercase; }
        .week-columns { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: #eee; border: 1px solid #eee; border-radius: 4px; overflow: hidden; }
        .week-col { background: #fff; min-height: 400px; display: flex; flex-direction: column; cursor: pointer; transition: all 0.2s; }
        .week-col:hover { background: #f8f9fa; }
        .week-col.today { background: #ebf5ff; }
        .week-col.weekend { background: #fdfdfd; }
        .col-header { padding: 12px; display: flex; flex-direction: column; align-items: center; border-bottom: 1px solid #f1f1f1; gap: 4px; }
        .w-name { font-size: 11px; font-weight: 700; color: #95a5a6; text-transform: uppercase; }
        .w-num { font-size: 20px; font-weight: 800; color: #2c3e50; }
        .today .w-num { color: #3498db; }
        .col-events { padding: 8px; display: flex; flex-direction: column; gap: 4px; }
        .ev-pill { background: #fff; border: 1px solid #eee; border-left: 3px solid #3498db; padding: 4px 6px; border-radius: 3px; font-size: 11px; display: flex; flex-direction: column; gap: 2px; }
        .ev-pill .t { font-weight: 800; font-size: 9px; color: #3498db; }
        .ev-pill .txt { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        @media (max-width: 768px) { .week-columns { grid-template-columns: 1fr; } .week-col { min-height: auto; } }
      `}</style>
    </div>
  );
};
