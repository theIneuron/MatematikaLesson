import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Eng kichik mos son",
    "ru": "Практика к уроку 2. Признаки делимости на 2, 5 и 10"
  },
  "prompt": {
    "uz": "2, 5 va 10 ga bir vaqtda bo'linadigan eng kichik uch xonali sonni yozing.",
    "ru": "Запишите наименьшее трёхзначное число, которое делится на 2, 5 и 10."
  },
  "answer": "100",
  "explanation": {
    "uz": "Eng kichik uch xonali son 100 bo'lib, u 2, 5 va 10 ga bo'linadi.",
    "ru": "Правильный ответ: 100. Для делимости на 2, 5 и 10 достаточно проверить последнюю цифру."
  }
};

export default function D02_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={2} task={2}/>;
}
