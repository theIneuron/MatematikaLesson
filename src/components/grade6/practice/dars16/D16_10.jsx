import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ikki bosqichli masala",
    "ru": "Практика к уроку 16. Задачи с дробями и десятичными дробями"
  },
  "prompt": {
    "uz": "24 metrlik matoning 5/12 qismi ishlatildi, keyin yana 3,5 metr sarflandi. Qancha mato qolganini toping.",
    "ru": "Из 24 метров ткани использовали 5/12 всей ткани, а затем ещё 3,5 метра. Сколько ткани осталось?"
  },
  "options": [
    "9,5 m",
    "10,5 m",
    "11,5 m",
    "13,5 m"
  ],
  "answer": "10,5 m",
  "translationsRu": {
    "9,5 m": "9,5 м",
    "10,5 m": "10,5 м",
    "11,5 m": "11,5 м",
    "13,5 m": "13,5 м"
  },
  "explanation": {
    "uz": "24 × 5/12 = 10 metr, jami 13,5 metr ishlatildi; 24 − 13,5 = 10,5 metr.",
    "ru": "Правильный ответ: 10,5 м. Сначала величины приводят к одному виду, затем выполняют нужное действие."
  }
};

export default function D16_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={16} task={10}/>;
}
