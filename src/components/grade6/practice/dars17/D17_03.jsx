import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Teng nisbatlar",
    "ru": "Практика к уроку 17. Отношение"
  },
  "prompt": {
    "uz": "Har bir nisbatni unga teng bo'lgan soddalashtirilgan nisbat bilan moslashtiring.",
    "ru": "Соедините каждое отношение с равным сокращённым отношением."
  },
  "left": [
    "15 : 25",
    "24 : 36",
    "35 : 49"
  ],
  "right": [
    "5 : 7",
    "2 : 3",
    "3 : 5"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "explanation": {
    "uz": "15 : 25 = 3 : 5; 24 : 36 = 2 : 3; 35 : 49 = 5 : 7.",
    "ru": "Все пары найдены правильно. При сокращении отношения оба его члена делят на одно и то же число."
  }
};

export default function D17_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={17} task={3}/>;
}
