import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Eng katta bo'luvchi",
    "ru": "Практика к уроку 5. Наибольший общий делитель"
  },
  "prompt": {
    "uz": "20 va 30 ning eng katta umumiy bo'luvchisini toping.",
    "ru": "Найдите наибольший общий делитель чисел 20 и 30."
  },
  "options": [
    "5",
    "10",
    "15",
    "20"
  ],
  "answer": "10",
  "explanation": {
    "uz": "20 va 30 ni bo'ladigan eng katta son 10.",
    "ru": "Правильный ответ: 10. НОД — наибольший из общих делителей."
  }
};

export default function D05_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={5} task={4}/>;
}
