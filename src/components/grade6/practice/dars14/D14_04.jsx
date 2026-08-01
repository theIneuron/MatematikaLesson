import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "100 ga ko'paytirish",
    "ru": "Практика к уроку 14. Умножение и деление десятичных дробей"
  },
  "prompt": {
    "uz": "6,37 sonini 100 ga ko'paytirganda vergul qaysi tomonga nechta xona siljishini o'ylab, natijani toping.",
    "ru": "Умножьте число 6,37 на 100."
  },
  "options": [
    "0,0637",
    "63,7",
    "637",
    "6370"
  ],
  "answer": "637",
  "explanation": {
    "uz": "100 ga ko'paytirganda vergul ikki xona o'ngga siljiydi: 6,37 × 100 = 637.",
    "ru": "Правильный ответ: 637. При действиях с десятичными дробями важно правильно определить место запятой."
  }
};

export default function D14_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={14} task={4}/>;
}
