import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Yaxlitlangan qiymatlar",
    "ru": "Практика к уроку 15. Периодические дроби и округление",
    "en": "Rounded values"
  },
  "prompt": {
    "uz": "Har bir sonni o'ndan birlargacha yaxlitlang va o'ng ustundagi mos qiymati bilan bog'lang.",
    "ru": "Округлите каждое число до десятых и соедините с ответом.",
    "en": "Round each number to tenths and connect it with the matching value on the right."
  },
  "left": [
    "3,24",
    "5,68",
    "9,95"
  ],
  "right": [
    "10,0",
    "3,2",
    "5,7"
  ],
  "pairs": [
    1,
    2,
    0
  ],
  "explanation": {
    "uz": "3,24 ≈ 3,2; 5,68 ≈ 5,7; 9,95 ≈ 10,0. Har safar yuzdan birlar raqamiga qaraladi.",
    "ru": "Все пары найдены правильно. При округлении смотрят на первую цифру после сохраняемого разряда.",
    "en": "3,24 ≈ 3,2; 5,68 ≈ 5,7; 9,95 ≈ 10,0. Every time you look at the digit in the hundredths place."
  }
};

export default function D15_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={15} task={6}/>;
}
