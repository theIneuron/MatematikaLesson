import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Eng kichik kasr",
    "ru": "Практика к уроку 26. Сравнение рациональных чисел",
    "en": "The smallest fraction"
  },
  "prompt": {
    "uz": "−5/6, −0,9, −3/4 va −0,7 sonlaridan eng kichigini toping.",
    "ru": "Найдите наименьшее среди чисел −5/6, −0,9, −3/4 и −0,7.",
    "en": "Find the smallest of the numbers −5/6, −0,9, −3/4 and −0,7."
  },
  "options": [
    "−5/6",
    "−0,9",
    "−3/4",
    "−0,7"
  ],
  "answer": "−0,9",
  "explanation": {
    "uz": "−5/6 ≈ −0,833; −0,9 ulardan ham kichik.",
    "ru": "Правильный ответ: −0,9. Из двух чисел больше то, которое расположено правее на координатной прямой.",
    "en": "−5/6 ≈ −0,833; and −0,9 is smaller even than that."
  }
};

export default function D26_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={26} task={7}/>;
}
