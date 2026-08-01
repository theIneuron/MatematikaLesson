import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Doira yuzi",
    "ru": "Площадь круга"
  },
  "prompt": {
    "uz": "Radiusi 4 cm bo‘lgan doira yuzini π=3,14 da toping.",
    "ru": "Найдите площадь круга радиуса 4 см при π=3,14."
  },
  "options": [
    "12,56 cm²",
    "25,12 cm²",
    "50,24 cm²",
    "100,48 cm²"
  ],
  "answer": "50,24 cm²",
  "translationsRu": {
    "12,56 cm²": "12,56 см²",
    "25,12 cm²": "25,12 см²",
    "50,24 cm²": "50,24 см²",
    "100,48 cm²": "100,48 см²"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 50,24 cm² hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 50,24 cm²."
  }
};

export default function D39_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={39} task={1}/>;
}
