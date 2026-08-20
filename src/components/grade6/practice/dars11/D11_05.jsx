import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Ko'paytmani tekshirish",
    "ru": "Практика к уроку 11. Умножение обыкновенных дробей",
    "en": "Checking a product"
  },
  "prompt": {
    "uz": "8/15 × 5/12 ko'paytmaning qisqarmas qiymati 2/9 ga teng, degan fikrni hisoblash orqali tekshiring.",
    "ru": "Верно ли, что 8/15 × 5/12 = 2/9?",
    "en": "Work out the product 8/15 × 5/12 and check the statement that its value in the simplest form is 2/9."
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
    "uz": "8/15 × 5/12 da 5 bilan 15, 8 bilan 12 qisqaradi: 2/3 × 1/3 = 2/9.",
    "ru": "Правильный ответ: Да. При умножении дробей перемножают числители и знаменатели, а результат сокращают.",
    "en": "In 8/15 × 5/12 the 5 cancels with the 15 and the 8 with the 12: 2/3 × 1/3 = 2/9."
  }
};

export default function D11_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={11} task={5}/>;
}
