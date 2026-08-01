import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Qolgan masofa",
    "ru": "Практика к уроку 16. Задачи с дробями и десятичными дробями"
  },
  "prompt": {
    "uz": "Sayyoh 18,6 kilometr yo'lning 2,4 kilometrini bosib o'tdi. Qolgan masofani hisoblab, javobni kilometrda yozing.",
    "ru": "Турист прошёл 2,4 км из 18,6 км. Вычислите оставшееся расстояние."
  },
  "answer": "16,2",
  "explanation": {
    "uz": "Qolgan yo'l 18,6 − 2,4 = 16,2 kilometr.",
    "ru": "Правильный ответ: 16,2. Сначала величины приводят к одному виду, затем выполняют нужное действие."
  }
};

export default function D16_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={16} task={2}/>;
}
