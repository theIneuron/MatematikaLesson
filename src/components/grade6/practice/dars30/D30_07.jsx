import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Koordinata tekisligi",
    "ru": "Координатная плоскость"
  },
  "prompt": {
    "uz": "D(−2; 5) nuqtadan 4 birlik o‘ngga siljiganda hosil bo‘ladigan nuqtani toping.",
    "ru": "Найдите точку, полученную сдвигом D(−2; 5) на 4 единицы вправо."
  },
  "options": [
    "(−6; 5)",
    "(2; 5)",
    "(−2; 9)",
    "(−2; 1)"
  ],
  "answer": "(2; 5)",
  "explanation": {
    "uz": "O‘ngga siljishda x ga 4 qo‘shiladi, y o‘zgarmaydi: (2; 5).",
    "ru": "При сдвиге вправо к x прибавляют 4, y не меняется: (2; 5)."
  }
};

export default function D30_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={30} task={7}/>;
}
