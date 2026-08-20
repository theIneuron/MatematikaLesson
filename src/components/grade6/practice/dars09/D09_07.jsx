import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "EKUK orqali maxraj",
    "ru": "Практика к уроку 9. Приведение дробей к общему знаменателю",
    "en": "The denominator through the LCM"
  },
  "prompt": {
    "uz": "7/18 va 5/24 kasrlarining eng kichik umumiy maxrajini toping.",
    "ru": "Найдите наименьший общий знаменатель дробей 7/18 и 5/24.",
    "en": "Find the least common denominator of the fractions 7/18 and 5/24."
  },
  "options": [
    "36",
    "48",
    "72",
    "144"
  ],
  "answer": "72",
  "explanation": {
    "uz": "EKUK(18,24)=72, shuning uchun eng kichik umumiy maxraj 72.",
    "ru": "Правильный ответ: 72. Наименьший общий знаменатель равен НОК знаменателей.",
    "en": "LCM(18, 24) = 72, so the least common denominator is 72."
  }
};

export default function D09_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={9} task={7}/>;
}
