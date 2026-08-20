// Mashq mexanikalari — 3-sinf amaliyot kanoni bo'yicha (TIPLAR_AMALIYOT_3SINF.md
// §3): choice, order, match, multi. Klaviatura talab qiladigan erkin raqamli
// kiritish ishlatilmaydi (etalon Dars01 da ham u yo'q).
import { useRef, useState } from 'react';
import {
  buildOptionOrder, playSfx, useCanAnswer, useLesson, useNarration, useT,
} from './runtime.js';
import { FeedbackBlock, Heading, Options, Stage } from './ui.jsx';

// Umumiy javob yozuvi — natijaga bir xil shaklda tushadi.
const useAttempts = (storedAnswer) => ({
  attemptsRef: useRef(storedAnswer?.attempts ?? 0),
  cleanRef: useRef(storedAnswer?.firstTry ?? true),
});

// --------------------------------------------------------------------------
// choice — bir nechta variantdan bittasini tanlash
// --------------------------------------------------------------------------
export function ChoiceExercise({
  screen, ordinal = 0, storedAnswer, onAnswer, onNext, onPrev, visual = null, bit = null, shuffle = true,
}) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[screen];
  const audio = useNarration(c.audio, screen);
  const canAnswer = useCanAnswer(audio);
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const { attemptsRef, cleanRef } = useAttempts(storedAnswer);
  const optionOrder = shuffle
    ? buildOptionOrder(c.options.length, c.correctIndex, lesson.lessonId, ordinal)
    : null;

  const pick = (index) => {
    if (solved || !canAnswer) return;
    attemptsRef.current += 1;
    const ok = index === c.correctIndex;
    if (!ok) cleanRef.current = false;
    setPicked(index);
    setSolved(ok);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong));
    onAnswer({
      screenIdx: screen,
      stage: lesson.screenMeta[screen].scope,
      question: t(c.question),
      options: c.options.map(t),
      correctIndex: c.correctIndex,
      correctAnswer: t(c.options[c.correctIndex]),
      studentAnswerIndex: index,
      studentAnswer: t(c.options[index]),
      correct: ok,
      firstTry: ok && cleanRef.current && attemptsRef.current === 1,
      attempts: attemptsRef.current,
      solved: ok,
    });
  };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} done={solved}>
      <div className="stack">
        <Heading c={c} screen={screen} bit={bit} />
        {visual}
        <section className="question">
          <h2>{t(c.question)}</h2>
          <Options
            values={c.options}
            order={optionOrder}
            picked={picked}
            onPick={pick}
            correctIndex={c.correctIndex}
            solved={solved}
            locked={!canAnswer}
          />
          <FeedbackBlock show={picked !== null} correct={solved}>
            {picked !== null ? t(c.feedback[picked]) : ''}
          </FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
}

// --------------------------------------------------------------------------
// order — kartochkalarni kerakli ketma-ketlikda bosish
// Gaplar alohida freymda turadi (methodist talabi): tanlangan tartib va
// tanlash uchun bank ko'z bilan ajratilgan.
// --------------------------------------------------------------------------
export function OrderExercise({ screen, storedAnswer, onAnswer, onNext, onPrev, visual = null }) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[screen];
  const audio = useNarration(c.audio, screen);
  const canAnswer = useCanAnswer(audio);
  const size = c.cards.length;
  const [order, setOrder] = useState(storedAnswer?.correct ? c.cards.map((_, index) => index) : []);
  const [message, setMessage] = useState(null);
  const { attemptsRef, cleanRef } = useAttempts(storedAnswer);
  const solved = order.length === size && order.every((value, index) => value === index);

  const choose = (index) => {
    if (solved || !canAnswer || order.includes(index)) return;
    const next = [...order, index];
    setOrder(next);
    if (next.length < size) return;
    attemptsRef.current += 1;
    const ok = next.every((value, place) => value === place);
    if (!ok) cleanRef.current = false;
    const text = ok ? c.audio.on_correct : c.audio.on_wrong;
    setMessage(text);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(text));
    onAnswer({
      screenIdx: screen,
      stage: lesson.screenMeta[screen].scope,
      question: t(c.question),
      correctAnswer: c.cards.map((_, place) => place).join(','),
      studentAnswer: next.join(','),
      correct: ok,
      firstTry: ok && cleanRef.current && attemptsRef.current === 1,
      attempts: attemptsRef.current,
      solved: ok,
    });
  };

  const reset = () => { if (!solved) { setOrder([]); setMessage(null); } };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} done={solved}>
      <div className="stack">
        <Heading c={c} screen={screen} />
        {visual}
        <section className="question">
          <h2>{t(c.question)}</h2>
          {/* Tuzilgan tartib — o'z freymida */}
          <div className="order-frame" data-g4-role="order-frame">
            <span className="order-frame-label">
              {t({ uz: "Tuzilgan tartib", ru: 'Составленный порядок', en: 'Your order' })}
            </span>
            <div className="order-result">
              {Array.from({ length: size }, (_, place) => {
                const index = order[place];
                return (
                  <div key={place} className={index === undefined ? 'is-empty' : ''}>
                    <b>{place + 1}</b>
                    <span>{index === undefined ? '' : t(c.cards[index])}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Tanlash uchun gaplar — alohida freym */}
          <div className="bank-frame" data-g4-role="bank-frame">
            <span className="bank-frame-label">
              {t({ uz: "Gaplarni tanlang", ru: 'Выбирай утверждения', en: 'Pick the statements' })}
            </span>
            <div className="card-bank">
              {c.cards.map((card, index) => (
                <button
                  type="button"
                  key={t(card)}
                  onClick={() => choose(index)}
                  disabled={order.includes(index) || solved || !canAnswer}
                >
                  {t(card)}
                </button>
              ))}
            </div>
            {order.length > 0 && !solved && (
              <button type="button" className="tiny-action" onClick={reset}>
                {t({ uz: "Qayta tuzish", ru: 'Собрать заново', en: 'Start again' })}
              </button>
            )}
          </div>
          <FeedbackBlock show={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
}

// --------------------------------------------------------------------------
// match — chapdagi ta'rifga o'ngdagi yozuvni moslashtirish (4 juftgacha)
// --------------------------------------------------------------------------
export function MatchExercise({ screen, storedAnswer, onAnswer, onNext, onPrev, visual = null }) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[screen];
  const audio = useNarration(c.audio, screen);
  const canAnswer = useCanAnswer(audio);
  const restored = Array.isArray(storedAnswer?.studentAnswer) && storedAnswer.studentAnswer.length === c.situations.length
    ? storedAnswer.studentAnswer
    : Array(c.situations.length).fill(-1);
  const [matches, setMatches] = useState(restored);
  const [message, setMessage] = useState(null);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const { attemptsRef, cleanRef } = useAttempts(storedAnswer);

  const cycle = (index) => {
    if (solved || !canAnswer) return;
    setMatches((previous) => previous.map((value, place) => (
      place === index ? (value + 1) % c.formulas.length : value
    )));
    setMessage(null);
  };

  const submit = () => {
    if (matches.some((value) => value < 0) || solved || !canAnswer) return;
    attemptsRef.current += 1;
    const ok = matches.every((value, index) => value === c.answer[index]);
    if (!ok) cleanRef.current = false;
    setSolved(ok);
    setMessage(ok ? c.audio.on_correct : c.audio.on_wrong);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong));
    onAnswer({
      screenIdx: screen,
      stage: lesson.screenMeta[screen].scope,
      question: t(c.question),
      correctAnswer: c.answer,
      studentAnswer: matches,
      correct: ok,
      firstTry: ok && cleanRef.current && attemptsRef.current === 1,
      attempts: attemptsRef.current,
      solved: ok,
    });
  };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} done={solved}>
      <div className="stack">
        <Heading c={c} screen={screen} />
        {visual}
        <section className="question">
          <h2>{t(c.question)}</h2>
          <div className="matching">
            {c.situations.map((situation, index) => (
              <div key={t(situation)}>
                <span>{t(situation)}</span>
                <button type="button" onClick={() => cycle(index)} disabled={solved || !canAnswer}>
                  {matches[index] < 0
                    ? t({ uz: "Yozuvni tanlang", ru: 'Выбери запись', en: 'Choose an expression' })
                    : c.formulas[matches[index]]}
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn-white-accent check-wide"
            onClick={submit}
            disabled={matches.some((value) => value < 0) || solved || !canAnswer}
          >
            {t({ uz: "Tekshirish", ru: 'Проверить', en: 'Check' })}
          </button>
          <FeedbackBlock show={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
}

// --------------------------------------------------------------------------
// multi — mos keladiganlarning barchasini belgilash. Qisman javob to'liq
// noto'g'ri hisoblanadi (3-sinf kanoni §3.3).
// --------------------------------------------------------------------------
export function MultiExercise({ screen, storedAnswer, onAnswer, onNext, onPrev, visual = null }) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[screen];
  const audio = useNarration(c.audio, screen);
  const canAnswer = useCanAnswer(audio);
  const [chosen, setChosen] = useState(() => new Set(storedAnswer?.correct ? c.answer : []));
  const [message, setMessage] = useState(null);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const { attemptsRef, cleanRef } = useAttempts(storedAnswer);

  const toggle = (index) => {
    if (solved || !canAnswer) return;
    setChosen((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
    setMessage(null);
  };

  const submit = () => {
    if (!chosen.size || solved || !canAnswer) return;
    attemptsRef.current += 1;
    const picked = [...chosen].sort((a, b) => a - b);
    const expected = [...c.answer].sort((a, b) => a - b);
    const ok = picked.length === expected.length && picked.every((value, index) => value === expected[index]);
    if (!ok) cleanRef.current = false;
    setSolved(ok);
    setMessage(ok ? c.audio.on_correct : c.audio.on_wrong);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong));
    onAnswer({
      screenIdx: screen,
      stage: lesson.screenMeta[screen].scope,
      question: t(c.question),
      options: c.options.map(t),
      correctAnswer: expected.join(','),
      studentAnswer: picked.join(','),
      correct: ok,
      firstTry: ok && cleanRef.current && attemptsRef.current === 1,
      attempts: attemptsRef.current,
      solved: ok,
    });
  };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} done={solved}>
      <div className="stack">
        <Heading c={c} screen={screen} />
        {visual}
        <section className="question">
          <h2>{t(c.question)}</h2>
          <div className={`options options-multi ${!canAnswer ? 'is-locked' : ''}`} aria-busy={!canAnswer || undefined}>
            {c.options.map((option, index) => (
              <button
                type="button"
                key={t(option)}
                data-g4-role="answer-card"
                aria-pressed={chosen.has(index)}
                className={`option ${chosen.has(index) ? 'picked' : ''} ${solved && c.answer.includes(index) ? 'right' : ''}`}
                disabled={solved || !canAnswer}
                onClick={() => toggle(index)}
              >
                <b>{String.fromCharCode(65 + index)}</b>
                <span>{t(option)}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn-white-accent check-wide"
            onClick={submit}
            disabled={!chosen.size || solved || !canAnswer}
          >
            {t({ uz: "Tekshirish", ru: 'Проверить', en: 'Check' })}
          </button>
          <FeedbackBlock show={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
}
