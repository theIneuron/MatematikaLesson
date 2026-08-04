// ============================================================================
// informatika3/kit/ioviz.jsx — ВИЗУАЛИЗАТОРЫ ПОТОКА ДАННЫХ
//
// Ядро всего урока — цепочка: ВВОД -> ОБРАБОТКА -> ВЫВОД, и ПАМЯТЬ, которая
// держит данные. В методике информатики эта модель называется IPOS (Input,
// Processing, Output, Storage) и в начальной школе даётся именно так: четыре
// шага, а не список деталей.
//
// ЧТО ЗДЕСЬ ПРИНЦИПИАЛЬНО:
//
//   1. НАПРАВЛЕНИЕ ВИДНО ГЛАЗОМ. Устройство ввода и устройство вывода
//      отличаются одним признаком — куда идут данные. Значит на экране должна
//      двигаться не картинка устройства, а СТРЕЛКА. Ребёнок классифицирует по
//      направлению, а не запоминает список «клавиатура, мышь, микрофон».
//
//   2. ПАМЯТЬ — ЧЕТВЁРТЫЙ БЛОК, А НЕ СНОСКА. Без неё «компьютер посчитал и
//      забыл» звучит так же законно, как «сохранил». Двусторонняя стрелка к
//      памяти показывает, что в неё и кладут, и берут из неё.
//
//   3. ПОДПИСЕЙ ЗДЕСЬ НЕТ. Все слова приходят из content/DarsNN.data.js
//      локализованными узлами {uz, ru, en} и переводятся через useT.
//      В kit/ не должно быть ни одной фразы (src/courses/README.md, п.2).
// ============================================================================

import React from 'react';
import { T, useT, useIsMobile } from '../engine/kit/index.js';
import { DeviceIcon, DeviceCard, ROLE_COLOR } from './devices.jsx';

// ---------------------------------------------------------------------------
// СТРЕЛКА ПОТОКА. dir: 'right' | 'left' | 'both'.
// Точка ползёт по стрелке только когда поток активен: движение обозначает, что
// данные идут ПРЯМО СЕЙЧАС, и включать его без причины нельзя.
// ---------------------------------------------------------------------------
export const FlowArrow = React.memo(({ dir = 'right', color = T.ink2, active = false, len = 46, vertical = false }) => {
  const head = (x, sign) => `M${x} 15 l${-7 * sign} -5.5 M${x} 15 l${-7 * sign} 5.5`;
  const w = len;
  const body = (
    <svg
      viewBox={`0 0 ${w} 30`}
      width={w}
      height={30}
      aria-hidden="true"
      style={{ display: 'block', transform: vertical ? 'rotate(90deg)' : 'none', overflow: 'visible' }}
    >
      <line
        x1="3"
        y1="15"
        x2={w - 3}
        y2="15"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        className={active ? 'inf-flow-line' : ''}
      />
      {(dir === 'right' || dir === 'both') && (
        <path d={head(w - 3, 1)} stroke={color} strokeWidth="2.6" strokeLinecap="round" fill="none"/>
      )}
      {(dir === 'left' || dir === 'both') && (
        <path d={head(3, -1)} stroke={color} strokeWidth="2.6" strokeLinecap="round" fill="none"/>
      )}
      {active && (
        <circle
          cx={dir === 'left' ? w - 6 : 6}
          cy="15"
          r="4"
          fill={color}
          className="inf-flow-dot"
          style={{ '--inf-flow-len': `${dir === 'left' ? -(w - 12) : w - 12}px` }}
        />
      )}
    </svg>
  );
  return body;
});
FlowArrow.displayName = 'FlowArrow';

// ---------------------------------------------------------------------------
// БЛОК ЦЕПОЧКИ
// ---------------------------------------------------------------------------
const ChainBlock = ({ kind, role, label, note, lit, live, size, unknown = false }) => {
  const t = useT();
  const c = ROLE_COLOR[role];
  return (
    <div
      className={`inf-chain-block${live ? ' inf-part-live' : ''}`}
      data-lit={lit ? '1' : '0'}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        padding: 'clamp(7px, 1.4vw, 11px) clamp(6px, 1.2vw, 10px)',
        borderRadius: 15, background: unknown ? '#FFF3E9' : (lit ? c.fill : T.paper),
        border: unknown
          ? `2.5px dashed ${T.accent}`
          : `2px solid ${lit ? c.line : 'rgba(167,166,162,.25)'}`,
        boxShadow: lit && !unknown ? `0 12px 26px -20px ${c.line}` : 'none',
        minWidth: size + 26, flex: '0 0 auto',
      }}
    >
      {/* Обратная задача: место в цепочке известно, часть — нет. Поэтому вместо
          иконки стоит знак вопроса РОВНО того же размера: рамка не должна прыгать
          при подстановке ответа. */}
      {unknown ? (
        <span
          className="mono"
          style={{
            width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.72, fontWeight: 800, color: T.accent, lineHeight: 1,
          }}
        >
          ?
        </span>
      ) : (
        <DeviceIcon kind={kind} role={role} size={size}/>
      )}
      <span
        style={{
          fontWeight: 800, fontSize: 'clamp(10px, 1.55vw, 13px)', color: lit ? c.line : T.ink2,
          textAlign: 'center', lineHeight: 1.1, letterSpacing: 0.2, textTransform: 'uppercase',
        }}
      >
          {t(label)}
      </span>
      {note && (
        <span style={{ fontSize: 'clamp(9px, 1.3vw, 11px)', color: T.ink2, textAlign: 'center', lineHeight: 1.15 }}>
          {t(note)}
        </span>
      )}
    </div>
  );
};

/**
 * Цепочка ВВОД -> ОБРАБОТКА -> ВЫВОД плюс ПАМЯТЬ.
 *
 * @param labels {input, process, output, memory} — локализованные узлы
 * @param notes  те же ключи, мелкая подпись под названием (необязательно)
 * @param lit    сколько блоков уже зажжено: 1 ввод, 2 обработка, 3 вывод, 4 память
 * @param live   ключ блока, о котором звучит фраза ПРЯМО СЕЙЧАС
 * @param unknown ключ блока, вместо которого стоит знак вопроса (обратная задача)
 */
export const IOChain = React.memo(({
  labels = {}, notes = {}, lit = 4, live = null, unknown = null,
}) => {
  const isMobile = useIsMobile(640);
  const size = isMobile ? 34 : 46;
  const arrowLen = isMobile ? 30 : 46;
  const blocks = [
    { key: 'input', kind: 'keyboard', role: 'input' },
    { key: 'process', kind: 'cpu', role: 'inside' },
    { key: 'output', kind: 'monitor', role: 'output' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(2px, .8vw, 6px)' }}>
        {blocks.map((b, i) => (
          <React.Fragment key={b.key}>
            {i > 0 && (
              <FlowArrow
                dir="right"
                len={arrowLen}
                color={lit > i ? ROLE_COLOR.inside.line : T.ink3}
                active={lit > i}
              />
            )}
            <ChainBlock
              kind={b.kind}
              role={b.role}
              label={labels[b.key]}
              note={notes[b.key]}
              lit={lit > i}
              live={live === b.key}
              unknown={unknown === b.key}
              size={size}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Память висит под обработкой и связана с ней ДВУСТОРОННЕЙ стрелкой:
          данные в неё кладут и из неё берут. Односторонняя стрелка соврала бы. */}
      {labels.memory && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ height: 26, display: 'flex', alignItems: 'center' }}>
            <FlowArrow dir="both" len={26} vertical color={lit > 3 ? ROLE_COLOR.inside.line : T.ink3} active={false}/>
          </div>
          <ChainBlock
            kind="disk"
            role="inside"
            label={labels.memory}
            note={notes.memory}
            lit={lit > 3}
            live={live === 'memory'}
            unknown={unknown === 'memory'}
            size={size}
          />
        </div>
      )}
    </div>
  );
});
IOChain.displayName = 'IOChain';

// ---------------------------------------------------------------------------
// ОДНО УСТРОЙСТВО И НАПРАВЛЕНИЕ ПОТОКА
//
// Компьютер всегда справа, устройство всегда слева, и меняется только СТРЕЛКА.
// Это сделано намеренно: если менять местами и устройство, и стрелку, ребёнок
// начинает читать положение на экране, а не направление данных.
// ---------------------------------------------------------------------------
export const SignalFlow = React.memo(({
  kind, role = 'none', deviceLabel, computerLabel, direction = null, flowLabel, size = 66,
}) => {
  const t = useT();
  const isMobile = useIsMobile(640);
  const known = direction === 'in' || direction === 'out';
  const c = known ? (direction === 'in' ? ROLE_COLOR.input : ROLE_COLOR.output) : ROLE_COLOR.none;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(4px, 1.4vw, 10px)' }}>
      <DeviceCard kind={kind} role={known ? role : 'none'} label={deviceLabel} size={isMobile ? 46 : size}/>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <span
          className="mono"
          style={{ fontSize: 'clamp(9px, 1.4vw, 12px)', fontWeight: 800, color: c.line, letterSpacing: 0.3 }}
        >
          {known ? t(flowLabel) : '?'}
        </span>
        <FlowArrow
          dir={direction === 'out' ? 'left' : 'right'}
          len={isMobile ? 44 : 64}
          color={c.line}
          active={known}
        />
      </div>

      {/* Компьютер — «системный блок с экраном»: один предмет, чтобы стрелка
          читалась как «в компьютер» и «из компьютера», а не «в монитор». */}
      <div
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          padding: 'clamp(8px, 1.6vw, 12px)', borderRadius: 16,
          background: ROLE_COLOR.inside.fill, border: `2px solid ${ROLE_COLOR.inside.line}`,
          minWidth: 'clamp(88px, 17vw, 122px)',
        }}
      >
        <DeviceIcon kind="cpu" role="inside" size={isMobile ? 40 : 54}/>
        <span
          style={{
            fontWeight: 800, fontSize: 'clamp(10px, 1.6vw, 13px)', color: ROLE_COLOR.inside.line,
            textAlign: 'center', lineHeight: 1.1,
          }}
        >
          {t(computerLabel)}
        </span>
      </div>
    </div>
  );
});
SignalFlow.displayName = 'SignalFlow';

// ---------------------------------------------------------------------------
// РЯД УСТРОЙСТВ — для экрана, где ребёнок выбирает и сравнивает.
// ---------------------------------------------------------------------------
export const DeviceRow = React.memo(({ items = [], selectedKey = null, onPick = null, dimUnselected = false, size }) => {
  const isMobile = useIsMobile(640);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(6px, 1.6vw, 12px)', justifyContent: 'center' }}>
      {items.map((it) => (
        <DeviceCard
          key={it.key}
          kind={it.kind}
          role={it.role || 'none'}
          label={it.label}
          badge={it.badge}
          size={size ?? (isMobile ? 44 : 62)}
          selected={selectedKey === it.key}
          dim={dimUnselected && selectedKey !== null && selectedKey !== it.key}
          onClick={onPick ? () => onPick(it.key) : null}
        />
      ))}
    </div>
  );
});
DeviceRow.displayName = 'DeviceRow';

// ---------------------------------------------------------------------------
// КОМАНДА И РЕЗУЛЬТАТ — «компьютер не догадывается»
//
// Экран о том, что компьютер выполняет буквально написанное. Поэтому строки
// показываются парами: слева то, что ему велели, справа то, что он сделал.
// Строка с пометкой bad — та, где велели не то, что хотели: результат честный,
// а задумка провалилась. Это и есть граница между «умеет» и «думает».
// ---------------------------------------------------------------------------
export const CommandBoard = React.memo(({ headers = {}, rows = [], shown = null }) => {
  const t = useT();
  const visible = shown === null ? rows.length : shown;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 480 }}>
      <div style={{ display: 'flex', gap: 8, padding: '0 4px' }}>
        {['cmd', 'out'].map((k) => (
          <span
            key={k}
            className="mono"
            style={{
              flex: 1, fontSize: 'clamp(9px, 1.4vw, 11px)', fontWeight: 800, letterSpacing: 0.5,
              color: T.ink2, textTransform: 'uppercase',
            }}
          >
            {t(headers[k])}
          </span>
        ))}
      </div>
      {rows.map((r, i) => {
        const on = i < visible;
        const tone = r.bad ? '#C99A2E' : ROLE_COLOR.output.line;
        return (
          <div
            key={i}
            style={{
              display: 'flex', gap: 8, alignItems: 'stretch',
              opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)',
              transition: 'opacity .4s ease, transform .4s ease',
            }}
          >
            <div
              className="mono"
              style={{
                flex: 1, padding: 'clamp(8px, 1.6vw, 11px)', borderRadius: 12, background: T.paper,
                border: '2px solid rgba(167,166,162,.25)', fontWeight: 800,
                fontSize: 'clamp(12px, 2vw, 15px)', color: T.ink, display: 'flex', alignItems: 'center',
              }}
            >
              {t(r.cmd)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FlowArrow dir="right" len={26} color={tone} active={on}/>
            </div>
            <div
              className="mono"
              style={{
                flex: 1, padding: 'clamp(8px, 1.6vw, 11px)', borderRadius: 12,
                background: r.bad ? '#FFF9E8' : ROLE_COLOR.output.fill,
                border: `2px solid ${r.bad ? 'rgba(216,169,58,.4)' : ROLE_COLOR.output.line}`,
                fontWeight: 800, fontSize: 'clamp(12px, 2vw, 15px)', color: tone,
                display: 'flex', alignItems: 'center',
              }}
            >
              {t(r.out)}
            </div>
          </div>
        );
      })}
    </div>
  );
});
CommandBoard.displayName = 'CommandBoard';
