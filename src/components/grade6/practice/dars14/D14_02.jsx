import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "O'nli kasrlarni bo'lish",
    "ru": "Практика к уроку 14. Умножение и деление десятичных дробей"
  },
  "prompt": {
    "uz": "7,2 : 0,6 bo'lish amalida bo'luvchi va bo'linuvchini 10 ga ko'paytirib hisoblang. Javobni yozing.",
    "ru": "Вычислите 7,2 : 0,6."
  },
  "answer": "12",
  "explanation": {
    "uz": "7,2 : 0,6 = 72 : 6 = 12.",
    "ru": "Правильный ответ: 12. При действиях с десятичными дробями важно правильно определить место запятой."
  }
};

export default function D14_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={14} task={2}/>;
}
