import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Davriy kasrni aniqlash",
    "ru": "Практика к уроку 15. Периодические дроби и округление",
    "en": "Spotting a recurring decimal"
  },
  "prompt": {
    "uz": "Quyidagi yozuvlardan davriy o'nli kasrni toping. Qavs ichidagi raqamlar cheksiz takrorlanishini yodda tuting.",
    "ru": "Найдите периодическую десятичную дробь.",
    "en": "Find the recurring decimal among these records. Remember that the digits inside the brackets repeat without end."
  },
  "options": [
    "0,75",
    "1,2(4)",
    "3,125",
    "6,08"
  ],
  "answer": "1,2(4)",
  "explanation": {
    "uz": "1,2(4) yozuvida 4 raqami cheksiz takrorlanadi. Shu sabab bu davriy o'nli kasr.",
    "ru": "Правильный ответ: 1,2(4). При округлении смотрят на первую цифру после сохраняемого разряда.",
    "en": "In the record 1,2(4) the digit 4 repeats without end. That is why it is a recurring decimal."
  }
};

export default function D15_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={15} task={1}/>;
}
