import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Ishchilar va kunlar",
    "ru": "Практика к уроку 23. Задачи на пропорции"
  },
  "prompt": {
    "uz": "12 ishchi ishni 18 kunda tugatadi. Bir xil unumda 27 ishchi shu ishni necha kunda tugatishini yozing.",
    "ru": "Двенадцать рабочих выполняют работу за 18 дней. За сколько дней её выполнят 27 рабочих?"
  },
  "answer": "8",
  "explanation": {
    "uz": "Ishchi-kunlar soni o'zgarmaydi: 12 × 18 = 27 × 8.",
    "ru": "Правильный ответ: 8. Сначала определяют вид зависимости, затем составляют и решают пропорцию."
  }
};

export default function D23_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={23} task={2}/>;
}
