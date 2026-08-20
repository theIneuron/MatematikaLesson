import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "O'q simmetriyasi",
    "ru": "Осевая симметрия",
    "en": "Reflection symmetry"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "y o‘qiga aks",
    "x o‘qiga aks",
    "x=y ga aks"
  ],
  "right": [
    "(x;y)→(−x;y)",
    "(x;y)→(x;−y)",
    "(x;y)→(y;x)"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "y o‘qiga aks": "отражение относительно y",
    "x o‘qiga aks": "отражение относительно x",
    "x=y ga aks": "отражение относительно x=y"
  },
  "translationsEn": {
    "y o‘qiga aks": "reflection in the y axis",
    "x o‘qiga aks": "reflection in the x axis",
    "x=y ga aks": "reflection in x=y"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: y o‘qiga aks ↔ (x;y)→(−x;y); x o‘qiga aks ↔ (x;y)→(x;−y); x=y ga aks ↔ (x;y)→(y;x).",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: reflection in the y axis ↔ (x;y)→(−x;y); reflection in the x axis ↔ (x;y)→(x;−y); reflection in x=y ↔ (x;y)→(y;x)."
  }
};

export default function D40_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={40} task={9}/>;
}
