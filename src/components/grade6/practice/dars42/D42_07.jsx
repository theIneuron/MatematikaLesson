import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Uchburchak elementlari, turlari va perimetri",
    "ru": "Элементы, виды и периметр треугольника"
  },
  "prompt": {
    "uz": "Ikki tomoni 9 cm va 13 cm. Uchinchi tomon uchun qaysi uzunlik mumkin?",
    "ru": "Две стороны равны 9 и 13 см. Какая длина третьей стороны возможна?"
  },
  "options": [
    "3 cm",
    "4 cm",
    "10 cm",
    "23 cm"
  ],
  "answer": "10 cm",
  "translationsRu": {
    "3 cm": "3 см",
    "4 cm": "4 см",
    "10 cm": "10 см",
    "23 cm": "23 см"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 10 cm hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 10 cm."
  }
};

export default function D42_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={42} task={7}/>;
}
