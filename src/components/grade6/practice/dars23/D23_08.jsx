import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Mato miqdori",
    "ru": "Практика к уроку 23. Задачи на пропорции"
  },
  "prompt": {
    "uz": "15 metr matodan 6 ta bir xil buyum tayyorlanadi. 14 ta buyum uchun necha metr mato kerakligini yozing.",
    "ru": "Из 15 метров ткани получают 6 одинаковых изделий. Сколько ткани нужно для 14 изделий?"
  },
  "answer": "35",
  "explanation": {
    "uz": "Bir buyumga 15 : 6 = 2,5 metr; 14 buyumga 35 metr.",
    "ru": "Правильный ответ: 35. Сначала определяют вид зависимости, затем составляют и решают пропорцию."
  }
};

export default function D23_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={23} task={8}/>;
}
