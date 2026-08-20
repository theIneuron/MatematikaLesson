import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Tenglama yordamida masalalar yechish",
    "ru": "Решение задач с помощью уравнений",
    "en": "Solving problems with equations"
  },
  "prompt": {
    "uz": "Sonning 4 baravari 52 ga teng. Sonni yozing.",
    "ru": "Четырёхкратное число равно 52. Запишите число.",
    "en": "Four times a number is equal to 52. Write the number."
  },
  "answer": "13",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 13 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 13.",
    "en": "Do the operations of the calculation in the right order and the answer is 13."
  }
};

export default function D35_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={35} task={2}/>;
}
