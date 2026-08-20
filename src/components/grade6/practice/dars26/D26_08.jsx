import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Oraliqdagi butun son",
    "ru": "Практика к уроку 26. Сравнение рациональных чисел",
    "en": "A whole number in between"
  },
  "prompt": {
    "uz": "−2,5 dan katta, lekin −1,5 dan kichik bo'lgan butun sonni yozing.",
    "ru": "Запишите целое число, которое больше −2,5, но меньше −1,5.",
    "en": "Write the whole number that is greater than −2,5 but smaller than −1,5."
  },
  "answer": "-2",
  "explanation": {
    "uz": "−2,5 < −2 < −1,5, shuning uchun yagona butun son −2.",
    "ru": "Правильный ответ: -2. Из двух чисел больше то, которое расположено правее на координатной прямой.",
    "en": "−2,5 < −2 < −1,5, so the only whole number is −2."
  }
};

export default function D26_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={26} task={8}/>;
}
