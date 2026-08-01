import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Noma'lum surat",
    "ru": "Практика к уроку 7. Основное свойство дроби"
  },
  "prompt": {
    "uz": "?/28 = 3/7 tenglik to'g'ri bo'lishi uchun noma'lum suratni topib yozing.",
    "ru": "Найдите неизвестный числитель в равенстве ?/28 = 3/7."
  },
  "answer": "12",
  "explanation": {
    "uz": "28 : 7 = 4, demak surat ham 3 × 4 = 12 bo'ladi.",
    "ru": "Правильный ответ: 12. При умножении или делении числителя и знаменателя на одно число значение дроби не меняется."
  }
};

export default function D07_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={7} task={2}/>;
}
