import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Uchburchak va murakkab shakllar yuzi",
    "ru": "Площадь треугольника и сложных фигур",
    "en": "The area of a triangle and of compound shapes"
  },
  "prompt": {
    "uz": "12×9 to‘rtburchakdan yuzi 24 bo‘lgan uchburchak kesildi. Qolgan yuzni toping.",
    "ru": "Из прямоугольника 12×9 вырезали треугольник площадью 24. Найдите остаток.",
    "en": "A triangle with the area 24 was cut out of a 12×9 rectangle. Find the area that is left."
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
    "ru": "После последовательного применения правила темы к данным условия получается 84.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 84."
  }
};

export default function D43_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={43} task={7}/>;
}
