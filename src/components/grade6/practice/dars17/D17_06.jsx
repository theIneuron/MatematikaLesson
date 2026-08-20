import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Nisbatdagi tartib",
    "ru": "Практика к уроку 17. Отношение",
    "en": "The order inside a ratio"
  },
  "prompt": {
    "uz": "Berilgan tavsiflarni mos nisbat yozuvi bilan bog'lang. Nisbatda miqdorlarning tartibini o'zgartirmang.",
    "ru": "Соедините словесное описание с отношением, сохраняя порядок величин.",
    "en": "Connect each description with the ratio that fits it. Do not change the order of the quantities in the ratio."
  },
  "left": [
    "9 ning 6 ga nisbati",
    "4 ning 20 ga nisbati",
    "18 ning 24 ga nisbati"
  ],
  "right": [
    "1 : 5",
    "3 : 2",
    "3 : 4"
  ],
  "pairs": [
    1,
    0,
    2
  ],
  "translationsRu": {
    "9 ning 6 ga nisbati": "отношение 9 к 6",
    "4 ning 20 ga nisbati": "отношение 4 к 20",
    "18 ning 24 ga nisbati": "отношение 18 к 24"
  },
  "translationsEn": {
    "9 ning 6 ga nisbati": "the ratio of 9 to 6",
    "4 ning 20 ga nisbati": "the ratio of 4 to 20",
    "18 ning 24 ga nisbati": "the ratio of 18 to 24"
  },
  "explanation": {
    "uz": "9 : 6 = 3 : 2; 4 : 20 = 1 : 5; 18 : 24 = 3 : 4.",
    "ru": "Все пары найдены правильно. При сокращении отношения оба его члена делят на одно и то же число.",
    "en": "9 : 6 = 3 : 2; 4 : 20 = 1 : 5; 18 : 24 = 3 : 4."
  }
};

export default function D17_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={17} task={6}/>;
}
