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
    "180° burilish",
    "O ga nisbatan aks",
    "ikki marta markaziy aks"
  ],
  "right": [
    "(x;y)→(−x;−y)",
    "qarama-qarshi nuqta",
    "boshlang‘ich nuqta"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "180° burilish": "поворот на 180°",
    "O ga nisbatan aks": "O относительно оси",
    "ikki marta markaziy aks": "двойная центральная симметрия",
    "qarama-qarshi nuqta": "противоположная точка",
    "boshlang‘ich nuqta": "исходная точка"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 180° burilish ↔ (x;y)→(−x;−y); O ga nisbatan aks ↔ qarama-qarshi nuqta; ikki marta markaziy aks ↔ boshlang‘ich nuqta.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D41_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={41} task={9}/>;
}
