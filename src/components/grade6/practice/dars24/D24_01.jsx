import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Nuqtalarning joylashuvi",
    "ru": "Практика к уроку 24. Координатная прямая",
    "en": "Where the points lie"
  },
  "prompt": {
    "uz": "Koordinata chizig'ida A nuqta −4 da, B nuqta 3 da joylashgan. Qaysi nuqta o'ngroqda turishini aniqlang.",
    "ru": "Точка A имеет координату −4, а точка B — координату 3. Какая точка расположена правее?",
    "en": "On the coordinate line point A is at −4 and point B is at 3. Work out which point lies further to the right."
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
  "translationsEn": {
    "A nuqta": "Point A",
    "B nuqta": "Point B",
    "Ikkalasi bir joyda": "Both in the same place",
    "Aniqlab bo‘lmaydi": "It cannot be told"
  },
  "explanation": {
    "uz": "3 soni −4 dan katta va koordinata chizig'ida o'ngroqda, demak B nuqta o'ngda.",
    "ru": "Правильный ответ: Точка B. Чем правее расположено число на координатной прямой, тем оно больше.",
    "en": "3 is greater than −4 and lies further to the right on the coordinate line, so point B is on the right."
  }
};

export default function D24_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={24} task={1}/>;
}
