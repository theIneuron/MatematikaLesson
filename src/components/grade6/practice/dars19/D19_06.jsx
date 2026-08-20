import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Jadvalni to'ldirish",
    "ru": "Практика к уроку 19. Прямая и обратная пропорциональность",
    "en": "Filling in a table"
  },
  "prompt": {
    "uz": "Jadvaldagi bog'lanishlarga mos yetishmayotgan qiymatlarni toping.",
    "ru": "Заполните пропуски в таблицах прямой и обратной зависимости.",
    "en": "Find the missing values that fit the relations in the tables."
  },
  "left": [
    "2 kg → 14 000; 6 kg → ?",
    "4 ishchi → 15 kun; 10 ishchi → ?",
    "90 km/soat → 4 soat; 120 km/soat → ?"
  ],
  "right": [
    "3 soat",
    "42 000 so'm",
    "6 kun"
  ],
  "pairs": [
    1,
    2,
    0
  ],
  "translationsRu": {
    "2 kg → 14 000; 6 kg → ?": "2 кг → 14 000; 6 кг → ?",
    "4 ishchi → 15 kun; 10 ishchi → ?": "4 рабочих → 15 дней; 10 рабочих → ?",
    "90 km/soat → 4 soat; 120 km/soat → ?": "90 км/часа → 4 часа; 120 км/часа → ?",
    "3 soat": "3 часа",
    "42 000 so'm": "42 000 сум",
    "6 kun": "6 дней"
  },
  "translationsEn": {
    "2 kg → 14 000; 6 kg → ?": "2 kg → 14 000; 6 kg → ?",
    "4 ishchi → 15 kun; 10 ishchi → ?": "4 workers → 15 days; 10 workers → ?",
    "90 km/soat → 4 soat; 120 km/soat → ?": "90 km/h → 4 hours; 120 km/h → ?",
    "3 soat": "3 hours",
    "42 000 so'm": "42 000 sum",
    "6 kun": "6 days"
  },
  "explanation": {
    "uz": "6 kg 42 000 so'm; 10 ishchi 6 kun; 120 km/soatda vaqt 3 soat.",
    "ru": "Все пары найдены правильно. При прямой зависимости величины меняются одинаково, при обратной — в противоположных направлениях.",
    "en": "6 kg cost 42 000 sum; 10 workers need 6 days; at 120 km/h the time is 3 hours."
  }
};

export default function D19_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={19} task={6}/>;
}
