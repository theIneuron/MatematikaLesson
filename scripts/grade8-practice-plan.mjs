// ============================================================================
// 8-SINF AMALIYOTI: JAVOBLAR VA BOSISHLAR — bir joyda, yon ta'sirsiz.
//
// NEGA ALOHIDA FAYL. Javoblarni ham tekshiruv (`grade8-practice-check.mjs`),
// ham suratchi (`grade8-practice-shot.mjs`) ishlatadi. Tekshiruv faylining
// o'zida yuqori darajada `await` bor, ya'ni undan import qilish tekshiruvni
// ISHGA TUSHIRIB yuboradi. Shu sababli ma'lumot va bosish alohida turadi.
//
// Javoblar RAZMETKADA yo'q: aks holda ularni o'quvchi ham ko'rardi.
// ============================================================================
// ============================================================
// JAVOBLAR. Har topshiriq — bosishlar ketma-ketligi.
//   type  -- maydonga yozish (indeks bilan: ikki maydonli topshiriqda)
//   card  -- bankdagi karta (matni bo'yicha)
//   slot  -- tirqish (indeks bo'yicha)
//   item  -- yozuv (id bo'yicha) · zone -- zona (id bo'yicha)
//   row   -- tayyor yechimning satri (id bo'yicha)
//   none  -- «taqiqlangan qiymat yo'q» tugmasi
// ============================================================
export const PLAN = [
  // 01 input: (3b + 21)/6, b = −5 -> 1
  [{ type: '1' }],
  // 02 sort: butun (a, c, e) va kasr (b, d, g)
  [
    { item: 'a' }, { zone: 'w' }, { item: 'c' }, { zone: 'w' }, { item: 'e' }, { zone: 'w' },
    { item: 'b' }, { zone: 'f' }, { item: 'd' }, { zone: 'f' }, { item: 'g' }, { zone: 'f' },
  ],
  // 03 slots: 4x = 28, x = 7, x ≠ 7
  [{ card: '28' }, { slot: 0 }, { card: '7' }, { slot: 1 }, { card: '≠' }, { slot: 2 }],
  // 04 input: (x − 9)/(x + 4) da x = 9 -> 0
  [{ type: '0' }],
  // 05 odz: qiymat −7 va shart x ≠ 3
  [{ type: '-7', at: 0 }, { type: 'x != 3', at: 1 }],
  // 06 build: maxraj x · (x − 6)
  [{ card: 'x' }, { card: '·' }, { card: '(x − 6)' }],
  // 07 odz: qiymat 4 va shart x ≠ 0, x ≠ 5
  [{ type: '4', at: 0 }, { type: 'x != 0, x != 5', at: 1 }],
  // 08 boundary: (x · x)/x va x nolda ajraladi
  [{ type: '0' }],
  // 09 audit: birinchi noto'g'ri satr r3, kontrprimer 0
  [{ row: 'r3' }, { type: '0' }],
  // 10 input odz: taqiq yo'q — tugma
  [{ none: true }],
]

export async function step(page, act) {
  if (act.type !== undefined) {
    // Telefonda ikki maydonli topshiriqda faol maydon BITTA, ikkinchisi
    // yig'ilgan satr: uni ochish kerak (kit.jsx -> Odz).
    const fold = page.locator(`[data-fold="${act.at || 0}"]`)
    if (await fold.count()) await fold.click()
    const fields = page.locator('.g8-input')
    await fields.nth(await fields.count() > 1 ? (act.at || 0) : 0).fill(act.type)
    return
  }
  if (act.card !== undefined) { await page.locator(`[data-card="${act.card}"]`).first().click(); return }
  if (act.slot !== undefined) { await page.locator(`[data-slot="${act.slot}"]`).click(); return }
  if (act.item !== undefined) { await page.locator(`[data-item="${act.item}"]`).click(); return }
  if (act.zone !== undefined) { await page.locator(`[data-zone="${act.zone}"]`).click(); return }
  if (act.row !== undefined) { await page.locator(`[data-row="${act.row}"]`).click(); return }
  if (act.none) { await page.locator('.pq-none').click(); return }
  throw new Error('nomalum harakat: ' + JSON.stringify(act))
}
