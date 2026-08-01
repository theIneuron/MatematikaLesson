import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Tezlik va vaqt",
    "ru": "Практика к уроку 23. Задачи на пропорции"
  },
  "prompt": {
    "uz": "Bir xil masofada tezlik oshsa, safar vaqti ham ortadi, degan fikrni proporsionallik turiga ko'ra tekshiring.",
    "ru": "Верно ли, что при увеличении скорости время движения по одному пути тоже увеличивается?"
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
  "explanation": {
    "uz": "Bir xil yo'lda tezlik va vaqt teskari proporsional, shuning uchun fikr noto'g'ri.",
    "ru": "Правильный ответ: Нет. Сначала определяют вид зависимости, затем составляют и решают пропорцию."
  }
};

export default function D23_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={23} task={5}/>;
}
