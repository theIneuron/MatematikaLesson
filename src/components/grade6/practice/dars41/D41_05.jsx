import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Markaziy simmetriya",
    "ru": "Центральная симметрия"
  },
  "prompt": {
    "uz": "Oddiy uchburchak markaziy simmetriyaga ega.",
    "ru": "Обычный треугольник имеет центральную симметрию."
  },
  "options": [
    "Ha",
    "Yo'q"
  ],
  "answer": "Yo'q",
  "translationsRu": {
    "Ha": "Да",
    "Yo'q": "Нет"
  },
  "explanation": {
    "uz": "Berilgan fikr mavzuning asosiy qoidasiga zid, shuning uchun u noto‘g‘ri.",
    "ru": "Утверждение противоречит основному правилу темы, поэтому оно неверно."
  }
};

export default function D41_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={41} task={5}/>;
}
