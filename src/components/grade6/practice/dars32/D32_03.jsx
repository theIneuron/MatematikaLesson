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
    "2(a+4)",
    "5(y−1)",
    "−3(m+2)"
  ],
  "right": [
    "2a+8",
    "5y−5",
    "−3m−6"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "−3(m+2)": "−3(m+2)"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 2(a+4) ↔ 2a+8; 5(y−1) ↔ 5y−5; −3(m+2) ↔ −3m−6.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: 2(a+4) ↔ 2a+8; 5(y−1) ↔ 5y−5; −3(m+2) ↔ −3m−6."
  }
};

export default function D32_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={32} task={3}/>;
}
