import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Iqtisodiy va ishga oid masalalar",
    "ru": "Экономические задачи и задачи на работу"
  },
  "prompt": {
    "uz": "Mahsulot 250 mingga olinib, 290 mingga sotildi. Foydani toping.",
    "ru": "Товар купили за 250 тысяч и продали за 290 тысяч. Найдите прибыль."
  },
  "options": [
    "30 ming",
    "40 ming",
    "50 ming",
    "540 ming"
  ],
  "answer": "40 ming",
  "translationsRu": {
    "30 ming": "30 тыс.",
    "40 ming": "40 тыс.",
    "50 ming": "50 тыс.",
    "540 ming": "540 тыс."
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 40 ming hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 40 ming."
  }
};

export default function D36_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={36} task={7}/>;
}
