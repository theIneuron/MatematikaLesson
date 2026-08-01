import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Ratsional sonlarni qo'shish",
    "ru": "Сложение рациональных чисел"
  },
  "prompt": {
    "uz": "−14 + 9 yig‘indini hisoblab, javobni yozing.",
    "ru": "Вычислите сумму −14 + 9 и запишите ответ."
  },
  "answer": "-5",
  "explanation": {
    "uz": "Modullar ayirmasi 14 − 9 = 5; katta modul manfiy songa tegishli, demak −5.",
    "ru": "Разность модулей 14 − 9 = 5; больший модуль у отрицательного числа, значит −5."
  }
};

export default function D27_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={27} task={2}/>;
}
