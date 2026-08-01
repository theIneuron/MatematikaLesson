import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Ratsional sonlarni qo'shish",
    "ru": "Сложение рациональных чисел"
  },
  "prompt": {
    "uz": "Hisoblashlarni to‘g‘ri javoblari bilan bog‘lang.",
    "ru": "Соедините вычисления с правильными ответами."
  },
  "left": [
    "−2,5 + 1,2",
    "3,7 + (−5,1)",
    "−4,6 + (−2,3)"
  ],
  "right": [
    "−1,3",
    "−1,4",
    "−6,9"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir ifodada ishoralar qoidasi qo‘llanadi: natijalar −1,3; −1,4 va −6,9.",
    "ru": "По правилу знаков получаем соответственно −1,3; −1,4 и −6,9."
  }
};

export default function D27_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={27} task={6}/>;
}
