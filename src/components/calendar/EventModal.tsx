import React, { useState } from 'react';
import { formatDateExtended, CalendarEvent } from '@/lib/calendar';

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
      date: ''
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Nuovo Appuntamento</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="date-info">{formatDateExtended(date)}</div>
            <div className="input-group">
              <label>Titolo Evento</label>
              <input
                type="text"
                className="form-input"
                placeholder="Cosa devi fare?"
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="input-group">
              <label>Orario (opzionale)</label>
              <input
                type="time"
                className="form-input"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annulla</button>
            <button type="submit" className="btn btn-primary">Salva Evento</button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        .modal-dialog {
          width: 400px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          overflow: hidden;
          animation: slideUp 0.2s ease;
        }
        .modal-header {
          padding: 16px 20px;
          background-color: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-title { font-weight: 700; color: #2c3e50; }
        .close-btn { background: none; border: none; font-size: 24px; color: #95a5a6; cursor: pointer; }
        .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
        .date-info { font-size: 13px; color: #7f8c8d; font-weight: 600; margin-bottom: -10px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-group label { font-size: 12px; font-weight: 700; color: #34495e; text-transform: uppercase; }
        .form-input { padding: 10px 12px; border: 1px solid #ccd1d9; border-radius: 4px; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .form-input:focus { border-color: #3498db; }
        .modal-footer { padding: 16px 20px; background-color: #f8f9fa; border-top: 1px solid #dee2e6; display: flex; justify-content: flex-end; gap: 12px; }
        .btn { padding: 10px 20px; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: all 0.2s; }
        .btn-primary { background-color: #3498db; color: #fff; }
        .btn-primary:hover { background-color: #2980b9; }
        .btn-secondary { background-color: #fff; border-color: #ccd1d9; color: #7f8c8d; }
        .btn-secondary:hover { background-color: #f8f9fa; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};
