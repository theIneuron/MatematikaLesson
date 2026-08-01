import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Iqtisodiy va ishga oid masalalar",
    "ru": "Экономические задачи и задачи на работу"
  },
  "prompt": {
    "uz": "Ikki usta soatiga 12 va 15 tadan detal tayyorlaydi. 8 soatda jami nechta detal tayyorlanadi?",
    "ru": "Два мастера делают 12 и 15 деталей в час. Сколько деталей они сделают за 8 часов?"
  },
  "options": [
    "196",
    "206",
    "216",
    "226"
  ],
  "answer": "216",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 216 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 216."
  }
};

export default function D36_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={36} task={10}/>;
}
