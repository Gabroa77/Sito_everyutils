import React, { useRef, useEffect } from 'react';
import { getDaysInMonth, getISOWeek, dateToISOKey, CalendarEvent } from '../../lib/calendar';

interface MonthViewProps {
  currentDate: Date;
  startDayOfWeek: number;
  events: Record<string, CalendarEvent[]>;
  onDayClick: (date: Date) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  startDayOfWeek,
  events,
  onDayClick,
}) => {
  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth(), startDayOfWeek);
  const weekDays = startDayOfWeek === 1
    ? ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
    : ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const gridRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') nextIndex = index + 1;
    else if (e.key === 'ArrowLeft') nextIndex = index - 1;
    else if (e.key === 'ArrowDown') nextIndex = index + 7;
    else if (e.key === 'ArrowUp') nextIndex = index - 7;
    else if (e.key === 'Enter') {
      onDayClick(days[index].date);
      return;
    } else {
      return;
    }

    if (nextIndex >= 0 && nextIndex < days.length) {
      const cell = gridRef.current?.querySelector(`[data-index="${nextIndex}"]`) as HTMLElement;
      cell?.focus();
    }
  };

  return (
    <div className="month-grid-container" role="grid" ref={gridRef}>
      <div className="grid-header">
        <div className="week-num-header">#</div>
        {weekDays.map(d => (
          <div key={d} className="weekday-label">{d}</div>
        ))}
      </div>

      {weeks.map((week, weekIdx) => (
        <div key={weekIdx} className="grid-row">
          <div className="week-number">{getISOWeek(week[0].date)}</div>
          {week.map((day, dayIdx) => {
            const index = weekIdx * 7 + dayIdx;
            const isoKey = dateToISOKey(day.date);
            const dayEvents = events[isoKey] || [];
            return (
              <div
                key={day.date.getTime()}
                data-index={index}
                className={`grid-cell ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''} ${day.isWeekend ? 'weekend' : ''}`}
                onClick={() => onDayClick(day.date)}
                role="gridcell"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                <span className="day-number">{day.date.getDate()}</span>
                {dayEvents.length > 0 && (
                  <div className="event-badges">
                    {dayEvents.slice(0, 2).map((_, idx) => (
                      <span key={idx} className="event-dot" />
                    ))}
                    {dayEvents.length > 2 && <span className="event-more">+{dayEvents.length - 2}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <style jsx>{`
        .month-grid-container {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          background-color: #ffffff;
        }
        .grid-header {
          display: grid;
          grid-template-columns: 30px repeat(7, 1fr);
          background-color: var(--bg-sidebar);
          border-bottom: 1px solid var(--border-color);
        }
        .weekday-label {
          padding: 8px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          text-align: center;
          text-transform: uppercase;
        }
        .week-num-header {
          padding: 8px;
          font-size: 11px;
          color: var(--text-secondary);
          text-align: center;
        }
        .grid-row {
          display: grid;
          grid-template-columns: 30px repeat(7, 1fr);
          border-bottom: 1px solid var(--border-color);
        }
        .grid-row:last-child { border-bottom: none; }
        .grid-cell {
          aspect-ratio: 1;
          padding: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: background-color 0.15s;
          position: relative;
          outline: none;
        }
        .grid-cell:focus {
          background-color: var(--hover-bg);
          box-shadow: inset 0 0 0 2px var(--accent-color);
          z-index: 1;
        }
        .grid-cell:hover { background-color: var(--hover-bg); }
        .grid-cell.other-month {
          color: var(--text-secondary);
          background-color: #fafafa;
        }
        .grid-cell.today { background-color: var(--accent-light); }
        .grid-cell.today .day-number {
          background-color: var(--accent-color);
          color: #ffffff;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .grid-cell.weekend { background-color: #fcfcfc; }
        .week-number {
          font-size: 10px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid var(--border-color);
          background-color: var(--bg-sidebar);
        }
        .day-number { font-size: 14px; }
        .event-badges {
          display: flex;
          gap: 2px;
          justify-content: center;
          width: 100%;
        }
        .event-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--accent-color);
        }
        .event-more { font-size: 8px; color: var(--text-secondary); }
        @media (max-width: 600px) {
          .weekday-label { font-size: 9px; }
          .grid-cell { padding: 2px; }
          .day-number { font-size: 12px; }
        }
      `}</style>
    </div>
  );
};
