import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Markaziy simmetriya",
    "ru": "Центральная симметрия",
    "en": "Point symmetry"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "parallelogramm",
    "aylana",
    "uchburchak"
  ],
  "right": [
    "bor — diagonallar kesishgan nuqta",
    "bor — aylana markazi",
    "yo‘q"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "aylana": "окружность",
    "uchburchak": "треугольник",
    "bor — diagonallar kesishgan nuqta": "есть — точка пересечения диагоналей",
    "bor — aylana markazi": "есть — центр окружности",
    "yo‘q": "нет",
    "parallelogramm": "параллелограмм"
  },
  "translationsEn": {
    "parallelogramm": "a parallelogram",
    "aylana": "a circle",
    "uchburchak": "a triangle",
    "bor — diagonallar kesishgan nuqta": "yes — the point where the diagonals cross",
    "bor — aylana markazi": "yes — the centre of the circle",
    "yo‘q": "no"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: parallelogramm ↔ bor — diagonallar kesishgan nuqta; aylana ↔ bor — aylana markazi; uchburchak ↔ yo‘q.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: a parallelogram ↔ yes, the point where the diagonals cross; a circle ↔ yes, the centre of the circle; a triangle ↔ no."
  }
};

export default function D41_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={41} task={6}/>;
}
