import { useState } from 'react';
import NotePicker from './NotePicker';
import {
  EASY_QUALITIES,
  HARD_QUALITIES,
  QUALITY_LABEL,
  pick,
  randomInt,
  randomNote,
  sameNoteSet,
  triadNotes,
  type Note,
  type Quality,
} from '../music';

type Mode = 'easy' | 'hard';

interface Round {
  root: Note;
  quality: Quality;
  tones: [Note, Note, Note];
  /** Easy mode: which tone index (0-2) is hidden. Unused in hard mode. */
  hiddenIndex: number;
}

function newRound(mode: Mode): Round {
  const root = randomNote();
  const quality = pick(mode === 'easy' ? EASY_QUALITIES : HARD_QUALITIES);
  return {
    root,
    quality,
    tones: triadNotes(root, quality),
    hiddenIndex: randomInt(3),
  };
}

type Phase = 'guessing' | 'graded';

const MODE_STORAGE_KEY = 'guitar-trainer.triad-mode';

function loadMode(): Mode {
  const stored = localStorage.getItem(MODE_STORAGE_KEY);
  return stored === 'hard' ? 'hard' : 'easy';
}

export default function TriadTrainer() {
  const [mode, setMode] = useState<Mode>(loadMode);
  const [round, setRound] = useState<Round>(() => newRound(loadMode()));
  const [selected, setSelected] = useState<Note[]>([]);
  const [phase, setPhase] = useState<Phase>('guessing');
  const [correct, setCorrect] = useState(false);

  const needed = mode === 'easy' ? 1 : 3;
  const answerNotes: Note[] =
    mode === 'easy' ? [round.tones[round.hiddenIndex]] : [...round.tones];

  function changeMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    localStorage.setItem(MODE_STORAGE_KEY, next);
    // Mode change resets the current game at any time.
    setRound(newRound(next));
    setSelected([]);
    setPhase('guessing');
  }

  function submit() {
    if (selected.length !== needed) return;
    setCorrect(sameNoteSet(selected, answerNotes));
    setPhase('graded');
  }

  function next() {
    setRound(newRound(mode));
    setSelected([]);
    setPhase('guessing');
  }

  const chordName = `${round.root} ${QUALITY_LABEL[round.quality]}`;

  return (
    <section className="trainer">
      <h2>Chord Triad Trainer</h2>

      <div className="mode-toggle" role="radiogroup" aria-label="Difficulty">
        {(['easy', 'hard'] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            className={mode === m ? 'mode-btn active' : 'mode-btn'}
            onClick={() => changeMode(m)}
          >
            {m === 'easy' ? 'Easy' : 'Hard'}
          </button>
        ))}
      </div>

      <p className="instructions">
        {mode === 'easy'
          ? 'One chord tone is hidden. Select the missing note.'
          : 'Select all three chord tones (root, third, and fifth).'}
      </p>

      <div className="chord-prompt">
        <div className="chord-name">{chordName}</div>
        {mode === 'easy' && (
          <div className="tone-slots">
            {round.tones.map((tone, i) => (
              <span
                key={i}
                className={
                  i === round.hiddenIndex ? 'tone-slot hidden-tone' : 'tone-slot'
                }
              >
                {i === round.hiddenIndex
                  ? phase === 'graded'
                    ? tone
                    : '?'
                  : tone}
              </span>
            ))}
          </div>
        )}
        {mode === 'hard' && (
          <div className="tone-slots">
            {round.tones.map((tone, i) => (
              <span key={i} className="tone-slot hidden-tone">
                {phase === 'graded' ? tone : '?'}
              </span>
            ))}
          </div>
        )}
      </div>

      <NotePicker
        selected={selected}
        max={needed}
        onChange={setSelected}
        disabled={phase === 'graded'}
        correctNotes={answerNotes}
        graded={phase === 'graded'}
      />
      <p className="pick-count">
        {selected.length}/{needed} selected
      </p>

      {phase === 'guessing' ? (
        <button
          type="button"
          className="primary-btn"
          onClick={submit}
          disabled={selected.length !== needed}
        >
          Submit
        </button>
      ) : (
        <button type="button" className="primary-btn" onClick={next}>
          Next
        </button>
      )}

      {phase === 'graded' && (
        <div
          className={correct ? 'result success' : 'result failure'}
          role="status"
        >
          {correct ? (
            <>✓ Correct! {chordName} is <strong>{round.tones.join(' – ')}</strong>.</>
          ) : (
            <>
              ✗ Not quite. {chordName} is{' '}
              <strong>{round.tones.join(' – ')}</strong>
              {mode === 'easy' && (
                <>
                  {' '}— the missing tone was{' '}
                  <strong>{round.tones[round.hiddenIndex]}</strong>.
                </>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
