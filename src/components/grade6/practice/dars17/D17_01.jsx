import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Nisbatni soddalashtirish",
    "ru": "Практика к уроку 17. Отношение"
  },
  "prompt": {
    "uz": "Savatda 12 ta olma va 18 ta nok bor. Olmalar sonining noklar soniga nisbatini eng sodda ko'rinishda toping.",
    "ru": "В корзине 12 яблок и 18 груш. Запишите отношение числа яблок к числу груш в простейшем виде."
  },
  "options": [
    "2 : 3",
    "3 : 2",
    "6 : 9",
    "12 : 30"
  ],
  "answer": "2 : 3",
  "explanation": {
    "uz": "12 : 18 nisbatning ikkala hadini 6 ga bo'lsak 2 : 3 hosil bo'ladi.",
    "ru": "Правильный ответ: 2 : 3. При сокращении отношения оба его члена делят на одно и то же число."
  }
};

export default function D17_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={17} task={1}/>;
}
