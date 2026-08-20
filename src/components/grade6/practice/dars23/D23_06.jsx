import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Bog'lanish turi",
    "ru": "Практика к уроку 23. Задачи на пропорции",
    "en": "The kind of relation"
  },
  "prompt": {
    "uz": "Masaladagi bog'lanishni uning proporsionallik turi bilan moslashtiring.",
    "ru": "Соедините зависимость в задаче с видом пропорциональности.",
    "en": "Match the relation in the problem with its kind of proportion."
  },
  "left": [
    "Mahsulot miqdori va narxi",
    "Ishchilar soni va ish muddati",
    "Tezlik va bir xil yo‘l vaqti"
  ],
  "right": [
    "Teskari proporsional miqdorlar",
    "To‘g‘ri proporsional miqdorlar",
    "Ko‘paytmasi o‘zgarmaydi"
  ],
  "pairs": [
    1,
    0,
    2
  ],
  "translationsRu": {
    "Mahsulot miqdori va narxi": "Количество товара и стоимость",
    "Ishchilar soni va ish muddati": "Число рабочих и срок работы",
    "Tezlik va bir xil yo‘l vaqti": "Скорость и время прохождения одного пути",
    "Teskari proporsional miqdorlar": "Обратно пропорциональные величины",
    "To‘g‘ri proporsional miqdorlar": "Прямо пропорциональные величины",
    "Ko‘paytmasi o‘zgarmaydi": "Произведение не изменяется"
  },
  "translationsEn": {
    "Mahsulot miqdori va narxi": "The amount of goods and their cost",
    "Ishchilar soni va ish muddati": "The number of workers and the time for the job",
    "Tezlik va bir xil yo‘l vaqti": "The speed and the time over the same route",
    "Teskari proporsional miqdorlar": "Inversely proportional quantities",
    "To‘g‘ri proporsional miqdorlar": "Directly proportional quantities",
    "Ko‘paytmasi o‘zgarmaydi": "Their product stays the same"
  },
  "explanation": {
    "uz": "Mahsulot va narx to'g'ri, ishchi va muddat teskari, tezlik va vaqt ko'paytmasi o'zgarmaydi.",
    "ru": "Все пары найдены правильно. Сначала определяют вид зависимости, затем составляют и решают пропорцию.",
    "en": "The goods and the cost are direct, the workers and the time are inverse, and the product of the speed and the time stays the same."
  }
};

export default function D23_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={23} task={6}/>;
}
