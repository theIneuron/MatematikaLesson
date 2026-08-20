import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Ratsional sonlarni qo'shish",
    "ru": "Сложение рациональных чисел",
    "en": "Adding rational numbers"
  },
  "prompt": {
    "uz": "−14 + 9 yig‘indini hisoblab, javobni yozing.",
    "ru": "Вычислите сумму −14 + 9 и запишите ответ.",
    "en": "Work out the sum −14 + 9 and write the answer."
  },
  "answer": "-5",
  "explanation": {
    "uz": "Modullar ayirmasi 14 − 9 = 5; katta modul manfiy songa tegishli, demak −5.",
    "ru": "Разность модулей 14 − 9 = 5; больший модуль у отрицательного числа, значит −5.",
    "en": "The difference of the moduli is 14 − 9 = 5; the bigger modulus belongs to the negative number, so it is −5."
  }
};

export default function D27_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={27} task={2}/>;
}
