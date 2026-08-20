import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ikki chegirma",
    "ru": "Практика к уроку 22. Задачи на проценты",
    "en": "Two discounts"
  },
  "prompt": {
    "uz": "Telefon narxi 1 200 000 so'm edi. Avval 10% chegirma, so'ng chegirmali narxdan yana 5% chegirma berildi. Yakuniy narxni toping.",
    "ru": "Телефон стоил 1 200 000 сумов. Сначала дали скидку 10%, затем ещё 5% от новой цены. Найдите итоговую цену.",
    "en": "A phone cost 1 200 000 sum. First it was given a 10% discount, then another 5% off the discounted price. Find the final price."
  },
  "options": [
    "1 020 000 so'm",
    "1 026 000 so'm",
    "1 030 000 so'm",
    "1 080 000 so'm"
  ],
  "answer": "1 026 000 so'm",
  "translationsRu": {
    "1 020 000 so'm": "1 020 000 сум",
    "1 026 000 so'm": "1 026 000 сум",
    "1 030 000 so'm": "1 030 000 сум",
    "1 080 000 so'm": "1 080 000 сум"
  },
  "translationsEn": {
    "1 020 000 so'm": "1 020 000 sum",
    "1 026 000 so'm": "1 026 000 sum",
    "1 030 000 so'm": "1 030 000 sum",
    "1 080 000 so'm": "1 080 000 sum"
  },
  "explanation": {
    "uz": "1 200 000 × 0,90 × 0,95 = 1 026 000 so'm.",
    "ru": "Правильный ответ: 1 026 000 сум. Новое значение находят умножением начального значения на коэффициент изменения.",
    "en": "1 200 000 × 0,90 × 0,95 = 1 026 000 sum."
  }
};

export default function D22_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={22} task={7}/>;
}
