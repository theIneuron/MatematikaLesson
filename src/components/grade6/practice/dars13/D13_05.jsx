import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Nolning alohida holati",
    "ru": "Практика к уроку 13. Взаимно обратные числа и нахождение целого",
    "en": "The special case of zero"
  },
  "prompt": {
    "uz": "0 sonining o'zaro teskari soni mavjud, degan fikrni ko'paytma 1 bo'lishi sharti asosida tekshiring.",
    "ru": "Верно ли, что у числа 0 есть обратное число?",
    "en": "Zero has a reciprocal number. Check this statement against the rule that the product has to be 1."
  },
  "options": [
    "Ha",
    "Yo'q"
  ],
  "answer": "Yo'q",
  "translationsRu": {
    "Ha": "Да",
    "Yo'q": "Нет"
  },
  "translationsEn": {
    "Ha": "Yes",
    "Yo'q": "No"
  },
  "explanation": {
    "uz": "Nolni hech qanday songa ko'paytirib 1 hosil qilib bo'lmaydi. Demak, 0 ning teskari soni yo'q.",
    "ru": "Правильный ответ: Нет. Произведение взаимно обратных чисел равно единице.",
    "en": "There is no number you can multiply zero by to get 1. So zero has no reciprocal."
  }
};

export default function D13_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={13} task={5}/>;
}
