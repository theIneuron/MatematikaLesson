import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Narx proporsiyasi",
    "ru": "Практика к уроку 18. Пропорция",
    "en": "A proportion with prices"
  },
  "prompt": {
    "uz": "4 ta daftar 18 000 so'm turadi. Narx o'zgarmasa, 10 ta daftar qancha turishini proporsiya yordamida toping.",
    "ru": "Четыре тетради стоят 18 000 сумов. Сколько стоят 10 таких тетрадей?",
    "en": "4 notebooks cost 18 000 sum. If the price stays the same, use a proportion to find the cost of 10 notebooks."
  },
  "options": [
    "36 000 so'm",
    "40 000 so'm",
    "45 000 so'm",
    "48 000 so'm"
  ],
  "answer": "45 000 so'm",
  "translationsRu": {
    "36 000 so'm": "36 000 сум",
    "40 000 so'm": "40 000 сум",
    "45 000 so'm": "45 000 сум",
    "48 000 so'm": "48 000 сум"
  },
  "translationsEn": {
    "36 000 so'm": "36 000 sum",
    "40 000 so'm": "40 000 sum",
    "45 000 so'm": "45 000 sum",
    "48 000 so'm": "48 000 sum"
  },
  "explanation": {
    "uz": "Bitta daftar 18 000 : 4 = 4 500 so'm; 10 tasi 45 000 so'm.",
    "ru": "Правильный ответ: 45 000 сум. В пропорции произведение крайних членов равно произведению средних.",
    "en": "One notebook costs 18 000 : 4 = 4 500 sum; and 10 of them cost 45 000 sum."
  }
};

export default function D18_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={18} task={10}/>;
}
