// 6-sinf darslarini avtomatik kezib chiqish uchun umumiy yordamchilar.
// Ikki test ham (ovoz va joylashuv) shu yerdan foydalanadi — bir xil mantiqni
// ikki joyda saqlamaslik uchun.
//
// Ekran qulfi yoqilgandan keyin (metodist qarori 2026-08-05) darsni kezish
// uchun TOPSHIRIQNI BAJARISH shart: aks holda «Davom» ochilmaydi va ekran
// joyida qoladi. Ilgari qulf ulanmagani uchun testlar topshiriqni yechmasdan
// ham o'tib ketardi.

export const NAV_SELECTOR = '.stage-nav button, .fth-nav button';

// Ekran o'zgarganini aniqlash kaliti: butun matn xeshi. Faqat bosh qismini
// olsak, ba'zi darslarning ketma-ket slaydlari bir xil ko'rinardi.
export async function screenKey(page) {
  return page.evaluate(() => {
    const root = document.querySelector('.lesson-root');
    const text = root ? root.innerText : '';
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    return text ? `${text.length}:${hash}` : '';
  });
}

export async function navOpen(page) {
  const nav = page.locator(NAV_SELECTOR).last();
  if (await nav.count() === 0) return false;
  return nav.isEnabled().catch(() => false);
}

// «Davom» ochilishini kutadi: ovoz tugashi + javobdan keyingi izoh vaqti.
export async function waitNavOpen(page, timeoutMs = 22000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const nav = page.locator(NAV_SELECTOR).last();
    if (await nav.count() === 0) return false;
    if (await nav.isEnabled().catch(() => false)) return true;
    await page.waitForTimeout(400);
  }
  return false;
}

// Ekrandagi topshiriqni bajarishga urinadi. To'g'ri javobni bilmaydi:
//  - bitta javobli ekranda variantlar navbat bilan sinaladi (xato o'chadi);
//  - bir nechta javobli ekranda kartalar BITTALAB belgilanib tekshiriladi:
//    to'g'ri karta yashil bo'lib qulflanadi, xato karta o'chadi. Hammasini
//    birdan belgilash ishlamaydi — xato to'plamda tanlov bekor bo'ladi.
export async function solveScreen(page) {
  for (let attempt = 0; attempt < 14; attempt += 1) {
    if (await navOpen(page)) return true;
    const cards = page.locator('.lesson-root .pd-num:not([disabled])');
    const options = page.locator('.lesson-root button.option:not([disabled])');
    const check = page.locator('.lesson-root button', { hasText: /^(Tekshirish|Проверить)$/ }).first();

    if (await cards.count() > 0) {
      await cards.first().click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(250);
      if (await check.count() > 0 && await check.isEnabled().catch(() => false)) {
        await check.click({ timeout: 3000 }).catch(() => {});
      }
      await page.waitForTimeout(1100);
      continue;
    }
    if (await options.count() > 0) {
      await options.first().click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(700);
      if (await check.count() > 0 && await check.isEnabled().catch(() => false)) {
        await check.click({ timeout: 3000 }).catch(() => {});
        await page.waitForTimeout(700);
      }
      continue;
    }
    if (await check.count() > 0 && await check.isEnabled().catch(() => false)) {
      await check.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(700);
      continue;
    }
    return false; // bajariladigan element yo'q (izoh ekrani)
  }
  return false;
}

// Bir qadam oldinga: topshiriqni bajaradi, qulf ochilishini kutadi, «Davom» ni
// bosadi. `false` qaytsa — oldinga yo'l yo'q (dars tugadi yoki ekran qotdi).
export async function stepForward(page) {
  await solveScreen(page);
  const nav = page.locator(NAV_SELECTOR).last();
  // Birinchi slaydda (mavzu/kirish savoli) navigatsiya paneli YO'Q: variant
  // bosilgach dars o'zi keyingi ekranga o'tadi. Shu holatda «yo'l yo'q» deb
  // chiqib ketmaymiz — tsikl ekran kalitiga qarab o'zi hal qiladi.
  if (await nav.count() === 0) return true;
  if (!await waitNavOpen(page)) return false;
  await nav.click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);
  return true;
}

export function parseLessonArgs(argv, total) {
  const list = [];
  for (const arg of argv) {
    const range = arg.match(/^(\d+)-(\d+)$/);
    if (range) {
      for (let i = Number(range[1]); i <= Number(range[2]); i += 1) list.push(i);
    } else if (/^\d+$/.test(arg)) list.push(Number(arg));
  }
  return list.length ? list : Array.from({ length: total }, (_, i) => i + 1);
}
