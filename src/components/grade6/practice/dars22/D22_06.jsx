import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Yangi qiymat",
    "ru": "Практика к уроку 22. Задачи на проценты",
    "en": "The new value"
  },
  "prompt": {
    "uz": "Boshlang'ich qiymat va foiz o'zgarishini yangi qiymat bilan bog'lang.",
    "ru": "Соедините начальное значение и процентное изменение с новым значением.",
    "en": "Connect the starting value and the change in percent with the new value."
  },
  "left": [
    "200 ga 30% qo‘shildi",
    "600 dan 15% ayirildi",
    "80 ga 25% qo‘shildi"
  ],
  "right": [
    "100",
    "260",
    "510"
  ],
  "pairs": [
    1,
    2,
    0
  ],
  "translationsRu": {
    "200 ga 30% qo‘shildi": "200 увеличили на 30%",
    "600 dan 15% ayirildi": "600 уменьшили на 15%",
    "80 ga 25% qo‘shildi": "80 увеличили на 25%"
  },
  "translationsEn": {
    "200 ga 30% qo‘shildi": "30% was added to 200",
    "600 dan 15% ayirildi": "15% was taken off 600",
    "80 ga 25% qo‘shildi": "25% was added to 80"
  },
  "explanation": {
    "uz": "200 × 1,30 = 260; 600 × 0,85 = 510; 80 × 1,25 = 100.",
    "ru": "Все пары найдены правильно. Новое значение находят умножением начального значения на коэффициент изменения.",
    "en": "200 × 1,30 = 260; 600 × 0,85 = 510; 80 × 1,25 = 100."
  }
};

export default function D22_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={22} task={6}/>;
}
