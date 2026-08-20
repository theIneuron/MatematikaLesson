import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Qismning butunga nisbati",
    "ru": "Практика к уроку 17. Отношение",
    "en": "The ratio of a part to the whole"
  },
  "prompt": {
    "uz": "Sinfda 14 nafar qiz va 21 nafar o'g'il bor. Qizlar sonining barcha o'quvchilar soniga nisbatini soddalashtiring.",
    "ru": "В классе 14 девочек и 21 мальчик. Найдите отношение числа девочек ко всему классу.",
    "en": "A class has 14 girls and 21 boys. Simplify the ratio of the number of girls to the number of all the pupils."
  },
  "options": [
    "2 : 3",
    "2 : 5",
    "3 : 5",
    "14 : 21"
  ],
  "answer": "2 : 5",
  "explanation": {
    "uz": "Jami 35 o'quvchi. Qizlarning jamiga nisbati 14 : 35 = 2 : 5.",
    "ru": "Правильный ответ: 2 : 5. При сокращении отношения оба его члена делят на одно и то же число.",
    "en": "There are 35 pupils altogether. The ratio of the girls to everybody is 14 : 35 = 2 : 5."
  }
};

export default function D17_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={17} task={4}/>;
}
