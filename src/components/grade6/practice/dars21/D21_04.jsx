import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Qismning foizi",
    "ru": "Практика к уроку 21. Проценты",
    "en": "The percentage a part makes"
  },
  "prompt": {
    "uz": "18 soni 72 sonining necha foizini tashkil etishini qismni butunga bo'lish orqali toping.",
    "ru": "Сколько процентов от 72 составляет число 18?",
    "en": "Divide the part by the whole to find what percentage of 72 the number 18 makes."
  },
  "options": [
    "20%",
    "25%",
    "30%",
    "40%"
  ],
  "answer": "25%",
  "explanation": {
    "uz": "18 : 72 × 100% = 25%.",
    "ru": "Правильный ответ: 25%. Один процент равен одной сотой части целого.",
    "en": "18 : 72 × 100% = 25%."
  }
};

export default function D21_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={21} task={4}/>;
}
