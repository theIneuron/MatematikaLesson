import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Yuzdan birgacha yaxlitlash",
    "ru": "Практика к уроку 15. Периодические дроби и округление"
  },
  "prompt": {
    "uz": "2,374 sonini yuzdan birlargacha yaxlitlang. Mingdan birlar xonasidagi raqam 4 ekanini hisobga oling.",
    "ru": "Округлите 2,374 до сотых."
  },
  "options": [
    "2,3",
    "2,37",
    "2,38",
    "2,40"
  ],
  "answer": "2,37",
  "explanation": {
    "uz": "Yuzdan birlar xonasidan keyingi raqam 4 bo'lib, 5 dan kichik. Shuning uchun 2,374 ≈ 2,37.",
    "ru": "Правильный ответ: 2,37. При округлении смотрят на первую цифру после сохраняемого разряда."
  }
};

export default function D15_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={15} task={7}/>;
}
