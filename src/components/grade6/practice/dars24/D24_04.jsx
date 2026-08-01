import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Nuqtalar orasidagi masofa",
    "ru": "Практика к уроку 24. Координатная прямая"
  },
  "prompt": {
    "uz": "−6 va 2 sonlari orasida koordinata chizig'ida nechta birlik masofa borligini toping.",
    "ru": "Найдите расстояние между числами −6 и 2 на координатной прямой."
  },
  "options": [
    "4 birlik",
    "6 birlik",
    "8 birlik",
    "10 birlik"
  ],
  "answer": "8 birlik",
  "translationsRu": {
    "4 birlik": "4 единиц",
    "6 birlik": "6 единиц",
    "8 birlik": "8 единиц",
    "10 birlik": "10 единиц"
  },
  "explanation": {
    "uz": "Masofa |2 − (−6)| = 8 birlik.",
    "ru": "Правильный ответ: 8 единиц. Чем правее расположено число на координатной прямой, тем оно больше."
  }
};

export default function D24_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={24} task={4}/>;
}
