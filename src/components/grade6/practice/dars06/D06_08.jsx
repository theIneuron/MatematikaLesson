import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "16 va 18 ning EKUKi",
    "ru": "Практика к уроку 6. Наименьшее общее кратное",
    "en": "The LCM of 16 and 18"
  },
  "prompt": {
    "uz": "16 va 18 sonlarining EKUKini hisoblab yozing.",
    "ru": "Вычислите НОК чисел 16 и 18.",
    "en": "Work out the LCM of 16 and 18 and write the answer."
  },
  "answer": "144",
  "explanation": {
    "uz": "16 = 2⁴, 18 = 2 × 3²; EKUK = 2⁴ × 3² = 144.",
    "ru": "Правильный ответ: 144. НОК — наименьшее положительное общее кратное.",
    "en": "16 = 2⁴, 18 = 2 × 3²; the LCM = 2⁴ × 3² = 144."
  }
};

export default function D06_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={6} task={8}/>;
}
