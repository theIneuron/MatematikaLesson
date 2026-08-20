import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Doira yuzi",
    "ru": "Площадь круга",
    "en": "The area of a disc"
  },
  "prompt": {
    "uz": "Halqaning tashqi radiusi 5 cm, ichki radiusi 3 cm. π=3 da yuzini toping.",
    "ru": "Внешний радиус кольца 5 см, внутренний 3 см. Найдите площадь при π=3.",
    "en": "The outer radius of a ring is 5 cm and its inner radius is 3 cm. Find its area, taking π=3."
  },
  "options": [
    "24 cm²",
    "36 cm²",
    "48 cm²",
    "75 cm²"
  ],
  "answer": "48 cm²",
  "translationsRu": {
    "24 cm²": "24 см²",
    "36 cm²": "36 см²",
    "48 cm²": "48 см²",
    "75 cm²": "75 см²"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 48 cm² hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 48 см².",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 48 cm²."
  }
};

export default function D39_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={39} task={10}/>;
}
