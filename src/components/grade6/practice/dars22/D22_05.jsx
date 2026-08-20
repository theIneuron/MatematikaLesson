import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Ketma-ket o'zgarish",
    "ru": "Практика к уроку 22. Задачи на проценты",
    "en": "Two changes in a row"
  },
  "prompt": {
    "uz": "Narx avval 10% ga oshib, keyin yangi narxdan 10% ga kamaytirilsa, boshlang'ich narxga qaytadi, degan fikr to'g'rimi?",
    "ru": "Верно ли, что повышение цены на 10%, а затем снижение новой цены на 10% возвращает исходную цену?",
    "en": "A price first rises by 10% and then the new price is cut by 10%. Is it true that it comes back to the price it started from?"
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
  "translationsEn": {
    "Ha": "Yes",
    "Yo'q": "No"
  },
  "explanation": {
    "uz": "1,10 × 0,90 = 0,99. Yakuniy qiymat boshlang'ichning 99 foizi bo'ladi.",
    "ru": "Правильный ответ: Нет. Новое значение находят умножением начального значения на коэффициент изменения.",
    "en": "1,10 × 0,90 = 0,99. The final value is 99 percent of the one it started from."
  }
};

export default function D22_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={22} task={5}/>;
}
