import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Aylana uzunligi",
    "ru": "Длина окружности"
  },
  "prompt": {
    "uz": "Aylana uzunligi kvadrat santimetrda o‘lchanadi.",
    "ru": "Длина окружности измеряется в квадратных сантиметрах."
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

export default function D38_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={38} task={5}/>;
}
