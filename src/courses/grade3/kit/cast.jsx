/* eslint-disable react-refresh/only-export-components */
// ============================================================================
// grade3/kit/cast.jsx — КАНОН ПЕРСОНАЖЕЙ
//
// Источник: src/components/grade3/Dars01.jsx, версия ИЗ КОММИТА (HEAD).
// SVG перенесены ДОСЛОВНО, механическим извлечением по диапазонам строк, а не
// перепечаткой: в этих фигурах каждая координата значима, одна опечатка ломает лицо.
//
// Канон 3 класса (SYUJET_3SINF.md) — пять и только пять:
//     Bit    — робот-провожатый, ведёт урок и реагирует на ответы
//     Ra'no  — ведущая из экипажа
//     Anvar, Zuhra, Jasur — экипаж
// Новых персонажей не добавлять: ребёнок должен узнавать одних и тех же.
//
// Отличия от источника:
//   1. Фразы похвалы и подбадривания — на трёх языках (ETALON v2 §9.1).
//   2. Reaction подписан по контракту §6.1: Bit выходит И на верном, И на неверном
//      ответе. Это осознанное отличие от правила 1 класса (personaj.md: «Bit
//      появляется ТОЛЬКО на неправильном ответе») — решение методиста 2026-08-03.
// ============================================================================

import { createContext, useContext, useEffect } from 'react';

// ---------------------------------------------------------------------------
// РЕЧЕВЫЕ ЗАГОТОВКИ
//
// Фразы идут по кругу, чтобы урок не звучал монотонно. Счётчик живёт в модуле:
// сбрасывается только при перезагрузке страницы — этого достаточно, состояние
// между уроками сохранять не требуется.
//
// ENCOURAGE — подбадривание при ошибке. Ни одна фраза НЕ ДАЁТ ответ: они
// показывают СПОСОБ (пересчитай по одному, не спеша, по порядку). Это правило
// эталона: подсказка указывает, на что смотреть, а не что написать.
// ---------------------------------------------------------------------------
export const PRAISE = {
  uz: ['Barakalla!', 'Ajoyib!', "Zo'r!", 'Ofarin!'],
  ru: ['Молодец!', 'Отлично!', 'Здорово!', 'Умница!'],
  en: ['Well done!', 'Excellent!', 'Great!', 'Nice work!'],
};

export const ENCOURAGE = {
  uz: [
    'Sal qoldi! Yana bir bor, bittadan sanang.',
    'Yaqin qoldingiz! Diqqat bilan qaytadan sanang.',
    'Yaxshi urinish! Shoshmasdan, tartib bilan sanang.',
    'Ozgina qoldi! Har biriga qarab, bittadan sanang.',
    "Zo'r harakat! Sanashni boshidan, sekin boshlang.",
  ],
  ru: [
    'Почти! Посчитай ещё раз, по одному.',
    'Уже близко! Посмотри внимательно и сосчитай снова.',
    'Хорошая попытка! Считай не спеша, по порядку.',
    'Ещё чуть-чуть! Дотронься до каждого и посчитай.',
    'Молодец! Начни счёт сначала, спокойно.',
  ],
  en: [
    'Almost! Count again, one by one.',
    'Very close! Look carefully and count once more.',
    'Good try! Count slowly, in order.',
    'Just a bit more! Touch each one and count.',
    'Well tried! Start counting again, calmly.',
  ],
};

let encIdx = 0;
export const nextEncourage = (lang) => {
  const a = ENCOURAGE[lang] || ENCOURAGE.ru;
  const p = a[encIdx % a.length];
  encIdx += 1;
  return p;
};

let praiseIdx = 0;
export const nextPraise = (lang) => {
  const a = PRAISE[lang] || PRAISE.ru;
  const p = a[praiseIdx % a.length];
  praiseIdx += 1;
  return p;
};

// ---------------------------------------------------------------------------
// BIT — робот-провожатый.
// state: present (встречает) | happy (верный ответ) | hint (ошибка, помогает)
// ---------------------------------------------------------------------------
export const BitSVG = ({ state = 'present', className = '' }) => (
  <svg className={`g1-char g1-char-bit ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g1bbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E2ECF2"/><stop offset="100%" stopColor="#B6C7D2"/></linearGradient>
      <linearGradient id="g1bhead" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EBF2F6"/><stop offset="100%" stopColor="#C4D3DC"/></linearGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)"/>
    {/* antenna */}
    <g className="g1-bit-ant">
      <path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="60" cy="11" r="6" fill="#FF4F28"/>
      <circle cx="58" cy="9" r="2" fill="#FFB9A6"/>
    </g>
    {/* oyoqchalar */}
    <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF"/>
    <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF"/>
    {/* tana */}
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g1bbody)" stroke="#A9BCC8" strokeWidth="2"/>
    <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5"/>
    {/* qo'llar + panjalar (state) */}
    {state === 'happy' && (
      <g>
        <path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="22" cy="47" r="5" fill="#B6C7D2"/>
        <path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="98" cy="47" r="5" fill="#B6C7D2"/>
      </g>
    )}
    {state === 'present' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="30" cy="103" r="5" fill="#B6C7D2"/>
        <g className="g1-bit-wave"><path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="98" cy="43" r="5" fill="#B6C7D2"/></g>
      </g>
    )}
    {state === 'hint' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="30" cy="103" r="5" fill="#B6C7D2"/>
        <path d="M84 74 C 92 64 96 54 95 46" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="95" cy="45" r="5" fill="#B6C7D2"/>
      </g>
    )}
    {/* bosh */}
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g1bhead)" stroke="#A9BCC8" strokeWidth="2"/>
    {/* ekran-yuz + porlash */}
    <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C"/>
    <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)"/>
    <g className="g1-eyes" fill="#5BD6F2">
      {state === 'hint'
        ? <><circle cx="50" cy="50" r="4.5"/><circle cx="70" cy="49" r="5.5"/></>
        : <><circle cx="50" cy="50" r="5"/><circle cx="70" cy="50" r="5"/></>}
    </g>
    {state === 'happy' && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round"/>}
    {state === 'present' && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round"/>}
    {state === 'hint' && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2"/>}
    {/* hint: yordam belgisi */}
    {state === 'hint' && <g><circle cx="99" cy="38" r="9" fill="#FFC23C"/><text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text></g>}
  </svg>
);

// ---------------------------------------------------------------------------
// НАСТРОЕНИЕ ПЕРСОНАЖА НА УРОВНЕ УРОКА
// Экран объявляет своё настроение через useHero, а показывает его один постоянный
// overlay — персонаж не прыгает по экрану от слайда к слайду.
// ---------------------------------------------------------------------------
export const HeroContext = createContext({ setMood: () => {} });

export const useHero = (mood) => {
  const { setMood } = useContext(HeroContext);
  useEffect(() => { setMood(mood); }, [mood, setMood]);
};

/** Overlay в левом нижнем углу. Показывается только когда Bit встречает ('present'). */
export const StageHero = ({ mood }) => {
  if (mood !== 'present') return null;
  return (
    <div className="g1-stage-hero g1-sh-present" aria-hidden="true">
      <BitSVG state="present" className="g1-hero-bit"/>
    </div>
  );
};

/**
 * Reaction — карточка отклика на ответ: текст слева, анимированный Bit справа.
 *
 * Bit выходит И на верном, И на неверном ответе (решение методиста 2026-08-03,
 * ETALON v2 §6.1). Это осознанное отличие от 1 класса, где Bit был сигналом
 * ошибки: в 3 классе он провожатый, а не тревожная лампочка.
 *
 * На ошибке тон мягкий: ни красного креста, ни резкого звука — только Bit
 * с подсказкой (§6).
 */
export const Reaction = ({ state, praise }) => {
  const ok = state === 'correct';
  useHero(ok ? 'happy' : 'encourage');
  return (
    <div className={`g1-bitcard ${ok ? 'g1-bitcard-ok' : 'g1-bitcard-enc'}`}>
      <div className="g1-bitcard-fig"><BitSVG state={ok ? 'happy' : 'hint'}/></div>
      <div className="g1-bitcard-body"><span className="g1-bitcard-txt">{praise}</span></div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ЭКИПАЖ — Ra'no, Anvar, Zuhra, Jasur. SVG дословно из коммита.
// ---------------------------------------------------------------------------
export const RanoSVG = ({ mood = 'pointing', className = '' }) => {
  const big = mood === 'happy' || mood === 'celebrate';
  return (
    <svg className={`g1-char g1-char-rano ${className}`} viewBox="0 0 130 190" aria-hidden="true">
      <defs>
        <radialGradient id="g1mskin" cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#F8CBA0"/><stop offset="100%" stopColor="#E0A06E"/></radialGradient>
        <linearGradient id="g1mdress" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF92B8"/><stop offset="100%" stopColor="#E84F86"/></linearGradient>
        <linearGradient id="g1mhair" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5A3A22"/><stop offset="100%" stopColor="#3A2516"/></linearGradient>
      </defs>
      <ellipse cx="64" cy="178" rx="34" ry="5" fill="rgba(58,53,48,0.13)"/>
      <rect x="57" y="140" width="7.5" height="28" rx="3.7" fill="url(#g1mskin)"/>
      <rect x="65.5" y="140" width="7.5" height="28" rx="3.7" fill="url(#g1mskin)"/>
      <ellipse cx="60" cy="170" rx="8" ry="4.2" fill="#C23B63"/>
      <ellipse cx="70" cy="170" rx="8" ry="4.2" fill="#C23B63"/>
      <path d="M43 36 Q43 11 65 11 Q87 11 87 36 L87 80 Q82 66 77 62 L77 40 Q77 27 65 27 Q53 27 53 40 L53 62 Q48 66 43 80 Z" fill="url(#g1mhair)"/>
      {big ? (
        <g>
          <path d="M53 58 Q45 42 41 28" stroke="url(#g1mskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="41" cy="27" r="4.6" fill="url(#g1mskin)"/>
          <path d="M77 58 Q85 42 89 28" stroke="url(#g1mskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="89" cy="27" r="4.6" fill="url(#g1mskin)"/>
        </g>
      ) : (
        <g>
          <path d="M53 58 Q46 74 43 91" stroke="url(#g1mskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="43" cy="92" r="4.6" fill="url(#g1mskin)"/>
          <path d="M77 58 Q84 74 87 91" stroke="url(#g1mskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="87" cy="92" r="4.6" fill="url(#g1mskin)"/>
        </g>
      )}
      <path d="M50 56 Q52 50 58 49 L72 49 Q78 50 80 56 L94 146 Q65 155 36 146 Z" fill="url(#g1mdress)"/>
      <path d="M37 140 Q65 149 93 140 L94 146 Q65 155 36 146 Z" fill="rgba(255,255,255,0.28)"/>
      <ellipse cx="51" cy="57" rx="7" ry="6" fill="url(#g1mdress)"/>
      <ellipse cx="79" cy="57" rx="7" ry="6" fill="url(#g1mdress)"/>
      <path d="M58 50 Q65 57 72 50 Q68 54 65 54 Q62 54 58 50 Z" fill="#FFFFFF"/>
      <path d="M46 67 Q65 72 84 67 L85 73 Q65 78 45 73 Z" fill="#D43E74"/>
      <circle cx="65" cy="70" r="2.6" fill="#FFD86B" stroke="#C99A2E" strokeWidth="0.8"/>
      <circle cx="65" cy="37" r="16.5" fill="url(#g1mskin)"/>
      <ellipse cx="45" cy="44" rx="7.5" ry="11" fill="url(#g1mhair)"/>
      <ellipse cx="85" cy="44" rx="7.5" ry="11" fill="url(#g1mhair)"/>
      <circle cx="48.5" cy="35" r="2.4" fill="#FF4F8B"/>
      <circle cx="81.5" cy="35" r="2.4" fill="#FF4F8B"/>
      <path d="M49 37 Q50 18 65 17 Q80 18 81 37 Q74 27 65 26 Q56 27 49 37 Z" fill="url(#g1mhair)"/>
      <path d="M65 16 L58 12 Q56 17 62 18 Z M65 16 L72 12 Q74 17 68 18 Z" fill="#FF4F8B"/>
      <circle cx="65" cy="16.5" r="2" fill="#E03A78"/>
      <g className="g1-eyes">
        <circle cx="59" cy="37" r="2.1" fill="#3A2A1E"/><circle cx="71" cy="37" r="2.1" fill="#3A2A1E"/>
        <path d="M56 33.6 Q59 32.2 61.4 33.6" stroke="#3A2A1E" strokeWidth="1" fill="none" strokeLinecap="round"/>
        <path d="M68.6 33.6 Q71 32.2 74 33.6" stroke="#3A2A1E" strokeWidth="1" fill="none" strokeLinecap="round"/>
      </g>
      <path d="M64.6 39 Q65 41 65.9 41" stroke="#C98A6A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {big
        ? <path d="M59 43 Q65 51 71 43 Q65 47 59 43 Z" fill="#C0392B"/>
        : <path d="M60 44 Q65 48 70 44" stroke="#C0392B" strokeWidth="2" fill="none" strokeLinecap="round"/>}
      <ellipse cx="54" cy="44" rx="3" ry="2" fill="rgba(255,120,120,0.4)"/>
      <ellipse cx="76" cy="44" rx="3" ry="2" fill="rgba(255,120,120,0.4)"/>
    </svg>
  );
};

export const AnvarSVG = ({ pose = 'door', className = '' }) => {
  const happy = pose === 'happy';
  const door = pose === 'door';
  return (
    <svg className={`g1-char g1-char-anvar ${className}`} viewBox="0 0 130 190" aria-hidden="true">
      <defs>
        <radialGradient id="g1askin" cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#F8CBA0"/><stop offset="100%" stopColor="#E0A06E"/></radialGradient>
        <linearGradient id="g1ashirt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4C90E6"/><stop offset="100%" stopColor="#2C63B0"/></linearGradient>
        <linearGradient id="g1ahair" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3A2E26"/><stop offset="100%" stopColor="#211915"/></linearGradient>
      </defs>
      <ellipse cx="64" cy="178" rx="32" ry="5" fill="rgba(58,53,48,0.13)"/>
      <rect x="57" y="120" width="8" height="48" rx="3.5" fill="#46566B"/>
      <rect x="65" y="120" width="8" height="48" rx="3.5" fill="#3C4A5C"/>
      <ellipse cx="60" cy="170" rx="8" ry="4.2" fill="#22303F"/>
      <ellipse cx="70" cy="170" rx="8" ry="4.2" fill="#22303F"/>
      {door && (
        <g>
          <path d="M52 60 Q46 78 44 95" stroke="url(#g1askin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="44" cy="96" r="4.6" fill="url(#g1askin)"/>
          <g className="g1-anvar-wave">
            <path d="M78 58 Q88 44 90 30" stroke="url(#g1askin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="90" cy="29" r="4.6" fill="url(#g1askin)"/>
          </g>
        </g>
      )}
      {happy && (
        <g>
          <path d="M52 58 Q44 42 40 28" stroke="url(#g1askin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="40" cy="27" r="4.6" fill="url(#g1askin)"/>
          <path d="M78 58 Q86 42 90 28" stroke="url(#g1askin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="90" cy="27" r="4.6" fill="url(#g1askin)"/>
        </g>
      )}
      <path d="M51 56 Q53 50 60 49 L70 49 Q77 50 79 56 L86 118 Q65 124 44 118 Z" fill="url(#g1ashirt)"/>
      <ellipse cx="52" cy="57" rx="6.5" ry="5.5" fill="url(#g1ashirt)"/>
      <ellipse cx="78" cy="57" rx="6.5" ry="5.5" fill="url(#g1ashirt)"/>
      <path d="M58 50 Q65 56 72 50 Q68 54 65 54 Q62 54 58 50 Z" fill="#1F4E8C"/>
      <ellipse cx="50" cy="39" rx="2.6" ry="3.6" fill="url(#g1askin)"/>
      <ellipse cx="80" cy="39" rx="2.6" ry="3.6" fill="url(#g1askin)"/>
      <circle cx="65" cy="37" r="16" fill="url(#g1askin)"/>
      <path d="M49 39 Q48 32 54 30 L56 37 Q52 38 50 41 Z" fill="url(#g1ahair)"/>
      <path d="M81 39 Q82 32 76 30 L74 37 Q78 38 80 41 Z" fill="url(#g1ahair)"/>
      <path d="M47 34 Q47 15 65 14 Q83 15 83 34 Q65 28 47 34 Z" fill="#2C7BD6"/>
      <path d="M47 34 Q49 20 60 15 Q55 19 52 25 Q49 30 49 35 Z" fill="#2569B8"/>
      <rect x="47" y="32" width="36" height="4" rx="2" fill="#2569B8"/>
      <circle cx="65" cy="14.5" r="2.2" fill="#2569B8"/>
      <path d="M47 35 Q31 36 27 42 Q42 45 50 39 Z" fill="#2569B8"/>
      <path d="M47 35 Q34 36 29 41 Q42 42 49 38 Z" fill="#1E5599"/>
      <g stroke="#3A2A1E" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M55 36 Q59 34.6 62.5 36"/>
        <path d="M67.5 36 Q71 34.6 75 36"/>
      </g>
      <g className="g1-eyes">
        <circle cx="59" cy="39" r="2.2" fill="#3A2A1E"/><circle cx="71" cy="39" r="2.2" fill="#3A2A1E"/>
        <circle cx="59.8" cy="38.2" r="0.7" fill="#fff"/><circle cx="71.8" cy="38.2" r="0.7" fill="#fff"/>
      </g>
      <path d="M64.6 39 Q65 41 65.9 41" stroke="#C98A6A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {happy
        ? <path d="M59 43 Q65 51 71 43 Q65 47 59 43 Z" fill="#C0392B"/>
        : <path d="M60 44 Q65 48 70 44" stroke="#C0392B" strokeWidth="2" fill="none" strokeLinecap="round"/>}
      <ellipse cx="54" cy="44" rx="3" ry="2" fill="rgba(255,120,120,0.34)"/>
      <ellipse cx="76" cy="44" rx="3" ry="2" fill="rgba(255,120,120,0.34)"/>
    </svg>
  );
};

export const JasurSVG = ({ pose = 'pointing', className = '' }) => {
  const happy = pose === 'happy';
  return (
    <svg className={`g1-char g1-char-jasur ${className}`} viewBox="0 0 130 190" aria-hidden="true">
      <defs>
        <radialGradient id="g1jskin" cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#F6C79A"/><stop offset="100%" stopColor="#D89A63"/></radialGradient>
        <linearGradient id="g1jvest" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#54B777"/><stop offset="100%" stopColor="#2F8E52"/></linearGradient>
        <linearGradient id="g1jhair" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#332A22"/><stop offset="100%" stopColor="#1C1611"/></linearGradient>
        <linearGradient id="g1jbag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F0843A"/><stop offset="100%" stopColor="#D2611E"/></linearGradient>
      </defs>
      <ellipse cx="64" cy="178" rx="32" ry="5" fill="rgba(58,53,48,0.13)"/>
      <rect x="79" y="60" width="25" height="46" rx="9" fill="url(#g1jbag)" stroke="#B9531A" strokeWidth="1.5"/>
      <rect x="85" y="76" width="15" height="18" rx="4" fill="#E5752B" stroke="#B9531A" strokeWidth="1.1"/>
      <path d="M88 76 v18" stroke="#B9531A" strokeWidth="1.2"/>
      <rect x="57" y="120" width="8" height="48" rx="3.5" fill="#4A5A48"/>
      <rect x="65" y="120" width="8" height="48" rx="3.5" fill="#3E4D3D"/>
      <ellipse cx="60" cy="170" rx="8" ry="4.2" fill="#5B3A24"/>
      <ellipse cx="70" cy="170" rx="8" ry="4.2" fill="#4A2E1C"/>
      {!happy && (
        <g>
          <path d="M78 60 Q86 76 86 92" stroke="url(#g1jskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="86" cy="93" r="4.6" fill="url(#g1jskin)"/>
          <path d="M52 58 Q42 50 36 40" stroke="url(#g1jskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="35" cy="39" r="4.6" fill="url(#g1jskin)"/>
        </g>
      )}
      {happy && (
        <g>
          <path d="M52 58 Q44 42 40 28" stroke="url(#g1jskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="40" cy="27" r="4.6" fill="url(#g1jskin)"/>
          <path d="M78 58 Q86 42 90 28" stroke="url(#g1jskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="90" cy="27" r="4.6" fill="url(#g1jskin)"/>
        </g>
      )}
      <path d="M51 56 Q53 50 60 49 L70 49 Q77 50 79 56 L86 118 Q65 124 44 118 Z" fill="url(#g1jvest)"/>
      <ellipse cx="52" cy="57" rx="6.5" ry="5.5" fill="url(#g1jvest)"/>
      <ellipse cx="78" cy="57" rx="6.5" ry="5.5" fill="url(#g1jvest)"/>
      <path d="M59 49 L65 57 L71 49 L68.5 48 L65 52.5 L61.5 48 Z" fill="#FFFFFF"/>
      <path d="M60 50 L65 57.5 L70 50" stroke="#2A7E48" strokeWidth="1.6" fill="none"/>
      <path d="M58 51 Q60 82 63 113" stroke="#E5752B" strokeWidth="4.6" fill="none" strokeLinecap="round"/>
      <path d="M73 51 Q70 82 68 113" stroke="#E5752B" strokeWidth="4.6" fill="none" strokeLinecap="round"/>
      <circle cx="62" cy="100" r="2.2" fill="#C25E1C"/><circle cx="69" cy="100" r="2.2" fill="#C25E1C"/>
      <ellipse cx="50" cy="39" rx="2.6" ry="3.6" fill="url(#g1jskin)"/>
      <ellipse cx="80" cy="39" rx="2.6" ry="3.6" fill="url(#g1jskin)"/>
      <circle cx="65" cy="37" r="16" fill="url(#g1jskin)"/>
      <path d="M49 37 Q47 19 65 17 Q84 18 82 36 Q79 27 70 25 Q74 31 69 32 Q64 24 55 28 Q50 31 51 39 Z" fill="url(#g1jhair)"/>
      <path d="M54 29 Q61 23 71 27 Q63 28 58 33 Q55 32 54 29 Z" fill="#241B14"/>
      <g stroke="#332419" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M55 36 Q59 34.6 62.5 36"/>
        <path d="M67.5 36 Q71 34.6 75 36"/>
      </g>
      <g className="g1-eyes">
        <circle cx="59" cy="39" r="2.2" fill="#332419"/><circle cx="71" cy="39" r="2.2" fill="#332419"/>
        <circle cx="59.8" cy="38.2" r="0.7" fill="#fff"/><circle cx="71.8" cy="38.2" r="0.7" fill="#fff"/>
      </g>
      <path d="M64.6 39 Q65 41 65.9 41" stroke="#C98A6A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {happy
        ? <path d="M59 43 Q65 51 71 43 Q65 47 59 43 Z" fill="#B83A2B"/>
        : <path d="M60 44 Q65 48 70 44" stroke="#B83A2B" strokeWidth="2" fill="none" strokeLinecap="round"/>}
      <ellipse cx="54" cy="44" rx="3" ry="2" fill="rgba(255,120,120,0.32)"/>
      <ellipse cx="76" cy="44" rx="3" ry="2" fill="rgba(255,120,120,0.32)"/>
      {!happy && <g><rect x="79" y="92" width="23" height="16" rx="2" fill="#3C7BC0"/><rect x="79" y="92" width="23" height="4" fill="#2C63A0"/><line x1="90.5" y1="96" x2="90.5" y2="108" stroke="#2C63A0" strokeWidth="1.3"/></g>}
    </svg>
  );
};

export const ZuhraSVG = ({ mood = 'pointing', className = '' }) => {
  const big = mood === 'happy' || mood === 'celebrate';
  return (
    <svg className={`g1-char g1-char-zuhra ${className}`} viewBox="0 0 130 190" aria-hidden="true">
      <defs>
        <radialGradient id="g1uskin" cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#F8CBA0"/><stop offset="100%" stopColor="#E0A06E"/></radialGradient>
        <linearGradient id="g1udress" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFC24B"/><stop offset="100%" stopColor="#EF8E22"/></linearGradient>
        <linearGradient id="g1uhair" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3E2A1A"/><stop offset="100%" stopColor="#241307"/></linearGradient>
      </defs>
      <ellipse cx="64" cy="178" rx="34" ry="5" fill="rgba(58,53,48,0.13)"/>
      <rect x="57" y="140" width="7.5" height="28" rx="3.7" fill="url(#g1uskin)"/>
      <rect x="65.5" y="140" width="7.5" height="28" rx="3.7" fill="url(#g1uskin)"/>
      <ellipse cx="60" cy="170" rx="8" ry="4.2" fill="#C26A12"/>
      <ellipse cx="70" cy="170" rx="8" ry="4.2" fill="#C26A12"/>
      <path d="M38 46 Q33 32 41 24 Q41 13 53 14 Q57 5 66 9 Q75 5 80 14 Q92 14 91 26 Q98 34 92 47 Q97 60 87 68 L87 50 Q87 30 64 30 Q43 30 43 50 L43 68 Q33 60 38 46 Z" fill="url(#g1uhair)"/>
      <circle cx="42" cy="50" r="7.5" fill="url(#g1uhair)"/>
      <circle cx="88" cy="50" r="7.5" fill="url(#g1uhair)"/>
      <circle cx="40" cy="40" r="6" fill="url(#g1uhair)"/>
      <circle cx="90" cy="40" r="6" fill="url(#g1uhair)"/>
      {big ? (
        <g>
          <path d="M53 58 Q45 42 41 28" stroke="url(#g1uskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="41" cy="27" r="4.6" fill="url(#g1uskin)"/>
          <path d="M77 58 Q85 42 89 28" stroke="url(#g1uskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="89" cy="27" r="4.6" fill="url(#g1uskin)"/>
        </g>
      ) : (
        <g>
          <path d="M53 58 Q46 74 43 91" stroke="url(#g1uskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="43" cy="92" r="4.6" fill="url(#g1uskin)"/>
          <path d="M77 58 Q84 74 87 91" stroke="url(#g1uskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="87" cy="92" r="4.6" fill="url(#g1uskin)"/>
        </g>
      )}
      <path d="M50 56 Q52 50 58 49 L72 49 Q78 50 80 56 L94 146 Q65 155 36 146 Z" fill="url(#g1udress)"/>
      <path d="M37 140 Q65 149 93 140 L94 146 Q65 155 36 146 Z" fill="rgba(255,255,255,0.28)"/>
      <ellipse cx="51" cy="57" rx="7" ry="6" fill="url(#g1udress)"/>
      <ellipse cx="79" cy="57" rx="7" ry="6" fill="url(#g1udress)"/>
      <path d="M58 50 Q65 57 72 50 Q68 54 65 54 Q62 54 58 50 Z" fill="#FFFFFF"/>
      <path d="M46 67 Q65 72 84 67 L85 73 Q65 78 45 73 Z" fill="#D9781A"/>
      <circle cx="65" cy="70" r="2.6" fill="#FFF1C2" stroke="#C99A2E" strokeWidth="0.8"/>
      <circle cx="65" cy="37" r="16.5" fill="url(#g1uskin)"/>
      <path d="M48 39 Q47 24 56 22 Q59 17 65 21 Q71 17 74 22 Q83 24 82 39 Q79 31 74 32 Q71 27 67 31 Q64 26 60 31 Q56 27 53 32 Q50 31 48 39 Z" fill="url(#g1uhair)"/>
      <g>
        <circle cx="50" cy="27" r="2.6" fill="#FF7AA8"/>
        <circle cx="50" cy="22" r="2.3" fill="#FF9CC0"/><circle cx="54.5" cy="25" r="2.3" fill="#FF9CC0"/><circle cx="52.5" cy="30" r="2.3" fill="#FF9CC0"/><circle cx="46.5" cy="29" r="2.3" fill="#FF9CC0"/><circle cx="45.5" cy="24" r="2.3" fill="#FF9CC0"/>
        <circle cx="50" cy="26" r="1.5" fill="#FFD86B"/>
      </g>
      <g className="g1-eyes">
        <circle cx="59" cy="37" r="2.1" fill="#3A2A1E"/><circle cx="71" cy="37" r="2.1" fill="#3A2A1E"/>
        <path d="M55.5 33 Q59 31.4 62 33" stroke="#3A2A1E" strokeWidth="1" fill="none" strokeLinecap="round"/>
        <path d="M68 33 Q71 31.4 74.5 33" stroke="#3A2A1E" strokeWidth="1" fill="none" strokeLinecap="round"/>
      </g>
      <g fill="none" stroke="#2B7CD3" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="59" cy="37" r="5"/>
        <circle cx="71" cy="37" r="5"/>
        <path d="M64 37 Q65 35.8 66 37"/>
        <path d="M54 36 L49.5 34.5"/>
        <path d="M76 36 L80.5 34.5"/>
      </g>
      <path d="M64.6 39 Q65 41 65.9 41" stroke="#C98A6A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {big
        ? <path d="M59 44 Q65 52 71 44 Q65 48 59 44 Z" fill="#C0392B"/>
        : <path d="M60 45 Q65 49 70 45" stroke="#C0392B" strokeWidth="2" fill="none" strokeLinecap="round"/>}
      <ellipse cx="53" cy="45" rx="3" ry="2" fill="rgba(255,120,120,0.4)"/>
      <ellipse cx="77" cy="45" rx="3" ry="2" fill="rgba(255,120,120,0.4)"/>
    </svg>
  );
};
