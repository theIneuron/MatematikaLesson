import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Iqtisodiy va ishga oid masalalar",
    "ru": "Экономические задачи и задачи на работу"
  },
  "prompt": {
    "uz": "5 ta bir xil daftar 60 ming so‘m turadi. Bitta daftar narxini ming so‘mda yozing.",
    "ru": "5 одинаковых тетрадей стоят 60 тысяч сумов. Запишите цену одной в тысячах."
  },
  "answer": "12",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 12 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 12."
  }
};

export default function D36_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={36} task={2}/>;
}
