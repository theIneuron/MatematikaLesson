import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Uchburchak va murakkab shakllar yuzi",
    "ru": "Площадь треугольника и сложных фигур"
  },
  "prompt": {
    "uz": "12×9 to‘rtburchakdan yuzi 24 bo‘lgan uchburchak kesildi. Qolgan yuzni toping.",
    "ru": "Из прямоугольника 12×9 вырезали треугольник площадью 24. Найдите остаток."
  },
  "options": [
    "72",
    "80",
    "84",
    "108"
  ],
  "answer": "84",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 84 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 84."
  }
};

export default function D43_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={43} task={7}/>;
}
