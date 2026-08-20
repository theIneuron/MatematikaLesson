import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Modulning ishorasi",
    "ru": "Практика к уроку 25. Модуль числа",
    "en": "The sign of a modulus"
  },
  "prompt": {
    "uz": "|−8| = −8 tenglik to'g'ri, degan fikrni modulning manfiy bo'lmaslik xossasi bilan tekshiring.",
    "ru": "Верно ли равенство |−8| = −8?",
    "en": "Check the statement that the equality |−8| = −8 is true against the rule that a modulus is never negative."
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
    "uz": "Modul hech qachon manfiy bo'lmaydi: |−8| = 8.",
    "ru": "Правильный ответ: Нет. Модуль числа — его расстояние от нуля, поэтому модуль не бывает отрицательным.",
    "en": "A modulus is never negative: |−8| = 8."
  }
};

export default function D25_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={25} task={5}/>;
}
