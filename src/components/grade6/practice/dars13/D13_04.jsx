import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ko'paytmasi bir",
    "ru": "Практика к уроку 13. Взаимно обратные числа и нахождение целого"
  },
  "prompt": {
    "uz": "Quyidagi juftliklardan qaysi biri o'zaro teskari sonlardan tashkil topganini ko'paytirib tekshiring.",
    "ru": "Какая пара состоит из взаимно обратных чисел?"
  },
  "options": [
    "4/9 va 9/4",
    "3/7 va 3/7",
    "5/8 va 8/3",
    "6 va 1/5"
  ],
  "answer": "4/9 va 9/4",
  "translationsRu": {
    "4/9 va 9/4": "4/9 и 9/4",
    "3/7 va 3/7": "3/7 и 3/7",
    "5/8 va 8/3": "5/8 и 8/3",
    "6 va 1/5": "6 и 1/5"
  },
  "explanation": {
    "uz": "4/9 × 9/4 = 1. Shu sabab bu juftlik o'zaro teskari sonlardan tuzilgan.",
    "ru": "Правильный ответ: 4/9 и 9/4. Произведение взаимно обратных чисел равно единице."
  }
};

export default function D13_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={13} task={4}/>;
}
