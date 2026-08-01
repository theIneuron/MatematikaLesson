import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Birliklarni aylantirish",
    "ru": "Практика к уроку 20. Масштаб"
  },
  "prompt": {
    "uz": "1 : 500 000 masshtabda xaritadagi 2 santimetr haqiqiy 10 kilometrga teng, degan fikrni birliklarni aylantirib tekshiring.",
    "ru": "Верно ли, что при масштабе 1 : 500 000 двум сантиметрам соответствуют 10 километров?"
  },
  "options": [
    "Ha",
    "Yo'q"
  ],
  "answer": "Ha",
  "translationsRu": {
    "Ha": "Да",
    "Yo'q": "Нет"
  },
  "explanation": {
    "uz": "2 × 500 000 = 1 000 000 cm = 10 km, shuning uchun fikr to'g'ri.",
    "ru": "Правильный ответ: Да. В масштабе 1 : n одному сантиметру на карте соответствуют n сантиметров на местности."
  }
};

export default function D20_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={20} task={5}/>;
}
