import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Noma'lum chetki had",
    "ru": "Практика к уроку 18. Пропорция",
    "en": "The unknown outer term"
  },
  "prompt": {
    "uz": "x : 18 = 7 : 9 proporsiyada noma'lum x ni toping. Javobni dastlabki nisbatga qo'yib tekshiring.",
    "ru": "Найдите x в пропорции x : 18 = 7 : 9.",
    "en": "Find the unknown x in the proportion x : 18 = 7 : 9. Put the answer back into the first ratio to check it."
  },
  "options": [
    "12",
    "13",
    "14",
    "16"
  ],
  "answer": "14",
  "explanation": {
    "uz": "9x = 18 × 7 = 126; x = 14.",
    "ru": "Правильный ответ: 14. В пропорции произведение крайних членов равно произведению средних.",
    "en": "9x = 18 × 7 = 126; x = 14."
  }
};

export default function D18_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={18} task={7}/>;
}
