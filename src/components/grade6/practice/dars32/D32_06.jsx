import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Qavslarni ochish",
    "ru": "Раскрытие скобок"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
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
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D32_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={32} task={6}/>;
}
