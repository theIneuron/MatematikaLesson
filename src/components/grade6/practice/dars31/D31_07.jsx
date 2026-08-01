import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Harfli ifodalar",
    "ru": "Буквенные выражения"
  },
  "prompt": {
    "uz": "To‘g‘ri to‘rtburchak tomonlari a va b. Perimetr formulasini tanlang.",
    "ru": "Стороны прямоугольника a и b. Выберите формулу периметра."
  },
  "options": [
    "ab",
    "2a+b",
    "2(a+b)",
    "a+b"
  ],
  "answer": "2(a+b)",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 2(a+b) hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 2(a+b)."
  }
};

export default function D31_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={31} task={7}/>;
}
