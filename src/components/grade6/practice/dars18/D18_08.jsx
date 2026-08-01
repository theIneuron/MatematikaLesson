import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Noma'lum o'rta had",
    "ru": "Практика к уроку 18. Пропорция"
  },
  "prompt": {
    "uz": "16 : x = 4 : 11 proporsiyada noma'lum maxrajni toping.",
    "ru": "Найдите неизвестный знаменатель в пропорции 16 : x = 4 : 11."
  },
  "answer": "44",
  "explanation": {
    "uz": "4x = 16 × 11 = 176; x = 44.",
    "ru": "Правильный ответ: 44. В пропорции произведение крайних членов равно произведению средних."
  }
};

export default function D18_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={18} task={8}/>;
}
