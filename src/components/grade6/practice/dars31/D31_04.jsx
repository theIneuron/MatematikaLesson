import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Harfli ifodalar",
    "ru": "Буквенные выражения"
  },
  "prompt": {
    "uz": "Bir daftar narxi p so‘m. 6 ta daftar narxini ifodalovchi yozuvni tanlang.",
    "ru": "Одна тетрадь стоит p сумов. Выберите выражение стоимости 6 тетрадей."
  },
  "options": [
    "p+6",
    "p−6",
    "6p",
    "p:6"
  ],
  "answer": "6p",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 6p hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 6p."
  }
};

export default function D31_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={31} task={4}/>;
}
