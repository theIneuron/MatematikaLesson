import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Hisoblash natijalari",
    "ru": "Практика к уроку 14. Умножение и деление десятичных дробей"
  },
  "prompt": {
    "uz": "O'nli kasrli amallarni hisoblang va har birini takrorlanmaydigan to'g'ri javobi bilan juftlang.",
    "ru": "Соедините действия с десятичными дробями с правильными ответами."
  },
  "left": [
    "3,6 × 1,5",
    "9,24 : 2,2",
    "0,84 : 0,7"
  ],
  "right": [
    "1,2",
    "4,2",
    "5,4"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "explanation": {
    "uz": "3,6 × 1,5 = 5,4; 9,24 : 2,2 = 4,2; 0,84 : 0,7 = 1,2.",
    "ru": "Все пары найдены правильно. При действиях с десятичными дробями важно правильно определить место запятой."
  }
};

export default function D14_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={14} task={9}/>;
}
