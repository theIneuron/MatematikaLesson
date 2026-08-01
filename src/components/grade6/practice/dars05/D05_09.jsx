import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "EKUBlarni moslashtirish",
    "ru": "Практика к уроку 5. Наибольший общий делитель"
  },
  "prompt": {
    "uz": "Sonlar juftini EKUBi bilan moslashtiring.",
    "ru": "Соедините пары чисел с их НОД."
  },
  "left": [
    "32 va 56",
    "27 va 63",
    "50 va 80"
  ],
  "right": [
    "8",
    "9",
    "10"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "32 va 56": "32 и 56",
    "27 va 63": "27 и 63",
    "50 va 80": "50 и 80"
  },
  "explanation": {
    "uz": "EKUB(32,56)=8, EKUB(27,63)=9, EKUB(50,80)=10.",
    "ru": "Все пары найдены правильно. НОД — наибольший из общих делителей."
  }
};

export default function D05_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={5} task={9}/>;
}
