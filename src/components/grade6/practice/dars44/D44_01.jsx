import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Fazoviy shakllar hajmi va o'lchov birliklari",
    "ru": "Объём пространственных фигур и единицы",
    "en": "The volume of solids and units of measure"
  },
  "prompt": {
    "uz": "O‘lchamlari 3 cm, 4 cm va 5 cm bo‘lgan parallelepiped hajmini toping.",
    "ru": "Найдите объём параллелепипеда размером 3, 4 и 5 см.",
    "en": "Find the volume of a cuboid with the sides 3 cm, 4 cm and 5 cm."
  },
  "options": [
    "12 cm³",
    "20 cm³",
    "47 cm³",
    "60 cm³"
  ],
  "answer": "60 cm³",
  "translationsRu": {
    "12 cm³": "12 см³",
    "20 cm³": "20 см³",
    "47 cm³": "47 см³",
    "60 cm³": "60 см³"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 60 cm³ hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 60 см³.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 60 cm³."
  }
};

export default function D44_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={44} task={1}/>;
}
