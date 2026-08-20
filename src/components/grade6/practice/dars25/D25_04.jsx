import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Nuqtalar masofasi",
    "ru": "Практика к уроку 25. Модуль числа",
    "en": "The distance between points"
  },
  "prompt": {
    "uz": "A(−6) va B(5) nuqtalari orasidagi masofani modul yordamida hisoblang.",
    "ru": "Найдите расстояние между точками A(−6) и B(5).",
    "en": "Use the modulus to work out the distance between the points A(−6) and B(5)."
  },
  "options": [
    "1 birlik",
    "6 birlik",
    "10 birlik",
    "11 birlik"
  ],
  "answer": "11 birlik",
  "translationsRu": {
    "1 birlik": "1 единица",
    "6 birlik": "6 единиц",
    "10 birlik": "10 единиц",
    "11 birlik": "11 единиц"
  },
  "translationsEn": {
    "1 birlik": "1 unit",
    "6 birlik": "6 units",
    "10 birlik": "10 units",
    "11 birlik": "11 units"
  },
  "explanation": {
    "uz": "Masofa |5 − (−6)| = 11 birlik.",
    "ru": "Правильный ответ: 11 единиц. Модуль числа — его расстояние от нуля, поэтому модуль не бывает отрицательным.",
    "en": "The distance is |5 − (−6)| = 11 units."
  }
};

export default function D25_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={25} task={4}/>;
}
