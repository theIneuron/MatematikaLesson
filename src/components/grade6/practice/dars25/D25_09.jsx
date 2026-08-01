import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Ikki son orasidagi masofa",
    "ru": "Практика к уроку 25. Модуль числа"
  },
  "prompt": {
    "uz": "Har bir sonlar juftini ularning orasidagi masofa bilan moslashtiring.",
    "ru": "Соедините пары чисел с расстоянием между ними."
  },
  "left": [
    "−4 va 9",
    "−7 va −2",
    "3 va 11"
  ],
  "right": [
    "5",
    "8",
    "13"
  ],
  "pairs": [
    2,
    0,
    1
  ],
  "translationsRu": {
    "−4 va 9": "−4 и 9",
    "−7 va −2": "−7 и −2",
    "3 va 11": "3 и 11"
  },
  "explanation": {
    "uz": "|9 − (−4)| = 13; |−2 − (−7)| = 5; |11 − 3| = 8.",
    "ru": "Все пары найдены правильно. Модуль числа — его расстояние от нуля, поэтому модуль не бывает отрицательным."
  }
};

export default function D25_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={25} task={9}/>;
}
