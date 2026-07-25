import React, { useCallback, useMemo, useRef, useState } from 'react';
import { SLIDES } from './Dars07Content.jsx';
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
  NextLabel,
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

const TOTAL_SCREENS = 15;
const SCORED_SCREENS = [5, 7, 8, 10, 11, 12, 13];
const FACT_BADGE = {
  uz: 'Bilasizmi? · Matematika',
  ru: 'Знаете ли вы? · Математика',
};

const localized = (node, lang) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  return node[lang] ?? node.uz ?? node.ru ?? '';
};

const correctText = (slide) => ({
  uz: `To'g'ri. ${slide.why?.[0]?.uz || ''}`,
  ru: `Верно. ${slide.why?.[0]?.ru || ''}`,
});

const factAudio = (slide) => slide.fact ? {
  uz: `Bilasizmi? ${slide.fact.uz}`,
  ru: `Знаете ли вы? ${slide.fact.ru}`,
} : null;

function FractionBars({ numerator, denominator, tone = 'accent' }) {
  return (
    <div className={`d7-bars d7-bars-${tone}`} aria-label={`${numerator}/${denominator}`}>
      {Array.from({ length: denominator }, (_, index) => (
        <span key={index} className={index < numerator ? 'filled' : ''}/>
      ))}
    </div>
  );
}

function FractionPair({ left, right, leftParts, rightParts }) {
  return (
    <div className="d7-pair">
      <div>
        <Frac n={left.split('/')[0]} d={left.split('/')[1]} size="mid"/>
        <FractionBars numerator={leftParts[0]} denominator={leftParts[1]}/>
      </div>
      <b>=</b>
      <div>
        <Frac n={right.split('/')[0]} d={right.split('/')[1]} size="mid"/>
        <FractionBars numerator={rightParts[0]} denominator={rightParts[1]} tone="blue"/>
      </div>
    </div>
  );
}

function Equation({ a, b, op = '×', by }) {
  const [an, ad] = a.split('/');
  const [bn, bd] = b.split('/');
  return (
    <div className="d7-equation">
      <Frac n={an} d={ad} size="mid"/>
      {by && (
        <>
          <span>=</span>
          <span className="d7-op-frac">
            <b>{an} {op} {by}</b>
            <i/>
            <b>{ad} {op} {by}</b>
          </span>
        </>
      )}
      <span>=</span>
      <Frac n={bn} d={bd} size="mid"/>
    </div>
  );
}

function NumberLine() {
  return (
    <div className="d7-line">
      <span className="d7-tick d7-tick-0"/><span className="d7-tick d7-tick-half"/><span className="d7-tick d7-tick-1"/>
      <b className="d7-zero">0</b><b className="d7-one">1</b>
      <div className="d7-line-fracs"><Frac n="1" d="2"/><Frac n="2" d="4"/><Frac n="3" d="6"/></div>
    </div>
  );
}

function LessonVisual({ kind, lang }) {
  if (kind === 'half') return (
    <div className="d7-visual-stack">
      <FractionBars numerator={1} denominator={2}/>
      <span className="d7-down">↓</span>
      <FractionBars numerator={2} denominator={4} tone="blue"/>
    </div>
  );
  if (kind === 'split') return <FractionPair left="1/2" right="2/4" leftParts={[1, 2]} rightParts={[2, 4]}/>;
  if (kind === 'multiply') return <Equation a="2/3" b="8/12" by="4"/>;
  if (kind === 'ratio') return (
    <div className="d7-visual-stack">
      <FractionBars numerator={2} denominator={3}/>
      <p className="small mono d7-caption">{lang === 'uz' ? 'har bir bo‘lak × 3' : 'каждая часть × 3'}</p>
      <FractionBars numerator={6} denominator={9} tone="blue"/>
    </div>
  );
  if (kind === 'threeFifths') return <FractionPair left="3/5" right="6/10" leftParts={[3, 5]} rightParts={[6, 10]}/>;
  if (kind === 'reduce') return <Equation a="6/8" b="3/4" op=":" by="2"/>;
  if (kind === 'tenFifteen') return <Equation a="10/15" b="2/3" op=":" by="5"/>;
  if (kind === 'fourSixths') return <Equation a="4/6" b="2/3" op=":" by="2"/>;
  if (kind === 'numberLine') return <NumberLine/>;
  if (kind === 'unknown') return (
    <div className="d7-equation">
      <Frac n="?" d="18" size="mid"/><span>=</span><Frac n="2" d="3" size="mid"/>
    </div>
  );
  return null;
}

function FractionDrift() {
  return (
    <div className="d7-drift" aria-hidden="true">
      {['1/2', '2/4', '3/6', '4/8', '5/10', '6/12'].map((value, index) => {
        const [n, d] = value.split('/');
        return <span className={`d7-drift-${index + 1}`} key={value}><Frac n={n} d={d}/></span>;
      })}
    </div>
  );
}

function FactFractionIcon() {
  return (
    <div className="d7-fact-icon" aria-hidden="true">
      <Frac n="1" d="2" size="mid"/><span>=</span><Frac n="2" d="4" size="mid"/>
    </div>
  );
}

function D7TitleScreen({ screen, totalScreens, onAnswer, onNext }) {
  const slide = SLIDES[0];
  const t = useT();
  const lang = useLang();
  const audio = useAudio([
    {
      id: 'd7_s0_topic',
      text: lang === 'uz'
        ? "Bugungi mavzu kasrning asosiy xossasi. Bugun kasrning qiymatini o'zgartirmasdan uning surat va maxrajini o'zgartirishni o'rganamiz."
        : 'Тема урока — основное свойство дроби. Сегодня научимся менять числитель и знаменатель, не изменяя значения дроби.',
      trigger: 'on_mount',
      waits_for: null,
    },
    {
      id: 'd7_s0_example',
      text: lang === 'uz'
        ? "Bir kasrning ikki xil yozuviga qarang: ikkidan bir va to'rtdan ikki. Ular nega teng ekanini dars davomida aniqlaymiz."
        : 'Посмотрите на две записи одной дроби: одна вторая и две четвёртых. На уроке выясним, почему они равны.',
      trigger: 'after_previous',
      waits_for: { type: 'option_picked' },
    },
  ]);
  const [picked, setPicked] = useState(null);
  const pickedRef = useRef(false);
  const introDone = audio.muted || (audio.hasStarted && !audio.isBusy);
  const formulaVisible = audio.muted ||
    audio.currentSegment === 'd7_s0_example' ||
    audio.lastCompletedSegment === 'd7_s0_topic' ||
    audio.lastCompletedSegment === 'd7_s0_example';

  const pick = (value) => {
    if (pickedRef.current) return;
    pickedRef.current = true;
    setPicked(value);
    onAnswer({ stage: 'hook', screenIdx: screen, studentAnswer: value, correct: true });
    audio.triggerEvent('option_picked');
    setTimeout(onNext, 280);
  };

  return (
    <Stage eyebrow={slide.eyebrow} screen={screen} totalScreens={totalScreens} audioState={audio}>
      <div className="ttl-wrap">
        <Floaters/>
        <FractionDrift/>
        <p className="eyebrow ttl-kicker">{lang === 'uz' ? 'YANGI MAVZU' : 'НОВАЯ ТЕМА'}</p>
        <h1 className="display ttl-h1">{t(slide.title)}</h1>
        <span className="ttl-rule" aria-hidden="true"/>
        <p className="body ttl-sub">{t(slide.subtitle)}</p>
        {formulaVisible && (
          <div className="ttl-hero" style={{ animationDelay: '0.12s' }}>
            <div className="d7-title-equation"><Frac n="1" d="2" size="mid"/><span>=</span><Frac n="2" d="4" size="mid"/></div>
            {introDone && (
              <div className="ttl-tease">
                <span className="ttl-q">{lang === 'uz' ? 'Qiymati o‘zgardimi?' : 'Значение изменилось?'}</span>
                <span className="ttl-q">{lang === 'uz' ? 'Nega teng?' : 'Почему равны?'}</span>
              </div>
            )}
          </div>
        )}
        {introDone && (
          <>
            <p className="small ttl-prompt" style={{ animationDelay: '0.38s' }}>
              {lang === 'uz' ? 'Boshlashga tayyormisiz?' : 'Готовы начать?'}
            </p>
            <div className="ttl-opts" style={{ animationDelay: '0.62s' }}>
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

function D7RevealScreen({ screen, ...props }) {
  const slide = SLIDES[screen];
  const content = useMemo(() => ({
    eyebrow: slide.eyebrow,
    audio: {
      uz: slide.steps.map((step) => step.uz),
      ru: slide.steps.map((step) => step.ru),
    },
  }), [slide]);

  return (
    <RevealScreen
      {...props}
      screen={screen}
      screenContent={content}
      totalScreens={TOTAL_SCREENS}
      renderStep={({ t, lang, step, refs }) => (
        <div className="rv-col">
          <h2 className="title h-title fade-up">{t(slide.title)}</h2>
          <div className="frame fade-up delay-1 d7-figure-frame">
            <LessonVisual kind={slide.visual} lang={lang}/>
          </div>
          {slide.steps.slice(0, step + 1).map((line, index) => (
            <div
              ref={refs[index]}
              className={`rv-block ${index % 2 ? 'rv-block-b' : 'rv-block-a'} fade-up`}
              key={index}
            >
              <p className={`rv-lbl ${index % 2 ? 'rv-lbl-b' : 'rv-lbl-a'}`}>
                <span className="d7-step-number">{index + 1}</span>{mt(t(line))}
              </p>
            </div>
          ))}
        </div>
      )}
    />
  );
}

function D7QuestionScreen({ screen, ...props }) {
  const slide = SLIDES[screen];
  const lang = useLang();
  const options = (slide.options || []).map((option) => {
    const value = localized(option, lang);
    const rendered = mt(value);
    return /^\d+$/.test(value)
      ? <span className="mono d7-standalone-number">{rendered}</span>
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
  const fact = factAudio(slide);

  return (
    <QuestionScreen
      {...props}
      screen={screen}
      idx={screen}
      totalScreens={TOTAL_SCREENS}
      screenMeta={{ scope: slide.scored ? 'practice' : 'hook' }}
      screenContent={content}
      titleNode={slide.title}
      question={<p className="body" style={{ color: T.ink2 }}>{mt(localized(slide.prompt, lang))}</p>}
      options={options}
      correctIdx={slide.correct}
      figure={(solved) => solved ? null : <LessonVisual kind={slide.visual} lang={lang}/>}
      factOnCorrect={<WhyCard lines={{ uz: slide.why.map((line) => line.uz), ru: slide.why.map((line) => line.ru) }}/>}
      factAudio={fact}
      factNode={slide.fact ? (
        <FactCard text={slide.fact} badge={FACT_BADGE} anim={<FactFractionIcon/>}/>
      ) : null}
    />
  );
}

function D7MultiScreen(props) {
  const screen = 10;
  const slide = SLIDES[screen];
  const correctValues = slide.correctSet.map((index) => slide.options[index]);
  const content = {
    eyebrow: slide.eyebrow,
    label: { uz: 'bir nechta javob', ru: 'несколько ответов' },
    context: {
      uz: "To'g'ri tanlovlar yashil bo'lib saqlanadi. Xato tanlovlarni qayta tekshiring.",
      ru: 'Верные варианты сохранятся зелёными. Ошибочные варианты проверьте ещё раз.',
    },
    question: slide.title,
    numbers: slide.options,
    divisors: correctValues,
    correct_text: correctText(slide),
    hint: slide.wrong,
    why: { uz: slide.why.map((line) => line.uz), ru: slide.why.map((line) => line.ru) },
    audio: {
      intro: slide.intro,
      on_correct: { uz: "To'g'ri, barcha teng kasrlar topildi.", ru: 'Верно, все равные дроби найдены.' },
      on_wrong: slide.wrong,
    },
  };
  return (
    <PickDivisors
      {...props}
      screen={screen}
      screenContent={content}
      totalScreens={TOTAL_SCREENS}
      retryMode
      whyNode={<WhyCard lines={content.why}/>}
    />
  );
}

function D7MatchScreen(props) {
  const screen = 11;
  const slide = SLIDES[screen];
  const content = {
    eyebrow: slide.eyebrow,
    title: slide.title,
    lead: slide.prompt,
    pairs: slide.rows.map((row) => ({
      number: row.left,
      label: { uz: 'teng kasri', ru: 'равная дробь' },
      reading: { uz: row.correct, ru: row.correct },
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
      totalScreens={TOTAL_SCREENS}
      factNode={<WhyCard lines={content.why}/>}
    />
  );
}

function D7ClassifyScreen(props) {
  const screen = 12;
  const slide = SLIDES[screen];
  const content = {
    eyebrow: slide.eyebrow,
    title: slide.title,
    lead: slide.prompt,
    bin_a: { uz: 'Teng kasr', ru: 'Равные дроби' },
    bin_b: { uz: 'Teng emas', ru: 'Не равны' },
    cards: slide.cards.map((card) => ({ label: card.label, bin: card.value ? 'a' : 'b' })),
    hint: slide.wrong,
    audio_hint: slide.wrong,
    correct_text: correctText(slide),
    why: { uz: slide.why.map((line) => line.uz), ru: slide.why.map((line) => line.ru) },
    audio: {
      intro: slide.intro,
      on_correct: { uz: "To'g'ri, barcha juftliklar ajratildi.", ru: 'Верно, все пары распределены.' },
      on_wrong: { uz: 'Bu guruhga emas.', ru: 'Не в эту группу.' },
    },
  };
  return (
    <Classify
      {...props}
      screen={screen}
      screenContent={content}
      totalScreens={TOTAL_SCREENS}
      whyNode={<WhyCard lines={content.why}/>}
    />
  );
}

function D7SummaryScreen({ screen, totalScreens, answers, onPrev, finishLesson }) {
  const slide = SLIDES[14];
  const lang = useLang();
  const t = useT();
  const score = SCORED_SCREENS.filter((index) => answers[index]?.firstTry === true).length;
  const audio = useAudio([{
    id: 'd7_summary',
    text: slide.audio[lang],
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'clamp(12px, 2.2vw, 18px)' }}>
        <div className="sm-head fade-up">
          <h2 className="title h-sub">{t(slide.title)}</h2>
          <span className="sm-score mono">{score}/{SCORED_SCREENS.length}</span>
        </div>
        <div className="frame sm-main fade-up delay-1">
          <p className="small mono" style={{ color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            {lang === 'uz' ? 'Asosiysi' : 'Главное'}
          </p>
          <div className="d7-summary-list">
            {slide.points.map((point, index) => (
              <div key={index}><span>{index + 1}</span><p className="body">{mt(t(point))}</p></div>
            ))}
          </div>
        </div>
        <div className="frame-success sm-close fade-up delay-2">
          <p className="body">
            {lang === 'uz'
              ? "Endi teng kasrlarni topish, kasrni kengaytirish va qisqartirish qoidasini bilasiz."
              : 'Теперь вы умеете находить равные дроби, расширять и сокращать дроби.'}
          </p>
        </div>
      </div>
    </Stage>
  );
}

const SCREENS = [
  D7TitleScreen,
  D7QuestionScreen,
  D7RevealScreen,
  D7RevealScreen,
  D7RevealScreen,
  D7QuestionScreen,
  D7RevealScreen,
  D7QuestionScreen,
  D7QuestionScreen,
  D7RevealScreen,
  D7MultiScreen,
  D7MatchScreen,
  D7ClassifyScreen,
  D7QuestionScreen,
  D7SummaryScreen,
];

const D7_STYLES = `
.d7-lesson .frac,
.d7-lesson .frac .n,
.d7-lesson .frac .d,
.d7-lesson .d7-standalone-number {
  font-family: 'Fraunces', 'Source Serif 4', serif;
  font-variation-settings: "opsz" 144;
  font-weight: 600;
}
.d7-bars { width: min(100%, 560px); min-height: clamp(46px, 8vw, 62px); display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; overflow: hidden; border: 2px solid #494550; border-radius: 12px; background: #FFFFFF; }
.d7-bars span { border-right: 1.5px solid #8A8883; transition: background 0.55s ease; }
.d7-bars span:last-child { border-right: none; }
.d7-bars-accent span.filled { background: #FFE8E1; }
.d7-bars-blue span.filled { background: #EAF6FB; }
.d7-pair { width: 100%; display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); align-items: center; gap: clamp(8px, 2vw, 18px); }
.d7-pair > div { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.d7-pair > b { font-family: 'JetBrains Mono', monospace; font-size: clamp(24px, 5vw, 36px); color: #8A8883; }
.d7-visual-stack { width: 100%; max-width: 590px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.d7-down { color: #FF4F28; font-size: 24px; line-height: 1; }
.d7-caption { color: #FF4F28; }
.d7-equation, .d7-title-equation { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 18px); font-family: 'JetBrains Mono', monospace; font-size: clamp(22px, 4.4vw, 32px); font-weight: 700; }
.d7-op-frac {
  display: inline-grid;
  grid-template-rows: 1fr 0.08em 1fr;
  text-align: center;
  font-family: 'Fraunces', 'Source Serif 4', serif;
  font-size: clamp(26px, 5vw, 38px);
  font-variation-settings: "opsz" 144;
  font-weight: 600;
  line-height: 1;
}
.d7-op-frac b {
  padding: 0 0.12em;
  font: inherit;
}
.d7-op-frac i {
  display: block;
  width: 100%;
  min-height: 2px;
  border-radius: 2px;
  background: currentColor;
}
.d7-figure-frame { display: flex; align-items: center; justify-content: center; min-height: clamp(92px, 18vw, 142px); padding: clamp(12px, 2.4vw, 18px); }
.d7-step-number { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; margin-right: 9px; border-radius: 50%; background: currentColor; color: #FFFFFF; font: 700 12px 'JetBrains Mono', monospace; vertical-align: 2px; }
.rv-lbl-a .d7-step-number { background: #FF4F28; }
.rv-lbl-b .d7-step-number { background: #1F7A4D; }
.d7-line { position: relative; width: 100%; max-width: 590px; height: 112px; margin: 0 auto; border-top: 4px solid #494550; margin-top: 48px; }
.d7-tick { position: absolute; top: -12px; width: 3px; height: 22px; background: #494550; }
.d7-tick-0 { left: 0; }.d7-tick-half { left: 50%; background: #FF4F28; height: 29px; top: -15px; }.d7-tick-1 { right: 0; }
.d7-zero, .d7-one { position: absolute; top: 17px; font-family: 'JetBrains Mono', monospace; }.d7-zero { left: 0; }.d7-one { right: 0; }
.d7-line-fracs { position: absolute; left: 50%; top: -48px; transform: translateX(-50%); display: flex; gap: 10px; color: #FF4F28; }
.d7-drift { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.d7-drift > span { position: absolute; color: #FF4F28; opacity: 0.07; animation: ambFloat 17s ease-in-out infinite; }
.d7-drift-1 { left: 5%; top: 10%; font-size: 31px; }.d7-drift-2 { right: 8%; top: 8%; font-size: 24px; animation-delay: -3s!important; color: #019ACB!important; }
.d7-drift-3 { left: 10%; bottom: 14%; font-size: 27px; animation-delay: -6s!important; }.d7-drift-4 { right: 5%; bottom: 12%; font-size: 34px; animation-delay: -9s!important; color: #019ACB!important; }
.d7-drift-5 { left: 42%; top: 2%; font-size: 21px; animation-delay: -12s!important; }.d7-drift-6 { right: 20%; bottom: 31%; font-size: 24px; animation-delay: -14s!important; }
.d7-fact-icon { display: flex; align-items: center; justify-content: center; gap: 7px; color: #019ACB; font-size: 17px; }
.d7-summary-list { display: flex; flex-direction: column; gap: 10px; }
.d7-summary-list > div { display: grid; grid-template-columns: 26px 1fr; gap: 10px; align-items: start; }
.d7-summary-list > div > span { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: #FFE8E1; color: #FF4F28; font: 700 12px 'JetBrains Mono', monospace; }
.d7-summary-list p { margin: 0; }
@media (max-width: 639.98px) {
  .d7-bars { min-height: 44px; }
  .d7-pair { gap: 6px; }
  .d7-figure-frame { min-height: 88px; }
  .d7-line { height: 96px; margin-top: 45px; }
}
`;

export default function Dars07({
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
  const safeOnFinished = onFinished || ((payload) => console.log('[Preview] onFinished payload:', payload));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const startRef = useRef(Date.now());
  const navLockRef = useRef(0);

  const recordAnswer = useCallback((data) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[current] = data;
      return next;
    });
  }, [current]);

  const navGuard = () => {
    const now = Date.now();
    if (now - navLockRef.current < 350) return false;
    navLockRef.current = now;
    return true;
  };
  const next = () => { if (navGuard()) setCurrent((value) => Math.min(value + 1, TOTAL_SCREENS - 1)); };
  const prev = () => { if (navGuard()) setCurrent((value) => Math.max(value - 1, 0)); };

  const finishLesson = useCallback(() => {
    const score = SCORED_SCREENS.filter((index) => answers[index]?.firstTry === true).length;
    safeOnFinished({
      lessonId: 'frac_6_07',
      lessonTitle: { uz: 'Kasrning asosiy xossasi', ru: 'Основное свойство дроби' },
      studentName: safeName,
      durationSec: Math.floor((Date.now() - startRef.current) / 1000),
      totalQuestions: SCORED_SCREENS.length,
      correctAnswers: score,
      scorePercent: Math.round((score / SCORED_SCREENS.length) * 100),
      finalScore: score,
      finalTotal: SCORED_SCREENS.length,
      passed: true,
      firstTryStats: { total: SCORED_SCREENS.length, firstTryCorrect: score },
      answers: answers.filter(Boolean),
    });
  }, [answers, safeName, safeOnFinished]);

  const CurrentScreen = SCREENS[current];

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <style>{D7_STYLES}</style>
      <div className="lesson-root d7-lesson">
        {isPreview && (
          <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: 4, background: '#FFFFFF', borderRadius: 99, padding: 4, boxShadow: '0 4px 12px -4px rgba(58, 53, 48, 0.25)' }}>
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
        <CurrentScreen
          key={`${current}-${lang}`}
          screen={current}
          totalScreens={TOTAL_SCREENS}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={recordAnswer}
          onNext={next}
          onPrev={prev}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}
