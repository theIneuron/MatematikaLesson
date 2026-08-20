import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Fazoviy shakllar hajmi va o'lchov birliklari",
    "ru": "Объём пространственных фигур и единицы",
    "en": "The volume of solids and units of measure"
  },
  "prompt": {
    "uz": "Hajmi 120 cm³, asos yuzi 30 cm² bo‘lgan prizma balandligini toping.",
    "ru": "Объём призмы 120 см³, площадь основания 30 см². Найдите высоту.",
    "en": "The volume of a prism is 120 cm³ and the area of its base is 30 cm². Find its height."
  },
  "options": [
    "3 cm",
    "4 cm",
    "5 cm",
    "6 cm"
  ],
  "answer": "4 cm",
  "translationsRu": {
    "3 cm": "3 см",
    "4 cm": "4 см",
    "5 cm": "5 см",
    "6 cm": "6 см"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 4 cm hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 4 см.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 4 cm."
  }
};

export default function D44_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={44} task={7}/>;
}
