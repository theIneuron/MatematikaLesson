import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Ayirmani tekshirish",
    "ru": "Практика к уроку 10. Сложение и вычитание дробей",
    "en": "Checking a difference"
  },
  "prompt": {
    "uz": "3/5 − 1/10 ayirmaning qiymati 1/2 ga teng.",
    "ru": "Верно ли, что 3/5 − 1/10 = 1/2?",
    "en": "The value of the difference 3/5 − 1/10 is equal to 1/2."
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
    "uz": "3/5 = 6/10; 6/10 − 1/10 = 5/10 = 1/2.",
    "ru": "Правильный ответ: Да. Сначала дроби приводят к общему знаменателю, затем выполняют действие с числителями.",
    "en": "3/5 = 6/10; 6/10 − 1/10 = 5/10 = 1/2."
  }
};

export default function D10_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={10} task={5}/>;
}
