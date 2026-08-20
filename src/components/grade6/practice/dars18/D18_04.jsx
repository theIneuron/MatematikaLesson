import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Haqiqiy proporsiya",
    "ru": "Практика к уроку 18. Пропорция",
    "en": "A true proportion"
  },
  "prompt": {
    "uz": "Quyidagi tengliklardan qaysi biri haqiqiy proporsiya ekanini chetki va o'rta hadlar ko'paytmasi bilan tekshiring.",
    "ru": "Какое равенство является верной пропорцией?",
    "en": "Use the product of the outer terms and of the inner terms to check which of these equalities is a true proportion."
  },
  "options": [
    "4 : 6 = 10 : 15",
    "3 : 8 = 9 : 16",
    "5 : 7 = 15 : 28",
    "6 : 11 = 18 : 22"
  ],
  "answer": "4 : 6 = 10 : 15",
  "explanation": {
    "uz": "4 × 15 = 60 va 6 × 10 = 60. Ko'paytmalar teng, demak bu proporsiya.",
    "ru": "Правильный ответ: 4 : 6 = 10 : 15. В пропорции произведение крайних членов равно произведению средних.",
    "en": "4 × 15 = 60 and 6 × 10 = 60. The products are equal, so this is a proportion."
  }
};

export default function D18_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={18} task={4}/>;
}
