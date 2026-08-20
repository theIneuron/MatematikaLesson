import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Tenglama yordamida masalalar yechish",
    "ru": "Решение задач с помощью уравнений",
    "en": "Solving problems with equations"
  },
  "prompt": {
    "uz": "Bir sonning yarmi 18 bo‘lsa, bu son 36 ga teng.",
    "ru": "Если половина числа равна 18, то число равно 36.",
    "en": "If half of a number is 18, then the number is equal to 36."
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

export default function D35_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={35} task={5}/>;
}
