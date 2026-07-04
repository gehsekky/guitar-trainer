import { useState } from 'react';
import IntervalTrainer from './IntervalTrainer';

// Sub-trainers within Ear Training. Future: 'note' (identify a played
// note) and 'chord' (identify a played chord quality) slot in here.
type EarGame = 'interval';

const GAMES: { id: EarGame; label: string }[] = [
  { id: 'interval', label: 'Intervals' },
];

export default function EarTrainer() {
  const [game, setGame] = useState<EarGame>('interval');

  return (
    <section className="trainer">
      <h2>Ear Trainer</h2>

      {GAMES.length > 1 && (
        <div className="mode-toggle" role="radiogroup" aria-label="Ear game">
          {GAMES.map((g) => (
            <button
              key={g.id}
              type="button"
              role="radio"
              aria-checked={game === g.id}
              className={game === g.id ? 'mode-btn active' : 'mode-btn'}
              onClick={() => setGame(g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}

      {game === 'interval' && <IntervalTrainer />}
    </section>
  );
}
