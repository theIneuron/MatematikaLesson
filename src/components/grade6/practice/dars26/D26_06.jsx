import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Taqqoslash belgilari",
    "ru": "Практика к уроку 26. Сравнение рациональных чисел",
    "en": "Signs of comparison"
  },
  "prompt": {
    "uz": "Har bir taqqoslashni mos belgi bilan bog'lang.",
    "ru": "Соедините каждое сравнение с правильным знаком.",
    "en": "Connect each comparison with the sign that fits it."
  },
  "left": [
    "−7 □ −3",
    "2/5 □ 0,4",
    "−0,25 □ 0"
  ],
  "right": [
    ">",
    "=",
    "<"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "explanation": {
    "uz": "−7 < −3; 2/5 = 0,4; −0,25 < 0.",
    "ru": "Все пары найдены правильно. Из двух чисел больше то, которое расположено правее на координатной прямой.",
    "en": "−7 < −3; 2/5 = 0,4; −0,25 < 0."
  }
};

export default function D26_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={26} task={6}/>;
}
