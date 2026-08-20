import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Katakdagi raqam",
    "ru": "Практика к уроку 3. Признаки делимости на 3 и 9",
    "en": "The digit in the box"
  },
  "prompt": {
    "uz": "Kataklarga mos raqamlarni toping.",
    "ru": "Подберите цифру для каждого числа, чтобы оно делилось на 9.",
    "en": "Find the digit that fits each box."
  },
  "left": [
    "4□2 soni 9 ga bo‘linadi",
    "71□ soni 9 ga bo‘linadi",
    "8□1 soni 9 ga bo‘linadi"
  ],
  "right": [
    "1",
    "3",
    "0"
  ],
  "pairs": [
    1,
    0,
    2
  ],
  "translationsRu": {
    "4□2 soni 9 ga bo‘linadi": "число 4□2 делится на 9",
    "71□ soni 9 ga bo‘linadi": "число 71□ делится на 9",
    "8□1 soni 9 ga bo‘linadi": "число 8□1 делится на 9"
  },
  "translationsEn": {
    "4□2 soni 9 ga bo‘linadi": "4□2 divides by 9",
    "71□ soni 9 ga bo‘linadi": "71□ divides by 9",
    "8□1 soni 9 ga bo‘linadi": "8□1 divides by 9"
  },
  "explanation": {
    "uz": "4□2 uchun 3, 71□ uchun 1, 8□1 uchun 0 yozilsa raqamlar yig'indisi 9 ga karrali bo'ladi.",
    "ru": "Все пары найдены правильно. Для делимости на 3 и 9 проверяют сумму цифр числа.",
    "en": "With 3 in 4□2, with 1 in 71□ and with 0 in 8□1 the sum of the digits becomes a multiple of 9."
  }
};

export default function D03_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={3} task={9}/>;
}
