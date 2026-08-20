import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "100 ga ko'paytirish",
    "ru": "Практика к уроку 14. Умножение и деление десятичных дробей",
    "en": "Multiplying by 100"
  },
  "prompt": {
    "uz": "6,37 sonini 100 ga ko'paytirganda vergul qaysi tomonga nechta xona siljishini o'ylab, natijani toping.",
    "ru": "Умножьте число 6,37 на 100.",
    "en": "Think which way and how many places the comma moves when 6,37 is multiplied by 100, and find the result."
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
    "ru": "Правильный ответ: 637. При действиях с десятичными дробями важно правильно определить место запятой.",
    "en": "When you multiply by 100 the comma moves two places to the right: 6,37 × 100 = 637."
  }
};

export default function D14_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={14} task={4}/>;
}
