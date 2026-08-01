import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Nisbatli aralashma",
    "ru": "Практика к уроку 17. Отношение"
  },
  "prompt": {
    "uz": "Qizil va ko'k bo'yoq 3 : 5 nisbatda aralashtiriladi. 15 millilitr qizil bo'yoqqa qancha ko'k bo'yoq kerak?",
    "ru": "Красную и синюю краску смешивают в отношении 3 : 5. Сколько синей краски нужно для 15 мл красной?"
  },
  "options": [
    "20 ml",
    "25 ml",
    "30 ml",
    "35 ml"
  ],
  "answer": "25 ml",
  "translationsRu": {
    "20 ml": "20 мл",
    "25 ml": "25 мл",
    "30 ml": "30 мл",
    "35 ml": "35 мл"
  },
  "explanation": {
    "uz": "3 qism 15 ml bo'lsa, bir qism 5 ml; 5 qism ko'k bo'yoq 25 ml.",
    "ru": "Правильный ответ: 25 мл. При сокращении отношения оба его члена делят на одно и то же число."
  }
};

export default function D17_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={17} task={7}/>;
}
