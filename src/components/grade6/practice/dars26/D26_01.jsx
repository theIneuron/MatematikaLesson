import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Manfiy kasrlarni taqqoslash",
    "ru": "Практика к уроку 26. Сравнение рациональных чисел",
    "en": "Comparing negative fractions"
  },
  "prompt": {
    "uz": "−3/4 va −0,6 sonlarini bir xil o'nli ko'rinishga keltirib, kattaroq sonni aniqlang.",
    "ru": "Приведите −3/4 и −0,6 к одному виду и укажите большее число.",
    "en": "Bring −3/4 and −0,6 to the same decimal form and work out which number is greater."
  },
  "options": [
    "−3/4",
    "−0,6",
    "Sonlar teng",
    "Taqqoslab bo‘lmaydi"
  ],
  "answer": "−0,6",
  "translationsRu": {
    "Sonlar teng": "Числа равны",
    "Taqqoslab bo‘lmaydi": "Невозможно сравнить"
  },
  "translationsEn": {
    "Sonlar teng": "The numbers are equal",
    "Taqqoslab bo‘lmaydi": "They cannot be compared"
  },
  "explanation": {
    "uz": "−3/4 = −0,75. −0,6 soni −0,75 dan katta.",
    "ru": "Правильный ответ: −0,6. Из двух чисел больше то, которое расположено правее на координатной прямой.",
    "en": "−3/4 = −0,75. And −0,6 is greater than −0,75."
  }
};

export default function D26_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={26} task={1}/>;
}
