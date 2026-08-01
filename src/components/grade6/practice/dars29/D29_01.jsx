import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ratsional sonlarni ko'paytirish va bo'lish",
    "ru": "Умножение и деление рациональных чисел"
  },
  "prompt": {
    "uz": "−6 · 7 ko‘paytmaning ishorasi va qiymatini toping.",
    "ru": "Найдите знак и значение произведения −6 · 7."
  },
  "options": [
    "−42",
    "42",
    "−13",
    "13"
  ],
  "answer": "−42",
  "explanation": {
    "uz": "Har xil ishorali sonlar ko‘paytmasi manfiy: 6 · 7 = 42, javob −42.",
    "ru": "Произведение чисел с разными знаками отрицательно: 6 · 7 = 42, ответ −42."
  }
};

export default function D29_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={29} task={1}/>;
}
