import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Nisbatda taqsimlash",
    "ru": "Практика к уроку 17. Отношение"
  },
  "prompt": {
    "uz": "48 ta kitob 5 : 3 nisbatda badiiy va ilmiy kitoblarga ajratildi. Ilmiy kitoblar sonini toping.",
    "ru": "48 книг разделили на художественные и научные в отношении 5 : 3. Сколько научных книг?"
  },
  "options": [
    "15 ta",
    "18 ta",
    "20 ta",
    "30 ta"
  ],
  "answer": "18 ta",
  "translationsRu": {
    "15 ta": "15 шт.",
    "18 ta": "18 шт.",
    "20 ta": "20 шт.",
    "30 ta": "30 шт."
  },
  "explanation": {
    "uz": "Jami qismlar 5 + 3 = 8. Ilmiy kitoblar 48 : 8 × 3 = 18 ta.",
    "ru": "Правильный ответ: 18 шт.. При сокращении отношения оба его члена делят на одно и то же число."
  }
};

export default function D17_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={17} task={10}/>;
}
