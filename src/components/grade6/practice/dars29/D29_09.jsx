import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Ratsional sonlarni ko'paytirish va bo'lish",
    "ru": "Умножение и деление рациональных чисел"
  },
  "prompt": {
    "uz": "Ifodalarni to‘g‘ri qiymatlar bilan juftlang.",
    "ru": "Соедините выражения с правильными значениями."
  },
  "left": [
    "(−2)⁴",
    "(−3)³",
    "−5²"
  ],
  "right": [
    "16",
    "−27",
    "−25"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Juft daraja musbat, toq daraja manfiy; −5² yozuvida minus darajaga kirmaydi.",
    "ru": "Чётная степень положительна, нечётная отрицательна; в −5² минус не входит в степень."
  }
};

export default function D29_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={29} task={9}/>;
}
