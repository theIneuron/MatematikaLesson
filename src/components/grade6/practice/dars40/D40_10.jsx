import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "O'q simmetriyasi",
    "ru": "Осевая симметрия"
  },
  "prompt": {
    "uz": "A(−2; 6) avval y o‘qiga, keyin x o‘qiga akslantirildi. Natijani toping.",
    "ru": "A(−2; 6) отразили сначала относительно y, затем относительно x. Найдите результат."
  },
  "options": [
    "(2;−6)",
    "(−2;−6)",
    "(2;6)",
    "(−6;2)"
  ],
  "answer": "(2;−6)",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, (2;−6) hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается (2;−6)."
  }
};

export default function D40_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={40} task={10}/>;
}
