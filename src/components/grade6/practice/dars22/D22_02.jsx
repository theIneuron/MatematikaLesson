import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Narxning oshishi",
    "ru": "Практика к уроку 22. Задачи на проценты"
  },
  "prompt": {
    "uz": "Mahsulot narxi 240 000 so'mdan 15% ga oshdi. Yangi narxni ming so'mlarda yozing.",
    "ru": "Цена выросла на 15% от 240 000 сумов. Запишите новую цену в тысячах сумов."
  },
  "answer": "276",
  "explanation": {
    "uz": "O'sish 240 × 15% = 36 ming; yangi narx 276 ming so'm.",
    "ru": "Правильный ответ: 276. Новое значение находят умножением начального значения на коэффициент изменения."
  }
};

export default function D22_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={22} task={2}/>;
}
