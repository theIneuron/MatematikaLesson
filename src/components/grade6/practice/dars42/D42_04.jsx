import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Uchburchak elementlari, turlari va perimetri",
    "ru": "Элементы, виды и периметр треугольника",
    "en": "Elements, kinds and perimeter of a triangle"
  },
  "prompt": {
    "uz": "Bitta burchagi 90° bo‘lgan uchburchak turini tanlang.",
    "ru": "Выберите вид треугольника с одним углом 90°.",
    "en": "Choose the kind of triangle that has one angle of 90°."
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
  "translationsEn": {
    "o‘tkir": "acute-angled",
    "to‘g‘ri burchakli": "right-angled",
    "o‘tmas": "obtuse-angled",
    "teng tomonli": "equilateral"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, to‘g‘ri burchakli hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается: прямоугольный треугольник.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get: right-angled."
  }
};

export default function D42_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={42} task={4}/>;
}
