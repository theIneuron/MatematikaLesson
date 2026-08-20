import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Koordinata tekisligi",
    "ru": "Координатная плоскость",
    "en": "The coordinate plane"
  },
  "prompt": {
    "uz": "A(−1; 2) va B(−1; −5) nuqtalar orasidagi vertikal masofani toping.",
    "ru": "Найдите вертикальное расстояние между точками A(−1; 2) и B(−1; −5).",
    "en": "Find the vertical distance between the points A(−1; 2) and B(−1; −5)."
  },
  "options": [
    "3",
    "5",
    "7",
    "8"
  ],
  "answer": "7",
  "explanation": {
    "uz": "x lar teng; masofa ordinatalar ayirmasining moduli: |2 − (−5)| = 7.",
    "ru": "Координаты x равны; расстояние равно |2 − (−5)| = 7.",
    "en": "The x coordinates are equal; the distance is the modulus of the difference of the ordinates: |2 − (−5)| = 7."
  }
};

export default function D30_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={30} task={10}/>;
}
