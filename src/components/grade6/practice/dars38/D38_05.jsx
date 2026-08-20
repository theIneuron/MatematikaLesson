import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Aylana uzunligi",
    "ru": "Длина окружности",
    "en": "The circumference of a circle"
  },
  "prompt": {
    "uz": "Aylana uzunligi kvadrat santimetrda o‘lchanadi.",
    "ru": "Длина окружности измеряется в квадратных сантиметрах.",
    "en": "The circumference of a circle is measured in square centimetres."
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

export default function D38_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={38} task={5}/>;
}
