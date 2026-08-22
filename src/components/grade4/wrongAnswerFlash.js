// 4-sinf nazariy darslari uchun umumiy "xato javob" ko'rsatkichi.
//
// Metodist qarori (2026-08-21): variantli savolda xato javob berilganda variant
// qizil bo'lib QOLMASLIGI kerak — qisqa vaqt qizarib, so'ng neytral holatiga
// qaytadi va yana tanlash mumkin bo'ladi. Faqat to'g'ri javob variantlarni
// qulflaydi.
//
// Shu sababli darslarda `option-wrong` / `choice-wrong` kabi doimiy sinflar
// ishlatilmaydi: variantga vaqtinchalik `data-g4-wrong-flash="true"` qo'yiladi.
// Uslub ham, taymer ham shu yerda — 1-10 darslar bir xil ishlashi uchun.
import { useCallback, useEffect, useRef, useState } from 'react';

export const WRONG_FLASH_MS = 1400;

// Qaytaradi: [flashKey, flashWrong] — flashKey qizarib turgan variant kaliti
// (indeks yoki id), flashWrong(key) uni yoqadi va o'zi o'chiradi.
export function useWrongFlash(duration = WRONG_FLASH_MS) {
  const [flashKey, setFlashKey] = useState(null);
  const timerRef = useRef(null);

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setFlashKey(null);
  }, []);

  const flashWrong = useCallback((key) => {
    if (typeof window === 'undefined') return;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    // Bir xil variant ketma-ket bosilsa animatsiya qaytadan boshlanishi uchun
    // avval null ga tushiramiz.
    setFlashKey(null);
    window.requestAnimationFrame(() => setFlashKey(key));
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setFlashKey(null);
    }, duration);
  }, [duration]);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  return [flashKey, flashWrong, clear];
}

// Har dars o'z STYLES satrining ichiga qo'shadi: `${WRONG_FLASH_CSS}`.
//
// Ikkinchi qoida shu yerda: to'g'ri javob berilgach qolgan variantlar
// xiralashadi va bosilmaydi (metodist qarori 2026-08-21). Belgisi —
// `data-g4-answer-dim="true"`. Sinf nomi emas, data-atribut: 4-sinfda uch xil
// avlod bor (kit, 21-29 monolit, 31-40 monolit) va ularda variant sinflari
// har xil atalgan; atribut esa uchalasida bir xil ishlaydi.
export const WRONG_FLASH_CSS = `
[data-g4-wrong-flash="true"] {
  background: #FDECEA !important;
  box-shadow: 0 0 0 2px rgba(193, 57, 43, .48), 0 10px 24px -16px rgba(193, 57, 43, .5) !important;
  animation: g4-wrong-flash-shake .4s ease both;
}
[data-g4-wrong-flash="true"] :is(.option-letter, .choice-letter, .option-key, b:first-child) {
  color: #FFFFFF !important;
  background: #C1392B !important;
}
[data-g4-answer-dim="true"] {
  opacity: .42;
  filter: saturate(.45);
  transition: opacity .22s ease, filter .22s ease;
}
@keyframes g4-wrong-flash-shake {
  0%, 100% { transform: translateX(0); }
  22% { transform: translateX(-5px); }
  46% { transform: translateX(4px); }
  70% { transform: translateX(-2px); }
}
@media (prefers-reduced-motion: reduce) {
  [data-g4-wrong-flash="true"] { animation: none !important; }
}
`;
