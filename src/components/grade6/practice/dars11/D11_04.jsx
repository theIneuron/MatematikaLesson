import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Butun son va kasr",
    "ru": "Практика к уроку 11. Умножение обыкновенных дробей",
    "en": "A whole number and a fraction"
  },
  "prompt": {
    "uz": "6 × 5/18 ifodada butun sonni kasrga ko'paytiring va javobni qisqartirilgan kasr ko'rinishida toping.",
    "ru": "Вычислите 6 × 5/18 и выберите сокращённую дробь.",
    "en": "In the expression 6 × 5/18 multiply the whole number by the fraction and find the answer as a reduced fraction."
  },
  "options": [
    "5/3",
    "5/12",
    "11/18",
    "30/18"
  ],
  "answer": "5/3",
  "explanation": {
    "uz": "6 × 5/18 = 30/18. Surat va maxrajni 6 ga bo'lsak 5/3 hosil bo'ladi.",
    "ru": "Правильный ответ: 5/3. При умножении дробей перемножают числители и знаменатели, а результат сокращают.",
    "en": "6 × 5/18 = 30/18. Divide the numerator and the denominator by 6 and you get 5/3."
  }
};

export default function D11_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={11} task={4}/>;
}
