import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kasrni kengaytirish",
    "ru": "Практика к уроку 7. Основное свойство дроби",
    "en": "Expanding a fraction"
  },
  "prompt": {
    "uz": "2/5 kasrining surat va maxrajini 3 ga ko'paytirsak, qaysi teng kasr hosil bo'ladi?",
    "ru": "Числитель и знаменатель дроби 2/5 умножили на 3. Какая равная дробь получилась?",
    "en": "The numerator and the denominator of 2/5 are multiplied by 3. Which equal fraction comes out?"
  },
  "options": [
    "5/8",
    "6/15",
    "6/5",
    "2/15"
  ],
  "answer": "6/15",
  "explanation": {
    "uz": "Surat va maxraj 3 ga ko'payadi: 2 × 3 = 6, 5 × 3 = 15. Natija 6/15.",
    "ru": "Правильный ответ: 6/15. При умножении или делении числителя и знаменателя на одно число значение дроби не меняется.",
    "en": "The numerator and the denominator both grow 3 times: 2 × 3 = 6, 5 × 3 = 15. The result is 6/15."
  }
};

export default function D07_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={7} task={1}/>;
}
