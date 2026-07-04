# 🎸 Guitar Trainer

A browser-based practice app for guitarists to drill fretboard knowledge,
music theory, and ear training. Built with React + Vite + TypeScript, with no
backend — all logic runs client-side and preferences persist in
`localStorage`.

## Trainers

- **Neck Notes** — a position is marked on an SVG fretboard; name the note.
- **Chord Triads** — identify triad tones.
  - *Easy:* major/minor triad with one tone hidden — pick the missing note.
  - *Hard:* all four qualities (major, minor, diminished, augmented) with all
    three tones hidden — pick them all.
- **Sheet Music** — read a note on a treble staff (with key signature, ledger
  lines, and accidentals).
  - *Easy:* key signature drawn and named; quarter notes.
  - *Hard:* key signature only (infer the key) and identify the note duration.
- **Scales** — spell major and natural-minor scales.
  - *Easy:* major only, with a W–W–H–W–W–W–H cheat sheet and one degree hidden.
  - *Hard:* major or minor, no cheat sheet, all seven notes hidden.
- **Scale Degrees** — name the note for a functional scale degree (tonic,
  dominant, leading tone, …), with a description of each degree's harmonic role.
- **Ear Training** — hear a tonic then an interval and identify it by ear,
  using the Web Audio API. Key can be random or fixed.

Accidentals are shown with both enharmonic spellings (e.g. A♯/B♭).

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run preview  # preview the production build
```

## Tech

- React 19 + TypeScript
- Vite
- Web Audio API for tone generation
- Inline SVG for the fretboard and musical staff

No external UI or music-theory libraries — the theory (scales, triads,
intervals, key signatures) and rendering are implemented from scratch.
