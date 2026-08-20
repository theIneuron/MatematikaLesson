import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Nisbatlar tengligi",
    "ru": "Практика к уроку 17. Отношение",
    "en": "Ratios that are equal"
  },
  "prompt": {
    "uz": "8 : 12 va 10 : 15 nisbatlari o'zaro teng, degan fikrni ikkala nisbatni soddalashtirib tekshiring.",
    "ru": "Верно ли, что отношения 8 : 12 и 10 : 15 равны?",
    "en": "Simplify both ratios to check the statement that 8 : 12 and 10 : 15 are equal to each other."
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
    "uz": "8 : 12 = 2 : 3 va 10 : 15 = 2 : 3, demak nisbatlar teng.",
    "ru": "Правильный ответ: Да. При сокращении отношения оба его члена делят на одно и то же число.",
    "en": "8 : 12 = 2 : 3 and 10 : 15 = 2 : 3, so the ratios are equal."
  }
};

export default function D17_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={17} task={5}/>;
}
