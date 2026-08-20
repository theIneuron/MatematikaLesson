// Общий мобильный слой масштабирования для теоретических уроков 4 класса.
//
// Контракт: ETALON_4SINF.md §10 — при ширине менее 640 px весь урок
// масштабируется единым слоем, эталонная ширина макета 390 px.
// Техническая часть — src/books/MOBIL_DESKTOP_MOSLASH.md.
//
// Модуль существует, чтобы этот слой не копировался из урока в урок:
// пока он жил внутри DarsNN.jsx, урок 12 остался вовсе без масштабирования.
import { useEffect, useState } from 'react';

export const GRADE4_MOBILE_DESIGN_W = 390;
export const GRADE4_MOBILE_DESIGN_H = 760;
export const GRADE4_MOBILE_BREAKPOINT = 640;

// Урок узкий -> нужен ли компактный вариант отступов и раскладки.
export function useGrade4IsMobile(breakpoint = GRADE4_MOBILE_BREAKPOINT) {
  const [mobile, setMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setMobile(window.innerWidth < breakpoint);
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [breakpoint]);
  return mobile;
}

// Ставит --g4z на <html>. Урок применяет его через `zoom: var(--g4z, 1)`
// на корневом контейнере, поэтому масштабируется вся сцена целиком,
// а не отдельные её куски.
// `fitHeight: false` — только по ширине, как в эталоне Dars01: макет свёрстан на
// 390 px и целиком масштабируется под ширину телефона. Вариант с высотой
// (fitHeight: true) оставлен для уроков 11 и 12, где он уже применён.
export function useGrade4MobileZoom({
  designWidth = GRADE4_MOBILE_DESIGN_W,
  designHeight = GRADE4_MOBILE_DESIGN_H,
  breakpoint = GRADE4_MOBILE_BREAKPOINT,
  fitHeight = true,
} = {}) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = document.documentElement;
    const update = () => {
      const widthScale = window.innerWidth / designWidth;
      const heightScale = window.innerHeight / designHeight;
      const zoom = window.innerWidth < breakpoint
        ? (fitHeight ? Math.min(widthScale, heightScale, 1) : widthScale)
        : 1;
      root.style.setProperty('--g4z', String(zoom));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      root.style.removeProperty('--g4z');
    };
  }, [breakpoint, designHeight, designWidth, fitHeight]);
}
