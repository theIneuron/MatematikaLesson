import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Eng kichik tub son",
    "ru": "Практика к уроку 4. Простые и составные числа",
    "en": "The smallest prime number"
  },
  "prompt": {
    "uz": "2 soni eng kichik tub sondir.",
    "ru": "Верно ли, что 2 — наименьшее простое число?",
    "en": "2 is the smallest prime number."
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
    "uz": "2 ning faqat 1 va 2 bo'luvchilari bor; u eng kichik tub sondir.",
    "ru": "Правильный ответ: Да. Простое число имеет ровно два натуральных делителя.",
    "en": "2 has only the divisors 1 and 2, and it is the smallest prime number."
  }
};

export default function D04_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={4} task={5}/>;
}
