import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Aylana va doira",
    "ru": "Окружность и круг"
  },
  "prompt": {
    "uz": "Diametr markazdan o‘tadigan vatardir.",
    "ru": "Диаметр — хорда, проходящая через центр."
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

export default function D37_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={37} task={5}/>;
}
