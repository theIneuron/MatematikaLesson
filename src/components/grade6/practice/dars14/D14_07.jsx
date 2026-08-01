import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ikki o'nli kasr ko'paytmasi",
    "ru": "Практика к уроку 14. Умножение и деление десятичных дробей"
  },
  "prompt": {
    "uz": "0,48 × 0,25 ko'paytmani oddiy sonlar kabi hisoblab, vergulni to'g'ri qo'yilgan natijani tanlang.",
    "ru": "Вычислите произведение 0,48 × 0,25."
  },
  "options": [
    "0,012",
    "0,12",
    "1,2",
    "12"
  ],
  "answer": "0,12",
  "explanation": {
    "uz": "48 × 25 = 1200. Jami to'rtta kasr xonasi ajratilsa 0,1200 = 0,12 chiqadi.",
    "ru": "Правильный ответ: 0,12. При действиях с десятичными дробями важно правильно определить место запятой."
  }
};

export default function D14_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={14} task={7}/>;
}
