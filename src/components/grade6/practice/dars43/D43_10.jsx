import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Uchburchak va murakkab shakllar yuzi",
    "ru": "Площадь треугольника и сложных фигур"
  },
  "prompt": {
    "uz": "Trapetsiyasimon shakl 8×6 to‘rtburchak va asosi 8, balandligi 3 uchburchakdan tuzilgan. Jami yuzni toping.",
    "ru": "Фигура состоит из прямоугольника 8×6 и треугольника с основанием 8 и высотой 3. Найдите площадь."
  },
  "options": [
    "54",
    "60",
    "72",
    "96"
  ],
  "answer": "60",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 60 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 60."
  }
};

export default function D43_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={43} task={10}/>;
}
