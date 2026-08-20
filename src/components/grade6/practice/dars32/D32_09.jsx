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
    "3(a−2)+1",
    "−(2x−5)",
    "4−2(y+1)"
  ],
  "right": [
    "3a−5",
    "−2x+5",
    "2−2y"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 3(a−2)+1 ↔ 3a−5; −(2x−5) ↔ −2x+5; 4−2(y+1) ↔ 2−2y.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: 3(a−2)+1 ↔ 3a−5; −(2x−5) ↔ −2x+5; 4−2(y+1) ↔ 2−2y."
  }
};

export default function D32_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={32} task={9}/>;
}
