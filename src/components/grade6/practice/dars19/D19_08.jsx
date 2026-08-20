import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Birlik narx",
    "ru": "Практика к уроку 19. Прямая и обратная пропорциональность",
    "en": "The price of one unit"
  },
  "prompt": {
    "uz": "7 metr mato 84 000 so'm turadi. Shu narxda 11 metr matoning narxini ming so'mlarda yozing.",
    "ru": "Семь метров ткани стоят 84 000 сумов. Запишите стоимость 11 метров в тысячах сумов.",
    "en": "7 metres of cloth cost 84 000 sum. At the same price, write the cost of 11 metres in thousands of sum."
  },
  "answer": "132",
  "explanation": {
    "uz": "Bir metr 12 ming so'm; 11 metr 132 ming so'm.",
    "ru": "Правильный ответ: 132. При прямой зависимости величины меняются одинаково, при обратной — в противоположных направлениях.",
    "en": "One metre costs 12 thousand sum; 11 metres cost 132 thousand sum."
  }
};

export default function D19_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={19} task={8}/>;
}
