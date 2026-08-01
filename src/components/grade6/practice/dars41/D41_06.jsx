import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Markaziy simmetriya",
    "ru": "Центральная симметрия"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
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
    "yo‘q": "нет"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: parallelogramm ↔ bor — diagonallar kesishgan nuqta; aylana ↔ bor — aylana markazi; uchburchak ↔ yo‘q.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D41_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={41} task={6}/>;
}
