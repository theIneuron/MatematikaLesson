import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Teskari kasrning surati",
    "ru": "Практика к уроку 13. Взаимно обратные числа и нахождение целого",
    "en": "The numerator of the reciprocal"
  },
  "prompt": {
    "uz": "9/13 kasriga teskari kasrning suratini aniqlang va faqat shu sonni yozing.",
    "ru": "Запишите числитель дроби, обратной 9/13.",
    "en": "Work out the numerator of the reciprocal of 9/13 and write only that number."
  },
  "answer": "13",
  "explanation": {
    "uz": "9/13 kasrining surat va maxraji almashadi: teskari kasr 13/9. Uning surati 13.",
    "ru": "Правильный ответ: 13. Произведение взаимно обратных чисел равно единице.",
    "en": "The numerator and the denominator of 9/13 swap places: the reciprocal is 13/9. Its numerator is 13."
  }
};

export default function D13_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={13} task={2}/>;
}
