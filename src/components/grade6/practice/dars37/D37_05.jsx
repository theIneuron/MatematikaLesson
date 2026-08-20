import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Aylana va doira",
    "ru": "Окружность и круг",
    "en": "The circle and the disc"
  },
  "prompt": {
    "uz": "Diametr markazdan o‘tadigan vatardir.",
    "ru": "Диаметр — хорда, проходящая через центр.",
    "en": "A diameter is a chord that goes through the centre."
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

export default function D37_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={37} task={5}/>;
}
