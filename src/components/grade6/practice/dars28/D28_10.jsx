import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ratsional sonlarni ayirish",
    "ru": "Вычитание рациональных чисел",
    "en": "Subtracting rational numbers"
  },
  "prompt": {
    "uz": "Suv sathi 3 metr edi, keyin 7 metr pasaydi. Yangi sathni toping.",
    "ru": "Уровень воды был 3 метра, затем понизился на 7 метров. Найдите новый уровень.",
    "en": "The water level was 3 metres and then it fell by 7 metres. Find the new level."
  },
  "options": [
    "10 m",
    "4 m",
    "−4 m",
    "−10 m"
  ],
  "answer": "−4 m",
  "translationsRu": {
    "10 m": "10 м",
    "4 m": "4 м",
    "−4 m": "−4 м",
    "−10 m": "−10 м"
  },
  "explanation": {
    "uz": "Boshlang‘ich sathdan pasayishni ayiramiz: 3 − 7 = −4 metr.",
    "ru": "Из начального уровня вычитаем понижение: 3 − 7 = −4 метра.",
    "en": "Take the fall away from the level it started at: 3 − 7 = −4 metres."
  }
};

export default function D28_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={28} task={10}/>;
}
