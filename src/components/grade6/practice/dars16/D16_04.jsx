import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Retseptdagi kasrlar",
    "ru": "Практика к уроку 16. Задачи с дробями и десятичными дробями",
    "en": "Fractions in a recipe"
  },
  "prompt": {
    "uz": "Retsept uchun 2/3 stakan sut va 0,5 stakan suv kerak. Miqdorlarni oddiy kasrga keltirib, jami suyuqlikni toping.",
    "ru": "Для рецепта нужны 2/3 стакана молока и 0,5 стакана воды. Найдите общий объём жидкости.",
    "en": "A recipe needs 2/3 of a glass of milk and 0,5 of a glass of water. Bring the amounts to common fractions and find the total amount of liquid."
  },
  "options": [
    "5/6 stakan",
    "7/6 stakan",
    "4/3 stakan",
    "3/2 stakan"
  ],
  "answer": "7/6 stakan",
  "translationsRu": {
    "5/6 stakan": "5/6 стакана",
    "7/6 stakan": "7/6 стакана",
    "4/3 stakan": "4/3 стакана",
    "3/2 stakan": "3/2 стакана"
  },
  "translationsEn": {
    "5/6 stakan": "5/6 of a glass",
    "7/6 stakan": "7/6 of a glass",
    "4/3 stakan": "4/3 of a glass",
    "3/2 stakan": "3/2 of a glass"
  },
  "explanation": {
    "uz": "0,5 = 1/2. 2/3 + 1/2 = 4/6 + 3/6 = 7/6 stakan.",
    "ru": "Правильный ответ: 7/6 стакана. Сначала величины приводят к одному виду, затем выполняют нужное действие.",
    "en": "0,5 = 1/2. And 2/3 + 1/2 = 4/6 + 3/6 = 7/6 of a glass."
  }
};

export default function D16_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={16} task={4}/>;
}
