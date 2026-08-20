import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const GUIDES = {
  uz: {
    choice: "Variantlarni shoshilmay taqqoslang. Har bir son yoki ifodani mavzu qoidasiga ko'ra tekshirib, faqat bitta to'g'ri javobni tanlang.",
    bool: "Quyidagi matematik fikrni qoida asosida tekshiring. Fikr har doim to'g'ri bo'lsa «Ha», xato bo'lsa «Yo'q» javobini tanlang.",
    match: "Chap ustundagi har bir karta uchun o'ng ustundan aynan bitta mos javob toping. Avval chapdagi kartani, so'ng unga mos o'ngdagi kartani bosing.",
    input: "Hisoblashni bosqichma-bosqich bajaring. Hosil bo'lgan sonli javobni pastdagi maydonga klaviatura yordamida kiriting.",
  },
  ru: {
    choice: 'Сравните варианты и по правилу темы выберите только один правильный ответ.',
    bool: 'Проверьте математическое утверждение. Выберите «Да», если оно верно, и «Нет», если оно неверно.',
    match: 'Для каждой карточки слева найдите ровно одну пару справа. Сначала нажмите левую карточку, затем правую.',
    input: 'Выполните вычисления по шагам и введите числовой ответ с клавиатуры.',
  },
  en: {
    choice: 'Compare the options without rushing. Check every number and expression against the rule of the topic and pick the one right answer.',
    bool: 'Check the statement against the rule of the topic. Choose Yes if the statement is always true and No if it is false.',
    match: 'For every card on the left find exactly one card on the right. Tap the card on the left first, then the card that matches it.',
    input: 'Do the calculation step by step. Type the number you get into the field below.',
  },
};

// Ekran yozuvlari. Til uchtaga chiqqach ichma-ich shartlar o'rniga jadval.
const UI = {
  uz: {
    numeric: 'Sonli javob',
    correct: '✓ To‘g‘ri!',
    wrong: "Javob noto'g'ri. Qoidani eslab, qayta urinib ko'ring.",
  },
  ru: {
    numeric: 'Числовой ответ',
    correct: '✓ Верно!',
    wrong: 'Ответ неверный. Вспомните правило и попробуйте ещё раз.',
  },
  en: {
    numeric: 'Numeric answer',
    correct: '✓ Correct!',
    wrong: 'That answer is not right. Recall the rule and try again.',
  },
};

// Variant yozuvining tarjimasi qaysi jadvalda: UZ asl yozuv, boshqa tillar — xarita.
const LABELS = { ru: 'translationsRu', en: 'translationsEn' };

const shuffle = (list) => {
  const shuffled = [...list];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const autoScrollBehavior = () => (
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
);

const afterLayout = (callback) => {
  let secondFrame;
  const firstFrame = window.requestAnimationFrame(() => {
    secondFrame = window.requestAnimationFrame(callback);
  });
  return () => {
    window.cancelAnimationFrame(firstFrame);
    if (secondFrame) window.cancelAnimationFrame(secondFrame);
  };
};

function MathText({ text }) {
  const source = String(text);
  const parts = [];
  const renderPlainText = (value, keyPrefix) => String(value).split(/([×·])/).map((part, index) => (
    part === '×' || part === '·'
      ? <span className="g6q-multiply-dot" aria-label="ko‘paytirish" key={`${keyPrefix}-multiply-${index}`}/>
      : part
  ));
  const fractionPattern = /(\?|\d+)\s*\/\s*(\d+)/g;
  let cursor = 0;
  let match;
  while ((match = fractionPattern.exec(source)) !== null) {
    if (match.index > cursor) parts.push(...renderPlainText(source.slice(cursor, match.index), `text-${cursor}`));
    parts.push(
      <span className="g6q-frac" key={`${match.index}-${match[0]}`} aria-label={`${match[2]} dan ${match[1]}`}>
        <span>{match[1]}</span><i/><span>{match[2]}</span>
      </span>,
    );
    cursor = match.index + match[0].length;
  }
  if (cursor < source.length) parts.push(...renderPlainText(source.slice(cursor), `text-${cursor}`));
  return parts;
}

const parseNumericAnswer = (value) => Number(String(value).trim().replace(',', '.'));

const initialValue = (item, initialAnswer) => {
  if (item.type === 'match') {
    return Array.isArray(initialAnswer) && initialAnswer.length === item.left.length
      ? initialAnswer
      : Array(item.left.length).fill(null);
  }
  if (item.type === 'input') return initialAnswer == null ? '' : String(initialAnswer);
  return initialAnswer ?? null;
};

export default function Grade6Question({
  item,
  lesson,
  task,
  lang = 'uz',
  mode,
  initialAnswer,
  onReady,
  registerCheck,
  onSubmit,
  playCorrect,
  playWrong,
}) {
  const locked = mode === 'review';
  const locale = UI[lang] ? lang : 'uz';
  const ui = UI[locale];
  // Tarjimasi yo'q maydon uzbekchaga qaytadi: sinf kanoni shu tilda.
  const text = useCallback((field) => field?.[locale] ?? field?.uz ?? '', [locale]);
  const displayText = useCallback((value) => {
    const table = LABELS[locale];
    return (table && item[table]?.[String(value)]) ?? String(value);
  }, [item, locale]);
  const options = useMemo(() => shuffle(item.options || []), [item]);
  const right = useMemo(() => shuffle(item.right || []), [item]);
  const [answer, setAnswer] = useState(() => initialValue(item, initialAnswer));
  const [active, setActive] = useState(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const feedbackRef = useRef(null);
  const ready = item.type === 'match'
    ? answer.every(Boolean)
    : item.type === 'input'
      ? answer.trim() !== ''
      : answer !== null;

  useEffect(() => onReady?.(ready && !checked), [checked, onReady, ready]);

  const check = useCallback(() => {
    const ok = item.type === 'match'
      ? answer.every((value, index) => value === item.right[item.pairs[index]])
      : item.type === 'input'
        ? parseNumericAnswer(answer) === parseNumericAnswer(item.answer)
        : answer === item.answer;
    setChecked(true);
    setCorrect(ok);
    (ok ? playCorrect : playWrong)?.();
    onSubmit?.({
      questionText: item.prompt.uz,
      studentAnswer: answer,
      correctAnswer: item.answer ?? item.pairs,
      correct: ok,
      meta: { lesson, task },
    });
  }, [answer, item, lesson, onSubmit, playCorrect, playWrong, task]);

  useEffect(() => registerCheck?.(check), [check, registerCheck]);
  useEffect(() => {
    if (!checked) return undefined;
    return afterLayout(() => {
      feedbackRef.current?.scrollIntoView({
        behavior: autoScrollBehavior(),
        block: 'center',
        inline: 'nearest',
      });
    });
  }, [checked]);

  return (
    <div className="g6q" style={{ '--c1': '#06b6d4', '--c2': '#14b8a6' }}>
      <style>{`
        .g6q{max-width:650px;margin:auto;padding:8px 4px 18px;color:#172033;background:#fff7ed;font-family:Manrope,system-ui,sans-serif}
        .g6q-bars{display:grid;grid-template-columns:1fr 1fr;gap:6px}.g6q-bars i{height:5px;border-radius:9px;background:#fb923c}.g6q-bars i+ i{background:#fb923c}
        .g6q-tag{margin-top:12px;color:#f97316;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.g6q h2{font-size:25px;line-height:1.3;margin:7px 0 8px}
        .g6q-heading{display:block}
        .g6q-frac{display:inline-grid;grid-template-rows:auto 2px auto;align-items:center;min-width:1.35em;margin:0 .12em;vertical-align:middle;text-align:center;font-family:Manrope,system-ui,sans-serif;font-weight:900;line-height:1}.g6q-frac>span{padding:.08em .18em}.g6q-frac>i{display:block;width:100%;height:2px;border-radius:2px;background:currentColor}
        .g6q-multiply-dot{display:inline-block;width:.38em;height:.38em;margin:0 .24em;border-radius:50%;background:currentColor;vertical-align:.12em;box-shadow:none}
        .g6q-explain{margin:0 0 18px;padding:11px 13px;border-left:4px solid var(--c1);border-radius:0 12px 12px 0;background:#fff;color:#526071;font-size:14px;font-weight:650;line-height:1.55}
        .g6q-options{display:grid;grid-template-columns:1fr 1fr;gap:10px}.g6q button{font:800 17px inherit;color:#172033;cursor:pointer}
        .g6q-option{min-height:76px;padding:14px 16px;border:2.5px solid var(--c1);border-radius:17px;background:#fff;font-size:clamp(21px,3.5vw,28px)!important;font-weight:900!important;line-height:1.15;box-shadow:0 5px 0 color-mix(in srgb,var(--c1) 30%,white),0 9px 20px rgba(15,118,110,.08);transition:transform .15s,box-shadow .15s}.g6q-option:hover{transform:translateY(-2px)}.g6q-option.on{border-color:var(--c2);background:color-mix(in srgb,var(--c2) 16%,white);box-shadow:0 5px 0 color-mix(in srgb,var(--c2) 38%,white),0 0 0 3px color-mix(in srgb,var(--c2) 22%,transparent)}
        .g6q-option.right,.g6q-card.right{border-color:#22c55e!important;background:#dcfce7!important;box-shadow:0 0 0 3px #22c55e33!important;color:#166534}.g6q-option.wrong,.g6q-card.wrong{border-color:#ef4444!important;background:#fee2e2!important;box-shadow:0 0 0 3px #ef444433!important;color:#991b1b}
        .g6q-match{display:grid;grid-template-columns:minmax(0,1fr) 82px minmax(0,1fr);gap:8px;align-items:stretch}.g6q-col{display:grid;grid-template-rows:repeat(3,minmax(64px,1fr));gap:12px}.g6q-card{min-height:64px;padding:10px 12px;border:0;border-radius:12px;background:color-mix(in srgb,var(--c1) 18%,white);box-shadow:inset 0 0 0 2px var(--c1);font-size:clamp(20px,3.6vw,27px)!important;font-weight:900!important;line-height:1.12}.g6q-links+ .g6q-col .g6q-card{background:color-mix(in srgb,var(--c2) 18%,white);box-shadow:inset 0 0 0 2px var(--c2)}.g6q-card.on{box-shadow:inset 0 0 0 4px var(--c1)}.g6q-card.done{opacity:.82}
        .g6q-links{display:block;width:100%;height:100%;min-height:216px;overflow:visible}.g6q-link{fill:none;stroke:var(--c1);stroke-width:5;stroke-linecap:round;filter:drop-shadow(0 2px 2px rgba(6,182,212,.18))}.g6q-link.right{stroke:#22c55e}.g6q-link.wrong{stroke:#ef4444}
        .g6q-input-wrap{display:flex;justify-content:center;padding:12px}.g6q-input{width:min(100%,280px);height:82px;border:3px solid var(--c1);border-radius:17px;background:#fff;text-align:center;font:900 34px Manrope,system-ui,sans-serif;color:#172033;outline:none;box-shadow:0 6px 0 #a5f3fc}.g6q-input:focus{border-color:var(--c2);box-shadow:0 6px 0 #99f6e4}.g6q-input.right{border-color:#22c55e;background:#dcfce7;box-shadow:0 6px 0 #86efac}.g6q-input.wrong{border-color:#ef4444;background:#fee2e2;box-shadow:0 6px 0 #fca5a5}
        .g6q-feedback{margin-top:16px;padding:14px 16px;border:2px solid #f59e0b;border-radius:8px;background:#fef3c7;font-weight:800;color:#78350f;box-shadow:0 5px 0 #fcd34d;line-height:1.45;scroll-margin-block:16px 104px}.g6q-feedback strong{display:block;margin-bottom:4px;font-size:17px}.g6q-feedback-why{display:block;color:#713f12;font-size:14px}
        @media(max-width:520px){.g6q h2{font-size:20px;margin-bottom:7px}.g6q-explain{font-size:12px;line-height:1.4;margin-bottom:10px;padding:8px 10px}.g6q-options{gap:8px}.g6q-option{min-height:62px;padding:10px;font-size:20px!important}.g6q-match{grid-template-columns:minmax(0,1fr) 54px minmax(0,1fr);gap:4px}.g6q-col{grid-template-rows:repeat(3,minmax(58px,1fr));gap:8px}.g6q-card{font-size:19px!important;min-height:58px;padding:7px 5px}.g6q-links{min-height:190px}.g6q-link{stroke-width:4}}
      `}</style>
      <div className="g6q-bars"><i/><i/></div>
      <div className="g6q-tag">{text(item.topic)}</div>
      <div className="g6q-heading"><h2><MathText text={text(item.prompt)}/></h2></div>
      <p className="g6q-explain">{GUIDES[locale][item.type]}</p>

      {item.type === 'input' ? (
        <div className="g6q-input-wrap">
          <input
            className={`g6q-input ${checked ? correct ? 'right' : 'wrong' : ''}`}
            inputMode="decimal"
            value={answer}
            disabled={checked || locked}
            aria-label={ui.numeric}
            onChange={(event) => {
              const cleaned = event.target.value.replace(/[^\d,.-]/g, '').replace('.', ',');
              const sign = cleaned.startsWith('-') ? '-' : '';
              const unsigned = cleaned.replace(/-/g, '');
              const [whole, ...decimal] = unsigned.split(',');
              setAnswer(`${sign}${whole}${decimal.length ? `,${decimal.join('')}` : ''}`);
            }}
          />
        </div>
      ) : item.type !== 'match' ? (
        <div className="g6q-options">
          {options.map((value) => {
            const resultClass = checked && answer === value ? (correct ? 'right' : 'wrong') : '';
            return (
              <button
                type="button"
                className={`g6q-option ${answer === value ? 'on' : ''} ${resultClass}`}
                key={value}
                disabled={checked || locked}
                onClick={() => setAnswer(value)}
              >
                <MathText text={displayText(value)}/>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="g6q-match">
          <div className="g6q-col">
            {item.left.map((value, index) => {
              const resultClass = checked ? (answer[index] === item.right[item.pairs[index]] ? 'right' : 'wrong') : '';
              return (
                <button
                  type="button"
                  className={`g6q-card ${active === index ? 'on' : ''} ${answer[index] ? 'done' : ''} ${resultClass}`}
                  key={value}
                  disabled={checked || locked}
                  onClick={() => setActive(index)}
                >
                  <MathText text={displayText(value)}/>
                </button>
              );
            })}
          </div>
          <svg className="g6q-links" viewBox="0 0 100 216" preserveAspectRatio="none" aria-hidden="true">
            {answer.map((selected, leftIndex) => {
              if (!selected) return null;
              const rightIndex = right.indexOf(selected);
              const y1 = 36 + leftIndex * 72;
              const y2 = 36 + rightIndex * 72;
              const state = checked ? (selected === item.right[item.pairs[leftIndex]] ? 'right' : 'wrong') : '';
              return <path className={`g6q-link ${state}`} d={`M0 ${y1} C34 ${y1}, 66 ${y2}, 100 ${y2}`} key={`${leftIndex}-${selected}`}/>;
            })}
          </svg>
          <div className="g6q-col">
            {right.map((value) => {
              const linkedIndex = answer.indexOf(value);
              const resultClass = checked && linkedIndex >= 0
                ? (value === item.right[item.pairs[linkedIndex]] ? 'right' : 'wrong')
                : '';
              return (
                <button
                  type="button"
                  className={`g6q-card ${resultClass}`}
                  key={value}
                  disabled={checked || locked}
                  onClick={() => {
                    if (active !== null) {
                      setAnswer((current) => current.map((old, index) => (
                        index === active ? value : old === value ? null : old
                      )));
                      setActive(null);
                    }
                  }}
                >
                  <MathText text={displayText(value)}/>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {checked && (
        <div className="g6q-feedback" ref={feedbackRef}>
          {correct ? (
            <>
              <strong>{ui.correct}</strong>
              <span className="g6q-feedback-why"><MathText text={text(item.explanation)}/></span>
            </>
          ) : ui.wrong}
        </div>
      )}
    </div>
  );
}
