import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Teng qismlarga bo'lish",
    "ru": "Практика к уроку 12. Деление обыкновенных дробей"
  },
  "prompt": {
    "uz": "3/4 litr sharbat 1/8 litrlik teng stakanlarga quyildi. Barcha sharbat uchun nechta stakan kerak bo'lishini toping.",
    "ru": "Три четверти литра сока разлили в стаканы по одной восьмой литра. Сколько стаканов понадобилось?"
  },
  "options": [
    "4 ta",
    "5 ta",
    "6 ta",
    "8 ta"
  ],
  "answer": "6 ta",
  "translationsRu": {
    "4 ta": "4 шт.",
    "5 ta": "5 шт.",
    "6 ta": "6 шт.",
    "8 ta": "8 шт."
  },
  "explanation": {
    "uz": "Stakanlar soni 3/4 : 1/8 = 3/4 × 8 = 6 ga teng.",
    "ru": "Правильный ответ: 6 шт.. Деление на дробь заменяют умножением на обратную дробь."
  }
};

export default function D12_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={12} task={10}/>;
}
