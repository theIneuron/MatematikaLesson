import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Markaziy simmetriya",
    "ru": "Центральная симметрия"
  },
  "prompt": {
    "uz": "Markaziy simmetriya qanday burilishga teng?",
    "ru": "Какому повороту соответствует центральная симметрия?"
  },
  "options": [
    "90°",
    "120°",
    "180°",
    "360°"
  ],
  "answer": "180°",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 180° hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 180°."
  }
};

export default function D41_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={41} task={4}/>;
}
