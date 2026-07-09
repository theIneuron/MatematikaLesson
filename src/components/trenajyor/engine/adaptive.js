// Trenajyor engine — ko'nikma bo'yicha adaptivlik.
// Har skill alohida mastery (0–1) va daraja (1–3). Savol tanlash vazn bilan:
// zaif (past mastery) + kutilib qolgan (interval takrorlash) ko'nikma ko'proq chiqadi.
// TRENAJYOR_APP_REJA.md §2.

const DEFAULT_SKILL = () => ({ mastery: 0.35, level: 1, seen: 0, correct: 0, lastStep: -999 });

export function getSkill(profile, id) {
  return profile.skills[id] || DEFAULT_SKILL();
}

// Keyingi ko'nikmani tanlash. step — sessiya ichidagi joriy qadam (interval uchun).
export function selectSkill(profile, availableIds, step, lastId) {
  const weights = availableIds.map((id) => {
    const s = profile.skills[id] || DEFAULT_SKILL();
    const weakness = (1 - s.mastery) * 2;               // zaif → +0..2
    const due = Math.min(1.5, (step - s.lastStep) / 8); // kutildi → +0..1.5
    let w = 0.4 + weakness + due;
    if (id === lastId) w *= 0.15;                        // ketma-ket takror kam
    return Math.max(0.05, w);
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < availableIds.length; i++) {
    r -= weights[i];
    if (r <= 0) return availableIds[i];
  }
  return availableIds[availableIds.length - 1];
}

// Javobdan keyin mastery/darajani yangilash (profile.skills mutatsiya qilinadi).
export function updateMastery(profile, id, correct, fast, step) {
  const s = profile.skills[id] || DEFAULT_SKILL();
  s.seen += 1;
  if (correct) {
    s.correct += 1;
    const gain = 0.2 + (fast ? 0.06 : 0);
    s.mastery = Math.min(1, s.mastery + (1 - s.mastery) * gain);
    if (s.mastery >= 0.82 && s.level < 3) { s.level += 1; s.mastery = 0.6; } // darajaga ko'tarildi
  } else {
    s.mastery = Math.max(0, s.mastery - s.mastery * 0.3);
    if (s.mastery < 0.3 && s.level > 1) s.level -= 1;
  }
  s.lastStep = step;
  profile.skills[id] = s;
  return s;
}

// Sessiya xulosasi uchun: eng kuchli va eng zaif ko'nikma (shu sessiyada ko'rilganlaridan).
export function strongestWeakest(profile, sessionSkillIds) {
  const seen = sessionSkillIds.filter((id) => profile.skills[id]);
  if (!seen.length) return { strong: null, weak: null };
  const sorted = seen.slice().sort((a, b) => profile.skills[b].mastery - profile.skills[a].mastery);
  return { strong: sorted[0], weak: sorted[sorted.length - 1] };
}
