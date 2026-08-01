import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ratsional sonlarni qo'shish",
    "ru": "Сложение рациональных чисел"
  },
  "prompt": {
    "uz": "Hisob raqamida −125 ming so‘m qarz bor edi, unga 80 ming so‘m tushdi. Yangi holatni toping.",
    "ru": "На счёте был долг 125 тысяч сумов, затем поступило 80 тысяч. Найдите новое состояние счёта."
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
  "explanation": {
    "uz": "−125 + 80 = −45. Hisobda 45 ming so‘m qarz qoladi.",
    "ru": "−125 + 80 = −45. На счёте остаётся долг 45 тысяч сумов."
  }
};

export default function D27_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={27} task={10}/>;
}
