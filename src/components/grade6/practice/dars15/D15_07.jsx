import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Yuzdan birgacha yaxlitlash",
    "ru": "Практика к уроку 15. Периодические дроби и округление",
    "en": "Rounding to hundredths"
  },
  "prompt": {
    "uz": "2,374 sonini yuzdan birlargacha yaxlitlang. Mingdan birlar xonasidagi raqam 4 ekanini hisobga oling.",
    "ru": "Округлите 2,374 до сотых.",
    "en": "Round 2,374 to hundredths. Note that the digit in the thousandths place is 4."
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
    "ru": "Правильный ответ: 2,37. При округлении смотрят на первую цифру после сохраняемого разряда.",
    "en": "The digit after the hundredths place is 4, and that is less than 5. That is why 2,374 ≈ 2,37."
  }
};

export default function D15_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={15} task={7}/>;
}
