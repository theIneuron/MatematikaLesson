import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Tenglama yordamida masalalar yechish",
    "ru": "Решение задач с помощью уравнений",
    "en": "Solving problems with equations"
  },
  "prompt": {
    "uz": "Bir songa 12 qo‘shilganda 31 hosil bo‘ldi. Shu sonni toping.",
    "ru": "К числу прибавили 12 и получили 31. Найдите число.",
    "en": "12 was added to a number and 31 came out. Find that number."
  },
  "options": [
    "17",
    "19",
    "21",
    "43"
  ],
  "answer": "19",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 19 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 19.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 19."
  }
};

export default function D35_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={35} task={1}/>;
}
