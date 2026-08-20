import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Juftlar EKUBi",
    "ru": "Практика к уроку 5. Наибольший общий делитель",
    "en": "The GCD of a pair"
  },
  "prompt": {
    "uz": "Sonlar juftini EKUB qiymati bilan bog'lang.",
    "ru": "Соедините пары чисел со значением их НОД.",
    "en": "Connect each pair of numbers with the value of their GCD."
  },
  "left": [
    "24 va 36",
    "28 va 42",
    "45 va 60"
  ],
  "right": [
    "12",
    "14",
    "15"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "24 va 36": "24 и 36",
    "28 va 42": "28 и 42",
    "45 va 60": "45 и 60"
  },
  "translationsEn": {
    "24 va 36": "24 and 36",
    "28 va 42": "28 and 42",
    "45 va 60": "45 and 60"
  },
  "explanation": {
    "uz": "EKUB(24,36)=12, EKUB(28,42)=14, EKUB(45,60)=15.",
    "ru": "Все пары найдены правильно. НОД — наибольший из общих делителей.",
    "en": "GCD(24, 36) = 12, GCD(28, 42) = 14, GCD(45, 60) = 15."
  }
};

export default function D05_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={5} task={6}/>;
}
