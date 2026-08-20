import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Narxning oshishi",
    "ru": "Практика к уроку 22. Задачи на проценты",
    "en": "A rise in the price"
  },
  "prompt": {
    "uz": "Mahsulot narxi 240 000 so'mdan 15% ga oshdi. Yangi narxni ming so'mlarda yozing.",
    "ru": "Цена выросла на 15% от 240 000 сумов. Запишите новую цену в тысячах сумов.",
    "en": "The price of an item rose by 15% from 240 000 sum. Write the new price in thousands of sum."
  },
  "answer": "276",
  "explanation": {
    "uz": "O'sish 240 × 15% = 36 ming; yangi narx 276 ming so'm.",
    "ru": "Правильный ответ: 276. Новое значение находят умножением начального значения на коэффициент изменения.",
    "en": "The rise is 240 × 15% = 36 thousand; the new price is 276 thousand sum."
  }
};

export default function D22_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={22} task={2}/>;
}
