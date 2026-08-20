import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Aylana uzunligi",
    "ru": "Длина окружности",
    "en": "The circumference of a circle"
  },
  "prompt": {
    "uz": "Aylana radiusi 3 marta oshsa, uning uzunligi qanday o‘zgaradi?",
    "ru": "Как изменится длина окружности, если радиус увеличить в 3 раза?",
    "en": "How does the circumference change if the radius of the circle grows 3 times?"
  },
  "options": [
    "o‘zgarmaydi",
    "2 marta oshadi",
    "3 marta oshadi",
    "9 marta oshadi"
  ],
  "answer": "3 marta oshadi",
  "translationsRu": {
    "o‘zgarmaydi": "не изменится",
    "2 marta oshadi": "увеличится в 2 раза",
    "3 marta oshadi": "увеличится в 3 раза",
    "9 marta oshadi": "увеличится в 9 раз"
  },
  "translationsEn": {
    "o‘zgarmaydi": "it stays the same",
    "2 marta oshadi": "it grows 2 times",
    "3 marta oshadi": "it grows 3 times",
    "9 marta oshadi": "it grows 9 times"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 3 marta oshadi hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается: длина увеличится в 3 раза.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get: it grows 3 times."
  }
};

export default function D38_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={38} task={10}/>;
}
