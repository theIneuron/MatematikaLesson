import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Noma'lum maxraj",
    "ru": "Практика к уроку 7. Основное свойство дроби",
    "en": "The unknown denominator"
  },
  "prompt": {
    "uz": "25/? = 5/6 tenglik to'g'ri bo'lishi uchun noma'lum maxrajni topib yozing.",
    "ru": "Найдите неизвестный знаменатель в равенстве 25/? = 5/6.",
    "en": "Find the unknown denominator that makes the equality 25/? = 5/6 true."
  },
  "answer": "30",
  "explanation": {
    "uz": "25/30 = 5/6, chunki surat va maxraj 5 ga bo'linadi.",
    "ru": "Правильный ответ: 30. При умножении или делении числителя и знаменателя на одно число значение дроби не меняется.",
    "en": "25/30 = 5/6, because the numerator and the denominator both divide by 5."
  }
};

export default function D07_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={7} task={8}/>;
}
