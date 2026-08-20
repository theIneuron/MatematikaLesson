import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Doira yuzi",
    "ru": "Площадь круга",
    "en": "The area of a disc"
  },
  "prompt": {
    "uz": "Radiusi 3 cm bo‘lgan doira bilan radiusi 6 cm doira yuzlari nisbatini toping.",
    "ru": "Найдите отношение площадей кругов радиусов 3 см и 6 см.",
    "en": "Find the ratio of the areas of a disc with the radius 3 cm and a disc with the radius 6 cm."
  },
  "options": [
    "1:2",
    "1:3",
    "1:4",
    "1:6"
  ],
  "answer": "1:4",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 1:4 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 1:4.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 1:4."
  }
};

export default function D39_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={39} task={7}/>;
}
