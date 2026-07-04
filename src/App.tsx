import { useState } from 'react';
import NeckTrainer from './components/NeckTrainer';
import TriadTrainer from './components/TriadTrainer';
import SheetTrainer from './components/SheetTrainer';
import ScaleTrainer from './components/ScaleTrainer';
import './App.css';

type Tab = 'neck' | 'triad' | 'sheet' | 'scale';

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
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'sheet'}
            className={tab === 'sheet' ? 'tab active' : 'tab'}
            onClick={() => setTab('sheet')}
          >
            Sheet Music
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'scale'}
            className={tab === 'scale' ? 'tab active' : 'tab'}
            onClick={() => setTab('scale')}
          >
            Scales
          </button>
        </nav>
      </header>

      <main>
        {tab === 'neck' && <NeckTrainer />}
        {tab === 'triad' && <TriadTrainer />}
        {tab === 'sheet' && <SheetTrainer />}
        {tab === 'scale' && <ScaleTrainer />}
      </main>
    </div>
  );
}
