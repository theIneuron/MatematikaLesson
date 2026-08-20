import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Vergulni siljitish",
    "ru": "Практика к уроку 14. Умножение и деление десятичных дробей",
    "en": "Moving the comma"
  },
  "prompt": {
    "uz": "Har bir ifodada vergulni kerakli yo'nalishda siljiting va hosil bo'lgan son bilan moslashtiring.",
    "ru": "Передвиньте запятую в нужную сторону и соедините выражение с ответом.",
    "en": "Move the comma the right way in each expression and match it with the number you get."
  },
  "left": [
    "5,73 × 10",
    "48,6 : 100",
    "0,927 × 1000"
  ],
  "right": [
    "0,486",
    "57,3",
    "927"
  ],
  "pairs": [
    1,
    0,
    2
  ],
  "explanation": {
    "uz": "5,73 × 10 = 57,3; 48,6 : 100 = 0,486; 0,927 × 1000 = 927.",
    "ru": "Все пары найдены правильно. При действиях с десятичными дробями важно правильно определить место запятой.",
    "en": "5,73 × 10 = 57,3; 48,6 : 100 = 0,486; 0,927 × 1000 = 927."
  }
};

export default function D14_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={14} task={6}/>;
}
