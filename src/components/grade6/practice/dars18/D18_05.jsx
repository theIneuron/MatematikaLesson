import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Ko'paytmalar tengligi",
    "ru": "Практика к уроку 18. Пропорция"
  },
  "prompt": {
    "uz": "8 : 12 = 14 : 21 tenglik proporsiya bo'ladi, degan fikrni 8 × 21 va 12 × 14 ko'paytmalarini taqqoslab tekshiring.",
    "ru": "Верно ли, что 8 : 12 = 14 : 21 является пропорцией?"
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
    "uz": "8 × 21 = 168 va 12 × 14 = 168, shuning uchun tenglik proporsiya.",
    "ru": "Правильный ответ: Да. В пропорции произведение крайних членов равно произведению средних."
  }
};

export default function D18_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={18} task={5}/>;
}
