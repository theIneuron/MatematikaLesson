import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Haqiqiy masofa",
    "ru": "Практика к уроку 20. Масштаб"
  },
  "prompt": {
    "uz": "1 : 250 000 masshtabli xaritada ikki shahar orasidagi masofa 6 santimetr. Haqiqiy masofani kilometrda yozing.",
    "ru": "На карте масштаба 1 : 250 000 расстояние равно 6 см. Запишите реальное расстояние в километрах."
  },
  "answer": "15",
  "explanation": {
    "uz": "1 cm = 2,5 km; 6 cm = 15 km.",
    "ru": "Правильный ответ: 15. В масштабе 1 : n одному сантиметру на карте соответствуют n сантиметров на местности."
  }
};

export default function D20_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={20} task={2}/>;
}
