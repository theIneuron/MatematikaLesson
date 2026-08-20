import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Uchburchak elementlari, turlari va perimetri",
    "ru": "Элементы, виды и периметр треугольника",
    "en": "Elements, kinds and perimeter of a triangle"
  },
  "prompt": {
    "uz": "Perimetri 42 cm bo‘lgan teng yonli uchburchakning asosi 12 cm. Yon tomonini toping.",
    "ru": "Периметр равнобедренного треугольника 42 см, основание 12 см. Найдите боковую сторону.",
    "en": "The perimeter of an isosceles triangle is 42 cm and its base is 12 cm. Find one of its equal sides."
  },
  "options": [
    "12 cm",
    "15 cm",
    "18 cm",
    "30 cm"
  ],
  "answer": "15 cm",
  "translationsRu": {
    "12 cm": "12 см",
    "15 cm": "15 см",
    "18 cm": "18 см",
    "30 cm": "30 см"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 15 cm hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 15 см.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 15 cm."
  }
};

export default function D42_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={42} task={10}/>;
}
