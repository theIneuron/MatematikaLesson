import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Teskari kasrning surati",
    "ru": "Практика к уроку 13. Взаимно обратные числа и нахождение целого"
  },
  "prompt": {
    "uz": "9/13 kasriga teskari kasrning suratini aniqlang va faqat shu sonni yozing.",
    "ru": "Запишите числитель дроби, обратной 9/13."
  },
  "answer": "13",
  "explanation": {
    "uz": "9/13 kasrining surat va maxraji almashadi: teskari kasr 13/9. Uning surati 13.",
    "ru": "Правильный ответ: 13. Произведение взаимно обратных чисел равно единице."
  }
};

export default function D13_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={13} task={2}/>;
}
