import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Nuqta koordinatasi",
    "ru": "Практика к уроку 24. Координатная прямая",
    "en": "The coordinate of a point"
  },
  "prompt": {
    "uz": "Nuqta belgilanishini uning koordinatasi yoki tavsifi bilan bog'lang.",
    "ru": "Соедините обозначение точки с её координатой или описанием.",
    "en": "Connect the name of each point with its coordinate or with the description of it."
  },
  "left": [
    "A(−9)",
    "B(0)",
    "C(5)"
  ],
  "right": [
    "Sanoq boshi",
    "Musbat koordinata",
    "Manfiy koordinata"
  ],
  "pairs": [
    2,
    0,
    1
  ],
  "translationsRu": {
    "Sanoq boshi": "Начало отсчёта",
    "Musbat koordinata": "Положительная координата",
    "Manfiy koordinata": "Отрицательная координата"
  },
  "translationsEn": {
    "Sanoq boshi": "The origin",
    "Musbat koordinata": "A positive coordinate",
    "Manfiy koordinata": "A negative coordinate"
  },
  "explanation": {
    "uz": "A(−9) manfiy, B(0) sanoq boshida, C(5) musbat koordinatada.",
    "ru": "Все пары найдены правильно. Чем правее расположено число на координатной прямой, тем оно больше.",
    "en": "A(−9) is negative, B(0) is at the origin, and C(5) has a positive coordinate."
  }
};

export default function D24_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={24} task={6}/>;
}
