import { useState } from 'react';
import NeckTrainer from './components/NeckTrainer';
import TriadTrainer from './components/TriadTrainer';
import './App.css';

type Tab = 'neck' | 'triad';

export default function App() {
  const [tab, setTab] = useState<Tab>('neck');

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎸 Guitar Trainer</h1>
        <nav className="tabs" role="tablist" aria-label="Trainers">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'neck'}
            className={tab === 'neck' ? 'tab active' : 'tab'}
            onClick={() => setTab('neck')}
          >
            Neck Notes
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'triad'}
            className={tab === 'triad' ? 'tab active' : 'tab'}
            onClick={() => setTab('triad')}
          >
            Chord Triads
          </button>
        </nav>
      </header>

      <main>{tab === 'neck' ? <NeckTrainer /> : <TriadTrainer />}</main>
    </div>
  );
}
