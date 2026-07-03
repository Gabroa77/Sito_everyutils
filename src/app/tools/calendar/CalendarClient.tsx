'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  CalendarEvent,
  dateToISOKey
} from '@/lib/calendar';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { MonthView } from '@/components/calendar/MonthView';
import { WeekView } from '@/components/calendar/WeekView';
import { DayView } from '@/components/calendar/DayView';
import { YearView } from '@/components/calendar/YearView';
import { AgendaView } from '@/components/calendar/AgendaView';
import { EventModal } from '@/components/calendar/EventModal';

export default function CalendarClient() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [events, setEvents] = useState<Record<string, CalendarEvent[]>>({});
  const [startDayOfWeek, setStartDayOfWeek] = useState(1);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedEvents = localStorage.getItem('everyutils_calendar_events');
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
        if (parsed && typeof parsed === 'object') setEvents(parsed);
      } catch (e) { console.error(e); }
    }
    const savedStartDay = localStorage.getItem('everyutils_calendar_startday');
    if (savedStartDay) setStartDayOfWeek(parseInt(savedStartDay));
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    setIsLoaded(true);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('everyutils_calendar_events', JSON.stringify(events));
  }, [events, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('everyutils_calendar_startday', startDayOfWeek.toString());
  }, [startDayOfWeek, isLoaded]);

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

  const handlePrint = () => { window.print(); };

  const effectiveView = (isMobile && view === 'month') ? 'agenda' : view;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-box">E</div>
          <span className="logo-text">EveryUtils</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-title">Menu Principale</span>
            <Link href="/" className="nav-item">🏠 Home</Link>
            <div className="nav-item active">📅 Calendario</div>
          </div>
          <div className="nav-section">
            <span className="nav-title">Opzioni</span>
            <div className="setting-row">
              <label>Inizio settimana:</label>
              <select
                value={startDayOfWeek}
                onChange={(e) => setStartDayOfWeek(parseInt(e.target.value))}
                className="theme-select"
              >
                <option value={1}>Lunedì</option>
                <option value={0}>Domenica</option>
              </select>
            </div>
          </div>
        </nav>
      </aside>

      <main className="content-area">
        <div className="page-wrapper">
          <div className="view-card">
            <CalendarHeader
              currentDate={currentDate}
              view={view}
              setView={setView}
              onPrev={handlePrev}
              onNext={handleNext}
              onToday={() => setCurrentDate(new Date())}
              onDateChange={setCurrentDate}
              onPrint={handlePrint}
            />
            <div className="view-content">
              {effectiveView === 'month' && <MonthView currentDate={currentDate} startDayOfWeek={startDayOfWeek} events={events} onDayClick={handleDayClick} />}
              {effectiveView === 'week' && <WeekView currentDate={currentDate} startDayOfWeek={startDayOfWeek} events={events} onDayClick={handleDayClick} />}
              {effectiveView === 'day' && <DayView currentDate={currentDate} events={events} onAddEvent={handleDayClick} />}
              {effectiveView === 'year' && <YearView currentDate={currentDate} onMonthClick={(m) => { const d = new Date(currentDate); d.setMonth(m); setCurrentDate(d); setView('month'); }} />}
              {effectiveView === 'agenda' && <AgendaView currentDate={currentDate} events={events} onDayClick={handleDayClick} />}
            </div>
          </div>
        </div>
      </main>

      {isEventModalOpen && <EventModal date={selectedDate} onClose={() => setIsEventModalOpen(false)} onSave={handleAddEvent} />}

      <style jsx>{`
        .app-layout { display: flex; height: 100vh; background-color: #f4f6f8; }
        .sidebar { width: 240px; background-color: #2c3e50; color: #fff; display: flex; flex-direction: column; }
        .sidebar-header { padding: 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .logo-box { width: 32px; height: 32px; background: #3498db; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 800; }
        .logo-text { font-size: 18px; font-weight: 700; letter-spacing: 0.5px; }
        .sidebar-nav { padding: 16px; flex-grow: 1; display: flex; flex-direction: column; gap: 24px; }
        .nav-section { display: flex; flex-direction: column; gap: 4px; }
        .nav-title { font-size: 10px; text-transform: uppercase; color: rgba(255,255,255,0.4); font-weight: 700; margin-bottom: 8px; padding-left: 12px; }
        .nav-item { padding: 10px 12px; border-radius: 6px; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px; cursor: pointer; transition: all 0.2s; }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .nav-item.active { background: #3498db; color: #fff; font-weight: 600; }
        .setting-row { padding: 0 12px; display: flex; flex-direction: column; gap: 8px; }
        .setting-row label { font-size: 12px; color: rgba(255,255,255,0.6); }
        .theme-select { background: #34495e; color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 6px; border-radius: 4px; outline: none; }
        .content-area { flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column; }
        .page-wrapper { max-width: 1200px; margin: 0 auto; width: 100%; padding: 40px 24px; }
        .view-card { background: #ffffff; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }
        .view-content { padding: 0; }
        @media (max-width: 768px) { .sidebar { display: none; } .page-wrapper { padding: 20px 12px; } }
        @media print { .app-layout { background: #fff; } .sidebar { display: none; } .page-wrapper { padding: 0; margin: 0; max-width: none; } .view-card { box-shadow: none; border: none; } }
      `}</style>
    </div>
  );
}
