import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Yig'indini hisoblash",
    "ru": "Практика к уроку 10. Сложение и вычитание дробей",
    "en": "Working out a sum"
  },
  "prompt": {
    "uz": "5/12 + 7/18 yig'indini hisoblang.",
    "ru": "Вычислите сумму 5/12 + 7/18.",
    "en": "Work out the sum 5/12 + 7/18."
  },
  "options": [
    "12/30",
    "29/36",
    "31/36",
    "35/36"
  ],
  "answer": "29/36",
  "explanation": {
    "uz": "5/12=15/36 va 7/18=14/36; yig'indi 29/36.",
    "ru": "Правильный ответ: 29/36. Сначала дроби приводят к общему знаменателю, затем выполняют действие с числителями.",
    "en": "5/12 = 15/36 and 7/18 = 14/36; the sum is 29/36."
  }
};

export default function D10_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={10} task={4}/>;
}
