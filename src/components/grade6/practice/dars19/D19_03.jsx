import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Bog'lanish turlari",
    "ru": "Практика к уроку 19. Прямая и обратная пропорциональность"
  },
  "prompt": {
    "uz": "Har bir hayotiy bog'lanishni uning turiga yoki o'zgarmas kattaligiga moslashtiring.",
    "ru": "Соедините каждую жизненную зависимость с её видом."
  },
  "left": [
    "Mahsulot soni va umumiy narx",
    "Ishchilar soni va ish vaqti",
    "Tezlik va bir xil yo'l vaqti"
  ],
  "right": [
    "Teskari proporsional",
    "To'g'ri proporsional",
    "Ko'paytma o'zgarmaydi"
  ],
  "pairs": [
    1,
    0,
    2
  ],
  "translationsRu": {
    "Mahsulot soni va umumiy narx": "Количество товара и общая стоимость",
    "Ishchilar soni va ish vaqti": "Число рабочих и время работы",
    "Tezlik va bir xil yo'l vaqti": "Скорость и время прохождения одного пути",
    "Teskari proporsional": "Обратно пропорциональные",
    "To'g'ri proporsional": "Прямо пропорциональные",
    "Ko'paytma o'zgarmaydi": "Произведение не изменяется"
  },
  "explanation": {
    "uz": "Miqdor va narx to'g'ri, ishchi va vaqt teskari; bir xil yo'lda tezlik bilan vaqt ko'paytmasi o'zgarmaydi.",
    "ru": "Все пары найдены правильно. При прямой зависимости величины меняются одинаково, при обратной — в противоположных направлениях."
  }
};

export default function D19_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={19} task={3}/>;
}
