import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Amallarni moslashtirish",
    "ru": "Практика к уроку 10. Сложение и вычитание дробей"
  },
  "prompt": {
    "uz": "Amallarni to'g'ri javoblari bilan bog'lang.",
    "ru": "Соедините действия с правильными ответами."
  },
  "left": [
    "7/9 − 1/6",
    "3/10 + 5/12",
    "11/15 − 2/9"
  ],
  "right": [
    "11/18",
    "43/60",
    "23/45"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Natijalar: 11/18, 43/60 va 23/45.",
    "ru": "Все пары найдены правильно. Сначала дроби приводят к общему знаменателю, затем выполняют действие с числителями."
  }
};

export default function D10_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={10} task={6}/>;
}
