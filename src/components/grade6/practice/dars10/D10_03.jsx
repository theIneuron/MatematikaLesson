import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Amal va natija",
    "ru": "Практика к уроку 10. Сложение и вычитание дробей",
    "en": "An operation and its result"
  },
  "prompt": {
    "uz": "Har bir amalni uning natijasi bilan moslashtiring.",
    "ru": "Соедините каждое действие с его результатом.",
    "en": "Match each operation with its result."
  },
  "left": [
    "1/2 + 1/5",
    "5/6 − 1/3",
    "3/8 + 1/4"
  ],
  "right": [
    "7/10",
    "1/2",
    "5/8"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "1/2+1/5=7/10, 5/6−1/3=1/2, 3/8+1/4=5/8.",
    "ru": "Все пары найдены правильно. Сначала дроби приводят к общему знаменателю, затем выполняют действие с числителями.",
    "en": "1/2 + 1/5 = 7/10, 5/6 − 1/3 = 1/2, 3/8 + 1/4 = 5/8."
  }
};

export default function D10_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={10} task={3}/>;
}
