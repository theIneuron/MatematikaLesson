import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Nuqtalar oralig'i",
    "ru": "Практика к уроку 24. Координатная прямая"
  },
  "prompt": {
    "uz": "Koordinata chizig'ida M(−8), N(−1), K(6) nuqtalari berilgan. N nuqtadan K nuqtagacha bo'lgan masofani toping.",
    "ru": "Даны точки M(−8), N(−1), K(6). Найдите расстояние от N до K."
  },
  "options": [
    "5 birlik",
    "7 birlik",
    "8 birlik",
    "14 birlik"
  ],
  "answer": "7 birlik",
  "translationsRu": {
    "5 birlik": "5 единиц",
    "7 birlik": "7 единиц",
    "8 birlik": "8 единиц",
    "14 birlik": "14 единиц"
  },
  "explanation": {
    "uz": "N dan K gacha masofa |6 − (−1)| = 7 birlik.",
    "ru": "Правильный ответ: 7 единиц. Чем правее расположено число на координатной прямой, тем оно больше."
  }
};

export default function D24_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={24} task={10}/>;
}
