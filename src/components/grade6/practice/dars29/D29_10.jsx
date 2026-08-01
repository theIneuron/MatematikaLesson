import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ratsional sonlarni ko'paytirish va bo'lish",
    "ru": "Умножение и деление рациональных чисел"
  },
  "prompt": {
    "uz": "Bir aksiyaning qiymati har kuni 3 ming so‘mdan kamaydi. 6 kundagi umumiy o‘zgarishni toping.",
    "ru": "Цена акции ежедневно уменьшалась на 3 тысячи сумов. Найдите общее изменение за 6 дней."
  },
  "options": [
    "−18 ming",
    "18 ming",
    "−9 ming",
    "9 ming"
  ],
  "answer": "−18 ming",
  "translationsRu": {
    "−18 ming": "−18 тыс.",
    "18 ming": "18 тыс.",
    "−9 ming": "−9 тыс.",
    "9 ming": "9 тыс."
  },
  "explanation": {
    "uz": "Kunlik o‘zgarish −3, kunlar soni 6: −3 · 6 = −18 ming.",
    "ru": "Ежедневное изменение −3, число дней 6: −3 · 6 = −18 тысяч."
  }
};

export default function D29_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={29} task={10}/>;
}
