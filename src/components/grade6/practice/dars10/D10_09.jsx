import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Murakkabroq amallar",
    "ru": "Практика к уроку 10. Сложение и вычитание дробей"
  },
  "prompt": {
    "uz": "Har bir ifodani uning qisqarmas natijasi bilan moslashtiring.",
    "ru": "Соедините каждое выражение с его несократимым результатом."
  },
  "left": [
    "1/6 + 5/9",
    "7/8 − 3/10",
    "4/15 + 7/12"
  ],
  "right": [
    "13/18",
    "23/40",
    "17/20"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Umumiy maxrajga keltirib hisoblasak 13/18, 23/40 va 17/20 chiqadi.",
    "ru": "Все пары найдены правильно. Сначала дроби приводят к общему знаменателю, затем выполняют действие с числителями."
  }
};

export default function D10_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={10} task={9}/>;
}
