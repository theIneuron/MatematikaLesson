import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Aylana uzunligi",
    "ru": "Длина окружности"
  },
  "prompt": {
    "uz": "G‘ildirak diametri 0,7 m. π=22/7 da bir aylanish yo‘lini santimetrda yozing.",
    "ru": "Диаметр колеса 0,7 м. При π=22/7 запишите путь за оборот в сантиметрах."
  },
  "answer": "220",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 220 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 220."
  }
};

export default function D38_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={38} task={8}/>;
}
