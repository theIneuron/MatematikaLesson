import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "O'quvchilar foizi",
    "ru": "Практика к уроку 21. Проценты",
    "en": "A percentage of the pupils"
  },
  "prompt": {
    "uz": "480 o'quvchining 15 foizi musobaqada qatnashdi. Qatnashgan o'quvchilar sonini toping.",
    "ru": "В соревновании участвовали 15% из 480 учеников. Сколько учеников участвовало?",
    "en": "15 percent of 480 pupils took part in a competition. Find the number of pupils who took part."
  },
  "options": [
    "62",
    "68",
    "72",
    "75"
  ],
  "answer": "72",
  "explanation": {
    "uz": "480 × 15/100 = 72 o'quvchi.",
    "ru": "Правильный ответ: 72. Один процент равен одной сотой части целого.",
    "en": "480 × 15/100 = 72 pupils."
  }
};

export default function D21_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={21} task={7}/>;
}
