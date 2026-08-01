import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "O'nli javob",
    "ru": "Практика к уроку 14. Умножение и деление десятичных дробей"
  },
  "prompt": {
    "uz": "15,75 : 2,5 bo'lish amalini hisoblang. O'nli javobni vergul yordamida yozing.",
    "ru": "Вычислите 15,75 : 2,5 и запишите десятичный ответ."
  },
  "answer": "6,3",
  "explanation": {
    "uz": "15,75 : 2,5 = 157,5 : 25 = 6,3.",
    "ru": "Правильный ответ: 6,3. При действиях с десятичными дробями важно правильно определить место запятой."
  }
};

export default function D14_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={14} task={8}/>;
}
