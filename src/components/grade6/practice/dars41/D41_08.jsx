import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Markaziy simmetriya",
    "ru": "Центральная симметрия"
  },
  "prompt": {
    "uz": "C(9; −2) nuqtaning markaziy simmetrigidagi ordinatani yozing.",
    "ru": "Запишите ординату точки, центрально-симметричной C(9; −2)."
  },
  "answer": "2",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 2 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 2."
  }
};

export default function D41_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={41} task={8}/>;
}
