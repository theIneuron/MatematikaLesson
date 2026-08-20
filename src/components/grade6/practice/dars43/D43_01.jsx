import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Uchburchak va murakkab shakllar yuzi",
    "ru": "Площадь треугольника и сложных фигур",
    "en": "The area of a triangle and of compound shapes"
  },
  "prompt": {
    "uz": "Asosi 10 cm, balandligi 6 cm bo‘lgan uchburchak yuzini toping.",
    "ru": "Найдите площадь треугольника с основанием 10 см и высотой 6 см.",
    "en": "Find the area of a triangle with the base 10 cm and the height 6 cm."
  },
  "options": [
    "16 cm²",
    "30 cm²",
    "60 cm²",
    "80 cm²"
  ],
  "answer": "30 cm²",
  "translationsRu": {
    "16 cm²": "16 см²",
    "30 cm²": "30 см²",
    "60 cm²": "60 см²",
    "80 cm²": "80 см²"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 30 cm² hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 30 см².",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 30 cm²."
  }
};

export default function D43_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={43} task={1}/>;
}
