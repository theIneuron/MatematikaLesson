import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Qisqartirib ko'paytirish",
    "ru": "Практика к уроку 11. Умножение обыкновенных дробей"
  },
  "prompt": {
    "uz": "Ko'paytirishdan oldin qisqartiriladigan sonlar juftini shu amalning qisqarmas natijasi bilan moslashtiring.",
    "ru": "Соедините каждое произведение с его несократимым результатом."
  },
  "left": [
    "4/15 × 9/14",
    "14/25 × 5/21",
    "9/16 × 4/27"
  ],
  "right": [
    "1/12",
    "2/15",
    "6/35"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "explanation": {
    "uz": "4/15 × 9/14 = 6/35, 14/25 × 5/21 = 2/15, 9/16 × 4/27 = 1/12.",
    "ru": "Все пары найдены правильно. При умножении дробей перемножают числители и знаменатели, а результат сокращают."
  }
};

export default function D11_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={11} task={9}/>;
}
