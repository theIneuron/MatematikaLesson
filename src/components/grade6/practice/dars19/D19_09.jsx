import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "O'zgarish yo'nalishi",
    "ru": "Практика к уроку 19. Прямая и обратная пропорциональность"
  },
  "prompt": {
    "uz": "Miqdorlar qanday o'zgarganini mos natija bilan bog'lang.",
    "ru": "Соедините изменение первой величины с изменением второй."
  },
  "left": [
    "Birinchi miqdor 3 marta ortdi — to‘g‘ri bog‘lanish",
    "Birinchi miqdor 4 marta ortdi — teskari bog‘lanish",
    "Birinchi miqdor 2 marta kamaydi — to‘g‘ri bog‘lanish"
  ],
  "right": [
    "Ikkinchisi 2 marta kamayadi",
    "Ikkinchisi 4 marta kamayadi",
    "Ikkinchisi 3 marta ortadi"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "translationsRu": {
    "Birinchi miqdor 3 marta ortdi — to‘g‘ri bog‘lanish": "Первая величина выросла в 3 раза — прямая зависимость",
    "Birinchi miqdor 4 marta ortdi — teskari bog‘lanish": "Первая величина выросла в 4 раза — обратная зависимость",
    "Birinchi miqdor 2 marta kamaydi — to‘g‘ri bog‘lanish": "Первая величина уменьшилась в 2 раза — прямая зависимость",
    "Ikkinchisi 2 marta kamayadi": "Вторая уменьшится в 2 раза",
    "Ikkinchisi 4 marta kamayadi": "Вторая уменьшится в 4 раза",
    "Ikkinchisi 3 marta ortadi": "Вторая увеличится в 3 раза"
  },
  "explanation": {
    "uz": "To'g'ri bog'lanishda yo'nalish bir xil, teskari bog'lanishda qarama-qarshi bo'ladi.",
    "ru": "Все пары найдены правильно. При прямой зависимости величины меняются одинаково, при обратной — в противоположных направлениях."
  }
};

export default function D19_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={19} task={9}/>;
}
