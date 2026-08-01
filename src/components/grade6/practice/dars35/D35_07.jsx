import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Tenglama yordamida masalalar yechish",
    "ru": "Решение задач с помощью уравнений"
  },
  "prompt": {
    "uz": "Ota o‘g‘lidan 24 yosh katta. Ularning yoshlari yig‘indisi 54. O‘g‘il yoshini toping.",
    "ru": "Отец старше сына на 24 года, сумма их возрастов 54. Найдите возраст сына."
  },
  "options": [
    "12",
    "15",
    "18",
    "30"
  ],
  "answer": "15",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 15 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 15."
  }
};

export default function D35_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={35} task={7}/>;
}
