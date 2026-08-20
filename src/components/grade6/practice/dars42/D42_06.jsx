import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Uchburchak elementlari, turlari va perimetri",
    "ru": "Элементы, виды и периметр треугольника",
    "en": "Elements, kinds and perimeter of a triangle"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "60°,60°,60°",
    "30°,60°,90°",
    "40°,40°,100°"
  ],
  "right": [
    "o‘tkir",
    "to‘g‘ri burchakli",
    "o‘tmas"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "o‘tkir": "остроугольный",
    "to‘g‘ri burchakli": "прямоугольный",
    "o‘tmas": "тупоугольный"
  },
  "translationsEn": {
    "o‘tkir": "acute-angled",
    "to‘g‘ri burchakli": "right-angled",
    "o‘tmas": "obtuse-angled"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 60°,60°,60° ↔ o‘tkir; 30°,60°,90° ↔ to‘g‘ri burchakli; 40°,40°,100° ↔ o‘tmas.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: 60°,60°,60° ↔ acute-angled; 30°,60°,90° ↔ right-angled; 40°,40°,100° ↔ obtuse-angled."
  }
};

export default function D42_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={42} task={6}/>;
}
