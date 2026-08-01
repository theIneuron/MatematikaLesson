import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Teskari kasr usuli",
    "ru": "Практика к уроку 12. Деление обыкновенных дробей"
  },
  "prompt": {
    "uz": "Chapdagi bo'lish amallarini avval ko'paytirish ko'rinishiga keltiring, so'ng mos qisqarmas javobni tanlang.",
    "ru": "Замените деление умножением на обратную дробь и соедините с ответом."
  },
  "left": [
    "2/11 : 4/33",
    "7/12 : 14/9",
    "15/16 : 9/8"
  ],
  "right": [
    "3/8",
    "3/2",
    "5/6"
  ],
  "pairs": [
    1,
    0,
    2
  ],
  "explanation": {
    "uz": "2/11 : 4/33 = 3/2, 7/12 : 14/9 = 3/8, 15/16 : 9/8 = 5/6.",
    "ru": "Все пары найдены правильно. Деление на дробь заменяют умножением на обратную дробь."
  }
};

export default function D12_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={12} task={6}/>;
}
