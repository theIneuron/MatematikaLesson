import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Eng kichik umumiy maxraj",
    "ru": "Практика к уроку 9. Приведение дробей к общему знаменателю",
    "en": "The least common denominator"
  },
  "prompt": {
    "uz": "5/16 va 7/20 kasrlari eng kichik umumiy maxrajga to'g'ri keltirilgan qatorni toping.",
    "ru": "Выберите правильное приведение 5/16 и 7/20 к наименьшему общему знаменателю.",
    "en": "Find the row where 5/16 and 7/20 are brought to the least common denominator correctly."
  },
  "options": [
    "20/80 va 28/80",
    "25/80 va 28/80",
    "25/40 va 14/40",
    "10/32 va 14/40"
  ],
  "answer": "25/80 va 28/80",
  "translationsRu": {
    "20/80 va 28/80": "20/80 и 28/80",
    "25/80 va 28/80": "25/80 и 28/80",
    "25/40 va 14/40": "25/40 и 14/40",
    "10/32 va 14/40": "10/32 и 14/40"
  },
  "translationsEn": {
    "20/80 va 28/80": "20/80 and 28/80",
    "25/80 va 28/80": "25/80 and 28/80",
    "25/40 va 14/40": "25/40 and 14/40",
    "10/32 va 14/40": "10/32 and 14/40"
  },
  "explanation": {
    "uz": "EKUK(16,20)=80: 5/16=25/80 va 7/20=28/80.",
    "ru": "Правильный ответ: 25/80 и 28/80. Наименьший общий знаменатель равен НОК знаменателей.",
    "en": "LCM(16, 20) = 80: 5/16 = 25/80 and 7/20 = 28/80."
  }
};

export default function D09_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={9} task={10}/>;
}
