import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Tenglama yordamida masalalar yechish",
    "ru": "Решение задач с помощью уравнений"
  },
  "prompt": {
    "uz": "Uchta teng qutida jami 81 ta qalam bor. Bitta qutidagi qalamlar sonini yozing.",
    "ru": "В трёх одинаковых коробках 81 карандаш. Запишите число карандашей в одной коробке."
  },
  "answer": "27",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 27 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 27."
  }
};

export default function D35_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={35} task={8}/>;
}
