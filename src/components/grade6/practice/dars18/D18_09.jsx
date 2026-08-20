import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Proporsiyani tekshirish",
    "ru": "Практика к уроку 18. Пропорция",
    "en": "Checking a proportion"
  },
  "prompt": {
    "uz": "Har bir nisbatlar tengligini uning holati bilan moslashtiring.",
    "ru": "Соедините каждое равенство отношений с верным описанием.",
    "en": "Match each equality of ratios with the description that fits it."
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
  "translationsEn": {
    "Proporsiya emas": "Not a proportion",
    "30 : 45 ga teng": "Equal to 30 : 45",
    "Proporsiya": "A proportion"
  },
  "explanation": {
    "uz": "6 : 9 = 10 : 15 va 5 : 12 = 15 : 36 — proporsiya; 4 : 7 = 12 : 20 emas.",
    "ru": "Все пары найдены правильно. В пропорции произведение крайних членов равно произведению средних.",
    "en": "6 : 9 = 10 : 15 and 5 : 12 = 15 : 36 are proportions; 4 : 7 = 12 : 20 is not."
  }
};

export default function D18_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={18} task={9}/>;
}
