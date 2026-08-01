import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Koordinata tekisligi",
    "ru": "Координатная плоскость"
  },
  "prompt": {
    "uz": "C(−8; 0) nuqta x o‘qida joylashgan.",
    "ru": "Точка C(−8; 0) находится на оси x."
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
    "uz": "y = 0 bo‘lgan barcha nuqtalar x o‘qida yotadi.",
    "ru": "Все точки с y = 0 лежат на оси x."
  }
};

export default function D30_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={30} task={5}/>;
}
