import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Hayotiy hisoblar",
    "ru": "Практика к уроку 16. Задачи с дробями и десятичными дробями",
    "en": "Calculations from real life"
  },
  "prompt": {
    "uz": "Har bir hayotiy masalani hisoblang va o'ng ustundagi takrorlanmaydigan natijasi bilan moslashtiring.",
    "ru": "Решите каждую жизненную задачу и соедините её с ответом.",
    "en": "Work out each problem from real life and match it with its own result on the right."
  },
  "left": [
    "60 000 so'mning 3/10 qismi",
    "32 o'quvchining 5/8 qismi",
    "2,75 kg + 1/4 kg"
  ],
  "right": [
    "3 kg",
    "18 000 so'm",
    "20 o'quvchi"
  ],
  "pairs": [
    1,
    2,
    0
  ],
  "translationsRu": {
    "60 000 so'mning 3/10 qismi": "3/10 от 60 000 сумов",
    "32 o'quvchining 5/8 qismi": "5/8 от 32 учеников",
    "2,75 kg + 1/4 kg": "2,75 кг + 1/4 кг",
    "3 kg": "3 кг",
    "18 000 so'm": "18 000 сум",
    "20 o'quvchi": "20 учеников"
  },
  "translationsEn": {
    "60 000 so'mning 3/10 qismi": "3/10 of 60 000 sum",
    "32 o'quvchining 5/8 qismi": "5/8 of 32 pupils",
    "18 000 so'm": "18 000 sum",
    "20 o'quvchi": "20 pupils"
  },
  "explanation": {
    "uz": "60 000 × 3/10 = 18 000; 32 × 5/8 = 20; 2,75 + 0,25 = 3.",
    "ru": "Все пары найдены правильно. Сначала величины приводят к одному виду, затем выполняют нужное действие.",
    "en": "60 000 × 3/10 = 18 000; 32 × 5/8 = 20; 2,75 + 0,25 = 3."
  }
};

export default function D16_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={16} task={3}/>;
}
