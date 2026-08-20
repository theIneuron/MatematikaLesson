import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Qolgan miqdor",
    "ru": "Практика к уроку 21. Проценты",
    "en": "The amount left"
  },
  "prompt": {
    "uz": "Do'kondagi 640 mahsulotning 37,5 foizi sotildi. Nechta mahsulot qolganini ikki bosqichda toping.",
    "ru": "Из 640 товаров продали 37,5%. Сколько товаров осталось?",
    "en": "37,5 percent of the 640 goods in a shop were sold. Find in two steps how many goods are left."
  },
  "options": [
    "240",
    "360",
    "400",
    "440"
  ],
  "answer": "400",
  "explanation": {
    "uz": "640 ning 37,5 foizi 240; qolgan mahsulot 640 − 240 = 400.",
    "ru": "Правильный ответ: 400. Один процент равен одной сотой части целого.",
    "en": "37,5 percent of 640 is 240; the goods left are 640 − 240 = 400."
  }
};

export default function D21_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={21} task={10}/>;
}
