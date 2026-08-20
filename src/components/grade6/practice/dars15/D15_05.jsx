import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Tugaydigan kasr",
    "ru": "Практика к уроку 15. Периодические дроби и округление",
    "en": "A terminating decimal"
  },
  "prompt": {
    "uz": "0,125 soni davriy o'nli kasr, degan fikrni uning yozuvi tugashi yoki davom etishiga qarab tekshiring.",
    "ru": "Верно ли, что 0,125 — периодическая десятичная дробь?",
    "en": "0,125 is a recurring decimal. Check this statement by looking at whether its record ends or goes on."
  },
  "options": [
    "Ha",
    "Yo'q"
  ],
  "answer": "Yo'q",
  "translationsRu": {
    "Ha": "Да",
    "Yo'q": "Нет"
  },
  "translationsEn": {
    "Ha": "Yes",
    "Yo'q": "No"
  },
  "explanation": {
    "uz": "0,125 yozuvi uchta kasr xonasidan keyin tugaydi, shuning uchun u davriy emas.",
    "ru": "Правильный ответ: Нет. При округлении смотрят на первую цифру после сохраняемого разряда.",
    "en": "The record 0,125 ends after three decimal places, so it is not recurring."
  }
};

export default function D15_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={15} task={5}/>;
}
