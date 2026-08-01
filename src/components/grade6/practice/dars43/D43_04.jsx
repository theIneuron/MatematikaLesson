import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Uchburchak va murakkab shakllar yuzi",
    "ru": "Площадь треугольника и сложных фигур"
  },
  "prompt": {
    "uz": "Uchburchak yuzi 48 cm², asosi 12 cm. Balandligini toping.",
    "ru": "Площадь треугольника 48 см², основание 12 см. Найдите высоту."
  },
  "options": [
    "4 cm",
    "6 cm",
    "8 cm",
    "12 cm"
  ],
  "answer": "8 cm",
  "translationsRu": {
    "4 cm": "4 см",
    "6 cm": "6 см",
    "8 cm": "8 см",
    "12 cm": "12 см"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 8 cm hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 8 cm."
  }
};

export default function D43_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={43} task={4}/>;
}
