import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Chegirmali narx",
    "ru": "Практика к уроку 22. Задачи на проценты",
    "en": "A price with a discount"
  },
  "prompt": {
    "uz": "Narxi 180 000 so'm bo'lgan poyabzalga 20% chegirma berildi. Chegirmadan keyingi narxni toping.",
    "ru": "Обувь стоила 180 000 сумов. После скидки 20% найдите новую цену.",
    "en": "A pair of shoes that cost 180 000 sum was given a 20% discount. Find the price after the discount."
  },
  "options": [
    "126 000 so'm",
    "138 000 so'm",
    "144 000 so'm",
    "160 000 so'm"
  ],
  "answer": "144 000 so'm",
  "translationsRu": {
    "126 000 so'm": "126 000 сум",
    "138 000 so'm": "138 000 сум",
    "144 000 so'm": "144 000 сум",
    "160 000 so'm": "160 000 сум"
  },
  "translationsEn": {
    "126 000 so'm": "126 000 sum",
    "138 000 so'm": "138 000 sum",
    "144 000 so'm": "144 000 sum",
    "160 000 so'm": "160 000 sum"
  },
  "explanation": {
    "uz": "Chegirma 180 000 × 20% = 36 000; yangi narx 144 000 so'm.",
    "ru": "Правильный ответ: 144 000 сум. Новое значение находят умножением начального значения на коэффициент изменения.",
    "en": "The discount is 180 000 × 20% = 36 000; the new price is 144 000 sum."
  }
};

export default function D22_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={22} task={1}/>;
}
