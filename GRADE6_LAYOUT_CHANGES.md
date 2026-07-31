# Grade 6 layout changes (session)

Summary of local edits before commit. Grade 6 theory only.

## Files changed

1. `src/components/grade6/Grade6TheoryTheme.css`
2. `src/components/grade6/FractionTheoryLesson.jsx`
3. `src/components/grade6/Dars01.jsx`
4. `src/components/grade6/Dars02.jsx`
5. `src/components/grade6/Dars03.jsx`
6. `src/components/grade6/Dars04.jsx`
7. `src/components/grade6/Dars05.jsx`
8. `src/components/grade6/Dars06.jsx`

## What changed (by topic)

### Shared theme
- Desktop horizontal padding reduced (fluid clamp instead of large fixed side margin).
- Stage content can scroll vertically so zoom does not clip cards.
- Shared content max width token (`--g6-content-max` / 760px).
- Hook / figure cards: no short-viewport `max-height` crush; content stays inside the frame on zoom.
- `.g6-hook` and `.g6-custom-hook` column width aligned to the same max width across pages.

### FractionTheoryLesson (Dars 07+)
- Circle, coordinate plane, and geometry visuals scale inside `.g6-hook-visual` / `.fth-figure-frame`.
- Overflow clipped to the card so diagrams do not break out on zoom ±.

### Dars01
- Title / option cards grow with text on browser zoom (height auto, no hard crush).
- Lesson root class for Dars01-specific zoom-safe rules.

### Dars02–06
- First-page hook sizing bumped (wider column, larger type/frame) to match later screens.
- Screen0 max width aligned to content max (760).
- Dars02 tip stacks exempt from short-viewport zoom crush (spacing like RuleScreen).

## Out of scope
- No CONTENT / pedagogy text rewrites.
- No other grades.
- This markdown file is a pre-commit note; delete or keep as you prefer before committing.
