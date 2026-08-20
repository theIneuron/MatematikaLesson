import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Sonning moduli",
    "ru": "Практика к уроку 25. Модуль числа",
    "en": "The modulus of a number"
  },
  "prompt": {
    "uz": "−13 sonining modulini noldan bo'lgan masofa sifatida aniqlang va to'g'ri javobni tanlang.",
    "ru": "Найдите модуль числа −13 как расстояние от нуля.",
    "en": "Work out the modulus of −13 as its distance from zero and choose the right answer."
  },
  "options": [
    "−13",
    "0",
    "13",
    "26"
  ],
  "answer": "13",
  "explanation": {
    "uz": "|−13| = 13, chunki −13 soni noldan 13 birlik uzoqda.",
    "ru": "Правильный ответ: 13. Модуль числа — его расстояние от нуля, поэтому модуль не бывает отрицательным.",
    "en": "|−13| = 13, because −13 is 13 units away from zero."
  }
};

export default function D25_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={25} task={1}/>;
}
