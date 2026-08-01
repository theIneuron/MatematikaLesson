import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Xarid proporsiyasi",
    "ru": "Практика к уроку 23. Задачи на пропорции"
  },
  "prompt": {
    "uz": "5 kilogramm guruch 70 000 so'm turadi. Narx o'zgarmasa, 8 kilogramm guruch qancha turishini proporsiya orqali toping.",
    "ru": "Пять килограммов риса стоят 70 000 сумов. Сколько стоят 8 килограммов?"
  },
  "options": [
    "98 000 so'm",
    "105 000 so'm",
    "112 000 so'm",
    "120 000 so'm"
  ],
  "answer": "112 000 so'm",
  "translationsRu": {
    "98 000 so'm": "98 000 сум",
    "105 000 so'm": "105 000 сум",
    "112 000 so'm": "112 000 сум",
    "120 000 so'm": "120 000 сум"
  },
  "explanation": {
    "uz": "Bir kilogramm 14 000 so'm; 8 kilogramm 112 000 so'm.",
    "ru": "Правильный ответ: 112 000 сум. Сначала определяют вид зависимости, затем составляют и решают пропорцию."
  }
};

export default function D23_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={23} task={1}/>;
}
