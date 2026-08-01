import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "O'nli kasrlar ko'paytmasi",
    "ru": "Практика к уроку 14. Умножение и деление десятичных дробей"
  },
  "prompt": {
    "uz": "2,4 × 3,5 ko'paytmani hisoblang. Verguldan keyingi raqamlar sonini to'g'ri aniqlab, natijani tanlang.",
    "ru": "Вычислите произведение 2,4 × 3,5 и правильно поставьте запятую."
  },
  "options": [
    "7,4",
    "8,4",
    "8,9",
    "84"
  ],
  "answer": "8,4",
  "explanation": {
    "uz": "24 × 35 = 840. Ko'paytuvchilarda jami ikki kasr xonasi bor, shuning uchun natija 8,40 = 8,4.",
    "ru": "Правильный ответ: 8,4. При действиях с десятичными дробями важно правильно определить место запятой."
  }
};

export default function D14_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={14} task={1}/>;
}
