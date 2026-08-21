// 4-sinf monolit avlodlari (21-29 va 31-40) uchun maket tuzatishlari.
//
// Ikkalasi ham bitta xil nosozlikdan kelib chiqadi: ramka ichida KO'RINMAS
// blok joy band qilib turadi va bola oldida ramka ostida katta oq bo'shliq
// qoladi (metodist 2026-08-21 da aynan shuni ko'rsatdi). Kitda (11-20, 30,
// 41-51) bu muammo yo'q — shuning uchun qiymatlar kitdan olingan.
//
// FINALE_FIT_CSS   — 31-40 darslar uchun (yakuniy ekran).
// EMPTY_FEEDBACK_CSS — 21-29 darslar uchun (savol ramkasidagi izoh sloti).
//
// ---------------------------------------------------------------------------
// FINALE_FIT_CSS
//
// Muammo (2026-08-21 auditi, `scripts/grade4-frame-gap-audit.mjs`): o'n darsning
// hammasida oxirgi slayd skroll qilardi — 1366x768 da 58 px, 390x760 da 100 px.
// Natijada mukofot ramkasi ("Unvonni oching") kesilib qolardi, savol ramkasi
// ostida esa 92 px bo'sh oq joy turardi. Ikkalasi ham bir sababdan:
//
//   1) `.question-feedback-slot` yechim bloki uchun 92 px joyni OLDINDAN band
//      qilardi. Boshqa ekranlarda bu to'g'ri (maket sakramaydi va joy bor),
//      lekin yakuniy ekranda joy yo'q — shuning uchun tuzatish faqat
//      `.reflection-card` ichidagi slotga tegadi.
//   2) Javob berilgach variantlar yig'ilmasdi. JSX `reflection-options-solved`
//      sinfini beradi, lekin 31-40 darslarning CSS nusxasida bu sinf uchun
//      qoida yo'q edi — kitda (11-20, 30, 41-51) bor va aynan shu sababdan
//      ularda skroll chiqmaydi.
//
// Qiymatlar kitning `kit/summaryStyles.js` faylidan olingan: yakuniy ekran
// etalon Dars01 ga mos bo'lib qolishi kerak. Nusxa emas, import: bitta tuzatish
// o'n darsni birga tuzatadi (CLAUDE.md 5-bo'lim).
//
// Dars faylida oxirgi bo'lib qo'shiladi, shuning uchun o'z CSS nusxasidan
// ustun keladi:
//   <style>{STYLES + TOPIC_STYLES + G4_ETALON_OVERRIDES + WRONG_FLASH_CSS + FINALE_FIT_CSS}</style>
export const FINALE_FIT_CSS = `
/* 1. Yakuniy savol kartasida bo'sh joy band qilinmaydi. */
.reflection-card > .feedback-slot.question-feedback-slot { min-height: 0; }

/* 2. To'g'ri javobdan keyin variantlar yig'iladi va yechimga joy bo'shatadi
      (kit bilan bir xil xatti-harakat). */
.reflection-options {
  transition:
    max-height .55s cubic-bezier(.22,.8,.3,1) .3s,
    opacity .26s ease .32s,
    margin .55s cubic-bezier(.22,.8,.3,1) .3s;
}
.reflection-options-solved {
  max-height: 0;
  margin-block: 0;
  opacity: 0;
  pointer-events: none;
}

/* 3. Past oyna va telefon: yakuniy ekran siqiladi, tuzilishi o'zgarmaydi.
      Qiymatlar kitning mobil blokidan. */
@media (max-width: 639.98px), (max-height: 760px) {
  .summary-stack { gap: 7px; }
  .final-mission-heading { padding: 8px 10px; border-radius: 13px; }
  .final-mission-heading h1 { margin-top: 2px; font-size: 18px; }
  .final-mission-heading p { font-size: 9px; line-height: 1.25; }
  .summary-final-layout { gap: 6px; }
  .summary-card { padding: 8px; }
  .reflection-card > .summary-question-kicker { min-height: 23px; margin-bottom: 6px; }
  .reflection-options { gap: 4px; grid-template-rows: repeat(3, minmax(30px, 1fr)); }
  .reflection-option { min-height: 30px; padding: 4px 8px; }
  .summary-support-column { gap: 6px; }
  .summary-rules-toggle { min-height: 46px; padding: 6px 8px; gap: 7px; }
  .reward-stage-compact { min-height: 84px; padding: 9px 59px 8px 51px; border-radius: 14px; }
  .reward-stage-compact .reward-medal { left: 8px; width: 34px; height: 34px; font-size: 14px; }
  .reward-stage-compact .reward-bit { width: 57px; height: 71px; }
  .reward-stage-compact h2 { margin: 0; font-size: 14px; }
  .reward-score { margin-top: 2px; padding: 3px 6px; gap: 4px; }
}
`;

// ---------------------------------------------------------------------------
// EMPTY_FEEDBACK_CSS — 21-29 darslar.
//
// Muammo: `FeedbackBlock` javob berilmagan holatda ham to'liq chiziladi —
// ichida Bit rasmi turadi va `min-height: 76px` joy band qiladi, faqat
// `opacity: 0` bilan yashiriladi. Natijada savol ramkasi ostida 73-75 px
// ko'rinmas oq joy qolardi (o'n ikkita ekranda, ikkala vyuportda).
//
// Yechim kitdagidek: javob berilmaganda blok BO'SH chiziladi
// (`feedback-empty`) va balandligi nolga tushadi. Javob berilgach blok
// to'liq chiziladi va o'z joyini oladi — maket faqat pastga o'sadi, yuqoridagi
// savol va variantlar joyidan siljimaydi.
// `height` ham bekor qilinadi: darsning o'z CSS nusxasida
// `.feedback.feedback-slot { height: 76px; min-height: 76px }` turadi (telefonda
// 54 px), ya'ni balandlik QATTIQ belgilangan — faqat `min-height` ni nolga
// tushirish yetmaydi.
export const EMPTY_FEEDBACK_CSS = `
.feedback.feedback-empty {
  height: 0 !important;
  min-height: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  box-shadow: none !important;
  background: none !important;
}
`;

// ---------------------------------------------------------------------------
// SPLIT_STEPS_FIT_CSS — 32-40 darslar, ikkinchi slayd.
//
// Ikki ustunli maketda o'ng ramka chap ramkaning balandligiga cho'ziladi, lekin
// matn faqat tepada turadi: Dars33 da ramka ostida 209 px, Dars35 da 176 px,
// Dars39 da 180 px bo'sh joy qolardi.
//
// `.step-list` da muallif `align-content: center` yozgan, ya'ni ro'yxat
// markazda turishi ko'zda tutilgan. Lekin ota-element `.split-steps` grid
// emas, shuning uchun bu qoida hech narsa qilmaydi. Ota-elementni grid qilamiz
// — ro'yxat ramka ichida markazlashadi va bo'shliq ikki tomonga teng bo'linadi.
// Bu yangi qaror emas, mavjud niyatni ishlatib yuborish.
export const SPLIT_STEPS_FIT_CSS = `
.split-steps { display: grid; align-content: center; }
`;
