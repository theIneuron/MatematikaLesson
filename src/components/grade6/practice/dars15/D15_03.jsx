import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Kasr va o'nli yozuv",
    "ru": "Практика к уроку 15. Периодические дроби и округление",
    "en": "A fraction and its decimal record"
  },
  "prompt": {
    "uz": "Oddiy kasrlarni o'nli yozuvlari bilan moslashtiring. Davriy qism qavs ichida berilganiga e'tibor qarating.",
    "ru": "Соедините обыкновенные дроби с их десятичными записями.",
    "en": "Match the common fractions with their decimal records. Note that the repeating part is given inside brackets."
  },
  "left": [
    "1/3",
    "2/9",
    "5/6"
  ],
  "right": [
    "0,(2)",
    "0,(3)",
    "0,8(3)"
  ],
  "pairs": [
    1,
    0,
    2
  ],
  "explanation": {
    "uz": "1/3 = 0,(3), 2/9 = 0,(2), 5/6 = 0,8(3).",
    "ru": "Все пары найдены правильно. При округлении смотрят на первую цифру после сохраняемого разряда.",
    "en": "1/3 = 0,(3), 2/9 = 0,(2), 5/6 = 0,8(3)."
  }
};

export default function D15_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={15} task={3}/>;
}
