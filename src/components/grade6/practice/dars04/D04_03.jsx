import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Sonlarning turlari",
    "ru": "Практика к уроку 4. Простые и составные числа"
  },
  "prompt": {
    "uz": "Sonlarni mos tur bilan bog'lang.",
    "ru": "Соедините каждое число с его видом."
  },
  "left": [
    "13",
    "18",
    "1"
  ],
  "right": [
    "tub son",
    "murakkab son",
    "tub ham, murakkab ham emas"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "tub son": "простое число",
    "murakkab son": "составное число",
    "tub ham, murakkab ham emas": "ни простое, ни составное"
  },
  "explanation": {
    "uz": "13 tub, 18 murakkab, 1 esa tub ham, murakkab ham emas.",
    "ru": "Все пары найдены правильно. Простое число имеет ровно два натуральных делителя."
  }
};

export default function D04_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={4} task={3}/>;
}
