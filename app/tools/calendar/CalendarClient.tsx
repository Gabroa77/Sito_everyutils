'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  CalendarEvent,
  dateToISOKey
} from '../../../lib/calendar';
import { CalendarHeader } from '../../../components/calendar/CalendarHeader';
import { MonthView } from '../../../components/calendar/MonthView';
import { WeekView } from '../../../components/calendar/WeekView';
import { DayView } from '../../../components/calendar/DayView';
import { YearView } from '../../../components/calendar/YearView';
import { AgendaView } from '../../../components/calendar/AgendaView';
import { EventModal } from '../../../components/calendar/EventModal';

export default function CalendarClient() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [events, setEvents] = useState<Record<string, CalendarEvent[]>>({});
  const [startDayOfWeek, setStartDayOfWeek] = useState(1); // 1 = Monday
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);

  // Persistence - Load
  useEffect(() => {
    const savedEvents = localStorage.getItem('everyutils_calendar_events');
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
        if (parsed && typeof parsed === 'object') {
          setEvents(parsed);
        }
      } catch (e) { console.error(e); }
    }
    const savedStartDay = localStorage.getItem('everyutils_calendar_startday');
    if (savedStartDay) {
      setStartDayOfWeek(parseInt(savedStartDay));
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    setIsLoaded(true);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Persistence - Save (Only after loading)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('everyutils_calendar_events', JSON.stringify(events));
    }
  }, [events, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('everyutils_calendar_startday', startDayOfWeek.toString());
    }
  }, [startDayOfWeek, isLoaded]);

  // Handlers
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (view === 'month' || view === 'agenda') d.setMonth(d.getMonth() - 1);
    else if (view === 'week') d.setDate(d.getDate() - 7);
    else if (view === 'day') d.setDate(d.getDate() - 1);
    else if (view === 'year') d.setFullYear(d.getFullYear() - 1);
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (view === 'month' || view === 'agenda') d.setMonth(d.getMonth() + 1);
    else if (view === 'week') d.setDate(d.getDate() + 7);
    else if (view === 'day') d.setDate(d.getDate() + 1);
    else if (view === 'year') d.setFullYear(d.getFullYear() + 1);
    setCurrentDate(d);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsEventModalOpen(true);
  };

  const handleAddEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const isoKey = dateToISOKey(selectedDate);
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
      date: isoKey
    };

    setEvents(prev => ({
      ...prev,
      [isoKey]: [...(prev[isoKey] || []), newEvent]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const effectiveView = (isMobile && view === 'month') ? 'agenda' : view;

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="workspace-header">
          <div className="workspace-selector">
            <span className="workspace-avatar">E</span>
            <span className="workspace-name">EveryUtils Space</span>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="section-title">Navigazione</div>
          <Link href="/" className="menu-item">
            <span className="menu-item-icon">🏠</span>
            <span className="menu-item-text">Home</span>
          </Link>
          <div className="menu-item active">
            <span className="menu-item-icon">📅</span>
            <span className="menu-item-text">Calendario</span>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="section-title">Impostazioni</div>
          <div className="settings-control-sidebar">
            <label className="settings-label">Inizio settimana</label>
            <select
              value={startDayOfWeek}
              onChange={(e) => setStartDayOfWeek(parseInt(e.target.value))}
              className="settings-select"
            >
              <option value={1}>Lunedì</option>
              <option value={0}>Domenica</option>
            </select>
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="calc-btn text-btn-sidebar" onClick={handlePrint}>Stampa Mese</button>
        </div>
      </aside>

      <main className="main-workspace">
        <header className="workspace-header-bar">
          <div className="breadcrumbs">
            <span className="breadcrumb-item">EveryUtils</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">📅 Calendario</span>
          </div>
        </header>

        <div className="calendar-content-wrapper" ref={calendarRef}>
          <div className="calendar-card-full">
            <CalendarHeader
              currentDate={currentDate}
              view={view}
              setView={setView}
              onPrev={handlePrev}
              onNext={handleNext}
              onToday={() => setCurrentDate(new Date())}
              onDateChange={setCurrentDate}
            />

            <div className="view-container">
              {effectiveView === 'month' && (
                <MonthView
                  currentDate={currentDate}
                  startDayOfWeek={startDayOfWeek}
                  events={events}
                  onDayClick={handleDayClick}
                />
              )}
              {effectiveView === 'week' && (
                <WeekView
                  currentDate={currentDate}
                  startDayOfWeek={startDayOfWeek}
                  events={events}
                  onDayClick={handleDayClick}
                />
              )}
              {effectiveView === 'day' && (
                <DayView
                  currentDate={currentDate}
                  events={events}
                  onAddEvent={handleDayClick}
                />
              )}
              {effectiveView === 'year' && (
                <YearView
                  currentDate={currentDate}
                  onMonthClick={(m) => {
                    const d = new Date(currentDate);
                    d.setMonth(m);
                    setCurrentDate(d);
                    setView('month');
                  }}
                />
              )}
              {effectiveView === 'agenda' && (
                <AgendaView
                  currentDate={currentDate}
                  events={events}
                  onDayClick={handleDayClick}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {isEventModalOpen && (
        <EventModal
          date={selectedDate}
          onClose={() => setIsEventModalOpen(false)}
          onSave={handleAddEvent}
        />
      )}

      <style jsx global>{`
        :root {
          --bg-main: #ffffff;
          --bg-sidebar: #f7f7f5;
          --border-color: #ededeb;
          --text-primary: #37352f;
          --text-secondary: #7a7a78;
          --hover-bg: #efefed;
          --active-bg: #e8e8e6;
          --accent-color: #2383e2;
          --accent-light: #e3f2fd;
          --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          --sidebar-width: 240px;
        }
        body {
          margin: 0;
          font-family: var(--font-family);
          color: var(--text-primary);
        }
        .app-container {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        .sidebar {
          width: var(--sidebar-width);
          background-color: var(--bg-sidebar);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          z-index: 10;
        }
        .main-workspace {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .workspace-header-bar {
          height: 48px;
          display: flex;
          align-items: center;
          padding: 0 24px;
          border-bottom: 1px solid var(--border-color);
        }
        .calendar-content-wrapper {
          padding: 24px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .calendar-card-full {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 20px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        .menu-item.active {
          background-color: var(--active-bg);
          font-weight: 500;
        }
        .sidebar-section { padding: 10px; }
        .section-title {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          padding: 6px 12px;
        }
        .settings-control-sidebar { padding: 0 12px; }
        .settings-select {
          width: 100%;
          padding: 4px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          font-size: 13px;
          outline: none;
        }
        .calc-btn {
          border: 1px solid var(--border-color);
          background-color: #ffffff;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.15s;
        }
        .calc-btn:hover { background-color: var(--hover-bg); }
        .text-btn-sidebar {
          width: 100%;
          height: 36px;
          font-size: 13px;
          color: var(--text-secondary);
        }
        .segmented-control {
          background-color: var(--hover-bg);
          border-radius: 6px;
          padding: 2px;
          display: flex;
          gap: 2px;
        }
        .seg-btn {
          border: none;
          background: none;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 4px;
          cursor: pointer;
          color: var(--text-secondary);
        }
        .seg-btn.active {
          background-color: #ffffff;
          color: var(--text-primary);
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        @media print {
          .sidebar, .workspace-header-bar, .calendar-header-container .view-switcher-row, .nav-controls {
            display: none !important;
          }
          .main-workspace { overflow: visible !important; }
          .calendar-content-wrapper { padding: 0 !important; }
          .calendar-card-full { border: none !important; box-shadow: none !important; }
        }

        @media (max-width: 768px) {
          .sidebar { display: none; }
          .calendar-content-wrapper { padding: 12px; }
        }
      `}</style>
    </div>
  );
}
