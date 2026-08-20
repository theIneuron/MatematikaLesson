import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "O'xshash hadlarni ixchamlash",
    "ru": "Приведение подобных слагаемых",
    "en": "Collecting like terms"
  },
  "prompt": {
    "uz": "5a va −2a o‘xshash hadlar hisoblanadi.",
    "ru": "Слагаемые 5a и −2a являются подобными.",
    "en": "5a and −2a are like terms."
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

export default function D33_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={33} task={5}/>;
}
