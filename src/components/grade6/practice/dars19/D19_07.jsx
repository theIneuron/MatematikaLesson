import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kranlar ishi",
    "ru": "Практика к уроку 19. Прямая и обратная пропорциональность",
    "en": "Taps at work"
  },
  "prompt": {
    "uz": "8 ta kran hovuzni 6 soatda to'ldiradi. Bir xil tezlikda ishlaydigan 12 ta kran hovuzni necha soatda to'ldiradi?",
    "ru": "Восемь кранов наполняют бассейн за 6 часов. За сколько часов его наполнят 12 кранов?",
    "en": "8 taps fill a pool in 6 hours. How many hours do 12 taps that run at the same rate need to fill the pool?"
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
    "8 soat": "8 часов",
    "9 soat": "9 часов"
  },
  "translationsEn": {
    "3 soat": "3 hours",
    "4 soat": "4 hours",
    "8 soat": "8 hours",
    "9 soat": "9 hours"
  },
  "explanation": {
    "uz": "Kranlar soni va vaqt teskari: 8 × 6 = 12 × 4.",
    "ru": "Правильный ответ: 4 часа. При прямой зависимости величины меняются одинаково, при обратной — в противоположных направлениях.",
    "en": "The number of taps and the time are inverse: 8 × 6 = 12 × 4."
  }
};

export default function D19_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={19} task={7}/>;
}
