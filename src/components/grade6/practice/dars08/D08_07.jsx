import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "To'liq qisqartirish",
    "ru": "Практика к уроку 8. Сокращение дробей",
    "en": "Reducing completely"
  },
  "prompt": {
    "uz": "63/81 kasrini to'liq qisqartirganda qaysi kasr hosil bo'ladi?",
    "ru": "Полностью сократите дробь 63/81.",
    "en": "Which fraction comes out when 63/81 is reduced completely?"
  },
  "options": [
    "6/8",
    "7/9",
    "9/11",
    "20/27"
  ],
  "answer": "7/9",
  "explanation": {
    "uz": "63 va 81 ni 9 ga bo'lamiz: 63/81 = 7/9.",
    "ru": "Правильный ответ: 7/9. Для полного сокращения числитель и знаменатель делят на их НОД.",
    "en": "Divide 63 and 81 by 9: 63/81 = 7/9."
  }
};

export default function D08_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={8} task={7}/>;
}
