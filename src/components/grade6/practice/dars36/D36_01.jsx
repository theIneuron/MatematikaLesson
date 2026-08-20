import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Iqtisodiy va ishga oid masalalar",
    "ru": "Экономические задачи и задачи на работу",
    "en": "Money problems and work problems"
  },
  "prompt": {
    "uz": "Bir dona ruchka 4 500 so‘m. 8 ta ruchkaning narxini toping.",
    "ru": "Одна ручка стоит 4 500 сумов. Найдите стоимость 8 ручек.",
    "en": "One pen costs 4 500 sum. Find the cost of 8 pens."
  },
  "options": [
    "32 000",
    "34 000",
    "36 000",
    "40 000"
  ],
  "answer": "36 000",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 36 000 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 36 000.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 36 000."
  }
};

export default function D36_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={36} task={1}/>;
}
