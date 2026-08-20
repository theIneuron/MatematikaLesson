import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Foizni kasrga aylantirish",
    "ru": "Практика к уроку 21. Проценты",
    "en": "Turning a percentage into a fraction"
  },
  "prompt": {
    "uz": "36% ni avval yuzdan ulush sifatida yozing, so'ng qisqartirilgan oddiy kasr ko'rinishini toping.",
    "ru": "Запишите 36% в виде несократимой обыкновенной дроби.",
    "en": "First write 36% as hundredths, then find it as a common fraction in its simplest form."
  },
  "options": [
    "9/25",
    "18/25",
    "36/10",
    "3/5"
  ],
  "answer": "9/25",
  "explanation": {
    "uz": "36% = 36/100. Surat va maxrajni 4 ga bo'lsak 9/25.",
    "ru": "Правильный ответ: 9/25. Один процент равен одной сотой части целого.",
    "en": "36% = 36/100. Divide the numerator and the denominator by 4 and you get 9/25."
  }
};

export default function D21_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={21} task={1}/>;
}
