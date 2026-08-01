import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Fazoviy shakllar hajmi va o'lchov birliklari",
    "ru": "Объём пространственных фигур и единицы"
  },
  "prompt": {
    "uz": "1 dm³ necha cm³ ga teng?",
    "ru": "Сколько кубических сантиметров в 1 дм³?"
  },
  "options": [
    "10",
    "100",
    "1000",
    "10000"
  ],
  "answer": "1000",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 1000 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 1000."
  }
};

export default function D44_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={44} task={4}/>;
}
