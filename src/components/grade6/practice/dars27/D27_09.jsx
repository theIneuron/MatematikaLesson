import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Ratsional sonlarni qo'shish",
    "ru": "Сложение рациональных чисел"
  },
  "prompt": {
    "uz": "Yig‘indilarni natijalari bilan moslashtiring.",
    "ru": "Соедините суммы с их результатами."
  },
  "left": [
    "−1/3 + 5/6",
    "−7/10 + 1/5",
    "2/9 + (−8/9)"
  ],
  "right": [
    "1/2",
    "−1/2",
    "−2/3"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Umumiy maxrajga keltirilganda javoblar 1/2, −1/2 va −2/3 bo‘ladi.",
    "ru": "После приведения к общему знаменателю получаем 1/2, −1/2 и −2/3."
  }
};

export default function D27_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={27} task={9}/>;
}
