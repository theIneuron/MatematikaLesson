import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Proporsiyani tekshirish",
    "ru": "Практика к уроку 18. Пропорция"
  },
  "prompt": {
    "uz": "Har bir nisbatlar tengligini uning holati bilan moslashtiring.",
    "ru": "Соедините каждое равенство отношений с верным описанием."
  },
  "left": [
    "6 : 9 = 10 : 15",
    "4 : 7 = 12 : 20",
    "5 : 12 = 15 : 36"
  ],
  "right": [
    "Proporsiya emas",
    "30 : 45 ga teng",
    "Proporsiya"
  ],
  "pairs": [
    1,
    0,
    2
  ],
  "translationsRu": {
    "Proporsiya emas": "Не пропорция",
    "30 : 45 ga teng": "Равно отношению 30 : 45",
    "Proporsiya": "Пропорция"
  },
  "explanation": {
    "uz": "6 : 9 = 10 : 15 va 5 : 12 = 15 : 36 — proporsiya; 4 : 7 = 12 : 20 emas.",
    "ru": "Все пары найдены правильно. В пропорции произведение крайних членов равно произведению средних."
  }
};

export default function D18_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={18} task={9}/>;
}
