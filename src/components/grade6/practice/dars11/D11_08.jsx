import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Natijaning maxraji",
    "ru": "Практика к уроку 11. Умножение обыкновенных дробей"
  },
  "prompt": {
    "uz": "11/18 × 9/22 ko'paytmani qisqartirib hisoblang. Natijadagi kasrning maxrajini yozing.",
    "ru": "Вычислите 11/18 × 9/22 и запишите знаменатель результата."
  },
  "answer": "4",
  "explanation": {
    "uz": "11/18 × 9/22 = 1/4, chunki 11 bilan 22 va 9 bilan 18 oldindan qisqaradi. Maxraj 4.",
    "ru": "Правильный ответ: 4. При умножении дробей перемножают числители и знаменатели, а результат сокращают."
  }
};

export default function D11_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={11} task={8}/>;
}
