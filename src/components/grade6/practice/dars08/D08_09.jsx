import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Kasrlar EKUBi",
    "ru": "Практика к уроку 8. Сокращение дробей"
  },
  "prompt": {
    "uz": "Har bir kasrni surat va maxrajining EKUBi bilan moslashtiring.",
    "ru": "Соедините дробь с НОД её числителя и знаменателя."
  },
  "left": [
    "28/42",
    "36/60",
    "44/77"
  ],
  "right": [
    "11",
    "12",
    "14"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "explanation": {
    "uz": "EKUB(28,42)=14, EKUB(36,60)=12, EKUB(44,77)=11.",
    "ru": "Все пары найдены правильно. Для полного сокращения числитель и знаменатель делят на их НОД."
  }
};

export default function D08_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={8} task={9}/>;
}
