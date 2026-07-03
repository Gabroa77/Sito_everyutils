'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { parseAndEvaluate, formatResult } from '@/lib/calculator-logic';

const KEY_LAYOUTS: any = {
  standard: [
    { label: 'AC', key: 'AC', type: 'clear' },
    { label: '⌫', key: 'Backspace', type: 'operator' },
    { label: '%', key: '%', type: 'operator' },
    { label: '÷', key: '/', type: 'operator' },
    { label: '7', key: '7', type: 'number' },
    { label: '8', key: '8', type: 'number' },
    { label: '9', key: '9', type: 'number' },
    { label: '×', key: '*', type: 'operator' },
    { label: '4', key: '4', type: 'number' },
    { label: '5', key: '5', type: 'number' },
    { label: '6', key: '6', type: 'number' },
    { label: '−', key: '-', type: 'operator' },
    { label: '1', key: '1', type: 'number' },
    { label: '2', key: '2', type: 'number' },
    { label: '3', key: '3', type: 'number' },
    { label: '+', key: '+', type: 'operator' },
    { label: '±', key: 'pm', type: 'number' },
    { label: '0', key: '0', type: 'number' },
    { label: '.', key: '.', type: 'number' },
    { label: '=', key: 'Enter', type: 'equals' }
  ],
  scientific: [
    { label: 'RAD/DEG', key: 'angle-toggle', type: 'sci-op' },
    { label: '(', key: '(', type: 'sci-op' },
    { label: ')', key: ')', type: 'sci-op' },
    { label: '⌫', key: 'Backspace', type: 'operator' },
    { label: 'AC', key: 'AC', type: 'clear' },
    { label: 'sin', key: 'sin', type: 'sci-op' },
    { label: 'cos', key: 'cos', type: 'sci-op' },
    { label: 'tan', key: 'tan', type: 'sci-op' },
    { label: '^', key: '^', type: 'sci-op' },
    { label: '÷', key: '/', type: 'operator' },
    { label: 'log', key: 'log', type: 'sci-op' },
    { label: '7', key: '7', type: 'number' },
    { label: '8', key: '8', type: 'number' },
    { label: '9', key: '9', type: 'number' },
    { label: '×', key: '*', type: 'operator' },
    { label: 'ln', key: 'ln', type: 'sci-op' },
    { label: '4', key: '4', type: 'number' },
    { label: '5', key: '5', type: 'number' },
    { label: '6', key: '6', type: 'number' },
    { label: '−', key: '-', type: 'operator' },
    { label: '√', key: 'sqrt', type: 'sci-op' },
    { label: '1', key: '1', type: 'number' },
    { label: '2', key: '2', type: 'number' },
    { label: '3', key: '3', type: 'number' },
    { label: '+', key: '+', type: 'operator' },
    { label: 'π', key: 'pi', type: 'sci-op' },
    { label: 'e', key: 'e', type: 'sci-op' },
    { label: '0', key: '0', type: 'number' },
    { label: '.', key: '.', type: 'number' },
    { label: '=', key: 'Enter', type: 'equals' }
  ]
};

export default function CalculatorPage() {
  const [currentMode, setCurrentMode] = useState('standard');
  const [angleMode, setAngleMode] = useState('deg');
  const [expression, setExpression] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [lastResult, setLastResult] = useState('');
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('everyutils_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const onKeyPress = (key: string, label: string) => {
    if (key === 'AC') {
      setExpression('');
      setCurrentValue('');
      setHasEvaluated(false);
    } else if (key === 'Backspace') {
      if (hasEvaluated) { setExpression(''); setCurrentValue(''); setHasEvaluated(false); }
      else { setCurrentValue(prev => prev.slice(0, -1)); }
    } else if (key === 'angle-toggle') {
      setAngleMode(prev => prev === 'deg' ? 'rad' : 'deg');
    } else if (key === 'Enter') {
      evaluate();
    } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(key)) {
      if (hasEvaluated) { setExpression(key + '('); setCurrentValue(''); setHasEvaluated(false); }
      else { setExpression(prev => prev + (currentValue ? currentValue + ' × ' : '') + key + '('); setCurrentValue(''); }
    } else if (key === '(' || key === ')') {
      if (hasEvaluated) { setExpression(key); setCurrentValue(''); setHasEvaluated(false); }
      else { setExpression(prev => prev + (key === '(' && currentValue ? currentValue + ' × ' : currentValue) + key); setCurrentValue(''); }
    } else if (['+', '-', '*', '/', '^'].includes(key)) {
      if (hasEvaluated) { setExpression(lastResult + ' ' + label + ' '); setCurrentValue(''); setHasEvaluated(false); }
      else if (currentValue !== '') { setExpression(prev => prev + currentValue + ' ' + label + ' '); setCurrentValue(''); }
    } else if (key === 'pi' || key === 'e') {
      const val = key === 'pi' ? 'π' : 'e';
      if (hasEvaluated) { setExpression(val); setCurrentValue(''); setHasEvaluated(false); }
      else { setExpression(prev => prev + (currentValue ? currentValue + ' × ' : '') + val); setCurrentValue(''); }
    } else if (key === 'pm') {
      setCurrentValue(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
    } else if (key === '%') {
      if (currentValue) setCurrentValue(String(parseFloat(currentValue) / 100));
    } else {
      if (hasEvaluated) { setExpression(''); setCurrentValue(key); setHasEvaluated(false); }
      else { setCurrentValue(prev => prev === '0' ? key : prev + key); }
    }
  };

  const evaluate = () => {
    let evalStr = expression + currentValue;
    if (!evalStr.trim()) return;
    try {
      const res = parseAndEvaluate(evalStr, angleMode);
      const formatted = formatResult(res);
      setExpression(evalStr + ' =');
      setCurrentValue(formatted);
      setLastResult(formatted);
      setHasEvaluated(true);
      const newHistory = [{ formula: evalStr, result: formatted }, ...history].slice(0, 15);
      setHistory(newHistory);
      localStorage.setItem('everyutils_history', JSON.stringify(newHistory));
    } catch (e) {
      setCurrentValue('Errore');
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
           <div className="logo-box">E</div>
           <span className="logo-text">EveryUtils</span>
        </div>
        <nav className="sidebar-nav">
           <div className="nav-section">
              <span className="nav-title">Strumenti</span>
              <div className={`nav-item ${currentMode === 'standard' ? 'active' : ''}`} onClick={() => setCurrentMode('standard')}>🔢 Standard</div>
              <div className={`nav-item ${currentMode === 'scientific' ? 'active' : ''}`} onClick={() => setCurrentMode('scientific')}>🧪 Scientifica</div>
              <Link href="/tools/calendar" className="nav-item">📅 Calendario</Link>
           </div>
           <div className="nav-section">
              <span className="nav-title">Cronologia</span>
              <div className="history-list">
                 {history.length === 0 ? <div className="no-history">Vuota</div> :
                   history.map((h, i) => (
                     <div key={i} className="history-item">
                        <div className="h-expr">{h.formula}</div>
                        <div className="h-res">= {h.result}</div>
                     </div>
                   ))
                 }
              </div>
           </div>
        </nav>
      </aside>

      <main className="content-area">
        <div className="page-wrapper">
          <div className="calculator-container">
            <div className={`calculator-card ${currentMode === 'scientific' ? 'scientific' : ''}`}>
              <div className="card-header">
                 <h3>{currentMode === 'standard' ? '🔢 Calcolatrice Standard' : '🧪 Calcolatrice Scientifica'}</h3>
                 {currentMode === 'scientific' && (
                    <div className="mode-badge" onClick={() => setAngleMode(prev => prev === 'deg' ? 'rad' : 'deg')}>
                       {angleMode.toUpperCase()}
                    </div>
                 )}
              </div>
              <div className="display-box">
                 <div className="expr">{expression || <>&nbsp;</>}</div>
                 <div className="curr">{currentValue || '0'}</div>
              </div>
              <div className={`keypad ${currentMode}`}>
                 {KEY_LAYOUTS[currentMode].map((btn: any) => (
                    <button
                       key={btn.key}
                       className={`btn ${btn.type}`}
                       onClick={() => onKeyPress(btn.key, btn.label)}
                    >
                       {btn.label}
                    </button>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .app-layout { display: flex; height: 100vh; background-color: #f4f6f8; }
        .sidebar { width: 240px; background-color: #2c3e50; color: #fff; display: flex; flex-direction: column; }
        .sidebar-header { padding: 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .logo-box { width: 32px; height: 32px; background: #3498db; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 800; }
        .logo-text { font-size: 18px; font-weight: 700; }
        .sidebar-nav { padding: 16px; flex-grow: 1; display: flex; flex-direction: column; gap: 24px; overflow-y: auto; }
        .nav-section { display: flex; flex-direction: column; gap: 4px; }
        .nav-title { font-size: 10px; text-transform: uppercase; color: rgba(255,255,255,0.4); font-weight: 700; margin-bottom: 8px; }
        .nav-item { padding: 10px 12px; border-radius: 6px; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px; cursor: pointer; }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .nav-item.active { background: #3498db; color: #fff; }

        .content-area { flex-grow: 1; overflow-y: auto; }
        .page-wrapper { padding: 40px; display: flex; justify-content: center; }
        .calculator-card { width: 360px; background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .calculator-card.scientific { width: 480px; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .mode-badge { font-size: 10px; font-weight: 700; padding: 4px 8px; background: #eee; border-radius: 4px; cursor: pointer; }
        .display-box { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; align-items: flex-end; min-height: 100px; }
        .expr { font-size: 13px; color: #6c757d; }
        .curr { font-size: 32px; font-weight: 600; color: #212529; }
        .keypad { display: grid; gap: 8px; margin-top: 16px; }
        .keypad.standard { grid-template-columns: repeat(4, 1fr); }
        .keypad.scientific { grid-template-columns: repeat(5, 1fr); }
        .btn { height: 48px; border: 1px solid #dee2e6; background: #fff; border-radius: 6px; cursor: pointer; font-size: 16px; transition: all 0.1s; }
        .btn:hover { background: #f8f9fa; }
        .btn.operator, .btn.sci-op { background: #f1f3f5; font-size: 14px; }
        .btn.clear { color: #dc3545; }
        .btn.equals { background: #3498db; color: #fff; border-color: #3498db; }
        .history-list { display: flex; flex-direction: column; gap: 8px; }
        .history-item { font-size: 12px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px; }
        .h-expr { color: rgba(255,255,255,0.5); }
        .h-res { font-weight: 600; }
        .no-history { font-size: 11px; color: rgba(255,255,255,0.3); text-align: center; }
      `}</style>
    </div>
  );
}
