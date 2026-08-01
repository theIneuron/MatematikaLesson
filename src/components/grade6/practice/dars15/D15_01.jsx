import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Davriy kasrni aniqlash",
    "ru": "Практика к уроку 15. Периодические дроби и округление"
  },
  "prompt": {
    "uz": "Quyidagi yozuvlardan davriy o'nli kasrni toping. Qavs ichidagi raqamlar cheksiz takrorlanishini yodda tuting.",
    "ru": "Найдите периодическую десятичную дробь."
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
    "ru": "Правильный ответ: 1,2(4). При округлении смотрят на первую цифру после сохраняемого разряда."
  }
};

export default function D15_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={15} task={1}/>;
}
