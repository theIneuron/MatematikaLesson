// Dars 1 (3-sinf) · Amaliyot 10 — yakuniy mustaqil mashq.
// Maqsad: 10 yuzlik = 1000 bog'lanishini yangi vaziyatda sonli javob bilan tekshirish.
import { createPracticeQuestion } from '../QuestionFactory.jsx';

const SPEC = {
  id: '10',
  label: 'Yakuniy mashq',
  level: '🔴',
  tag: 'd01-thousand-transfer',
  type: 'input',
  emoji: '✍️',
  hideModel: true,
  correct: ['1000', '1 000'],
  inputMode: 'numeric',
  text: {
    uz: {
      eyebrow: 'Yakuniy mashq',
      setup: "Bitda 9 ta yuzlik panel bor edi. U yana 100 ta birlik olib keldi.",
      ask: "9 yuzlik va 100 birlik jami nechta birlik bo'ladi?",
      correct: "To'g'ri! 9 yuzlik — 900 birlik. 900 + 100 = 1000 birlik.",
      wrong: "Maslahat: avval 9 yuzlikni birliklarda yozing, keyin 100 ni qo'shing.",
      rule: "10 yuzlik = 1000 birlik = 1 minglik.",
      visual: '9 yuzlik + 100 birlik = ?',
      placeholder: 'Javob',
    },
    ru: {
      eyebrow: 'Итоговое задание',
      setup: 'У Бита было 9 сотенных панелей. Он принёс ещё 100 единиц.',
      ask: 'Сколько всего единиц составляют 9 сотен и 100 единиц?',
      correct: 'Верно! 9 сотен — это 900 единиц. 900 + 100 = 1000 единиц.',
      wrong: 'Подсказка: сначала запиши 9 сотен в единицах, затем прибавь 100.',
      rule: '10 сотен = 1000 единиц = 1 тысяча.',
      visual: '9 сотен + 100 единиц = ?',
      placeholder: 'Ответ',
    },
  },
};

export default createPracticeQuestion(SPEC);
