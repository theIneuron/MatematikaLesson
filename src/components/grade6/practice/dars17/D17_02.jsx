import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Nisbatning ikkinchi hadi",
    "ru": "Практика к уроку 17. Отношение",
    "en": "The second term of a ratio"
  },
  "prompt": {
    "uz": "28 : 42 nisbatning ikkala hadini ularning eng katta umumiy bo'luvchisiga bo'ling. Soddalashgan nisbatning ikkinchi hadini yozing.",
    "ru": "Сократите отношение 28 : 42 и запишите его второй член.",
    "en": "Divide both terms of the ratio 28 : 42 by their greatest common divisor. Write the second term of the simplified ratio."
  },
  "answer": "3",
  "explanation": {
    "uz": "28 : 42 = 2 : 3. Soddalashgan nisbatning ikkinchi hadi 3.",
    "ru": "Правильный ответ: 3. При сокращении отношения оба его члена делят на одно и то же число.",
    "en": "28 : 42 = 2 : 3. The second term of the simplified ratio is 3."
  }
};

export default function D17_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={17} task={2}/>;
}
