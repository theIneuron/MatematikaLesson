import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Juftlar EKUKi",
    "ru": "Практика к уроку 6. Наименьшее общее кратное",
    "en": "The LCM of a pair"
  },
  "prompt": {
    "uz": "Sonlar juftini EKUK qiymati bilan bog'lang.",
    "ru": "Соедините пары чисел со значением их НОК.",
    "en": "Connect each pair of numbers with the value of their LCM."
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
  "translationsEn": {
    "6 va 14": "6 and 14",
    "9 va 12": "9 and 12",
    "15 va 20": "15 and 20"
  },
  "explanation": {
    "uz": "EKUK(6,14)=42, EKUK(9,12)=36, EKUK(15,20)=60.",
    "ru": "Все пары найдены правильно. НОК — наименьшее положительное общее кратное.",
    "en": "LCM(6, 14) = 42, LCM(9, 12) = 36, LCM(15, 20) = 60."
  }
};

export default function D06_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={6} task={6}/>;
}
