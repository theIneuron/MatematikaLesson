import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Juftlarni umumiy maxrajga keltirish",
    "ru": "Практика к уроку 9. Приведение дробей к общему знаменателю",
    "en": "Bringing pairs to a common denominator"
  },
  "prompt": {
    "uz": "Har bir juftni to'g'ri umumiy maxrajdagi yozuvi bilan moslashtiring.",
    "ru": "Соедините пары дробей с правильной записью при общем знаменателе.",
    "en": "Match each pair with the way it is written at the common denominator."
  },
  "left": [
    "2/5 va 3/8",
    "5/6 va 7/10",
    "3/4 va 5/9"
  ],
  "right": [
    "16/40 va 15/40",
    "25/30 va 21/30",
    "27/36 va 20/36"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "2/5 va 3/8": "2/5 и 3/8",
    "5/6 va 7/10": "5/6 и 7/10",
    "3/4 va 5/9": "3/4 и 5/9",
    "16/40 va 15/40": "16/40 и 15/40",
    "25/30 va 21/30": "25/30 и 21/30",
    "27/36 va 20/36": "27/36 и 20/36"
  },
  "translationsEn": {
    "2/5 va 3/8": "2/5 and 3/8",
    "5/6 va 7/10": "5/6 and 7/10",
    "3/4 va 5/9": "3/4 and 5/9",
    "16/40 va 15/40": "16/40 and 15/40",
    "25/30 va 21/30": "25/30 and 21/30",
    "27/36 va 20/36": "27/36 and 20/36"
  },
  "explanation": {
    "uz": "Juftlar mos ravishda 40, 30 va 36 umumiy maxrajlariga keltirildi.",
    "ru": "Все пары найдены правильно. Наименьший общий знаменатель равен НОК знаменателей.",
    "en": "The pairs are brought to the common denominators 40, 30 and 36."
  }
};

export default function D09_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={9} task={9}/>;
}
