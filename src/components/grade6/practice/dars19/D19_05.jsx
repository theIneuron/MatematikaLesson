import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Miqdor va narx",
    "ru": "Практика к уроку 19. Прямая и обратная пропорциональность",
    "en": "Amount and cost"
  },
  "prompt": {
    "uz": "Mahsulotning dona narxi o'zgarmasa, mahsulot soni ortganda umumiy narx ham shu marta ortadi, degan fikr to'g'rimi?",
    "ru": "Верно ли, что при неизменной цене увеличение количества товара во столько же раз увеличивает общую стоимость?",
    "en": "The price of one item stays the same. Is it true that when the number of items grows, the total cost grows by the same factor?"
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
  "translationsEn": {
    "Ha": "Yes",
    "Yo'q": "No"
  },
  "explanation": {
    "uz": "Dona narxi o'zgarmasa, miqdor va umumiy narx to'g'ri proporsional.",
    "ru": "Правильный ответ: Да. При прямой зависимости величины меняются одинаково, при обратной — в противоположных направлениях.",
    "en": "While the price of one item stays the same, the amount and the total cost are directly proportional."
  }
};

export default function D19_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={19} task={5}/>;
}
