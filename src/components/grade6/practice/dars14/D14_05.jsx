import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "100 ga bo'lish",
    "ru": "Практика к уроку 14. Умножение и деление десятичных дробей"
  },
  "prompt": {
    "uz": "8,4 : 100 amalining natijasi 0,084 ga teng, degan fikrni vergulni siljitish qoidasi bilan tekshiring.",
    "ru": "Верно ли, что 8,4 : 100 = 0,084?"
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
  "explanation": {
    "uz": "100 ga bo'lganda vergul ikki xona chapga siljiydi: 8,4 : 100 = 0,084.",
    "ru": "Правильный ответ: Да. При действиях с десятичными дробями важно правильно определить место запятой."
  }
};

export default function D14_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={14} task={5}/>;
}
