import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ratsional sonlarni ko'paytirish va bo'lish",
    "ru": "Умножение и деление рациональных чисел"
  },
  "prompt": {
    "uz": "−1,5 · 0,8 ko‘paytmani hisoblang.",
    "ru": "Вычислите произведение −1,5 · 0,8."
  },
  "options": [
    "−1,2",
    "1,2",
    "−12",
    "12"
  ],
  "answer": "−1,2",
  "explanation": {
    "uz": "15 · 8 = 120; ikki kasr xonasi ajratiladi va ishora manfiy: −1,2.",
    "ru": "15 · 8 = 120; отделяем два знака после запятой и ставим минус: −1,2."
  }
};

export default function D29_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={29} task={4}/>;
}
