import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  T,
  configureLesson,
  LangContext,
  useLang,
  useT,
  useMobileZoom,
  useAudio,
  Stage,
  NavBack,
  NavNext,
  BackLabel,
  QuestionScreen,
  RevealScreen,
  PickDivisors,
  DragMatch,
  Classify,
  WhyCard,
  FactCard,
  Floaters,
  Frac,
  mt,
  STYLES,
} from './Dars01.jsx';

const FACT_BADGE = {
  uz: 'Bilasizmi? · Matematika',
  ru: 'Знаете ли вы? · Математика',
};

const localized = (value, lang) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value.uz ?? value.ru ?? '';
};

// “To‘g‘ri” va “Nega shunday” alohida audio bosqichlaridir. Birinchi izohni
// bu yerga ham qo‘shish uni “Nega shunday” ichida ikkinchi marta o‘qitardi.
const correctText = () => ({
  uz: "Javob to'g'ri.",
  ru: 'Ответ верный.',
});

function FractionBar({ numerator, denominator, color = 'accent', label }) {
  return (
    <div className="fth-bar-wrap">
      {label && <p className="small fth-bar-label">{label}</p>}
      <div className={`fth-bar fth-bar-${color}`}>
        {Array.from({ length: denominator }, (_, index) => (
          <span key={index} className={index < numerator ? 'filled' : ''}/>
        ))}
      </div>
    </div>
  );
}

export function MathVisual({ visual, lang }) {
  if (!visual) return null;

  if (visual.type === 'equation') {
    return (
      <div className="fth-equation" aria-label={localized(visual.expression, lang)}>
        {mt(localized(visual.expression, lang))}
      </div>
    );
  }

  if (visual.type === 'chain') {
    const connector = localized(visual.connector, lang) || '→';
    return (
      <div className="fth-chain">
        {visual.items.map((item, index) => (
          <React.Fragment key={`${localized(item, lang)}-${index}`}>
            <span className={index === visual.items.length - 1 ? 'is-final' : ''}>{mt(localized(item, lang))}</span>
            {index < visual.items.length - 1 && <b>{connector}</b>}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (visual.type === 'bars') {
    return (
      <div className="fth-bars">
        {visual.groups.map((group, index) => (
          <React.Fragment key={index}>
            <FractionBar
              numerator={group.numerator}
              denominator={group.denominator}
              color={group.color}
              label={localized(group.label, lang)}
            />
            {index < visual.groups.length - 1 && <span className="fth-equals">=</span>}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (visual.type === 'panels') {
    return (
      <div className="fth-panels">
        {visual.panels.map((panel, index) => (
          <div
            className={`fth-panel ${
              panel.color === 'yellow'
                ? 'fth-panel-yellow'
                : panel.color === 'green'
                  ? 'fth-panel-green'
                  : panel.color === 'blue' || (!panel.color && index % 2)
                    ? 'fth-panel-blue'
                    : ''
            }`}
            key={index}
          >
            <p className="small mono">{localized(panel.title, lang)}</p>
            {panel.lines.map((line, lineIndex) => (
              <div className="fth-panel-line" key={lineIndex}>{mt(localized(line, lang))}</div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (visual.type === 'steps') {
    return (
      <div className="fth-mini-steps">
        {visual.items.map((item, index) => (
          <div key={index}>
            <span>{index + 1}</span>
            <p>{mt(localized(item, lang))}</p>
          </div>
        ))}
      </div>
    );
  }

  if (visual.type === 'numberLine') {
    return (
      <div className="fth-number-line">
        <div className="fth-number-line-axis"/>
        {(visual.points || []).map((point, index) => (
          <div className="fth-number-point" style={{ left: `${point.at}%` }} key={index}>
            <i/>
            <span>{mt(localized(point.label, lang))}</span>
          </div>
        ))}
      </div>
    );
  }

  if (visual.type === 'cards') {
    return (
      <div className="fth-cards">
        {visual.items.map((item, index) => {
          const tone = typeof item === 'object' && !item.uz && !item.ru ? item.color : null;
          const value = typeof item === 'object' && !item.uz && !item.ru ? item.label : item;
          return (
            <div
              className={[
                index === visual.highlight ? 'is-highlighted' : '',
                tone ? `fth-card-${tone}` : '',
              ].filter(Boolean).join(' ')}
              key={index}
            >
              {mt(localized(value, lang))}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

function FractionDrift({ items }) {
  const values = items?.length ? items : ['1/2', '2/3', '3/4', '4/5', '5/6', '7/8'];
  return (
    <div className="fth-drift" aria-hidden="true">
      {values.slice(0, 6).map((value, index) => {
        const parts = value.split('/');
        return (
          <span className={`fth-drift-${index + 1}`} key={`${value}-${index}`}>
            {parts.length === 2 ? <Frac n={parts[0]} d={parts[1]}/> : mt(value)}
          </span>
        );
      })}
    </div>
  );
}

function FactFractionIcon({ expression = '1/2 = 2/4' }) {
  return <div className="fth-fact-icon" aria-hidden="true">{mt(expression)}</div>;
}

function TitleScreen({ lesson, screen, totalScreens, onAnswer, onNext }) {
  const slide = lesson.slides[0];
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{
    id: `${lesson.id}_s0_topic`,
    text: localized(slide.audio, lang),
    trigger: 'on_mount',
    waits_for: null,
  }]);
  const [picked, setPicked] = useState(null);
  const pickedRef = useRef(false);
  const introDone = audio.muted || (audio.hasStarted && !audio.isBusy);

  const pick = (value) => {
    if (pickedRef.current) return;
    pickedRef.current = true;
    setPicked(value);
    onAnswer({ stage: 'hook', screenIdx: screen, studentAnswer: value, correct: true });
    setTimeout(onNext, 240);
  };

  return (
    <Stage eyebrow={slide.eyebrow} screen={screen} totalScreens={totalScreens} audioState={audio}>
      <div className="ttl-wrap">
        <Floaters/>
        <FractionDrift items={lesson.decorations}/>
        <p className="eyebrow ttl-kicker">{lang === 'uz' ? 'YANGI MAVZU' : 'НОВАЯ ТЕМА'}</p>
        <h1 className="display ttl-h1">{t(slide.title)}</h1>
        <span className="ttl-rule" aria-hidden="true"/>
        <p className="body ttl-sub">{t(slide.subtitle)}</p>
        <div className="ttl-hero fth-title-hero">
          <MathVisual visual={slide.visual} lang={lang}/>
        </div>
        {introDone && (
          <>
            <p className="small ttl-prompt">
              {lang === 'uz' ? 'Boshlashga tayyormisiz?' : 'Готовы начать?'}
            </p>
            <div className="ttl-opts">
              <button className="option ttl-opt" disabled={picked !== null} onClick={() => pick('go')}>
                {lang === 'uz' ? 'Ha, boshlaymiz' : 'Да, начнём'}
              </button>
              <button className="option ttl-opt" disabled={picked !== null} onClick={() => pick('curious')}>
                {lang === 'uz' ? "Buni bilishni xohlayman" : 'Хочу разобраться'}
              </button>
            </div>
          </>
        )}
      </div>
    </Stage>
  );
}

function RevealLessonScreen({ lesson, screen, ...props }) {
  const slide = lesson.slides[screen];
  const content = useMemo(() => ({
    eyebrow: slide.eyebrow,
    audio: {
      uz: (slide.audio?.uz || slide.steps.map((step) => step.uz)),
      ru: (slide.audio?.ru || slide.steps.map((step) => step.ru)),
    },
  }), [slide]);

  return (
    <RevealScreen
      {...props}
      screen={screen}
      screenContent={content}
      totalScreens={lesson.slides.length}
      renderStep={({ t, lang, step, refs }) => (
        <div className="rv-col">
          <h2 className="title h-title fade-up">{mt(t(slide.title))}</h2>
          <div className="frame fade-up delay-1 fth-figure-frame">
            <MathVisual visual={slide.visual} lang={lang}/>
          </div>
          {slide.steps.slice(0, step + 1).map((line, index) => (
            <div
              ref={refs[index]}
              className={`rv-block ${index % 2 ? 'rv-block-b' : 'rv-block-a'} fade-up`}
              key={index}
            >
              <p className={`rv-lbl ${index % 2 ? 'rv-lbl-b' : 'rv-lbl-a'}`}>
                <span className="fth-step-number">{index + 1}</span>{mt(t(line))}
              </p>
            </div>
          ))}
        </div>
      )}
    />
  );
}

function SingleQuestionScreen({ lesson, screen, ...props }) {
  const slide = lesson.slides[screen];
  const lang = useLang();
  const options = (slide.options || []).map((option) => {
    const value = localized(option, lang);
    const rendered = mt(value);
    return /^\d+$/.test(value)
      ? <span className="fth-standalone-number">{rendered}</span>
      : rendered;
  });
  const content = {
    eyebrow: slide.eyebrow,
    title: slide.title,
    correct_text: correctText(slide),
    wrong_default: slide.wrong,
    audio: {
      intro: slide.intro,
      on_correct: { uz: "To'g'ri.", ru: 'Верно.' },
      on_wrong: slide.wrong,
    },
  };
  const factAudio = slide.fact ? {
    uz: `Bilasizmi? ${slide.fact.uz}`,
    ru: `Знаете ли вы? ${slide.fact.ru}`,
  } : null;

  return (
    <QuestionScreen
      {...props}
      screen={screen}
      idx={screen}
      totalScreens={lesson.slides.length}
      screenMeta={{ scope: slide.scored ? 'practice' : 'hook' }}
      screenContent={content}
      titleNode={slide.title}
      question={<p className="body" style={{ color: T.ink2 }}>{mt(localized(slide.prompt, lang))}</p>}
      options={options}
      correctIdx={slide.correct}
      figure={(solved) => solved ? null : <MathVisual visual={slide.visual} lang={lang}/>}
      factOnCorrect={<WhyCard lines={{ uz: slide.why.map((line) => line.uz), ru: slide.why.map((line) => line.ru) }}/>}
      factAudio={factAudio}
      factNode={slide.fact ? (
        <FactCard
          text={slide.fact}
          badge={FACT_BADGE}
          anim={<FactFractionIcon expression={slide.factVisual || '1/2 = 2/4'}/>}
        />
      ) : null}
    />
  );
}

function MultiQuestionScreen({ lesson, screen, ...props }) {
  const slide = lesson.slides[screen];
  const lang = useLang();
  const optionValues = slide.options.map((option) => localized(option, lang));
  const correctValues = slide.correctSet.map((index) => optionValues[index]);
  const content = {
    eyebrow: slide.eyebrow,
    label: { uz: 'bir nechta javob', ru: 'несколько ответов' },
    context: {
      uz: "To'g'ri tanlovlar yashil bo'lib saqlanadi. Xato tanlovlarni qayta tekshiring.",
      ru: 'Верные варианты сохранятся зелёными. Ошибочные варианты проверьте ещё раз.',
    },
    question: slide.title,
    numbers: optionValues,
    divisors: correctValues,
    correct_text: correctText(slide),
    hint: slide.wrong,
    why: { uz: slide.why.map((line) => line.uz), ru: slide.why.map((line) => line.ru) },
    audio: {
      intro: slide.intro,
      on_correct: { uz: "To'g'ri, barcha javoblar topildi.", ru: 'Верно, все ответы найдены.' },
      on_wrong: slide.wrong,
    },
  };
  return (
    <PickDivisors
      {...props}
      screen={screen}
      screenContent={content}
      totalScreens={lesson.slides.length}
      retryMode
      whyNode={<WhyCard lines={content.why}/>}
    />
  );
}

function MatchQuestionScreen({ lesson, screen, ...props }) {
  const slide = lesson.slides[screen];
  const lang = useLang();
  const content = {
    eyebrow: slide.eyebrow,
    title: slide.title,
    lead: slide.prompt,
    pairs: slide.rows.map((row) => ({
      number: localized(row.left, lang),
      label: row.label || { uz: 'mos javob', ru: 'подходящий ответ' },
      reading: row.correct,
    })),
    correct_text: correctText(slide),
    hint: slide.wrong,
    audio_hint: slide.wrong,
    why: { uz: slide.why.map((line) => line.uz), ru: slide.why.map((line) => line.ru) },
    audio: {
      intro: slide.intro,
      on_correct: { uz: "To'g'ri, barcha juftliklar joyida.", ru: 'Верно, все пары на своих местах.' },
      on_wrong: slide.wrong,
    },
  };
  return (
    <DragMatch
      {...props}
      screen={screen}
      screenContent={content}
      totalScreens={lesson.slides.length}
      factNode={<WhyCard lines={content.why}/>}
    />
  );
}

function ClassifyQuestionScreen({ lesson, screen, ...props }) {
  const slide = lesson.slides[screen];
  const content = {
    eyebrow: slide.eyebrow,
    title: slide.title,
    lead: slide.prompt,
    bin_a: slide.binA,
    bin_b: slide.binB,
    cards: slide.cards.map((card) => ({ label: card.label, bin: card.value ? 'a' : 'b' })),
    hint: slide.wrong,
    audio_hint: slide.wrong,
    correct_text: correctText(slide),
    why: { uz: slide.why.map((line) => line.uz), ru: slide.why.map((line) => line.ru) },
    audio: {
      intro: slide.intro,
      on_correct: { uz: "To'g'ri, barcha kartalar ajratildi.", ru: 'Верно, все карточки распределены.' },
      on_wrong: { uz: 'Bu guruhga emas.', ru: 'Не в эту группу.' },
    },
  };
  return (
    <Classify
      {...props}
      screen={screen}
      screenContent={content}
      totalScreens={lesson.slides.length}
      whyNode={<WhyCard lines={content.why}/>}
    />
  );
}

function SummaryScreen({ lesson, screen, totalScreens, answers, onPrev, finishLesson }) {
  const slide = lesson.slides[lesson.slides.length - 1];
  const lang = useLang();
  const t = useT();
  const score = lesson.scoredScreens.filter((index) => answers[index]?.firstTry === true).length;
  const audio = useAudio([{
    id: `${lesson.id}_summary`,
    text: localized(slide.audio, lang),
    trigger: 'on_mount',
    waits_for: null,
  }]);
  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext
        disabled={audio.isBusy}
        label={lang === 'uz' ? 'Darsni yakunlash' : 'Завершить урок'}
        onClick={finishLesson}
      />
    </>
  );

  return (
    <Stage eyebrow={slide.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="fth-summary">
        <div className="sm-head fade-up">
          <h2 className="title h-sub">{t(slide.title)}</h2>
          <span className="sm-score fth-score">{score}/{lesson.scoredScreens.length}</span>
        </div>
        <div className="frame sm-main fade-up delay-1">
          <p className="small mono fth-main-label">{lang === 'uz' ? 'Asosiysi' : 'Главное'}</p>
          <div className="fth-summary-list">
            {slide.points.map((point, index) => (
              <div key={index}><span>{index + 1}</span><p className="body">{mt(t(point))}</p></div>
            ))}
          </div>
        </div>
        <div className="frame-success sm-close fade-up delay-2">
          <p className="body">{localized(slide.close, lang)}</p>
        </div>
      </div>
    </Stage>
  );
}

const FRACTION_THEORY_STYLES = `
.fth-lesson .frac,
.fth-lesson .frac .n,
.fth-lesson .frac .d,
.fth-lesson .fth-standalone-number {
  font-family: 'Fraunces', 'Source Serif 4', serif;
  font-variation-settings: "opsz" 144;
  font-weight: 600;
}
.fth-title-hero { width: min(100%, 640px); }
.fth-figure-frame { display: flex; align-items: center; justify-content: center; min-height: clamp(100px, 19vw, 150px); padding: clamp(12px, 2.4vw, 20px); }
.fth-equation { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 0.22em; color: #0E0E10; font-family: 'Fraunces', 'Source Serif 4', serif; font-size: clamp(27px, 5.2vw, 40px); font-weight: 600; line-height: 1.25; text-align: center; }
.fth-equation .frac-sm, .fth-chain .frac-sm, .fth-cards .frac-sm { font-size: 1em; }
.fth-equation .mnum, .fth-chain .mnum, .fth-cards .mnum { font-family: inherit; font-size: 1em; font-weight: inherit; }
.fth-chain { width: 100%; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: clamp(7px, 1.8vw, 14px); font-family: 'Fraunces', 'Source Serif 4', serif; font-size: clamp(24px, 4.8vw, 36px); font-weight: 600; }
.fth-chain > span { display: inline-flex; align-items: center; padding: 7px 11px; border-radius: 12px; background: #FFFFFF; box-shadow: 0 5px 14px -8px rgba(58,53,48,.35); }
.fth-chain > span.is-final { color: #1F7A4D; background: #E3F0E8; }
.fth-chain > b { color: #FF4F28; font: 700 clamp(18px,3.7vw,27px) 'JetBrains Mono', monospace; }
.fth-bars { width: 100%; display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); align-items: center; gap: clamp(8px,2vw,17px); }
.fth-bar-wrap { display: flex; flex-direction: column; gap: 7px; }
.fth-bar-label { margin: 0; text-align: center; color: #5A5A60; }
.fth-bar { min-height: clamp(44px,8vw,62px); display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; overflow: hidden; border: 2px solid #494550; border-radius: 12px; background: #FFFFFF; }
.fth-bar span { border-right: 1.5px solid #8A8883; }
.fth-bar span:last-child { border-right: none; }
.fth-bar-accent span.filled { background: #FFE8E1; }
.fth-bar-blue span.filled { background: #EAF6FB; }
.fth-bar-green span.filled { background: #E3F0E8; }
.fth-equals { color: #8A8883; font: 700 clamp(24px,5vw,36px) 'JetBrains Mono', monospace; }
.fth-panels { width: 100%; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
.fth-panel { min-width: 0; padding: clamp(10px,2vw,16px); border-radius: 14px; background: #FFF2ED; border: 1.5px solid rgba(255,79,40,.24); }
.fth-panel-blue { background: #EAF6FB; border-color: rgba(1,154,203,.24); }
.fth-panel-yellow { background: #FFF7CF; border-color: rgba(215,166,32,.32); }
.fth-panel-green { background: #E3F0E8; border-color: rgba(31,122,77,.28); }
.fth-panel > p { margin: 0 0 8px; color: #5A5A60; text-transform: uppercase; letter-spacing: .06em; }
.fth-panel-line { padding: 4px 0; font-family: 'Fraunces','Source Serif 4',serif; font-size: clamp(18px,3.4vw,26px); font-weight: 600; text-align: center; }
.fth-panel-line .frac-sm { font-size: 1em; }
.fth-mini-steps { width: 100%; display: flex; flex-direction: column; gap: 8px; }
.fth-mini-steps > div { display: grid; grid-template-columns: 27px 1fr; align-items: center; gap: 10px; padding: 8px 11px; border-radius: 12px; background: #FFFFFF; }
.fth-mini-steps > div > span, .fth-step-number { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: #FF4F28; color: #FFFFFF; font: 700 12px 'JetBrains Mono',monospace; }
.fth-mini-steps p { margin: 0; color: #0E0E10; font-family: 'Source Serif 4',serif; font-size: clamp(16px,2.8vw,21px); font-weight: 600; }
.fth-step-number { margin-right: 9px; vertical-align: 2px; }
.rv-lbl-b .fth-step-number { background: #1F7A4D; }
.fth-number-line { position: relative; width: 100%; height: 96px; padding-top: 34px; }
.fth-number-line-axis { position: absolute; left: 3%; right: 3%; top: 45px; height: 4px; border-radius: 4px; background: #494550; }
.fth-number-point { position: absolute; top: 33px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; }
.fth-number-point i { width: 4px; height: 26px; border-radius: 4px; background: #FF4F28; }
.fth-number-point span { color: #0E0E10; font-family: 'Fraunces',serif; font-size: clamp(17px,3vw,23px); font-weight: 600; }
.fth-cards { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px; font-family: 'Fraunces',serif; font-size: clamp(21px,4vw,30px); font-weight: 600; }
.fth-cards > div { padding: 9px 14px; border-radius: 12px; background: #FFFFFF; border: 1.5px solid #E6E1D6; }
.fth-cards > div.is-highlighted { color: #1F7A4D; background: #E3F0E8; border-color: rgba(31,122,77,.32); }
.fth-cards > div.fth-card-yellow { background: #FFF7CF; border-color: rgba(215,166,32,.32); }
.fth-cards > div.fth-card-blue { background: #EAF6FB; border-color: rgba(1,154,203,.24); }
.fth-cards > div.fth-card-green { color: #1F7A4D; background: #E3F0E8; border-color: rgba(31,122,77,.32); }
.fth-fact-icon { color: #019ACB; font-family: 'Fraunces',serif; font-size: 18px; font-weight: 600; }
.fth-drift { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.fth-drift > span { position: absolute; color: #FF4F28; opacity: .07; animation: ambFloat 17s ease-in-out infinite; }
.fth-drift-1 { left:5%;top:10%;font-size:31px}.fth-drift-2{right:8%;top:8%;font-size:24px;animation-delay:-3s!important;color:#019ACB!important}
.fth-drift-3{left:10%;bottom:14%;font-size:27px;animation-delay:-6s!important}.fth-drift-4{right:5%;bottom:12%;font-size:34px;animation-delay:-9s!important;color:#019ACB!important}
.fth-drift-5{left:42%;top:2%;font-size:21px;animation-delay:-12s!important}.fth-drift-6{right:20%;bottom:31%;font-size:24px;animation-delay:-14s!important}
.fth-summary { flex:1;display:flex;flex-direction:column;justify-content:center;gap:clamp(12px,2.2vw,18px); }
.fth-score { font-family:'Fraunces','Source Serif 4',serif; font-size:clamp(24px,5.2vw,38px); font-weight:600; }
.fth-main-label { color:#FF4F28;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px; }
.fth-summary-list { display:flex;flex-direction:column;gap:10px; }
.fth-summary-list > div { display:grid;grid-template-columns:26px 1fr;gap:10px;align-items:start; }
.fth-summary-list > div > span { display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:#FFE8E1;color:#FF4F28;font:700 12px 'JetBrains Mono',monospace; }
.fth-summary-list p { margin:0; }
@media (max-width:639.98px) {
  .fth-figure-frame { min-height:90px; }
  .fth-panels { gap:8px; }
  .fth-panel { padding:9px; }
  .fth-bars { gap:6px; }
}
`;

export default function FractionTheoryLesson({
  lesson,
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  correctSoundUrl,
  wrongSoundUrl,
  aiGradingEndpoint,
  onFinished,
}) {
  useMobileZoom();
  const isPreview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
    aiGradingEndpoint: aiGradingEndpoint || '',
    studentName: safeName,
    voiceGender: voiceGender || 'm',
  });
  const safeOnFinished = useMemo(
    () => onFinished || ((payload) => console.log('[Preview] onFinished payload:', payload)),
    [onFinished],
  );
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const startRef = useRef(0);
  const navLockRef = useRef(0);

  useEffect(() => {
    startRef.current = Date.now();
  }, []);

  const recordAnswer = useCallback((data) => {
    setAnswers((previous) => {
      const nextAnswers = [...previous];
      nextAnswers[current] = data;
      return nextAnswers;
    });
  }, [current]);

  const navGuard = () => {
    const now = Date.now();
    if (now - navLockRef.current < 350) return false;
    navLockRef.current = now;
    return true;
  };
  const next = () => { if (navGuard()) setCurrent((value) => Math.min(value + 1, lesson.slides.length - 1)); };
  const prev = () => { if (navGuard()) setCurrent((value) => Math.max(value - 1, 0)); };

  const finishLesson = useCallback(() => {
    const score = lesson.scoredScreens.filter((index) => answers[index]?.firstTry === true).length;
    safeOnFinished({
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      studentName: safeName,
      durationSec: Math.floor((Date.now() - startRef.current) / 1000),
      totalQuestions: lesson.scoredScreens.length,
      correctAnswers: score,
      scorePercent: Math.round((score / lesson.scoredScreens.length) * 100),
      finalScore: score,
      finalTotal: lesson.scoredScreens.length,
      passed: true,
      firstTryStats: { total: lesson.scoredScreens.length, firstTryCorrect: score },
      answers: answers.filter(Boolean),
    });
  }, [answers, lesson, safeName, safeOnFinished]);

  const commonProps = {
    lesson,
    screen: current,
    totalScreens: lesson.slides.length,
    storedAnswer: answers[current],
    answers,
    onAnswer: recordAnswer,
    onNext: next,
    onPrev: prev,
    finishLesson,
  };

  let screenNode;
  const slideType = lesson.slides[current]?.type;
  if (current === 0) screenNode = <TitleScreen {...commonProps}/>;
  else if (current === lesson.slides.length - 1) screenNode = <SummaryScreen {...commonProps}/>;
  else if (slideType === 'info' || slideType === 'rule') screenNode = <RevealLessonScreen {...commonProps}/>;
  else if (slideType === 'multi') screenNode = <MultiQuestionScreen {...commonProps}/>;
  else if (slideType === 'match') screenNode = <MatchQuestionScreen {...commonProps}/>;
  else if (slideType === 'classify') screenNode = <ClassifyQuestionScreen {...commonProps}/>;
  else screenNode = <SingleQuestionScreen {...commonProps}/>;

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <style>{FRACTION_THEORY_STYLES}</style>
      <div className="lesson-root fth-lesson">
        {isPreview && (
          <div className="fth-lang-switch">
            {['ru', 'uz'].map((value) => (
              <button
                key={value}
                onClick={() => setPreviewLang(value)}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 99,
                  padding: '4px 12px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  fontWeight: 600,
                  background: previewLang === value ? '#FF4F28' : 'transparent',
                  color: previewLang === value ? '#FFFFFF' : '#5A5A60',
                }}
              >
                {value.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <React.Fragment key={`${current}-${lang}`}>{screenNode}</React.Fragment>
      </div>
      <style>{`.fth-lang-switch{position:fixed;top:10px;right:10px;z-index:1000;display:flex;gap:4px;background:#fff;border-radius:99px;padding:4px;box-shadow:0 4px 12px -4px rgba(58,53,48,.25)}`}</style>
    </LangContext.Provider>
  );
}
