import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kasrlarni bo'lish",
    "ru": "Практика к уроку 12. Деление обыкновенных дробей"
  },
  "prompt": {
    "uz": "3/5 kasrni 2/7 kasrga bo'ling. Bo'lishni ikkinchi kasrning teskarisiga ko'paytirish bilan almashtirib, javobni tanlang.",
    "ru": "Разделите 3/5 на 2/7, заменив деление умножением на обратную дробь."
  },
  "options": [
    "21/10",
    "6/35",
    "10/21",
    "5/6"
  ],
  "answer": "21/10",
  "explanation": {
    "uz": "3/5 : 2/7 = 3/5 × 7/2 = 21/10.",
    "ru": "Правильный ответ: 21/10. Деление на дробь заменяют умножением на обратную дробь."
  }
};

export default function D12_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={12} task={1}/>;
}
