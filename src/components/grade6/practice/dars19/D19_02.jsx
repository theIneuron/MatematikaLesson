import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Teskari proporsiya",
    "ru": "Практика к уроку 19. Прямая и обратная пропорциональность"
  },
  "prompt": {
    "uz": "6 ishchi bir xil unum bilan ishni 12 kunda tugatadi. Shu ishni 9 ishchi necha kunda tugatishini teskari proporsiya orqali toping.",
    "ru": "Шесть рабочих выполняют работу за 12 дней. За сколько дней её выполнят 9 рабочих?"
  },
  "answer": "8",
  "explanation": {
    "uz": "Ishchilar va kunlar ko'paytmasi o'zgarmaydi: 6 × 12 = 9 × 8.",
    "ru": "Правильный ответ: 8. При прямой зависимости величины меняются одинаково, при обратной — в противоположных направлениях."
  }
};

export default function D19_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={19} task={2}/>;
}
