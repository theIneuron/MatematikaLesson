import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ifoda qiymati",
    "ru": "Практика к уроку 25. Модуль числа"
  },
  "prompt": {
    "uz": "|−12| − |7| + |−2| ifodaning qiymatini amallar tartibida hisoblang.",
    "ru": "Вычислите |−12| − |7| + |−2|."
  },
  "options": [
    "3",
    "5",
    "7",
    "21"
  ],
  "answer": "7",
  "explanation": {
    "uz": "12 − 7 + 2 = 7.",
    "ru": "Правильный ответ: 7. Модуль числа — его расстояние от нуля, поэтому модуль не бывает отрицательным."
  }
};

export default function D25_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={25} task={7}/>;
}
