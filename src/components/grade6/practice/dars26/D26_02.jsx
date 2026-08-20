import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Eng kichik son",
    "ru": "Практика к уроку 26. Сравнение рациональных чисел",
    "en": "The smallest number"
  },
  "prompt": {
    "uz": "−8, 3, −5, 0 va 6 sonlari orasidagi eng kichik sonni yozing.",
    "ru": "Запишите наименьшее среди чисел −8, 3, −5, 0 и 6.",
    "en": "Write the smallest of the numbers −8, 3, −5, 0 and 6."
  },
  "answer": "-8",
  "explanation": {
    "uz": "Berilgan sonlar orasida koordinata chizig'ida eng chapdagisi −8.",
    "ru": "Правильный ответ: -8. Из двух чисел больше то, которое расположено правее на координатной прямой.",
    "en": "Of the given numbers the one furthest to the left on the coordinate line is −8."
  }
};

export default function D26_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={26} task={2}/>;
}
