import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Yoqilg'i sarfi",
    "ru": "Практика к уроку 23. Задачи на пропорции"
  },
  "prompt": {
    "uz": "Avtomobil 8 litr yoqilg'i bilan 96 kilometr yuradi. Shu sarfda 25 litr yoqilg'i bilan necha kilometr yuradi?",
    "ru": "Автомобиль проезжает 96 км на 8 литрах топлива. Сколько километров он проедет на 25 литрах?"
  },
  "options": [
    "240 km",
    "280 km",
    "300 km",
    "320 km"
  ],
  "answer": "300 km",
  "translationsRu": {
    "240 km": "240 км",
    "280 km": "280 км",
    "300 km": "300 км",
    "320 km": "320 км"
  },
  "explanation": {
    "uz": "Bir litrga 96 : 8 = 12 km; 25 litrga 300 km.",
    "ru": "Правильный ответ: 300 км. Сначала определяют вид зависимости, затем составляют и решают пропорцию."
  }
};

export default function D23_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={23} task={7}/>;
}
