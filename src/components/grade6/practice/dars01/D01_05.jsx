import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Karralilikni tekshirish",
    "ru": "Практика к уроку 1. Делители и кратные",
    "en": "Checking multiples"
  },
  "prompt": {
    "uz": "54 soni 6 ga karrali.",
    "ru": "Верно ли, что число 54 кратно 6?",
    "en": "54 is a multiple of 6."
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
    "uz": "54 : 6 = 9 va qoldiq yo'q, shuning uchun fikr to'g'ri.",
    "ru": "Правильный ответ: Да. Делитель делит число без остатка, а кратное получается умножением на натуральное число.",
    "en": "54 : 6 = 9 with no remainder, so the statement is true."
  }
};

export default function D01_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={1} task={5}/>;
}
