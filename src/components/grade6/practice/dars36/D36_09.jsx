import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Iqtisodiy va ishga oid masalalar",
    "ru": "Экономические задачи и задачи на работу",
    "en": "Money problems and work problems"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "C=p·n",
    "A=r·t",
    "F=D−X"
  ],
  "right": [
    "qiymat",
    "ish hajmi",
    "foyda"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "qiymat": "стоимость",
    "ish hajmi": "объём работы",
    "foyda": "прибыль"
  },
  "translationsEn": {
    "qiymat": "the cost",
    "ish hajmi": "the amount of work",
    "foyda": "the profit"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: C=p·n ↔ qiymat; A=r·t ↔ ish hajmi; F=D−X ↔ foyda.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: C=p·n ↔ the cost; A=r·t ↔ the amount of work; F=D−X ↔ the profit."
  }
};

export default function D36_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={36} task={9}/>;
}
