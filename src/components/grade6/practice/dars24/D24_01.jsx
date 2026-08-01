import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Nuqtalarning joylashuvi",
    "ru": "Практика к уроку 24. Координатная прямая"
  },
  "prompt": {
    "uz": "Koordinata chizig'ida A nuqta −4 da, B nuqta 3 da joylashgan. Qaysi nuqta o'ngroqda turishini aniqlang.",
    "ru": "Точка A имеет координату −4, а точка B — координату 3. Какая точка расположена правее?"
  },
  "options": [
    "A nuqta",
    "B nuqta",
    "Ikkalasi bir joyda",
    "Aniqlab bo‘lmaydi"
  ],
  "answer": "B nuqta",
  "translationsRu": {
    "A nuqta": "Точка A",
    "B nuqta": "Точка B",
    "Ikkalasi bir joyda": "Обе в одной точке",
    "Aniqlab bo‘lmaydi": "Невозможно определить"
  },
  "explanation": {
    "uz": "3 soni −4 dan katta va koordinata chizig'ida o'ngroqda, demak B nuqta o'ngda.",
    "ru": "Правильный ответ: Точка B. Чем правее расположено число на координатной прямой, тем оно больше."
  }
};

export default function D24_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={24} task={1}/>;
}
