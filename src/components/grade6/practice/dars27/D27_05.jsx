import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Ratsional sonlarni qo'shish",
    "ru": "Сложение рациональных чисел"
  },
  "prompt": {
    "uz": "Qarama-qarshi 18 va −18 sonlarining yig‘indisi nolga teng.",
    "ru": "Сумма противоположных чисел 18 и −18 равна нулю."
  },
  "options": [
    "Ha",
    "Yo'q"
  ],
  "answer": "Ha",
  "translationsRu": {
    "Ha": "Да",
    "Yo'q": "Нет"
  },
  "explanation": {
    "uz": "Qarama-qarshi sonlar modullari teng, ishoralari turlicha; ularning yig‘indisi 0.",
    "ru": "У противоположных чисел равные модули и разные знаки, поэтому их сумма равна 0."
  }
};

export default function D27_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={27} task={5}/>;
}
