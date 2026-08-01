import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Chap va o'ng",
    "ru": "Практика к уроку 24. Координатная прямая"
  },
  "prompt": {
    "uz": "Koordinata chizig'ida −5 soni −2 sonidan o'ngda joylashadi, degan fikrni sonlarning joylashuviga qarab tekshiring.",
    "ru": "Верно ли, что число −5 расположено правее числа −2?"
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
  "explanation": {
    "uz": "−5 soni −2 dan kichik va undan chapda, shuning uchun fikr noto'g'ri.",
    "ru": "Правильный ответ: Нет. Чем правее расположено число на координатной прямой, тем оно больше."
  }
};

export default function D24_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={24} task={5}/>;
}
