import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Qism necha foiz",
    "ru": "Практика к уроку 21. Проценты"
  },
  "prompt": {
    "uz": "Har bir qism va butun juftligi uchun qism butunning necha foizi ekanini moslashtiring.",
    "ru": "Для каждой пары найдите, сколько процентов составляет часть от целого."
  },
  "left": [
    "12 dan 3",
    "40 dan 14",
    "80 dan 52"
  ],
  "right": [
    "65%",
    "35%",
    "25%"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "translationsRu": {
    "12 dan 3": "3 из 12",
    "40 dan 14": "14 из 40",
    "80 dan 52": "52 из 80"
  },
  "explanation": {
    "uz": "3/12 = 25%; 14/40 = 35%; 52/80 = 65%.",
    "ru": "Все пары найдены правильно. Один процент равен одной сотой части целого."
  }
};

export default function D21_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={21} task={9}/>;
}
