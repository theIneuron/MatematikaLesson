import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "EKUK qiymatlari",
    "ru": "Практика к уроку 6. Наименьшее общее кратное",
    "en": "Values of the LCM"
  },
  "prompt": {
    "uz": "Har bir sonlar juftining eng kichik umumiy karralisini hisoblang va EKUK ifodasini mos qiymat bilan bog'lang.",
    "ru": "Вычислите НОК каждой пары и соедините выражение с ответом.",
    "en": "Work out the least common multiple of each pair of numbers and connect the LCM expression with the value that fits it."
  },
  "left": [
    "EKUK(3, 5)",
    "EKUK(4, 10)",
    "EKUK(6, 9)"
  ],
  "right": [
    "15",
    "18",
    "20"
  ],
  "pairs": [
    0,
    2,
    1
  ],
  "translationsRu": {
    "EKUK(3, 5)": "НОК(3, 5)",
    "EKUK(4, 10)": "НОК(4, 10)",
    "EKUK(6, 9)": "НОК(6, 9)"
  },
  "translationsEn": {
    "EKUK(3, 5)": "LCM(3, 5)",
    "EKUK(4, 10)": "LCM(4, 10)",
    "EKUK(6, 9)": "LCM(6, 9)"
  },
  "explanation": {
    "uz": "EKUK(3,5)=15, EKUK(4,10)=20, EKUK(6,9)=18.",
    "ru": "Все пары найдены правильно. НОК — наименьшее положительное общее кратное.",
    "en": "LCM(3, 5) = 15, LCM(4, 10) = 20, LCM(6, 9) = 18."
  }
};

export default function D06_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={6} task={3}/>;
}
