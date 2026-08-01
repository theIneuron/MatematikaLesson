import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Foizli natijalar",
    "ru": "Практика к уроку 22. Задачи на проценты"
  },
  "prompt": {
    "uz": "Har bir foizli masalani hisoblang va natijasi bilan moslashtiring.",
    "ru": "Решите каждую задачу на проценты и соедините с результатом."
  },
  "left": [
    "320 ning 25% qismi",
    "45 soni butunning 15% qismi",
    "500 ning 8% ga kamaygani"
  ],
  "right": [
    "460",
    "300",
    "80"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "translationsRu": {
    "320 ning 25% qismi": "25% от 320",
    "45 soni butunning 15% qismi": "45 составляет 15% целого",
    "500 ning 8% ga kamaygani": "500, уменьшенное на 8%"
  },
  "explanation": {
    "uz": "320 ning 25 foizi 80; 45 : 0,15 = 300; 500 × 0,92 = 460.",
    "ru": "Все пары найдены правильно. Новое значение находят умножением начального значения на коэффициент изменения."
  }
};

export default function D22_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={22} task={3}/>;
}
