import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Proporsiyada x",
    "ru": "Практика к уроку 23. Задачи на пропорции"
  },
  "prompt": {
    "uz": "Proporsiya tuzishda noma'lum x ni toping va mos javob bilan bog'lang.",
    "ru": "Найдите x в каждой пропорции и соедините с ответом."
  },
  "left": [
    "3 : 8 = x : 40",
    "7 : 5 = 42 : x",
    "12 : x = 4 : 9"
  ],
  "right": [
    "27",
    "30",
    "15"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "explanation": {
    "uz": "x = 15; x = 30; x = 27.",
    "ru": "Все пары найдены правильно. Сначала определяют вид зависимости, затем составляют и решают пропорцию."
  }
};

export default function D23_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={23} task={9}/>;
}
