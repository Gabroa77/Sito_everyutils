import React, { useState } from 'react';
import { formatDateExtended, CalendarEvent } from '../../lib/calendar';

interface EventModalProps {
  date: Date;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  date,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      time: time || undefined,
      date: '' // Will be handled by parent
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="standard-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Nuovo Evento</span>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="event-date-summary">
              {formatDateExtended(date)}
            </div>
            <div className="settings-group">
              <label className="settings-label">Titolo</label>
              <input
                type="text"
                className="modal-input"
                placeholder="Esempio: Riunione..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="settings-group">
              <label className="settings-label">Ora (opzionale)</label>
              <input
                type="time"
                className="modal-input"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="calc-btn text-btn secondary" onClick={onClose}>Annulla</button>
            <button type="submit" className="calc-btn text-btn primary">Salva</button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(15, 15, 15, 0.4);
          backdrop-filter: blur(2px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.15s ease;
        }
        .standard-modal {
          width: 360px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          border: 1px solid var(--border-color);
          overflow: hidden;
          animation: scaleUp 0.15s ease;
        }
        .event-date-summary {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 12px;
          font-weight: 500;
        }
        .modal-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-family: inherit;
          font-size: 14px;
          outline: none;
        }
        .modal-input:focus { border-color: var(--accent-color); }
        .modal-footer {
          padding: 16px 20px;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background-color: var(--bg-sidebar);
        }
        .text-btn.primary {
          background-color: var(--accent-color);
          color: #ffffff;
          border-color: var(--accent-color);
          font-weight: 600;
        }
        .text-btn.secondary {
          background-color: #ffffff;
          color: var(--text-secondary);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.97); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};
