import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "O'nli yozuvlarning turlari",
    "ru": "Практика к уроку 15. Периодические дроби и округление"
  },
  "prompt": {
    "uz": "Har bir o'nli yozuvni uning turini aniq ifodalovchi tavsif bilan moslashtiring.",
    "ru": "Соедините каждую десятичную запись с её видом."
  },
  "left": [
    "2,45",
    "0,(18)",
    "3,7(2)"
  ],
  "right": [
    "Aralash davriy kasr",
    "Sof davriy kasr",
    "Tugaydigan o‘nli kasr"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "translationsRu": {
    "Aralash davriy kasr": "Смешанная периодическая дробь",
    "Sof davriy kasr": "Чистая периодическая дробь",
    "Tugaydigan o‘nli kasr": "Конечная десятичная дробь"
  },
  "explanation": {
    "uz": "2,45 tugaydigan, 0,(18) sof davriy, 3,7(2) esa aralash davriy o'nli kasr.",
    "ru": "Все пары найдены правильно. При округлении смотрят на первую цифру после сохраняемого разряда."
  }
};

export default function D15_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={15} task={9}/>;
}
