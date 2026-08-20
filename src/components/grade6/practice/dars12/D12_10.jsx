import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Teng qismlarga bo'lish",
    "ru": "Практика к уроку 12. Деление обыкновенных дробей",
    "en": "Dividing into equal parts"
  },
  "prompt": {
    "uz": "3/4 litr sharbat 1/8 litrlik teng stakanlarga quyildi. Barcha sharbat uchun nechta stakan kerak bo'lishini toping.",
    "ru": "Три четверти литра сока разлили в стаканы по одной восьмой литра. Сколько стаканов понадобилось?",
    "en": "3/4 of a litre of juice was poured into equal glasses of 1/8 of a litre. Find how many glasses were needed for all the juice."
  },
  "options": [
    "4 ta",
    "5 ta",
    "6 ta",
    "8 ta"
  ],
  "answer": "6 ta",
  "translationsRu": {
    "4 ta": "4 стакана",
    "5 ta": "5 стаканов",
    "6 ta": "6 стаканов",
    "8 ta": "8 стаканов"
  },
  "translationsEn": {
    "4 ta": "4 glasses",
    "5 ta": "5 glasses",
    "6 ta": "6 glasses",
    "8 ta": "8 glasses"
  },
  "explanation": {
    "uz": "Stakanlar soni 3/4 : 1/8 = 3/4 × 8 = 6 ga teng.",
    "ru": "Правильный ответ: 6 стаканов. Деление на дробь заменяют умножением на обратную дробь.",
    "en": "The number of glasses is 3/4 : 1/8 = 3/4 × 8 = 6."
  }
};

export default function D12_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={12} task={10}/>;
}
