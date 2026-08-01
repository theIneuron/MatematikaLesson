import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Umumiy maxraj",
    "ru": "Практика к уроку 9. Приведение дробей к общему знаменателю"
  },
  "prompt": {
    "uz": "1/6 va 1/8 kasrlari uchun eng kichik umumiy maxrajni toping.",
    "ru": "Найдите наименьший общий знаменатель дробей 1/6 и 1/8."
  },
  "options": [
    "14",
    "24",
    "36",
    "48"
  ],
  "answer": "24",
  "explanation": {
    "uz": "EKUK(6,8)=24, demak eng kichik umumiy maxraj 24.",
    "ru": "Правильный ответ: 24. Наименьший общий знаменатель равен НОК знаменателей."
  }
};

export default function D09_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={9} task={1}/>;
}
