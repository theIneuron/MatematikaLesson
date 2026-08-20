import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Bo'linish xususiyatlari",
    "ru": "Практика к уроку 3. Признаки делимости на 3 и 9",
    "en": "Divisibility properties"
  },
  "prompt": {
    "uz": "Har bir sonning raqamlari yig'indisini tekshiring va uni 3 hamda 9 ga bo'linishiga mos tavsif bilan bog'lang.",
    "ru": "Проверьте сумму цифр и соедините каждое число с верным описанием делимости на 3 и 9.",
    "en": "Check the sum of the digits of each number and connect it with the description of its divisibility by 3 and by 9."
  },
  "left": [
    "312",
    "432",
    "715"
  ],
  "right": [
    "faqat 3 ga",
    "3 va 9 ga",
    "3 ga ham bo'linmaydi"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "faqat 3 ga": "только на 3",
    "3 va 9 ga": "на 3 и 9",
    "3 ga ham bo'linmaydi": "не делится ни на 3, ни на 9"
  },
  "translationsEn": {
    "faqat 3 ga": "by 3 only",
    "3 va 9 ga": "by 3 and by 9",
    "3 ga ham bo'linmaydi": "not even by 3"
  },
  "explanation": {
    "uz": "312 faqat 3 ga, 432 soni 3 va 9 ga bo'linadi, 715 esa ikkalasiga ham bo'linmaydi.",
    "ru": "Все пары найдены правильно. Для делимости на 3 и 9 проверяют сумму цифр числа.",
    "en": "312 divides only by 3, 432 divides by 3 and by 9, and 715 divides by neither of them."
  }
};

export default function D03_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={3} task={6}/>;
}
