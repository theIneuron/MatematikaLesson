import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Koordinata tekisligi",
    "ru": "Координатная плоскость"
  },
  "prompt": {
    "uz": "E(3; −4) nuqtadan x o‘qigacha bo‘lgan masofani yozing.",
    "ru": "Запишите расстояние от точки E(3; −4) до оси x."
  },
  "answer": "4",
  "explanation": {
    "uz": "x o‘qigacha masofa ordinata moduliga teng: |−4| = 4.",
    "ru": "Расстояние до оси x равно модулю ординаты: |−4| = 4."
  }
};

export default function D30_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={30} task={8}/>;
}
