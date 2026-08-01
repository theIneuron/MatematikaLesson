import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Nolgacha masofa",
    "ru": "Практика к уроку 25. Модуль числа"
  },
  "prompt": {
    "uz": "Koordinata chizig'ida −15 sonidan nolgacha bo'lgan masofani yozing.",
    "ru": "Запишите расстояние от числа −15 до нуля."
  },
  "answer": "15",
  "explanation": {
    "uz": "|−15| = 15, demak nolgacha masofa 15 birlik.",
    "ru": "Правильный ответ: 15. Модуль числа — его расстояние от нуля, поэтому модуль не бывает отрицательным."
  }
};

export default function D25_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={25} task={8}/>;
}
