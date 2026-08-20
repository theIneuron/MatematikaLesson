import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Tezlik va vaqt",
    "ru": "Практика к уроку 23. Задачи на пропорции",
    "en": "Speed and time"
  },
  "prompt": {
    "uz": "Bir xil masofada tezlik oshsa, safar vaqti ham ortadi, degan fikrni proporsionallik turiga ko'ra tekshiring.",
    "ru": "Верно ли, что при увеличении скорости время движения по одному пути тоже увеличивается?",
    "en": "Over the same distance the journey time grows as the speed grows. Check this statement against the kind of proportion."
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
    "uz": "Bir xil yo'lda tezlik va vaqt teskari proporsional, shuning uchun fikr noto'g'ri.",
    "ru": "Правильный ответ: Нет. Сначала определяют вид зависимости, затем составляют и решают пропорцию.",
    "en": "Over the same route the speed and the time are inversely proportional, so the statement is false."
  }
};

export default function D23_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={23} task={5}/>;
}
