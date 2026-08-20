import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Tenglama yordamida masalalar yechish",
    "ru": "Решение задач с помощью уравнений",
    "en": "Solving problems with equations"
  },
  "prompt": {
    "uz": "Ota o‘g‘lidan 24 yosh katta. Ularning yoshlari yig‘indisi 54. O‘g‘il yoshini toping.",
    "ru": "Отец старше сына на 24 года, сумма их возрастов 54. Найдите возраст сына.",
    "en": "A father is 24 years older than his son. Their ages add up to 54. Find the age of the son."
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
    "ru": "После последовательного применения правила темы к данным условия получается 15.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 15."
  }
};

export default function D35_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={35} task={7}/>;
}
