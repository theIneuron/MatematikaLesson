import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Qavslarni ochish",
    "ru": "Раскрытие скобок",
    "en": "Opening brackets"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "−(a+5)",
    "3(2x−1)",
    "−2(4−y)"
  ],
  "right": [
    "−a−5",
    "6x−3",
    "−8+2y"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: −(a+5) ↔ −a−5; 3(2x−1) ↔ 6x−3; −2(4−y) ↔ −8+2y.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: −(a+5) ↔ −a−5; 3(2x−1) ↔ 6x−3; −2(4−y) ↔ −8+2y."
  }
};

export default function D32_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={32} task={6}/>;
}
