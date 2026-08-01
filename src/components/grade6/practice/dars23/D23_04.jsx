import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Retsept proporsiyasi",
    "ru": "Практика к уроку 23. Задачи на пропорции"
  },
  "prompt": {
    "uz": "Retseptda 6 kishiga 450 gramm un kerak. 10 kishiga xuddi shu nisbatda qancha un kerak bo'ladi?",
    "ru": "Для шести человек требуется 450 граммов муки. Сколько нужно для 10 человек?"
  },
  "options": [
    "600 g",
    "650 g",
    "700 g",
    "750 g"
  ],
  "answer": "750 g",
  "explanation": {
    "uz": "Bir kishiga 450 : 6 = 75 gramm; 10 kishiga 750 gramm.",
    "ru": "Правильный ответ: 750 g. Сначала определяют вид зависимости, затем составляют и решают пропорцию."
  }
};

export default function D23_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={23} task={4}/>;
}
