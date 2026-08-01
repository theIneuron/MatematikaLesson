import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ishchilar va vaqt",
    "ru": "Практика к уроку 19. Прямая и обратная пропорциональность"
  },
  "prompt": {
    "uz": "12 ishchi buyurtmani 15 kunda bajaradi. Ishchilar soni 20 taga oshirilsa, ish necha kunda tugaydi?",
    "ru": "Двенадцать рабочих выполняют заказ за 15 дней. За сколько дней справятся 20 рабочих?"
  },
  "options": [
    "6 kun",
    "8 kun",
    "9 kun",
    "12 kun"
  ],
  "answer": "9 kun",
  "translationsRu": {
    "6 kun": "6 дней",
    "8 kun": "8 дней",
    "9 kun": "9 дней",
    "12 kun": "12 дней"
  },
  "explanation": {
    "uz": "12 × 15 = 20 × x; x = 180 : 20 = 9 kun.",
    "ru": "Правильный ответ: 9 дней. При прямой зависимости величины меняются одинаково, при обратной — в противоположных направлениях."
  }
};

export default function D19_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={19} task={10}/>;
}
