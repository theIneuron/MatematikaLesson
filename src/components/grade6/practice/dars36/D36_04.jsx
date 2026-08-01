import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Iqtisodiy va ishga oid masalalar",
    "ru": "Экономические задачи и задачи на работу"
  },
  "prompt": {
    "uz": "Usta soatiga 15 ta detal tayyorlaydi. 7 soatda nechta detal tayyorlaydi?",
    "ru": "Мастер изготавливает 15 деталей в час. Сколько деталей он сделает за 7 часов?"
  },
  "options": [
    "90",
    "100",
    "105",
    "120"
  ],
  "answer": "105",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 105 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 105."
  }
};

export default function D36_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={36} task={4}/>;
}
