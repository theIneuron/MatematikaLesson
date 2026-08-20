import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Teng yozuvlar",
    "ru": "Практика к уроку 21. Проценты",
    "en": "Records of equal value"
  },
  "prompt": {
    "uz": "0,6 o'nli kasr 60% ga teng, degan fikrni sonni 100 ga ko'paytirib tekshiring.",
    "ru": "Верно ли, что десятичная дробь 0,6 равна 60%?",
    "en": "Multiply the number by 100 to check the statement that the decimal 0,6 is equal to 60%."
  },
  "options": [
    "Ha",
    "Yo'q"
  ],
  "answer": "Ha",
  "translationsRu": {
    "Ha": "Да",
    "Yo'q": "Нет"
  },
  "translationsEn": {
    "Ha": "Yes",
    "Yo'q": "No"
  },
  "explanation": {
    "uz": "0,6 × 100% = 60%, shuning uchun fikr to'g'ri.",
    "ru": "Правильный ответ: Да. Один процент равен одной сотой части целого.",
    "en": "0,6 × 100% = 60%, so the statement is true."
  }
};

export default function D21_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={21} task={5}/>;
}
