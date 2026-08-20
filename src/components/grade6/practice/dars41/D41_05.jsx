import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Markaziy simmetriya",
    "ru": "Центральная симметрия",
    "en": "Point symmetry"
  },
  "prompt": {
    "uz": "Oddiy uchburchak markaziy simmetriyaga ega.",
    "ru": "Обычный треугольник имеет центральную симметрию.",
    "en": "An ordinary triangle has point symmetry."
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
  "translationsEn": {
    "Ha": "Yes",
    "Yo'q": "No"
  },
  "explanation": {
    "uz": "Berilgan fikr mavzuning asosiy qoidasiga zid, shuning uchun u noto‘g‘ri.",
    "ru": "Утверждение противоречит основному правилу темы, поэтому оно неверно.",
    "en": "The statement goes against the main rule of the topic, so it is false."
  }
};

export default function D41_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={41} task={5}/>;
}
