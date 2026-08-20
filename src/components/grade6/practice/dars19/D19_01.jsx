import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "To'g'ri proporsiya",
    "ru": "Практика к уроку 19. Прямая и обратная пропорциональность",
    "en": "Direct proportion"
  },
  "prompt": {
    "uz": "3 kilogramm meva 24 000 so'm tursa, narx o'zgarmaganda 5 kilogramm meva qancha turadi?",
    "ru": "Три килограмма фруктов стоят 24 000 сумов. Сколько стоят 5 килограммов?",
    "en": "3 kilograms of fruit cost 24 000 sum. How much do 5 kilograms cost if the price stays the same?"
  },
  "options": [
    "32 000 so'm",
    "36 000 so'm",
    "40 000 so'm",
    "48 000 so'm"
  ],
  "answer": "40 000 so'm",
  "translationsRu": {
    "32 000 so'm": "32 000 сум",
    "36 000 so'm": "36 000 сум",
    "40 000 so'm": "40 000 сум",
    "48 000 so'm": "48 000 сум"
  },
  "translationsEn": {
    "32 000 so'm": "32 000 sum",
    "36 000 so'm": "36 000 sum",
    "40 000 so'm": "40 000 sum",
    "48 000 so'm": "48 000 sum"
  },
  "explanation": {
    "uz": "Bir kilogramm 8 000 so'm; 5 kilogramm 8 000 × 5 = 40 000 so'm.",
    "ru": "Правильный ответ: 40 000 сум. При прямой зависимости величины меняются одинаково, при обратной — в противоположных направлениях.",
    "en": "One kilogram costs 8 000 sum; 5 kilograms cost 8 000 × 5 = 40 000 sum."
  }
};

export default function D19_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={19} task={1}/>;
}
