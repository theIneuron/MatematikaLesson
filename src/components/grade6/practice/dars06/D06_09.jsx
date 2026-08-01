import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "EKUKlarni moslashtirish",
    "ru": "Практика к уроку 6. Наименьшее общее кратное"
  },
  "prompt": {
    "uz": "Sonlar juftini EKUKi bilan moslashtiring.",
    "ru": "Соедините пары чисел с их НОК."
  },
  "left": [
    "8 va 15",
    "14 va 25",
    "16 va 21"
  ],
  "right": [
    "120",
    "336",
    "350"
  ],
  "pairs": [
    0,
    2,
    1
  ],
  "translationsRu": {
    "8 va 15": "8 и 15",
    "14 va 25": "14 и 25",
    "16 va 21": "16 и 21"
  },
  "explanation": {
    "uz": "EKUK(8,15)=120, EKUK(14,25)=350, EKUK(16,21)=336.",
    "ru": "Все пары найдены правильно. НОК — наименьшее положительное общее кратное."
  }
};

export default function D06_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={6} task={9}/>;
}
