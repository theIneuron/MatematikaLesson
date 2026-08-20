import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Teng qiymatli kasrlar",
    "ru": "Практика к уроку 16. Задачи с дробями и десятичными дробями",
    "en": "Records of equal value"
  },
  "prompt": {
    "uz": "0,25 kilogramm 1/4 kilogrammga teng, degan fikrni o'nli kasrni oddiy kasrga aylantirib tekshiring.",
    "ru": "Верно ли, что 0,25 килограмма равно 1/4 килограмма?",
    "en": "Turn the decimal into a common fraction to check the statement that 0,25 of a kilogram is equal to 1/4 of a kilogram."
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
    "uz": "0,25 = 25/100 = 1/4, shuning uchun fikr to'g'ri.",
    "ru": "Правильный ответ: Да. Сначала величины приводят к одному виду, затем выполняют нужное действие.",
    "en": "0,25 = 25/100 = 1/4, so the statement is true."
  }
};

export default function D16_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={16} task={5}/>;
}
