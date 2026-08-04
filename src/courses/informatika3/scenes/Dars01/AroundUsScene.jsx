// ============================================================================
// informatika3/scenes/Dars01/AroundUsScene.jsx — ПРЕДМЕТЫ ВОКРУГ И ЧИП ВНУТРИ
//
// Сцена решает главный misconception урока: «компьютер — это то, что стоит на
// столе с экраном». Пока ребёнок так думает, стиральная машина, банкомат и
// телефон остаются для него «просто техникой», а слово «компьютер» — названием
// мебели, а не устройства.
//
// Поэтому сцена показывает предметы в один ряд и по действию ребёнка ВСКРЫВАЕТ
// в них чип. Молоток остаётся серым — без него ряд превратился бы в «внутри
// всего есть компьютер», а это другая ложная модель, ничем не лучше первой.
//
// Три состояния, все приходят пропами:
//   gathered — раскрыть чипы (первый экран: после ответа ребёнка)
//   upto     — сколько предметов уже показано (второй экран: под озвучку)
//   focusKey — предмет, о котором звучит фраза прямо сейчас
//
// Проп называется upto, а НЕ shown: ExplorationScreen подмешивает в сцену свой
// `extra = { shown }` для счётных единиц математики, и одноимённый проп сцены
// затирался бы значением null на каждом экране без поштучного появления.
//
// Список предметов и подписи приходят из content/Dars01.data.js — здесь их нет.
// ============================================================================

import { DeviceIcon, ROLE_COLOR, T, useT, useIsMobile } from '../../kit/index.js';

export default function AroundUsScene({
  items = [], gathered = false, upto = null, focusKey = null,
}) {
  const t = useT();
  const isMobile = useIsMobile(640);
  const size = isMobile ? 46 : 66;
  const visibleCount = upto === null ? items.length : upto;

  return (
    <div
      style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'center',
        gap: 'clamp(6px, 1.8vw, 14px)', width: '100%',
      }}
    >
      {items.map((it, i) => {
        const visible = i < visibleCount;
        const isFocus = focusKey === it.key;
        // Чип виден только когда мир уже раскрыт И предмет уже показан: иначе
        // ответ на вопрос экрана лежит на экране раньше самого вопроса.
        const chip = gathered && visible && it.hasComputer;
        const c = chip ? ROLE_COLOR.inside : ROLE_COLOR.none;
        return (
          <div
            key={it.key}
            className={isFocus ? 'inf-part-live' : ''}
            style={{
              position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 5, padding: 'clamp(7px, 1.5vw, 11px)', borderRadius: 15,
              background: chip ? c.fill : T.paper,
              border: `2px solid ${chip ? c.line : 'rgba(167,166,162,.22)'}`,
              boxShadow: chip ? `0 12px 26px -18px ${c.line}` : '0 6px 16px -13px rgba(58,53,48,.3)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(10px)',
              transition: 'opacity .45s ease, transform .45s ease, background .45s ease, border-color .45s ease, box-shadow .45s ease',
              minWidth: 'clamp(80px, 15vw, 112px)',
            }}
          >
            {/* Чип «выглядывает» из угла предмета: он ВНУТРИ, а не рядом. */}
            {chip && (
              <span
                style={{
                  position: 'absolute', top: -9, right: -9, width: 26, height: 26, borderRadius: 8,
                  background: T.paper, border: `2px solid ${c.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 0 4px ${c.fill}`,
                }}
              >
                <DeviceIcon kind="cpu" role="inside" size={18}/>
              </span>
            )}

            <DeviceIcon kind={it.kind} role={chip ? 'inside' : 'none'} size={size} dim={!chip && gathered}/>

            <span
              style={{
                fontWeight: 700, fontSize: 'clamp(10px, 1.6vw, 13px)', lineHeight: 1.15,
                color: chip ? c.line : T.ink2, textAlign: 'center',
              }}
            >
              {t(it.label)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
