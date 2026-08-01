import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Uchburchak elementlari, turlari va perimetri",
    "ru": "Элементы, виды и периметр треугольника"
  },
  "prompt": {
    "uz": "Bitta burchagi 90° bo‘lgan uchburchak turini tanlang.",
    "ru": "Выберите вид треугольника с одним углом 90°."
  },
  "options": [
    "o‘tkir",
    "to‘g‘ri burchakli",
    "o‘tmas",
    "teng tomonli"
  ],
  "answer": "to‘g‘ri burchakli",
  "translationsRu": {
    "o‘tkir": "остроугольный",
    "to‘g‘ri burchakli": "прямоугольный",
    "o‘tmas": "тупоугольный",
    "teng tomonli": "равносторонний"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, to‘g‘ri burchakli hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается to‘g‘ri burchakli."
  }
};

export default function D42_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={42} task={4}/>;
}
