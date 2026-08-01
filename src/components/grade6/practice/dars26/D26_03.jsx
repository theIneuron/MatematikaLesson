import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Teng ratsional sonlar",
    "ru": "Практика к уроку 26. Сравнение рациональных чисел"
  },
  "prompt": {
    "uz": "Har bir sonni unga teng boshqa ko'rinishdagi ratsional son bilan moslashtiring.",
    "ru": "Соедините каждое рациональное число с равной записью."
  },
  "left": [
    "−1/2",
    "0,75",
    "−1,2"
  ],
  "right": [
    "−6/5",
    "3/4",
    "−0,5"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "explanation": {
    "uz": "−1/2 = −0,5; 0,75 = 3/4; −1,2 = −6/5.",
    "ru": "Все пары найдены правильно. Из двух чисел больше то, которое расположено правее на координатной прямой."
  }
};

export default function D26_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={26} task={3}/>;
}
