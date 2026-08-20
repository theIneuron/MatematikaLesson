import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "72 maxrajiga keltirish",
    "ru": "Практика к уроку 9. Приведение дробей к общему знаменателю",
    "en": "Bringing to the denominator 72"
  },
  "prompt": {
    "uz": "Kasrlarni maxraji 72 bo'lgan teng kasr bilan bog'lang.",
    "ru": "Соедините дроби с равными дробями со знаменателем 72.",
    "en": "Connect each fraction with the equal fraction that has the denominator 72."
  },
  "left": [
    "5/8",
    "7/9",
    "11/12"
  ],
  "right": [
    "45/72",
    "56/72",
    "66/72"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "5/8=45/72, 7/9=56/72, 11/12=66/72.",
    "ru": "Все пары найдены правильно. Наименьший общий знаменатель равен НОК знаменателей.",
    "en": "5/8 = 45/72, 7/9 = 56/72, 11/12 = 66/72."
  }
};

export default function D09_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={9} task={6}/>;
}
