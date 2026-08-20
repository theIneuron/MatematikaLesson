import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Raqamlar yig'indisi",
    "ru": "Практика к уроку 3. Признаки делимости на 3 и 9",
    "en": "The sum of the digits"
  },
  "prompt": {
    "uz": "Sonlarni raqamlari yig'indisi bilan moslashtiring.",
    "ru": "Соедините каждое число с суммой его цифр.",
    "en": "Match each number with the sum of its digits."
  },
  "left": [
    "234",
    "516",
    "729"
  ],
  "right": [
    "9",
    "12",
    "18"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "234 raqamlari yig'indisi 9, 516 niki 12, 729 niki 18.",
    "ru": "Все пары найдены правильно. Для делимости на 3 и 9 проверяют сумму цифр числа.",
    "en": "The digits of 234 add up to 9, of 516 to 12, of 729 to 18."
  }
};

export default function D03_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={3} task={3}/>;
}
