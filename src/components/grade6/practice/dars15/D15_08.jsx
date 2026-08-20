import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Davriy kasrni yaxlitlash",
    "ru": "Практика к уроку 15. Периодические дроби и округление",
    "en": "Rounding a recurring decimal"
  },
  "prompt": {
    "uz": "7/9 = 0,(7) ekanidan foydalanib, bu sonni yuzdan birlargacha yaxlitlang va o'nli javobni yozing.",
    "ru": "Используя 7/9 = 0,(7), округлите число до сотых.",
    "en": "Use 7/9 = 0,(7) to round this number to hundredths and write the decimal answer."
  },
  "answer": "0,78",
  "explanation": {
    "uz": "7/9 = 0,777... Yuzdan birlardan keyingi raqam 7 bo'lgani uchun 0,77 soni 0,78 gacha yaxlitlanadi.",
    "ru": "Правильный ответ: 0,78. При округлении смотрят на первую цифру после сохраняемого разряда.",
    "en": "7/9 = 0,777... The digit after the hundredths place is 7, so 0,77 rounds up to 0,78."
  }
};

export default function D15_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={15} task={8}/>;
}
