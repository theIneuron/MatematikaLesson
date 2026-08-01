import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Oldindan qisqartirish",
    "ru": "Практика к уроку 12. Деление обыкновенных дробей"
  },
  "prompt": {
    "uz": "11/18 : 22/27 ifodada ikkinchi kasrni teskarisiga aylantiring, sonlarni qisqartiring va natijani toping.",
    "ru": "Вычислите 11/18 : 22/27."
  },
  "options": [
    "3/4",
    "4/3",
    "11/15",
    "33/40"
  ],
  "answer": "3/4",
  "explanation": {
    "uz": "11/18 : 22/27 = 11/18 × 27/22 = 3/4.",
    "ru": "Правильный ответ: 3/4. Деление на дробь заменяют умножением на обратную дробь."
  }
};

export default function D12_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={12} task={7}/>;
}
