import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Bo'linmalarni moslashtirish",
    "ru": "Практика к уроку 12. Деление обыкновенных дробей"
  },
  "prompt": {
    "uz": "Har bir bo'lish amalini teskari kasr yordamida hisoblang va o'ng ustundagi javobi bilan moslashtiring.",
    "ru": "Соедините каждое деление дробей с его ответом."
  },
  "left": [
    "4/9 : 2/3",
    "5/8 : 25/12",
    "7/10 : 21/25"
  ],
  "right": [
    "2/3",
    "3/10",
    "5/6"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "4/9 : 2/3 = 2/3, 5/8 : 25/12 = 3/10, 7/10 : 21/25 = 5/6.",
    "ru": "Все пары найдены правильно. Деление на дробь заменяют умножением на обратную дробь."
  }
};

export default function D12_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={12} task={3}/>;
}
