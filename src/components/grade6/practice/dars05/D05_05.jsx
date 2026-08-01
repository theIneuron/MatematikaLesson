import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "EKUB tengligini tekshirish",
    "ru": "Практика к уроку 5. Наибольший общий делитель"
  },
  "prompt": {
    "uz": "EKUB(14, 21) = 7.",
    "ru": "Верно ли равенство НОД(14, 21) = 7?"
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
  "explanation": {
    "uz": "14 va 21 ning eng katta umumiy bo'luvchisi 7, shuning uchun tenglik to'g'ri.",
    "ru": "Правильный ответ: Да. НОД — наибольший из общих делителей."
  }
};

export default function D05_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={5} task={5}/>;
}
