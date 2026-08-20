import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Aralash ko'rinishlarni qo'shish",
    "ru": "Практика к уроку 16. Задачи с дробями и десятичными дробями",
    "en": "Adding records of different kinds"
  },
  "prompt": {
    "uz": "Idishga 3/5 litr sharbat va 0,7 litr suv quyildi. Ikkala miqdorni bir xil ko'rinishga keltirib, ichimlikning jami hajmini toping.",
    "ru": "В сосуд налили 3/5 литра сока и 0,7 литра воды. Приведите числа к одному виду и найдите общий объём.",
    "en": "3/5 of a litre of juice and 0,7 of a litre of water were poured into a jug. Bring both amounts to the same kind of record and find the total volume of the drink."
  },
  "options": [
    "1,1 litr",
    "1,2 litr",
    "1,3 litr",
    "1,4 litr"
  ],
  "answer": "1,3 litr",
  "translationsRu": {
    "1,1 litr": "1,1 литра",
    "1,2 litr": "1,2 литра",
    "1,3 litr": "1,3 литра",
    "1,4 litr": "1,4 литра"
  },
  "translationsEn": {
    "1,1 litr": "1,1 litres",
    "1,2 litr": "1,2 litres",
    "1,3 litr": "1,3 litres",
    "1,4 litr": "1,4 litres"
  },
  "explanation": {
    "uz": "3/5 = 0,6. Shuning uchun 0,6 + 0,7 = 1,3 litr.",
    "ru": "Правильный ответ: 1,3 литра. Сначала величины приводят к одному виду, затем выполняют нужное действие.",
    "en": "3/5 = 0,6. That is why 0,6 + 0,7 = 1,3 litres."
  }
};

export default function D16_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={16} task={1}/>;
}
