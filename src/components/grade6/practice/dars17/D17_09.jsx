import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Miqdorlar nisbati",
    "ru": "Практика к уроку 17. Отношение",
    "en": "The ratio of two quantities"
  },
  "prompt": {
    "uz": "Har bir vaziyatdagi birinchi miqdorning ikkinchi miqdorga nisbatini soddalashtirilgan javob bilan moslashtiring.",
    "ru": "Соедините каждую пару величин с её сокращённым отношением.",
    "en": "Match the ratio of the first quantity to the second one in each case with the simplified answer."
  },
  "left": [
    "16 sm ning 24 sm ga nisbati",
    "27 kg ning 45 kg ga nisbati",
    "32 minutning 40 minutga nisbati"
  ],
  "right": [
    "4 : 5",
    "3 : 5",
    "2 : 3"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "translationsRu": {
    "16 sm ning 24 sm ga nisbati": "отношение 16 см к 24 см",
    "27 kg ning 45 kg ga nisbati": "отношение 27 кг к 45 кг",
    "32 minutning 40 minutga nisbati": "отношение 32 минут к 40 минутам"
  },
  "translationsEn": {
    "16 sm ning 24 sm ga nisbati": "the ratio of 16 cm to 24 cm",
    "27 kg ning 45 kg ga nisbati": "the ratio of 27 kg to 45 kg",
    "32 minutning 40 minutga nisbati": "the ratio of 32 minutes to 40 minutes"
  },
  "explanation": {
    "uz": "16 : 24 = 2 : 3; 27 : 45 = 3 : 5; 32 : 40 = 4 : 5.",
    "ru": "Все пары найдены правильно. При сокращении отношения оба его члена делят на одно и то же число.",
    "en": "16 : 24 = 2 : 3; 27 : 45 = 3 : 5; 32 : 40 = 4 : 5."
  }
};

export default function D17_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={17} task={9}/>;
}
