import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ratsional sonlarni ko'paytirish va bo'lish",
    "ru": "Умножение и деление рациональных чисел",
    "en": "Multiplying and dividing rational numbers"
  },
  "prompt": {
    "uz": "Bir aksiyaning qiymati har kuni 3 ming so‘mdan kamaydi. 6 kundagi umumiy o‘zgarishni toping.",
    "ru": "Цена акции ежедневно уменьшалась на 3 тысячи сумов. Найдите общее изменение за 6 дней.",
    "en": "The price of a share fell by 3 thousand sum every day. Find the total change over 6 days."
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
  "translationsEn": {
    "−18 ming": "−18 thousand",
    "18 ming": "18 thousand",
    "−9 ming": "−9 thousand",
    "9 ming": "9 thousand"
  },
  "explanation": {
    "uz": "Kunlik o‘zgarish −3, kunlar soni 6: −3 · 6 = −18 ming.",
    "ru": "Ежедневное изменение −3, число дней 6: −3 · 6 = −18 тысяч.",
    "en": "The daily change is −3 and the number of days is 6: −3 · 6 = −18 thousand."
  }
};

export default function D29_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={29} task={10}/>;
}
