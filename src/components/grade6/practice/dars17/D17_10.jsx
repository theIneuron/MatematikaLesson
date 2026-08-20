import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Nisbatda taqsimlash",
    "ru": "Практика к уроку 17. Отношение",
    "en": "Sharing in a ratio"
  },
  "prompt": {
    "uz": "48 ta kitob 5 : 3 nisbatda badiiy va ilmiy kitoblarga ajratildi. Ilmiy kitoblar sonini toping.",
    "ru": "48 книг разделили на художественные и научные в отношении 5 : 3. Сколько научных книг?",
    "en": "48 books were shared into story books and science books in the ratio 5 : 3. Find the number of science books."
  },
  "options": [
    "15 ta",
    "18 ta",
    "20 ta",
    "30 ta"
  ],
  "answer": "18 ta",
  "translationsRu": {
    "15 ta": "15 книг",
    "18 ta": "18 книг",
    "20 ta": "20 книг",
    "30 ta": "30 книг"
  },
  "translationsEn": {
    "15 ta": "15 books",
    "18 ta": "18 books",
    "20 ta": "20 books",
    "30 ta": "30 books"
  },
  "explanation": {
    "uz": "Jami qismlar 5 + 3 = 8. Ilmiy kitoblar 48 : 8 × 3 = 18 ta.",
    "ru": "Правильный ответ: 18 книг. При сокращении отношения оба его члена делят на одно и то же число.",
    "en": "There are 5 + 3 = 8 parts altogether. The science books are 48 : 8 × 3 = 18."
  }
};

export default function D17_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={17} task={10}/>;
}
