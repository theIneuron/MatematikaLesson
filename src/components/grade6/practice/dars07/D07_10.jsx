import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kasrni to'liq qisqartirish",
    "ru": "Практика к уроку 7. Основное свойство дроби"
  },
  "prompt": {
    "uz": "35/49 kasrini eng sodda ko'rinishgacha qisqartiring.",
    "ru": "Сократите дробь 35/49 до несократимого вида."
  },
  "options": [
    "5/7",
    "7/9",
    "10/21",
    "30/49"
  ],
  "answer": "5/7",
  "explanation": {
    "uz": "35 va 49 ni 7 ga bo'lamiz: 35/49 = 5/7.",
    "ru": "Правильный ответ: 5/7. При умножении или делении числителя и знаменателя на одно число значение дроби не меняется."
  }
};

export default function D07_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={7} task={10}/>;
}
