import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "O'nli yozuvlarning turlari",
    "ru": "Практика к уроку 15. Периодические дроби и округление",
    "en": "Kinds of decimal records"
  },
  "prompt": {
    "uz": "Har bir o'nli yozuvni uning turini aniq ifodalovchi tavsif bilan moslashtiring.",
    "ru": "Соедините каждую десятичную запись с её видом.",
    "en": "Match each decimal record with the description that names its kind exactly."
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
  "translationsEn": {
    "Aralash davriy kasr": "A mixed recurring decimal",
    "Sof davriy kasr": "A purely recurring decimal",
    "Tugaydigan o‘nli kasr": "A terminating decimal"
  },
  "explanation": {
    "uz": "2,45 tugaydigan, 0,(18) sof davriy, 3,7(2) esa aralash davriy o'nli kasr.",
    "ru": "Все пары найдены правильно. При округлении смотрят на первую цифру после сохраняемого разряда.",
    "en": "2,45 is terminating, 0,(18) is purely recurring, and 3,7(2) is a mixed recurring decimal."
  }
};

export default function D15_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={15} task={9}/>;
}
