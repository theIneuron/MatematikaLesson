/* eslint-disable react-refresh/only-export-components */
// ============================================================================
// grade3/kit/ui.jsx — ОБОЛОЧКА ЭКРАНА, КНОПКИ, ОБРАТНАЯ СВЯЗЬ
//
// Источник: src/components/grade3/Dars01.jsx и Grade3EtalonDesign.jsx, обе версии
// ИЗ КОММИТА (HEAD). Оба файла в рабочем дереве имеют чужую незакоммиченную правку;
// в Dars01 она, среди прочего, удаляет scrollIntoView из FeedbackBlock — то есть
// разбор перестаёт подкручиваться в зону видимости (ETALON v2 §6.3 требует обратного).
//
// Отличия от источника — по контракту эталона:
//   1. Stage получает screenMeta ПРОПОМ. В оригинале он читал глобаль SCREEN_META
//      конкретного урока, из-за чего был непереносим между уроками.
//   2. Progress и ScreenTypeBadge перенесены сюда из Grade3EtalonDesign.jsx —
//      импортировать оттуда нельзя: файл лежит с чужой правкой.
//   3. Подписи на трёх языках (UZ/RU/EN) — ETALON v2 §9.1.
//   4. Добавлены OptionButton (состояния §5.1) и useCorrectRevealThenFade
//      (порядок обратной связи §6.1: подсветить -> дать увидеть -> убрать).
//
// eslint-disable сверху: это модуль-библиотека, экспортирует и компоненты, и хелперы;
// правило react-refresh рассчитано на модули-страницы.
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { FEEDBACK_FLOW, SCROLL_AND_LAYOUT } from './schema.js';
import { T, useLang, useT, useIsMobile, FREE_NAV } from './infra.js';

// ---------------------------------------------------------------------------
// ПОДПИСИ ИНТЕРФЕЙСА — три локали. Инлайн, а не импортом из src/components:
// каркас не имеет права зависеть от файлов уроков (см. src/courses/README.md).
// ---------------------------------------------------------------------------
const UI_COPY = {
  soundOn: { uz: 'Ovozni yoqish', ru: 'Включить звук', en: 'Turn sound on' },
  soundOff: { uz: "Ovozni o'chirish", ru: 'Выключить звук', en: 'Turn sound off' },
  replay: { uz: 'Ovozni qayta eshitish', ru: 'Повторить озвучку', en: 'Play again' },
  next: { uz: 'Davom etish', ru: 'Дальше', en: 'Next' },
  back: { uz: 'Orqaga', ru: 'Назад', en: 'Back' },
  progress: { uz: 'Dars jarayoni', ru: 'Прогресс урока', en: 'Lesson progress' },
};
const copy = (key, lang) => UI_COPY[key][lang] || UI_COPY[key].ru;

const SCREEN_TYPE_COPY = {
  hook: { icon: '✦', uz: 'Boshlanish', ru: 'Старт', en: 'Start' },
  exploration: { icon: '◉', uz: 'Kashfiyot', ru: 'Открытие', en: 'Discovery' },
  rule: { icon: '◆', uz: 'Qoida', ru: 'Правило', en: 'Rule' },
  test: { icon: '✓', uz: 'Mashq', ru: 'Практика', en: 'Practice' },
  case: { icon: '▦', uz: 'Masala', ru: 'Задача', en: 'Problem' },
  summary: { icon: '★', uz: 'Yakun', ru: 'Итог', en: 'Summary' },
  final: { icon: '◎', uz: 'Nazorat', ru: 'Проверка', en: 'Check' },
};

// ---------------------------------------------------------------------------
// МАТЕМАТИЧЕСКАЯ ТИПОГРАФИКА
// ---------------------------------------------------------------------------
export const Op = React.memo(({ children, size = 'mid' }) => {
  const fontSize = size === 'big' ? 'clamp(25px, 4.7vw, 38px)'
    : size === 'mid' ? 'clamp(16px, 3vw, 27px)'
      : 'clamp(12px, 2.1vw, 18px)';
  return <span className="mop" style={{ fontSize }}>{children}</span>;
});
Op.displayName = 'Op';

export const Frac = React.memo(({ n, d, color, size = 'sm' }) => (
  <span className={`frac frac-${size}`} style={{ color }}>
    <span className="n">{n}</span>
    <span className="bar"/>
    <span className="d">{d}</span>
  </span>
));
Frac.displayName = 'Frac';

// mt — рендерит текст, заменяя «a/b» настоящей дробью без слэша.
// Нужен потому, что «1/2» на экране должно выглядеть дробью, а в озвучке
// цифровая дробь запрещена вообще (ETALON v2 §9).
const FRAC_RE = /(\d+|\?)\/(\d+)/g;
export const mt = (str) => {
  const s = typeof str === 'string' ? str : String(str ?? '');
  if (s.indexOf('/') === -1) return s;
  const out = [];
  let last = 0;
  let m;
  let key = 0;
  FRAC_RE.lastIndex = 0;
  while ((m = FRAC_RE.exec(s)) !== null) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(<Frac key={`mtf${key}`} n={m[1]} d={m[2]} size="sm"/>);
    key += 1;
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
};

// ---------------------------------------------------------------------------
// ШАПКА ЭКРАНА
// ---------------------------------------------------------------------------
export function Progress({ current, total, lang = 'ru' }) {
  const value = Math.min(total, Math.max(1, current + 1));
  const percent = total > 0 ? (value / total) * 100 : 0;
  const label = lang === 'uz' ? `${value}-ekran, jami ${total} ta`
    : lang === 'en' ? `Screen ${value} of ${total}`
      : `Экран ${value} из ${total}`;
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label={copy('progress', lang)}
      aria-valuemin="1"
      aria-valuemax={total}
      aria-valuenow={value}
      aria-valuetext={label}
      title={label}
    >
      <div className="progress-bar" style={{ width: `${percent}%` }}/>
    </div>
  );
}

export function ScreenTypeBadge({ screenMeta, lang = 'ru' }) {
  const type = screenMeta?.scope === 'final' && screenMeta?.type === 'test'
    ? 'final'
    : screenMeta?.type || 'exploration';
  const c = SCREEN_TYPE_COPY[type] || SCREEN_TYPE_COPY.exploration;
  return (
    <span className={`grade3-screen-type grade3-screen-type-${type}`}>
      <span aria-hidden="true">{c.icon}</span>
      <span>{c[lang] || c.ru}</span>
    </span>
  );
}

export function AudioIndicator({ audioState }) {
  const { isPlaying, muted, replay, toggleMute } = audioState;
  const lang = useLang();
  const soundLabel = copy(muted ? 'soundOn' : 'soundOff', lang);
  const iconBtn = {
    background: 'transparent', border: 'none', cursor: 'pointer', padding: 4,
    display: 'flex', alignItems: 'center',
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button
        onClick={toggleMute}
        title={soundLabel}
        aria-label={soundLabel}
        style={{ ...iconBtn, color: muted ? T.ink3 : (isPlaying ? T.accent : T.ink2) }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          {muted ? (
            <>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </>
          ) : (
            <>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              {isPlaying && <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>}
            </>
          )}
        </svg>
      </button>
      {!muted && (
        <button onClick={replay} title={copy('replay', lang)} aria-label={copy('replay', lang)} style={{ ...iconBtn, color: T.ink2 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * Stage — рамка слайда: шапка (прогресс, тип, звук, номер), содержимое, панель навигации.
 * screenMeta приходит ПРОПОМ: в оригинале читалась глобаль SCREEN_META конкретного
 * урока, поэтому компонент нельзя было переиспользовать.
 * Вертикальная раскладка — flex + 100dvh, шапка и навигация flex-shrink: 0 (§6.3).
 */
export function Stage({ children, eyebrow, screen, totalScreens, screenMeta, navContent, audioState }) {
  const t = useT();
  const lang = useLang();
  const isMobile = useIsMobile(SCROLL_AND_LAYOUT.isMobileBreakpointPx);
  const padH = isMobile ? 12 : 56;
  const screenType = screenMeta?.type || 'custom';
  return (
    <div className={`stage stage-${screenType}`}>
      <div className="stage-header" style={{ paddingLeft: padH, paddingRight: padH }}>
        <Progress current={screen} total={totalScreens} lang={lang}/>
        <div className="chrome">
          <div className="chrome-left eyebrow">
            <span className="dot"/>
            <span>{t(eyebrow)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <ScreenTypeBadge screenMeta={screenMeta} lang={lang}/>
            {audioState && <AudioIndicator audioState={audioState}/>}
            <div className="mono small" style={{ color: T.ink, fontWeight: 700, fontSize: 14 }}>
              {String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
      <div className="stage-content" style={{ paddingLeft: padH, paddingRight: padH }}>
        {children}
      </div>
      {navContent && <div className="stage-nav" style={{ paddingLeft: padH, paddingRight: padH }}>{navContent}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// НАВИГАЦИЯ
// ---------------------------------------------------------------------------
export function NavBack({ onPrev }) {
  const lang = useLang();
  return (
    <button
      className="btn-ghost"
      onClick={onPrev}
      style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}
    >
      {copy('back', lang)}
    </button>
  );
}

// btn-ready — пульсация, когда идти уже можно: восьмилетнему нужен явный сигнал.
export function NavNext({ disabled, onClick }) {
  const lang = useLang();
  const isDisabled = FREE_NAV ? false : disabled;
  return (
    <button
      className={isDisabled ? 'btn-white-accent' : 'btn-white-accent btn-ready'}
      disabled={isDisabled}
      onClick={onClick}
      style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}
    >
      {copy('next', lang)}
    </button>
  );
}

// ---------------------------------------------------------------------------
// ВАРИАНТ ОТВЕТА — состояния строго по ETALON v2 §5.1.
// Неверный ЯНТАРНЫЙ, не красный: правило «тон мягкий» реализовано цветом.
// ---------------------------------------------------------------------------
export function OptionButton({ children, state = 'idle', disabled, onClick, fading, compact }) {
  const cls = ['option'];
  if (state === 'correct') cls.push('option-correct');
  if (state === 'wrong') cls.push('option-picked-wrong');
  if (fading) cls.push('option-fading');
  const size = compact
    ? { minHeight: 'clamp(48px, 7vw, 58px)', fontSize: 'clamp(13px, 1.7vw, 15px)' }
    : { minHeight: 'clamp(46px, 6.5vw, 56px)', fontSize: 'clamp(15px, 2.2vw, 19px)' };
  return (
    <button
      className={cls.join(' ')}
      disabled={disabled}
      onClick={onClick}
      style={{ padding: 'clamp(10px, 1.6vw, 13px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', ...size }}
    >
      {children}
    </button>
  );
}

/**
 * Порядок обратной связи при верном ответе — ETALON v2 §6.1.
 *
 * Сначала верный вариант подсвечен и ребёнок УСПЕВАЕТ его увидеть
 * (correctHighlightMs = 1100), только потом все варианты плавно исчезают
 * (optionsFadeOutMs = 600). Пауза не украшение: если гасить сразу, исчезает
 * главная обратная связь — что именно оказалось правильным.
 *
 * @returns { fading, gone } — fading включает класс option-fading, gone означает
 *          «можно переходить к следующему раунду»
 */
export function useCorrectRevealThenFade(isCorrect) {
  // 0 — обычное состояние, 1 — варианты гаснут, 2 — погасли.
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!isCorrect) return undefined;
    const t1 = setTimeout(() => setPhase(1), FEEDBACK_FLOW.correctHighlightMs);
    const t2 = setTimeout(() => setPhase(2), FEEDBACK_FLOW.correctHighlightMs + FEEDBACK_FLOW.optionsFadeOutMs);
    // Сброс делаем в очистке, а не в теле эффекта: тело эффекта не должно
    // синхронно менять состояние (react-hooks/set-state-in-effect).
    return () => { clearTimeout(t1); clearTimeout(t2); setPhase(0); };
  }, [isCorrect]);
  const eff = isCorrect ? phase : 0;
  return { fading: eff >= 1, gone: eff >= 2 };
}

// ---------------------------------------------------------------------------
// БЛОК ОБРАТНОЙ СВЯЗИ
// Двойной requestAnimationFrame: сначала блок встал на место после fade-up,
// потом скролл. Без этого прокрутка дёргается. В рабочем дереве scrollIntoView
// отсюда вырезан — здесь он на месте, как требует §6.3.
// ---------------------------------------------------------------------------
export function FeedbackBlock({ show, isCorrect, wrongClass, children }) {
  // visible включается на следующем кадре после монтирования — иначе CSS-переход
  // max-height/opacity не проигрывается, блок появляется рывком.
  const [visible, setVisible] = useState(false);
  // Задержка размонтирования, чтобы отыграла анимация ухода.
  const [lingering, setLingering] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!show) {
      // Показываем блок ещё 400 мс после скрытия: время на анимацию ухода.
      const timer = setTimeout(() => setLingering(false), 400);
      return () => clearTimeout(timer);
    }
    let tid;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      setVisible(true);
      setLingering(true);
      // Автоскролл к появившемуся разбору — обязателен (§6.3): на телефоне блок
      // иначе оказывается за пределами экрана и ребёнок его не видит.
      tid = setTimeout(() => {
        const el = ref.current;
        if (!el || typeof el.scrollIntoView !== 'function') return;
        const reduce = typeof window !== 'undefined' && window.matchMedia
          && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'end' });
      }, SCROLL_AND_LAYOUT.autoscrollDelayMs[0]);
    }));
    return () => { cancelAnimationFrame(raf); clearTimeout(tid); setVisible(false); };
  }, [show]);

  if (!show && !lingering) return null;
  return (
    <div ref={ref} className={`feedback-block ${visible && show ? 'visible' : ''}`}>
      <div className={isCorrect ? 'frame-success' : (wrongClass || 'frame-soft')}>{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ЦИФРОВАЯ КЛАВИАТУРА
//
// Смысл (комментарий автора в источнике): ребёнок не УЗНАЁТ ответ среди вариантов,
// а ПРОИЗВОДИТ его — набирает цифру за цифрой. Для разрядов это принципиально:
// набрать 305 значит осознанно поставить ноль в середину.
//
// В 19 эталонных уроках нашлось 8 версий этого компонента; взята преобладающая
// (10 файлов из 18). Подписи кнопок озвучены через aria-label.
// ---------------------------------------------------------------------------
const NUMPAD_COPY = {
  pad: { uz: 'Raqamli klaviatura', ru: 'Цифровая клавиатура', en: 'Number keypad' },
  back: { uz: "Oxirgi raqamni o'chirish", ru: 'Удалить последнюю цифру', en: 'Delete last digit' },
};

const npKey = {
  width: 'clamp(50px, 9vw, 54px)', height: 'clamp(42px, 7vw, 44px)',
  borderRadius: 13, border: `2px solid ${T.ink3}`, background: T.paper,
  fontWeight: 800, fontSize: 'clamp(21px, 4vw, 25px)', color: T.ink,
  fontFamily: "'JetBrains Mono', monospace",
};

export function NumPad({ value, setValue, disabled, max = 3 }) {
  const lang = useLang();
  const push = (d) => { if (!disabled) setValue((v) => (v.length >= max ? v : v + d)); };
  const back = () => { if (!disabled) setValue((v) => v.slice(0, -1)); };
  const key = { ...npKey, cursor: disabled ? 'default' : 'pointer' };
  return (
    <div className="d2-numpad" role="group" aria-label={NUMPAD_COPY.pad[lang] || NUMPAD_COPY.pad.ru}>
      <span className="d2-numpad-speaker" aria-hidden="true"/>
      <div
        className="mono d2-numpad-display"
        style={{
          minWidth: 'clamp(170px, 36vw, 212px)', height: 'clamp(50px, 9vw, 54px)',
          borderRadius: 15, border: `3px solid ${T.accent}`, background: T.paper,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 'clamp(28px, 5vw, 34px)', fontWeight: 800, color: T.ink,
          letterSpacing: 5, padding: '0 14px',
        }}
      >
        {value || '—'}
      </div>
      <div className="d2-numpad-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <button key={d} className="d2-numpad-key" type="button" disabled={disabled} onClick={() => push(String(d))} style={key}>{d}</button>
        ))}
        <span className="d2-numpad-spacer"/>
        <button className="d2-numpad-key" type="button" disabled={disabled} onClick={() => push('0')} style={key}>0</button>
        <button
          className="d2-numpad-key d2-numpad-back"
          type="button"
          aria-label={NUMPAD_COPY.back[lang] || NUMPAD_COPY.back.ru}
          disabled={disabled}
          onClick={back}
          style={{ ...key, fontSize: 22, color: T.accent }}
        >
          ⌫
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Slider — трек с заливкой и подсветкой (визуальный язык v15)
// ---------------------------------------------------------------------------
export function Slider({ value, min, max, step = 1, onChange, disabled = false }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="track-wrap">
      <div className="track-bg"/>
      <div className="track-fill" style={{ width: `${pct}%` }}/>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-input"
      />
    </div>
  );
}
