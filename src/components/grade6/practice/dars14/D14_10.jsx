import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Umumiy massani topish",
    "ru": "Практика к уроку 14. Умножение и деление десятичных дробей"
  },
  "prompt": {
    "uz": "Har biri 1,25 kilogramm bo'lgan 6 ta qopchadagi mahsulotning umumiy massasini hisoblang.",
    "ru": "Каждый из шести пакетов весит 1,25 кг. Найдите общую массу."
  },
  "options": [
    "6,25 kg",
    "7,25 kg",
    "7,5 kg",
    "8,5 kg"
  ],
  "answer": "7,5 kg",
  "translationsRu": {
    "6,25 kg": "6,25 кг",
    "7,25 kg": "7,25 кг",
    "7,5 kg": "7,5 кг",
    "8,5 kg": "8,5 кг"
  },
  "explanation": {
    "uz": "Umumiy massa 1,25 × 6 = 7,50, ya'ni 7,5 kilogramm.",
    "ru": "Правильный ответ: 7,5 кг. При действиях с десятичными дробями важно правильно определить место запятой."
  }
};

export default function D14_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={14} task={10}/>;
}
