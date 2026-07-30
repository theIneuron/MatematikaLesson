export function restorePracticeIndex(savedIndex, itemCount) {
  return Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < itemCount
    ? savedIndex
    : 0;
}
