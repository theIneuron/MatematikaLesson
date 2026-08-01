import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Geometriya va ma'lumotlar bo'limi yakuni",
    "ru": "Итог раздела геометрии и данных"
  },
  "prompt": {
    "uz": "10×8 to‘rtburchakdan asosi 6, balandligi 4 uchburchak kesildi. Qolgan yuzni toping.",
    "ru": "Из прямоугольника 10×8 вырезали треугольник с основанием 6 и высотой 4. Найдите остаток."
  },
  "options": [
    "56 cm²",
    "62 cm²",
    "68 cm²",
    "74 cm²"
  ],
  "answer": "68 cm²",
  "translationsRu": {
    "56 cm²": "56 см²",
    "62 cm²": "62 см²",
    "68 cm²": "68 см²",
    "74 cm²": "74 см²"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 68 cm² hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 68 cm²."
  }
};

export default function D46_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={46} task={10}/>;
}
