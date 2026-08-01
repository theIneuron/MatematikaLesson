import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kasrlar ko'paytmasi",
    "ru": "Практика к уроку 11. Умножение обыкновенных дробей"
  },
  "prompt": {
    "uz": "2/3 va 5/8 kasrlarini ko'paytiring. Suratlarni va maxrajlarni alohida ko'paytirib, natijani eng sodda ko'rinishda tanlang.",
    "ru": "Умножьте 2/3 на 5/8 и выберите результат в несократимом виде."
  },
  "options": [
    "5/12",
    "7/11",
    "10/11",
    "5/8"
  ],
  "answer": "5/12",
  "explanation": {
    "uz": "Suratlar: 2 × 5 = 10, maxrajlar: 3 × 8 = 24. 10/24 ni 2 ga qisqartirsak 5/12 hosil bo'ladi.",
    "ru": "Правильный ответ: 5/12. При умножении дробей перемножают числители и знаменатели, а результат сокращают."
  }
};

export default function D11_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={11} task={1}/>;
}
