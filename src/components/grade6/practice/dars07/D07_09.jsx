import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Kengaytirish natijalari",
    "ru": "Практика к уроку 7. Основное свойство дроби",
    "en": "Results of expanding"
  },
  "prompt": {
    "uz": "Kengaytirish amalini uning natijasi bilan moslashtiring.",
    "ru": "Соедините действие расширения дроби с его результатом.",
    "en": "Match each expansion with its result."
  },
  "left": [
    "3/8 ni 2 ga kengaytirish",
    "5/11 ni 3 ga kengaytirish",
    "7/12 ni 4 ga kengaytirish"
  ],
  "right": [
    "6/16",
    "15/33",
    "28/48"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "3/8 ni 2 ga kengaytirish": "расширить 3/8 в 2 раза",
    "5/11 ni 3 ga kengaytirish": "расширить 5/11 в 3 раза",
    "7/12 ni 4 ga kengaytirish": "расширить 7/12 в 4 раза"
  },
  "translationsEn": {
    "3/8 ni 2 ga kengaytirish": "expanding 3/8 by 2",
    "5/11 ni 3 ga kengaytirish": "expanding 5/11 by 3",
    "7/12 ni 4 ga kengaytirish": "expanding 7/12 by 4"
  },
  "explanation": {
    "uz": "3/8→6/16, 5/11→15/33, 7/12→28/48.",
    "ru": "Все пары найдены правильно. При умножении или делении числителя и знаменателя на одно число значение дроби не меняется.",
    "en": "3/8 gives 6/16, 5/11 gives 15/33, 7/12 gives 28/48."
  }
};

export default function D07_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={7} task={9}/>;
}
