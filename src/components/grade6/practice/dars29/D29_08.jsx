import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Ratsional sonlarni ko'paytirish va bo'lish",
    "ru": "Умножение и деление рациональных чисел"
  },
  "prompt": {
    "uz": "−4 · 6 : (−3) ifodaning qiymatini yozing.",
    "ru": "Вычислите −4 · 6 : (−3) и запишите ответ."
  },
  "answer": "8",
  "explanation": {
    "uz": "−4 · 6 = −24, so‘ng −24 : (−3) = 8.",
    "ru": "−4 · 6 = −24, затем −24 : (−3) = 8."
  }
};

export default function D29_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={29} task={8}/>;
}
