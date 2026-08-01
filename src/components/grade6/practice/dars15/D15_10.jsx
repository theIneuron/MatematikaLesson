import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Haroratni yaxlitlash",
    "ru": "Практика к уроку 15. Периодические дроби и округление"
  },
  "prompt": {
    "uz": "Harorat 18,67 °C deb o'lchandi. Uni o'ndan bir darajagacha yaxlitlab, termometrga yoziladigan qiymatni toping.",
    "ru": "Температура равна 18,67 °C. Округлите её до десятых градуса."
  },
  "options": [
    "18,6 °C",
    "18,7 °C",
    "18,67 °C",
    "19,0 °C"
  ],
  "answer": "18,7 °C",
  "explanation": {
    "uz": "18,67 ni o'ndan birlargacha yaxlitlashda yuzdan birlar raqami 7. Demak, 18,6 soni 18,7 ga oshadi.",
    "ru": "Правильный ответ: 18,7 °C. При округлении смотрят на первую цифру после сохраняемого разряда."
  }
};

export default function D15_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={15} task={10}/>;
}
