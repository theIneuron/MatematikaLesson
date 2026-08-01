import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Tenglama yordamida masalalar yechish",
    "ru": "Решение задач с помощью уравнений"
  },
  "prompt": {
    "uz": "Bir sonning yarmi 18 bo‘lsa, bu son 36 ga teng.",
    "ru": "Если половина числа равна 18, то число равно 36."
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

export default function D35_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={35} task={5}/>;
}
