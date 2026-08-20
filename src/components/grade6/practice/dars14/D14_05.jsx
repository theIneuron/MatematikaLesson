import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "100 ga bo'lish",
    "ru": "Практика к уроку 14. Умножение и деление десятичных дробей",
    "en": "Dividing by 100"
  },
  "prompt": {
    "uz": "8,4 : 100 amalining natijasi 0,084 ga teng, degan fikrni vergulni siljitish qoidasi bilan tekshiring.",
    "ru": "Верно ли, что 8,4 : 100 = 0,084?",
    "en": "Use the rule for moving the comma to check the statement that 8,4 : 100 = 0,084."
  },
  "options": [
    "Ha",
    "Yo'q"
  ],
  "answer": "Ha",
  "translationsRu": {
    "Ha": "Да",
    "Yo'q": "Нет"
  },
  "translationsEn": {
    "Ha": "Yes",
    "Yo'q": "No"
  },
  "explanation": {
    "uz": "100 ga bo'lganda vergul ikki xona chapga siljiydi: 8,4 : 100 = 0,084.",
    "ru": "Правильный ответ: Да. При действиях с десятичными дробями важно правильно определить место запятой.",
    "en": "When you divide by 100 the comma moves two places to the left: 8,4 : 100 = 0,084."
  }
};

export default function D14_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={14} task={5}/>;
}
