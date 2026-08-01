import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Koordinata tekisligi",
    "ru": "Координатная плоскость"
  },
  "prompt": {
    "uz": "A(−4; 3) nuqta koordinata tekisligining qaysi choragida joylashgan?",
    "ru": "В какой четверти координатной плоскости находится точка A(−4; 3)?"
  },
  "options": [
    "I chorak",
    "II chorak",
    "III chorak",
    "IV chorak"
  ],
  "answer": "II chorak",
  "translationsRu": {
    "I chorak": "I четверть",
    "II chorak": "II четверть",
    "III chorak": "III четверть",
    "IV chorak": "IV четверть"
  },
  "explanation": {
    "uz": "x manfiy, y musbat bo‘lsa, nuqta II chorakda yotadi.",
    "ru": "Если x отрицателен, а y положителен, точка лежит во II четверти."
  }
};

export default function D30_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={30} task={1}/>;
}
