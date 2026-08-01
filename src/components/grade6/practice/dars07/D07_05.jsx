import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Tenglikni tekshirish",
    "ru": "Практика к уроку 7. Основное свойство дроби"
  },
  "prompt": {
    "uz": "7/9 va 21/27 kasrlari o'zaro teng.",
    "ru": "Верно ли, что дроби 7/9 и 21/27 равны?"
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
    "uz": "7 va 9 ni 3 ga ko'paytirsak 21 va 27 chiqadi; kasrlar teng.",
    "ru": "Правильный ответ: Да. При умножении или делении числителя и знаменателя на одно число значение дроби не меняется."
  }
};

export default function D07_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={7} task={5}/>;
}
