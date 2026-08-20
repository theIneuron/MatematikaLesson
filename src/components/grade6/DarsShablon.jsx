// ============================================================
// 6 КЛАСС — ШАБЛОН УРОКА
// Скопируй этот файл в DarsNN.jsx и заполни. Здесь стоит ВСЁ, что урок обязан
// иметь, и ничего сверх того: обвязка живёт в ./screens.jsx и не копируется.
//
// Что заполняется:
//   1. LESSON_META  — идентификатор урока для платформы и озвучки;
//   2. SCREEN_META  — роли пятнадцати экранов (порядок = порядок массива screens);
//   3. CONTENT      — тексты на трёх языках и озвучка;
//   4. HookScene / FinalScene — СВОИ сцены урока (обязательны обе);
//   5. экраны с математикой этого урока.
//
// Правила урока — context/GRADE6_ETALON.md. Читать до первой строки кода.
// ============================================================

// `React` не вызывается напрямую, но импорт обязателен: LMS компилирует jsx в
// классическом режиме (React.createElement). Локальный vite этого не покажет.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import {
  registerLesson,
  configureLesson,
  navLocked,
  LangContext,
  useT,
  useMobileZoom,
  useAudio,
  PREVIEW_START,
  BASE_STYLES,
  Stage,
  NavBack,
  NavNext,
  NextLabel,
  BackLabel,
  HookScreen,
  SummaryScreen,
  // Дальше — то, что подключается по мере сборки экранов. Раскомментируй
  // нужное: RevealScreen (экран-фильм), RuleScreen (правило), QuestionScreen
  // (вопрос с четырьмя вариантами), FinalPanel (финальный тест), PickDivisors,
  // Classify, DragMatch, MethodCard, NowYou, FactCard, WhyCard, TaskCount.
} from './screens.jsx';

// ============================================================
// 1. ПАСПОРТ УРОКА
// lessonId уходит в платформу и в адрес озвучки — он обязан быть уникальным.
// ============================================================
const TOTAL_SCREENS = 15;

const LESSON_META = {
  lessonId: 'grade6-NN',
  lessonTitle: { ru: 'Название урока', uz: 'Dars nomi', en: 'Lesson title' },
};

// ============================================================
// 2. РОЛИ ЭКРАНОВ
// Порядок здесь и в массиве `screens` внизу обязан совпадать: оцениваемые
// экраны находятся по позиции. Роли и их смысл — GRADE6_ETALON.md §3.
// ============================================================
const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },      //  1 зачем это нужно
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },        //  2 вспомним известное
  { id: 's1',       type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },        //  3 ядро темы
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },        //  4 способ 1: показ, потом сам
  { id: 's2',       type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },        //  5 способ 2
  { id: 's_solve',  type: 'exploration', template: 'custom',        scored: false, scope: null },        //  6 решаем вместе
  { id: 's3',       type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },        //  7 способ 3 или граница темы
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },        //  8 правило, возврат к хуку
  { id: 'p1',       type: 'test',        template: 'QuestionScreen', scored: true, scope: 'practice' },  //  9 практика
  { id: 'p2',       type: 'test',        template: 'QuestionScreen', scored: true, scope: 'practice' },  // 10 практика
  { id: 'p3',       type: 'test',        template: 'QuestionScreen', scored: true, scope: 'practice' },  // 11 практика
  { id: 'p4',       type: 'test',        template: 'QuestionScreen', scored: true, scope: 'practice' },  // 12 найди ошибку
  { id: 'p5',       type: 'test',        template: 'custom',        scored: true,  scope: 'practice' },  // 13 задача из жизни
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },     // 14 финальный тест x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },        // 15 итог
];

// Урок представляется общему слою ОДИН раз. Без этого вызова озвучка уйдёт без
// идентификатора урока, а ответы — без роли экрана.
registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

// ============================================================
// 3. КОНТЕНТ
// Три языка на каждую строку. Озвучка — ШИРЕ экрана, без символов и кавычек.
// Правила текста и звука — GRADE6_ETALON.md §5 и §6.
// ============================================================
const CONTENT = {
  s_hook: {
    title: { ru: '', uz: '', en: '' },
    lead: { ru: '', uz: '', en: '' },
    voice_a: { ru: '', uz: '', en: '' },   // реплика первого героя
    voice_b: { ru: '', uz: '', en: '' },   // реплика второго героя
    ask: { ru: '', uz: '', en: '' },       // ОДИН вопрос экрана
    opt_5: { ru: '', uz: '', en: '' },     // первый вариант прогноза
    opt_6: { ru: '', uz: '', en: '' },     // второй вариант прогноза
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: "Variantlardan birini bosing. Javobni dars davomida tekshiramiz.",
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      // Две реплики: обстановка и вопрос. Вторая заканчивается обещанием
      // проверить прогноз по ходу урока — ответ на хуке НЕ называется.
      intro: { ru: ['', ''], uz: ['', ''], en: ['', ''] },
    },
  },

  // s_recall, s1, s_tool … — по одному узлу на экран, имена совпадают с SCREEN_META.

  s14: {
    banner: { ru: 'Математика · Тема', uz: 'Matematika · Mavzu', en: 'Mathematics · Topic' },
    heading: { ru: '', uz: '', en: '' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: '', uz: '', en: '' },
    brief_2: { ru: '', uz: '', en: '' },
    brief_3: { ru: '', uz: '', en: '' },
    audio: { ru: [''], uz: [''], en: [''] },
  },
};

// ============================================================
// 4. СЦЕНЫ УРОКА — ОБЯЗАТЕЛЬНЫ ОБЕ
// Хук открывает вопрос, финал показывает на той же сцене ответ. Мир один на
// класс (школа: зал, галерея, столовая, мастерская, двор), нарисован под тему
// ЭТОГО урока. Только фигуры: ни картинок, ни эмодзи.
// Пропорция кадра хука — 400 к 154, финала — 400 к 92: так хук и итог занимают
// одну и ту же высоту во всех уроках класса.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <rect x="0" y="0" width="400" height="154" fill="#F6F1E7"/>
    {/* пол, стены, предметы и люди этого урока */}
  </svg>
);

const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    {/* то же место, но вопрос хука уже решён */}
  </svg>
);

// ============================================================
// 5. ЭКРАНЫ
// Типовые экраны берутся из общего слоя и получают свой контент.
// Экран со своей математикой пишется здесь же, рядом со сценой.
// ============================================================
const ScreenHook = (props) => (
  <HookScreen {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_hook} sceneNode={<HookScene/>}/>
);

const ScreenSummary = (props) => (
  <SummaryScreen {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s14} sceneNode={<FinalScene/>}/>
);

// Заглушка на время сборки: каждый экран заменяется своим.
const Zaglushka = ({ screen, onNext, onPrev }) => {
  const t = useT();
  const audio = useAudio([]);
  return (
    <Stage screen={screen} totalScreens={TOTAL_SCREENS} audioState={audio}
      navContent={<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={navLocked(false)} label={<NextLabel/>} onClick={onNext}/></>}>
      <p className="body">{t(CONTENT.s14.heading)}</p>
    </Stage>
  );
};

// ============================================================
// 6. CSS УРОКА
// Базовые правила класса — в BASE_STYLES. Здесь только сцены и экраны этого
// урока. ВНИМАНИЕ: строка шаблонная, обратная кавычка или обратный слэш внутри
// неё (даже в комментарии) дают белый экран.
// ============================================================
const LESSON_STYLES = '';

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// 7. КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function LessonRoot({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = langProp || previewLang;
  configureLesson({
    ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '',
    aiGradingEndpoint: aiGradingEndpoint || '', studentName: studentName || '', voiceGender: voiceGender || 'm',
    // Теория 6 класса не оценивается и не запирает переход (решение методиста).
    navLock: false,
  });
  const [current, setCurrent] = useState(Math.min(PREVIEW_START, TOTAL_SCREENS - 1));
  const [answers, setAnswers] = useState([]);

  const screens = [ScreenHook, Zaglushka, Zaglushka, Zaglushka, Zaglushka, Zaglushka, Zaglushka,
    Zaglushka, Zaglushka, Zaglushka, Zaglushka, Zaglushka, Zaglushka, Zaglushka, ScreenSummary];
  const CurrentScreen = screens[current];

  const finishLesson = () => {
    if (!onFinished) return;
    onFinished({
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      // Теория не оценивается: проценты и passed остаются пустыми.
      totalQuestions: null, correctAnswers: null, scorePercent: null,
      finalScore: null, finalTotal: null, passed: null,
      answers: answers.filter(Boolean),
    });
  };

  return (
    <LangContext.Provider value={lang}>
      <div className="lesson-root">
        <style>{STYLES}</style>
        {isPreview && (
          <div style={{ position: 'fixed', top: 8, right: 8, zIndex: 40, display: 'flex', gap: 6 }}>
            {['ru', 'uz', 'en'].map((l) => (
              <button key={l} className="btn-ghost" onClick={() => setPreviewLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        )}
        <CurrentScreen
          screen={current}
          totalScreens={TOTAL_SCREENS}
          storedAnswer={answers[current]}
          onAnswer={(data) => setAnswers((prev) => { const next = [...prev]; next[current] = data; return next; })}
          onNext={() => setCurrent((v) => Math.min(v + 1, TOTAL_SCREENS - 1))}
          onPrev={() => setCurrent((v) => Math.max(v - 1, 0))}
          onReset={() => { setAnswers([]); setCurrent(0); }}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}
