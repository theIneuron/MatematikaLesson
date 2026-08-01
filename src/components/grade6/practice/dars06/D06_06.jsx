import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Juftlar EKUKi",
    "ru": "Практика к уроку 6. Наименьшее общее кратное"
  },
  "prompt": {
    "uz": "Sonlar juftini EKUK qiymati bilan bog'lang.",
    "ru": "Соедините пары чисел со значением их НОК."
  },
  "left": [
    "6 va 14",
    "9 va 12",
    "15 va 20"
  ],
  "right": [
    "36",
    "42",
    "60"
  ],
  "pairs": [
    1,
    0,
    2
  ],
  "translationsRu": {
    "6 va 14": "6 и 14",
    "9 va 12": "9 и 12",
    "15 va 20": "15 и 20"
  },
  "explanation": {
    "uz": "EKUK(6,14)=42, EKUK(9,12)=36, EKUK(15,20)=60.",
    "ru": "Все пары найдены правильно. НОК — наименьшее положительное общее кратное."
  }
};

export default function D06_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={6} task={6}/>;
}
