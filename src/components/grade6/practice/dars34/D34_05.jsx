import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Chiziqli tenglamalar",
    "ru": "Линейные уравнения",
    "en": "Linear equations"
  },
  "prompt": {
    "uz": "x = 4 soni 2x + 1 = 9 tenglamaning ildizi.",
    "ru": "Число x = 4 является корнем уравнения 2x + 1 = 9.",
    "en": "The number x = 4 is a root of the equation 2x + 1 = 9."
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

export default function D34_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={34} task={5}/>;
}
