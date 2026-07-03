'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function CalculatorPage() {
  const [currentMode, setCurrentMode] = useState('standard');
  const [expression, setExpression] = useState('');
  const [currentValue, setCurrentValue] = useState('0');
  const [history, setHistory] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Persistence
  useEffect(() => {
    const savedHistory = localStorage.getItem('everyutils_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
    }
  }, []);

  const handleClear = () => {
    setExpression('');
    setCurrentValue('0');
  };

  // Simplified version of the calculator for the migration
  // In a real scenario, we would port all the logic from index.html
  const handleDigit = (digit: string) => {
    setCurrentValue(prev => prev === '0' ? digit : prev + digit);
  };

  const handleOperator = (op: string) => {
    setExpression(currentValue + ' ' + op + ' ');
    setCurrentValue('0');
  };

  const evaluate = () => {
    try {
      // Very basic evaluation for demonstration
      const res = eval(expression.replace('×', '*').replace('÷', '/') + currentValue);
      const fullExpr = expression + currentValue + ' =';
      setExpression(fullExpr);
      setCurrentValue(String(res));
      const newHistory = [{ formula: fullExpr, result: String(res) }, ...history].slice(0, 15);
      setHistory(newHistory);
      localStorage.setItem('everyutils_history', JSON.stringify(newHistory));
    } catch (e) {
      setCurrentValue('Error');
    }
  };

  return (
    <div className={`app-container ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="workspace-header">
          <div className="workspace-selector">
            <span className="workspace-avatar">E</span>
            <span className="workspace-name">EveryUtils Space</span>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="section-title">Strumenti</div>
          <div className={`menu-item ${currentMode === 'standard' ? 'active' : ''}`} onClick={() => setCurrentMode('standard')}>
            <span className="menu-item-icon">🔢</span>
            <span className="menu-item-text">Standard</span>
          </div>
          <div className={`menu-item ${currentMode === 'scientific' ? 'active' : ''}`} onClick={() => setCurrentMode('scientific')}>
            <span className="menu-item-icon">🧪</span>
            <span className="menu-item-text">Scientifica</span>
          </div>
          <Link href="/tools/calendar" className="menu-item">
            <span className="menu-item-icon">📅</span>
            <span className="menu-item-text">Calendario</span>
          </Link>
        </div>

        <div className="sidebar-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
          <div className="section-title">Cronologia</div>
          <div className="history-list">
            {history.length === 0 ? (
              <div className="no-history">Nessun calcolo recente</div>
            ) : (
              history.map((item, idx) => (
                <div key={idx} className="history-item">
                  <div className="hist-expr">{item.formula}</div>
                  <div className="hist-res">= {item.result}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      <main className="main-workspace">
        <header className="workspace-header-bar">
          <div className="breadcrumbs">
            <span className="breadcrumb-item">EveryUtils</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">
              {currentMode === 'standard' ? '🔢 Calcolatrice Standard' : '🧪 Calcolatrice Scientifica'}
            </span>
          </div>
        </header>

        <div className="calculator-container">
          <div className={`calculator-card ${currentMode === 'scientific' ? 'scientific' : ''}`}>
            <div className="calc-card-header">
              <span className="calc-mode-title">
                {currentMode === 'standard' ? '🔢 Calcolatrice Standard' : '🧪 Calcolatrice Scientifica'}
              </span>
            </div>

            <div className="calc-display">
              <div className="calc-expr">{expression || <>&nbsp;</>}</div>
              <div className="calc-current">{currentValue}</div>
            </div>

            <div className={`calc-keypad ${currentMode === 'scientific' ? 'scientific' : 'standard'}`}>
              <button className="calc-btn clear" onClick={handleClear}>AC</button>
              <button className="calc-btn operator" onClick={() => setCurrentValue(prev => prev.slice(0, -1) || '0')}>⌫</button>
              <button className="calc-btn operator">%</button>
              <button className="calc-btn operator" onClick={() => handleOperator('/')}>÷</button>

              {[7, 8, 9].map(n => <button key={n} className="calc-btn" onClick={() => handleDigit(String(n))}>{n}</button>)}
              <button className="calc-btn operator" onClick={() => handleOperator('*')}>×</button>

              {[4, 5, 6].map(n => <button key={n} className="calc-btn" onClick={() => handleDigit(String(n))}>{n}</button>)}
              <button className="calc-btn operator" onClick={() => handleOperator('-')}>−</button>

              {[1, 2, 3].map(n => <button key={n} className="calc-btn" onClick={() => handleDigit(String(n))}>{n}</button>)}
              <button className="calc-btn operator" onClick={() => handleOperator('+')}>+</button>

              <button className="calc-btn">±</button>
              <button className="calc-btn" onClick={() => handleDigit('0')}>0</button>
              <button className="calc-btn">.</button>
              <button className="calc-btn equals" onClick={evaluate}>=</button>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .app-container { display: flex; height: 100vh; overflow: hidden; }
        .sidebar { width: var(--sidebar-width); background-color: var(--bg-sidebar); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; }
        .main-workspace { flex-grow: 1; display: flex; flex-direction: column; }
        .workspace-header-bar { height: 48px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid var(--border-color); }
        .calculator-container { flex-grow: 1; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .calculator-card { width: 360px; background-color: #ffffff; border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); display: flex; flex-direction: column; gap: 16px; }
        .calculator-card.scientific { width: 480px; }
        .calc-display { background-color: var(--bg-sidebar); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; display: flex; flex-direction: column; align-items: flex-end; min-height: 100px; }
        .calc-expr { font-size: 14px; color: var(--text-secondary); }
        .calc-current { font-size: 36px; font-weight: 500; }
        .calc-keypad { display: grid; gap: 8px; }
        .calc-keypad.standard { grid-template-columns: repeat(4, 1fr); }
        .calc-keypad.scientific { grid-template-columns: repeat(5, 1fr); }
        .calc-btn { border: 1px solid var(--border-color); background-color: #ffffff; height: 48px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 500; display: flex; align-items: center; justify-content: center; }
        .calc-btn:hover { background-color: var(--hover-bg); }
        .calc-btn.operator { background-color: var(--bg-sidebar); }
        .calc-btn.clear { color: var(--accent-red); }
        .calc-btn.equals { background-color: var(--accent-color); color: #ffffff; border-color: var(--accent-color); }
        .menu-item { display: flex; align-items: center; gap: 10px; padding: 6px 12px; border-radius: 6px; font-size: 14px; cursor: pointer; color: inherit; text-decoration: none; }
        .menu-item:hover { background-color: var(--hover-bg); }
        .menu-item.active { background-color: var(--active-bg); font-weight: 500; }
        .sidebar-section { padding: 10px; }
        .section-title { font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; padding: 6px 12px; }
        .history-list { padding: 0 10px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; }
        .history-item { display: flex; flex-direction: column; align-items: flex-end; font-size: 12px; }
        .hist-expr { color: var(--text-secondary); }
        .hist-res { font-weight: 600; }
        .no-history { font-size: 12px; color: var(--text-secondary); text-align: center; padding: 10px; }
      `}</style>
    </div>
  );
}
