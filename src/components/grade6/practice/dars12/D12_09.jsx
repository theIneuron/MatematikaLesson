import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Butun sonli bo'lish",
    "ru": "Практика к уроку 12. Деление обыкновенных дробей",
    "en": "Division with a whole number"
  },
  "prompt": {
    "uz": "Har bir butun son va kasr ishtirokidagi bo'lish amalini uning to'g'ri natijasi bilan juftlang.",
    "ru": "Соедините действия с целым числом и дробью с результатами.",
    "en": "Pair each division with a whole number and a fraction in it with its correct result."
  },
  "left": [
    "6 : 9/10",
    "5/12 : 5",
    "7/8 : 14"
  ],
  "right": [
    "1/16",
    "1/12",
    "20/3"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "explanation": {
    "uz": "6 : 9/10 = 20/3, 5/12 : 5 = 1/12, 7/8 : 14 = 1/16.",
    "ru": "Все пары найдены правильно. Деление на дробь заменяют умножением на обратную дробь.",
    "en": "6 : 9/10 = 20/3, 5/12 : 5 = 1/12, 7/8 : 14 = 1/16."
  }
};

export default function D12_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={12} task={9}/>;
}
