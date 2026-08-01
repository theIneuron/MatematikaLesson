import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "O'q simmetriyasi",
    "ru": "Осевая симметрия"
  },
  "prompt": {
    "uz": "O‘q simmetriyasida nuqta va uning aksi o‘qdan teng masofada bo‘ladi.",
    "ru": "При осевой симметрии точка и её образ равноудалены от оси."
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
    "uz": "Berilgan fikr mavzuning asosiy qoidasiga to‘liq mos keladi.",
    "ru": "Утверждение полностью соответствует основному правилу темы."
  }
};

export default function D40_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={40} task={5}/>;
}
