import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Eng kichik umumiy maxraj",
    "ru": "Практика к уроку 9. Приведение дробей к общему знаменателю"
  },
  "prompt": {
    "uz": "Kasrlar juftini eng kichik umumiy maxraji bilan moslashtiring.",
    "ru": "Соедините пары дробей с их наименьшим общим знаменателем."
  },
  "left": [
    "1/4 va 1/10",
    "1/9 va 1/15",
    "1/14 va 1/21"
  ],
  "right": [
    "20",
    "42",
    "45"
  ],
  "pairs": [
    0,
    2,
    1
  ],
  "translationsRu": {
    "1/4 va 1/10": "1/4 и 1/10",
    "1/9 va 1/15": "1/9 и 1/15",
    "1/14 va 1/21": "1/14 и 1/21"
  },
  "explanation": {
    "uz": "EKUK(4,10)=20, EKUK(9,15)=45, EKUK(14,21)=42.",
    "ru": "Все пары найдены правильно. Наименьший общий знаменатель равен НОК знаменателей."
  }
};

export default function D09_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={9} task={3}/>;
}
