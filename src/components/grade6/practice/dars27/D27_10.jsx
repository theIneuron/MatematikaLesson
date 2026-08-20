import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ratsional sonlarni qo'shish",
    "ru": "Сложение рациональных чисел",
    "en": "Adding rational numbers"
  },
  "prompt": {
    "uz": "Hisob raqamida −125 ming so‘m qarz bor edi, unga 80 ming so‘m tushdi. Yangi holatni toping.",
    "ru": "На счёте был долг 125 тысяч сумов, затем поступило 80 тысяч. Найдите новое состояние счёта.",
    "en": "An account had a debt of 125 thousand sum, and then 80 thousand sum came in. Find the new state of the account."
  },
  "options": [
    "−205 ming",
    "−45 ming",
    "45 ming",
    "205 ming"
  ],
  "answer": "−45 ming",
  "translationsRu": {
    "−205 ming": "−205 тыс.",
    "−45 ming": "−45 тыс.",
    "45 ming": "45 тыс.",
    "205 ming": "205 тыс."
  },
  "translationsEn": {
    "−205 ming": "−205 thousand",
    "−45 ming": "−45 thousand",
    "45 ming": "45 thousand",
    "205 ming": "205 thousand"
  },
  "explanation": {
    "uz": "−125 + 80 = −45. Hisobda 45 ming so‘m qarz qoladi.",
    "ru": "−125 + 80 = −45. На счёте остаётся долг 45 тысяч сумов.",
    "en": "−125 + 80 = −45. A debt of 45 thousand sum is left on the account."
  }
};

export default function D27_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={27} task={10}/>;
}
