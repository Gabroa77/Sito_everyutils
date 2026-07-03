import React, { useRef } from 'react';
import { getDaysInMonth, getISOWeek, dateToISOKey, CalendarEvent } from '@/lib/calendar';

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
    } else return;

    if (nextIndex >= 0 && nextIndex < days.length) {
      const cell = gridRef.current?.querySelector(`[data-index="${nextIndex}"]`) as HTMLElement;
      cell?.focus();
    }
  };

  return (
    <div className="month-view-wrapper">
      <div className="month-grid" role="grid" ref={gridRef}>
        <div className="grid-header">
          <div className="cell-header empty"></div>
          {weekDays.map(d => (
            <div key={d} className="cell-header">{d}</div>
          ))}
        </div>

        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid-row">
            <div className="week-label">{getISOWeek(week[0].date)}</div>
            {week.map((day, dayIdx) => {
              const index = weekIdx * 7 + dayIdx;
              const isoKey = dateToISOKey(day.date);
              const dayEvents = events[isoKey] || [];
              return (
                <div
                  key={day.date.getTime()}
                  data-index={index}
                  className={`day-cell ${!day.isCurrentMonth ? 'inactive' : ''} ${day.isToday ? 'today' : ''} ${day.isWeekend ? 'weekend' : ''}`}
                  onClick={() => onDayClick(day.date)}
                  role="gridcell"
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  <span className="day-num">{day.date.getDate()}</span>
                  <div className="event-indicators">
                    {dayEvents.map(ev => (
                      <div key={ev.id} className="mini-event" title={ev.title} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx>{`
        .month-view-wrapper {
          border: 1px solid var(--border-color);
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .month-grid { display: flex; flex-direction: column; background-color: #fff; }
        .grid-header { display: grid; grid-template-columns: 40px repeat(7, 1fr); background-color: #f1f3f4; border-bottom: 2px solid var(--border-color); }
        .cell-header { padding: 10px; font-size: 12px; font-weight: 700; color: #5f6368; text-align: center; border-right: 1px solid #e0e0e0; }
        .cell-header:last-child { border-right: none; }
        .grid-row { display: grid; grid-template-columns: 40px repeat(7, 1fr); border-bottom: 1px solid #e0e0e0; }
        .grid-row:last-child { border-bottom: none; }
        .week-label { font-size: 10px; font-weight: 600; color: #9aa0a6; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa; border-right: 1px solid #e0e0e0; }
        .day-cell { min-height: 100px; padding: 6px; display: flex; flex-direction: column; gap: 4px; border-right: 1px solid #e0e0e0; cursor: pointer; transition: background 0.1s; outline: none; }
        .day-cell:last-child { border-right: none; }
        .day-cell:hover, .day-cell:focus { background-color: #f1f3f4; }
        .day-cell.inactive { background-color: #f8f9fa; color: #dadce0; }
        .day-cell.today { background-color: #e8f0fe; }
        .day-cell.today .day-num { background-color: #1a73e8; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .day-cell.weekend { background-color: #fafafa; }
        .day-num { font-size: 13px; font-weight: 500; align-self: flex-end; }
        .event-indicators { display: flex; flex-wrap: wrap; gap: 2px; }
        .mini-event { width: 100%; height: 4px; background-color: #1a73e8; border-radius: 2px; }
      `}</style>
    </div>
  );
};
