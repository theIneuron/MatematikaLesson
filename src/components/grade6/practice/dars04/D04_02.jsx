import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Bo'luvchilar soni",
    "ru": "Практика к уроку 4. Простые и составные числа"
  },
  "prompt": {
    "uz": "37 tub sonining natural bo'luvchilari sonini yozing.",
    "ru": "Сколько натуральных делителей имеет простое число 37?"
  },
  "answer": "2",
  "explanation": {
    "uz": "37 tub son; uning faqat 1 va 37 bo'luvchilari bor — jami 2 ta.",
    "ru": "Правильный ответ: 2. Простое число имеет ровно два натуральных делителя."
  }
};

export default function D04_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={4} task={2}/>;
}
