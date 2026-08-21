export const G4_GEOMETRY_COMPACT_FRAME_STYLES = `
.info-stack > .model-card,
.question-stack:not(:has([data-g4-feedback])) > .test-layout {
  width: 100%;
  height: min(100%, clamp(330px, 55dvh, 420px)) !important;
  align-self: center;
}

@media (max-width: 639.98px) {
  .info-stack > .model-card,
  .question-stack:not(:has([data-g4-feedback])) > .test-layout {
    height: min(100%, clamp(310px, 55dvh, 380px)) !important;
  }
}
`;
