import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Harfli ifodalar",
    "ru": "Буквенные выражения",
    "en": "Expressions with letters"
  },
  "prompt": {
    "uz": "7y ifodada 7 soni koeffitsiyent hisoblanadi.",
    "ru": "В выражении 7y число 7 является коэффициентом.",
    "en": "In the expression 7y the number 7 is the coefficient."
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

export default function D31_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={31} task={5}/>;
}
