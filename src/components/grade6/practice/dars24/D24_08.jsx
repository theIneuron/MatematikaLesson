import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Koordinatalar masofasi",
    "ru": "Практика к уроку 24. Координатная прямая",
    "en": "The distance between coordinates"
  },
  "prompt": {
    "uz": "−12 va 5 koordinatali nuqtalar orasidagi masofani birliklarda yozing.",
    "ru": "Запишите расстояние между точками с координатами −12 и 5.",
    "en": "Write in units the distance between the points with the coordinates −12 and 5."
  },
  "answer": "17",
  "explanation": {
    "uz": "Masofa |5 − (−12)| = 17 birlik.",
    "ru": "Правильный ответ: 17. Чем правее расположено число на координатной прямой, тем оно больше.",
    "en": "The distance is |5 − (−12)| = 17 units."
  }
};

export default function D24_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={24} task={8}/>;
}
