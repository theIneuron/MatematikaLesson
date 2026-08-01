import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Iqtisodiy va ishga oid masalalar",
    "ru": "Экономические задачи и задачи на работу"
  },
  "prompt": {
    "uz": "Foyda daromaddan xarajatni ayirish orqali topiladi.",
    "ru": "Прибыль находят вычитанием расходов из дохода."
  },
  "options": [
    "Ha",
    "Yo'q"
  ],
  "answer": "Ha",
  "translationsRu": {
    "Ha": "Да",
    "Yo'q": "Нет"
  },
  "explanation": {
    "uz": "Berilgan fikr mavzuning asosiy qoidasiga to‘liq mos keladi.",
    "ru": "Утверждение полностью соответствует основному правилу темы."
  }
};

export default function D36_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={36} task={5}/>;
}
