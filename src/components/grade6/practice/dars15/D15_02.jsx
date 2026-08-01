import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "O'ndan birgacha yaxlitlash",
    "ru": "Практика к уроку 15. Периодические дроби и округление"
  },
  "prompt": {
    "uz": "6,784 sonini o'ndan birlargacha yaxlitlang. Yuzdan birlar xonasidagi raqamga qarab javobni yozing.",
    "ru": "Округлите 6,784 до десятых."
  },
  "answer": "6,8",
  "explanation": {
    "uz": "6,784 ni o'ndan birlargacha yaxlitlashda keyingi raqam 8. U 5 dan katta, shuning uchun 6,8 chiqadi.",
    "ru": "Правильный ответ: 6,8. При округлении смотрят на первую цифру после сохраняемого разряда."
  }
};

export default function D15_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={15} task={2}/>;
}
