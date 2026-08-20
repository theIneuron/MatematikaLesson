import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Ma'lumotlar bilan ishlash",
    "ru": "Работа с данными",
    "en": "Working with data"
  },
  "prompt": {
    "uz": "Ma’lumotlar qatorining kengligi eng katta va eng kichik qiymatlar ayirmasiga teng.",
    "ru": "Размах ряда данных равен разности наибольшего и наименьшего значений.",
    "en": "The range of a set of data is equal to the difference between the largest and the smallest value."
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

export default function D45_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={45} task={5}/>;
}
