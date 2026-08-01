import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Takroriy hodisalar",
    "ru": "Практика к уроку 6. Наименьшее общее кратное"
  },
  "prompt": {
    "uz": "Bir chiroq har 8 soniyada, ikkinchisi har 12 soniyada yonadi. Ular necha soniyadan keyin yana birga yonadi?",
    "ru": "Одна лампа мигает каждые 8 секунд, другая — каждые 12 секунд. Через сколько секунд они снова мигнут вместе?"
  },
  "options": [
    "16",
    "20",
    "24",
    "32"
  ],
  "answer": "24",
  "explanation": {
    "uz": "EKUK(8,12)=24, shuning uchun chiroqlar 24 soniyadan keyin yana birga yonadi.",
    "ru": "Правильный ответ: 24. НОК — наименьшее положительное общее кратное."
  }
};

export default function D06_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={6} task={10}/>;
}
