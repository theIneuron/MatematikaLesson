import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Manfiy son va modul",
    "ru": "Практика к уроку 26. Сравнение рациональных чисел"
  },
  "prompt": {
    "uz": "Moduli kattaroq bo'lgan manfiy son har doim kichikroq bo'ladi, degan fikrni −9 va −4 misolida tekshiring.",
    "ru": "Верно ли, что из двух отрицательных чисел число с большим модулем всегда меньше?"
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
  "explanation": {
    "uz": "Masalan, |−9| > |−4| va −9 < −4. Manfiy sonlarda modul kattalashsa son kichrayadi.",
    "ru": "Правильный ответ: Да. Из двух чисел больше то, которое расположено правее на координатной прямой."
  }
};

export default function D26_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={26} task={5}/>;
}
