import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Ratsional sonlarni ko'paytirish va bo'lish",
    "ru": "Умножение и деление рациональных чисел"
  },
  "prompt": {
    "uz": "−72 : (−9) bo‘linmaning qiymatini yozing.",
    "ru": "Запишите значение частного −72 : (−9)."
  },
  "answer": "8",
  "explanation": {
    "uz": "Bir xil ishorali sonlar bo‘linmasi musbat: 72 : 9 = 8.",
    "ru": "Частное чисел с одинаковыми знаками положительно: 72 : 9 = 8."
  }
};

export default function D29_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={29} task={2}/>;
}
