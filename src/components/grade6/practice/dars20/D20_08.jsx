import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Reja masshtabi",
    "ru": "Практика к уроку 20. Масштаб"
  },
  "prompt": {
    "uz": "Haqiqiy uzunligi 24 metr bo'lgan xona yo'lagi 1 : 200 masshtabli rejada necha santimetr bo'lishini yozing.",
    "ru": "Коридор длиной 24 метра изображён в масштабе 1 : 200. Запишите его длину на плане в сантиметрах."
  },
  "answer": "12",
  "explanation": {
    "uz": "24 m = 2 400 cm; 2 400 : 200 = 12 cm.",
    "ru": "Правильный ответ: 12. В масштабе 1 : n одному сантиметру на карте соответствуют n сантиметров на местности."
  }
};

export default function D20_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={20} task={8}/>;
}
