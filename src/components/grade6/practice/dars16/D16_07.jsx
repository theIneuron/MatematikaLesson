import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Xariddan qolgan pul",
    "ru": "Практика к уроку 16. Задачи с дробями и десятичными дробями",
    "en": "The money left after shopping"
  },
  "prompt": {
    "uz": "Do'konda 120 000 so'mning 3/8 qismiga daftar olindi. Xariddan keyin qancha pul qolganini ikki bosqichda hisoblang.",
    "ru": "На тетради потратили 3/8 от 120 000 сумов. Сколько денег осталось?",
    "en": "3/8 of 120 000 sum was spent on notebooks in a shop. Work out in two steps how much money is left after the shopping."
  },
  "options": [
    "45 000 so'm",
    "65 000 so'm",
    "75 000 so'm",
    "90 000 so'm"
  ],
  "answer": "75 000 so'm",
  "translationsRu": {
    "45 000 so'm": "45 000 сум",
    "65 000 so'm": "65 000 сум",
    "75 000 so'm": "75 000 сум",
    "90 000 so'm": "90 000 сум"
  },
  "translationsEn": {
    "45 000 so'm": "45 000 sum",
    "65 000 so'm": "65 000 sum",
    "75 000 so'm": "75 000 sum",
    "90 000 so'm": "90 000 sum"
  },
  "explanation": {
    "uz": "120 000 × 3/8 = 45 000 so'm sarflandi; 120 000 − 45 000 = 75 000 so'm qoldi.",
    "ru": "Правильный ответ: 75 000 сум. Сначала величины приводят к одному виду, затем выполняют нужное действие.",
    "en": "120 000 × 3/8 = 45 000 sum was spent; 120 000 − 45 000 = 75 000 sum is left."
  }
};

export default function D16_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={16} task={7}/>;
}
