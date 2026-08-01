import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Ketma-ket o'zgarish",
    "ru": "Практика к уроку 22. Задачи на проценты"
  },
  "prompt": {
    "uz": "Narx avval 10% ga oshib, keyin yangi narxdan 10% ga kamaytirilsa, boshlang'ich narxga qaytadi, degan fikr to'g'rimi?",
    "ru": "Верно ли, что повышение цены на 10%, а затем снижение новой цены на 10% возвращает исходную цену?"
  },
  "options": [
    "Ha",
    "Yo'q"
  ],
  "answer": "Yo'q",
  "translationsRu": {
    "Ha": "Да",
    "Yo'q": "Нет"
  },
  "explanation": {
    "uz": "1,10 × 0,90 = 0,99. Yakuniy qiymat boshlang'ichning 99 foizi bo'ladi.",
    "ru": "Правильный ответ: Нет. Новое значение находят умножением начального значения на коэффициент изменения."
  }
};

export default function D22_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={22} task={5}/>;
}
