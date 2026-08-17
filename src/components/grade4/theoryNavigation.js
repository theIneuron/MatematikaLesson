// Temporary review switch for Grade 4 theory lessons.
// Set this to false to restore the normal audio/activity Continue gate.
export const GRADE4_THEORY_CONTINUE_UNLOCKED = true;

export function canUseGrade4TheoryContinue(gatePassed, finish = false) {
  return (!finish && GRADE4_THEORY_CONTINUE_UNLOCKED) || Boolean(gatePassed);
}
