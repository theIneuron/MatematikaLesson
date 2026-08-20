import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ketma-ket o'sish",
    "ru": "Практика к уроку 22. Задачи на проценты",
    "en": "Two rises in a row"
  },
  "prompt": {
    "uz": "Omonatdagi 800 000 so'm bir yilda 12% ga ko'paydi. Keyingi yili hosil bo'lgan summaga 10% qo'shildi. Yakuniy summani toping.",
    "ru": "Вклад 800 000 сумов вырос на 12%, а затем новая сумма выросла ещё на 10%. Найдите итог.",
    "en": "A deposit of 800 000 sum grew by 12% in one year. The next year the sum it had reached grew by another 10%. Find the final sum."
  },
  "options": [
    "976 000 so'm",
    "980 000 so'm",
    "985 600 so'm",
    "992 000 so'm"
  ],
  "answer": "985 600 so'm",
  "translationsRu": {
    "976 000 so'm": "976 000 сум",
    "980 000 so'm": "980 000 сум",
    "985 600 so'm": "985 600 сум",
    "992 000 so'm": "992 000 сум"
  },
  "translationsEn": {
    "976 000 so'm": "976 000 sum",
    "980 000 so'm": "980 000 sum",
    "985 600 so'm": "985 600 sum",
    "992 000 so'm": "992 000 sum"
  },
  "explanation": {
    "uz": "800 000 × 1,12 × 1,10 = 985 600 so'm.",
    "ru": "Правильный ответ: 985 600 сум. Новое значение находят умножением начального значения на коэффициент изменения.",
    "en": "800 000 × 1,12 × 1,10 = 985 600 sum."
  }
};

export default function D22_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={22} task={10}/>;
}
