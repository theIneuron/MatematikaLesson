import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Uchburchak elementlari, turlari va perimetri",
    "ru": "Элементы, виды и периметр треугольника",
    "en": "Elements, kinds and perimeter of a triangle"
  },
  "prompt": {
    "uz": "2 cm, 4 cm va 7 cm kesmalardan uchburchak yasash mumkin.",
    "ru": "Из отрезков 2, 4 и 7 см можно построить треугольник.",
    "en": "A triangle can be built from segments of 2 cm, 4 cm and 7 cm."
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

export default function D42_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={42} task={5}/>;
}
