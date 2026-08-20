import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Teskari proporsiya",
    "ru": "Практика к уроку 19. Прямая и обратная пропорциональность",
    "en": "Inverse proportion"
  },
  "prompt": {
    "uz": "6 ishchi bir xil unum bilan ishni 12 kunda tugatadi. Shu ishni 9 ishchi necha kunda tugatishini teskari proporsiya orqali toping.",
    "ru": "Шесть рабочих выполняют работу за 12 дней. За сколько дней её выполнят 9 рабочих?",
    "en": "6 workers who all work at the same rate finish a job in 12 days. Use inverse proportion to find how many days 9 workers need for the same job."
  },
  "answer": "8",
  "explanation": {
    "uz": "Ishchilar va kunlar ko'paytmasi o'zgarmaydi: 6 × 12 = 9 × 8.",
    "ru": "Правильный ответ: 8. При прямой зависимости величины меняются одинаково, при обратной — в противоположных направлениях.",
    "en": "The product of the workers and the days stays the same: 6 × 12 = 9 × 8."
  }
};

export default function D19_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={19} task={2}/>;
}
