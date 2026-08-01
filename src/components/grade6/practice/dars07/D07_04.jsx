import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kasrni uch marta kengaytirish",
    "ru": "Практика к уроку 7. Основное свойство дроби"
  },
  "prompt": {
    "uz": "5/8 kasrini 3 marta kengaytirganda hosil bo'ladigan kasrni toping.",
    "ru": "Расширьте дробь 5/8 в 3 раза и выберите результат."
  },
  "options": [
    "8/11",
    "10/16",
    "15/24",
    "15/8"
  ],
  "answer": "15/24",
  "explanation": {
    "uz": "5 × 3 = 15 va 8 × 3 = 24, shuning uchun 5/8 = 15/24.",
    "ru": "Правильный ответ: 15/24. При умножении или делении числителя и знаменателя на одно число значение дроби не меняется."
  }
};

export default function D07_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={7} task={4}/>;
}
