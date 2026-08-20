import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Qisqarmas ko'rinishlar",
    "ru": "Практика к уроку 8. Сокращение дробей",
    "en": "Simplest forms"
  },
  "prompt": {
    "uz": "Har bir kasrni uning qisqarmas ko'rinishi bilan moslashtiring.",
    "ru": "Соедините каждую дробь с её несократимым видом.",
    "en": "Match each fraction with its simplest form."
  },
  "left": [
    "12/18",
    "20/35",
    "27/45"
  ],
  "right": [
    "2/3",
    "4/7",
    "3/5"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "12/18 = 2/3, 20/35 = 4/7, 27/45 = 3/5.",
    "ru": "Все пары найдены правильно. Для полного сокращения числитель и знаменатель делят на их НОД.",
    "en": "12/18 = 2/3, 20/35 = 4/7, 27/45 = 3/5."
  }
};

export default function D08_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={8} task={3}/>;
}
