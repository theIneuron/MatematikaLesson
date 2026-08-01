import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Qavslarni ochish",
    "ru": "Раскрытие скобок"
  },
  "prompt": {
    "uz": "6(a − 2) = 6a − 12 tenglik to‘g‘ri.",
    "ru": "Равенство 6(a − 2) = 6a − 12 верно."
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

export default function D32_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={32} task={5}/>;
}
