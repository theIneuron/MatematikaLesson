import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "O'q simmetriyasi",
    "ru": "Осевая симметрия",
    "en": "Reflection symmetry"
  },
  "prompt": {
    "uz": "O‘q simmetriyasida nuqta va uning aksi o‘qdan teng masofada bo‘ladi.",
    "ru": "При осевой симметрии точка и её образ равноудалены от оси.",
    "en": "In reflection symmetry a point and its image are the same distance away from the axis."
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
    "uz": "Berilgan fikr mavzuning asosiy qoidasiga to‘liq mos keladi.",
    "ru": "Утверждение полностью соответствует основному правилу темы.",
    "en": "The statement fits the main rule of the topic exactly."
  }
};

export default function D40_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={40} task={5}/>;
}
