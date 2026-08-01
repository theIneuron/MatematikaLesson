import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Natijaning maxraji",
    "ru": "Практика к уроку 12. Деление обыкновенных дробей"
  },
  "prompt": {
    "uz": "8/21 : 4/7 bo'lish amalini hisoblang. Qisqarmas javobning maxrajini yozing.",
    "ru": "Вычислите 8/21 : 4/7 и запишите знаменатель результата."
  },
  "answer": "3",
  "explanation": {
    "uz": "8/21 : 4/7 = 8/21 × 7/4 = 2/3. Natijaning maxraji 3.",
    "ru": "Правильный ответ: 3. Деление на дробь заменяют умножением на обратную дробь."
  }
};

export default function D12_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={12} task={8}/>;
}
