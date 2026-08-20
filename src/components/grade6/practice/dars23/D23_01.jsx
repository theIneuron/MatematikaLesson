import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Xarid proporsiyasi",
    "ru": "Практика к уроку 23. Задачи на пропорции",
    "en": "A proportion in shopping"
  },
  "prompt": {
    "uz": "5 kilogramm guruch 70 000 so'm turadi. Narx o'zgarmasa, 8 kilogramm guruch qancha turishini proporsiya orqali toping.",
    "ru": "Пять килограммов риса стоят 70 000 сумов. Сколько стоят 8 килограммов?",
    "en": "5 kilograms of rice cost 70 000 sum. If the price stays the same, use a proportion to find the cost of 8 kilograms."
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
  "translationsEn": {
    "98 000 so'm": "98 000 sum",
    "105 000 so'm": "105 000 sum",
    "112 000 so'm": "112 000 sum",
    "120 000 so'm": "120 000 sum"
  },
  "explanation": {
    "uz": "Bir kilogramm 14 000 so'm; 8 kilogramm 112 000 so'm.",
    "ru": "Правильный ответ: 112 000 сум. Сначала определяют вид зависимости, затем составляют и решают пропорцию.",
    "en": "One kilogram costs 14 000 sum; 8 kilograms cost 112 000 sum."
  }
};

export default function D23_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={23} task={1}/>;
}
