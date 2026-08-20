import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Ko'paytmalar tengligi",
    "ru": "Практика к уроку 18. Пропорция",
    "en": "The equality of the products"
  },
  "prompt": {
    "uz": "8 : 12 = 14 : 21 tenglik proporsiya bo'ladi, degan fikrni 8 × 21 va 12 × 14 ko'paytmalarini taqqoslab tekshiring.",
    "ru": "Верно ли, что 8 : 12 = 14 : 21 является пропорцией?",
    "en": "Compare the products 8 × 21 and 12 × 14 to check the statement that the equality 8 : 12 = 14 : 21 is a proportion."
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
  "translationsEn": {
    "Ha": "Yes",
    "Yo'q": "No"
  },
  "explanation": {
    "uz": "8 × 21 = 168 va 12 × 14 = 168, shuning uchun tenglik proporsiya.",
    "ru": "Правильный ответ: Да. В пропорции произведение крайних членов равно произведению средних.",
    "en": "8 × 21 = 168 and 12 × 14 = 168, so the equality is a proportion."
  }
};

export default function D18_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={18} task={5}/>;
}
