import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Iqtisodiy va ishga oid masalalar",
    "ru": "Экономические задачи и задачи на работу",
    "en": "Money problems and work problems"
  },
  "prompt": {
    "uz": "Bir ishchi 6 soatda 54 detal tayyorladi. Soatlik unumdorligini yozing.",
    "ru": "Рабочий изготовил 54 детали за 6 часов. Запишите производительность в час.",
    "en": "A worker made 54 parts in 6 hours. Write how many parts he makes in an hour."
  },
  "answer": "9",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 9 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 9.",
    "en": "Do the operations of the calculation in the right order and the answer is 9."
  }
};

export default function D36_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={36} task={8}/>;
}
