import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kamayish tartibi",
    "ru": "Практика к уроку 26. Сравнение рациональных чисел"
  },
  "prompt": {
    "uz": "−1,25; 2/3; −4/5; 0,6 sonlarini kamayish tartibida joylashtirilgan qatorni toping.",
    "ru": "Выберите строку, где числа −1,25; 2/3; −4/5; 0,6 расположены по убыванию."
  },
  "options": [
    "2/3; 0,6; −4/5; −1,25",
    "0,6; 2/3; −1,25; −4/5",
    "2/3; 0,6; −1,25; −4/5",
    "−1,25; −4/5; 0,6; 2/3"
  ],
  "answer": "2/3; 0,6; −4/5; −1,25",
  "explanation": {
    "uz": "2/3 ≈ 0,667 > 0,6 > −0,8 > −1,25.",
    "ru": "Правильный ответ: 2/3; 0,6; −4/5; −1,25. Из двух чисел больше то, которое расположено правее на координатной прямой."
  }
};

export default function D26_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={26} task={10}/>;
}
