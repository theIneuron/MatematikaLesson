import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Ratsional sonlarni ko'paytirish va bo'lish",
    "ru": "Умножение и деление рациональных чисел",
    "en": "Multiplying and dividing rational numbers"
  },
  "prompt": {
    "uz": "Nolga teng bo‘lmagan har qanday a soni uchun 0 : a = 0.",
    "ru": "Для любого ненулевого числа a верно равенство 0 : a = 0.",
    "en": "For any number a that is not zero, 0 : a = 0."
  },
  "options": [
    "Ha",
    "Yo'q"
  ],
  "answer": "Ha",
  "translationsRu": {
    "Ha": "Да",
    "Yo'q": "Нет"
  },
  "translationsEn": {
    "Ha": "Yes",
    "Yo'q": "No"
  },
  "explanation": {
    "uz": "Nolni nolga teng bo‘lmagan songa bo‘lganda natija 0 bo‘ladi.",
    "ru": "При делении нуля на ненулевое число получается 0.",
    "en": "When zero is divided by a number that is not zero the result is 0."
  }
};

export default function D29_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={29} task={5}/>;
}
