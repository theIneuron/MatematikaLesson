import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Fazoviy shakllar hajmi va o'lchov birliklari",
    "ru": "Объём пространственных фигур и единицы",
    "en": "The volume of solids and units of measure"
  },
  "prompt": {
    "uz": "Akvarium 50×30×40 cm. Uning sig‘imini litrlarda toping.",
    "ru": "Аквариум имеет размеры 50×30×40 см. Найдите вместимость в литрах.",
    "en": "An aquarium is 50×30×40 cm. Find how much it holds in litres."
  },
  "options": [
    "6 l",
    "60 l",
    "600 l",
    "6000 l"
  ],
  "answer": "60 l",
  "translationsRu": {
    "6 l": "6 л",
    "60 l": "60 л",
    "600 l": "600 л",
    "6000 l": "6000 л"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 60 l hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 60 л.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 60 l."
  }
};

export default function D44_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={44} task={10}/>;
}
