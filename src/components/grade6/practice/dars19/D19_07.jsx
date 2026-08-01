import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kranlar ishi",
    "ru": "Практика к уроку 19. Прямая и обратная пропорциональность"
  },
  "prompt": {
    "uz": "8 ta kran hovuzni 6 soatda to'ldiradi. Bir xil tezlikda ishlaydigan 12 ta kran hovuzni necha soatda to'ldiradi?",
    "ru": "Восемь кранов наполняют бассейн за 6 часов. За сколько часов его наполнят 12 кранов?"
  },
  "options": [
    "3 soat",
    "4 soat",
    "8 soat",
    "9 soat"
  ],
  "answer": "4 soat",
  "translationsRu": {
    "3 soat": "3 часа",
    "4 soat": "4 часа",
    "8 soat": "8 часа",
    "9 soat": "9 часа"
  },
  "explanation": {
    "uz": "Kranlar soni va vaqt teskari: 8 × 6 = 12 × 4.",
    "ru": "Правильный ответ: 4 часа. При прямой зависимости величины меняются одинаково, при обратной — в противоположных направлениях."
  }
};

export default function D19_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={19} task={7}/>;
}
