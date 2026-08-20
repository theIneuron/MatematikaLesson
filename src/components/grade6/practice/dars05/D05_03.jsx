import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "EKUB qiymatlari",
    "ru": "Практика к уроку 5. Наибольший общий делитель",
    "en": "Values of the GCD"
  },
  "prompt": {
    "uz": "Ifodalarni qiymatlari bilan moslashtiring.",
    "ru": "Соедините выражения с их значениями.",
    "en": "Match each expression with its value."
  },
  "left": [
    "EKUB(8, 12)",
    "EKUB(15, 25)",
    "EKUB(18, 30)"
  ],
  "right": [
    "4",
    "5",
    "6"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "EKUB(8, 12)": "НОД(8, 12)",
    "EKUB(15, 25)": "НОД(15, 25)",
    "EKUB(18, 30)": "НОД(18, 30)"
  },
  "translationsEn": {
    "EKUB(8, 12)": "GCD(8, 12)",
    "EKUB(15, 25)": "GCD(15, 25)",
    "EKUB(18, 30)": "GCD(18, 30)"
  },
  "explanation": {
    "uz": "EKUB(8,12)=4, EKUB(15,25)=5, EKUB(18,30)=6.",
    "ru": "Все пары найдены правильно. НОД — наибольший из общих делителей.",
    "en": "GCD(8, 12) = 4, GCD(15, 25) = 5, GCD(18, 30) = 6."
  }
};

export default function D05_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={5} task={3}/>;
}
