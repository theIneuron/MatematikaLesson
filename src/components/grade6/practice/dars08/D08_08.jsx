import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Noma'lum surat",
    "ru": "Практика к уроку 8. Сокращение дробей",
    "en": "The unknown numerator"
  },
  "prompt": {
    "uz": "?/55 kasri qisqartirilganda 3/5 hosil bo'lsa, noma'lum suratni yozing.",
    "ru": "Если дробь ?/55 сокращается до 3/5, найдите неизвестный числитель.",
    "en": "The fraction ?/55 reduces to 3/5. Write the unknown numerator."
  },
  "answer": "33",
  "explanation": {
    "uz": "33/55 ni 11 ga bo'lsak 3/5 hosil bo'ladi.",
    "ru": "Правильный ответ: 33. Для полного сокращения числитель и знаменатель делят на их НОД.",
    "en": "Divide 33/55 by 11 and you get 3/5."
  }
};

export default function D08_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={8} task={8}/>;
}
