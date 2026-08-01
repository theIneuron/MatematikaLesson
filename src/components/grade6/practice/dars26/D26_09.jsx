import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Sonning joylashuvi",
    "ru": "Практика к уроку 26. Сравнение рациональных чисел"
  },
  "prompt": {
    "uz": "Sonlarni koordinata chizig'idagi joylashuv tavsifi bilan moslashtiring.",
    "ru": "Соедините числа с описанием их положения на координатной прямой."
  },
  "left": [
    "−4,2",
    "0",
    "5/3"
  ],
  "right": [
    "Sanoq boshida",
    "Noldan chapda",
    "Noldan o‘ngda"
  ],
  "pairs": [
    1,
    0,
    2
  ],
  "translationsRu": {
    "Sanoq boshida": "В начале отсчёта",
    "Noldan chapda": "Слева от нуля",
    "Noldan o‘ngda": "Справа от нуля"
  },
  "explanation": {
    "uz": "−4,2 noldan chapda, 0 sanoq boshida, 5/3 noldan o'ngda.",
    "ru": "Все пары найдены правильно. Из двух чисел больше то, которое расположено правее на координатной прямой."
  }
};

export default function D26_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={26} task={9}/>;
}
