import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "O'sish tartibi",
    "ru": "Практика к уроку 26. Сравнение рациональных чисел"
  },
  "prompt": {
    "uz": "Quyidagi sonlar qatoridan o'sish tartibida to'g'ri joylashtirilganini toping.",
    "ru": "Какая строка правильно упорядочена по возрастанию?"
  },
  "options": [
    "−2; −0,5; 0; 1,4",
    "−0,5; −2; 0; 1,4",
    "0; −0,5; −2; 1,4",
    "−2; 0; −0,5; 1,4"
  ],
  "answer": "−2; −0,5; 0; 1,4",
  "explanation": {
    "uz": "Koordinata chizig'ida chapdan o'ngga: −2; −0,5; 0; 1,4.",
    "ru": "Правильный ответ: −2; −0,5; 0; 1,4. Из двух чисел больше то, которое расположено правее на координатной прямой."
  }
};

export default function D26_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={26} task={4}/>;
}
