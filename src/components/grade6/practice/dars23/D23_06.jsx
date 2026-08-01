import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Bog'lanish turi",
    "ru": "Практика к уроку 23. Задачи на пропорции"
  },
  "prompt": {
    "uz": "Masaladagi bog'lanishni uning proporsionallik turi bilan moslashtiring.",
    "ru": "Соедините зависимость в задаче с видом пропорциональности."
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
  "explanation": {
    "uz": "Mahsulot va narx to'g'ri, ishchi va muddat teskari, tezlik va vaqt ko'paytmasi o'zgarmaydi.",
    "ru": "Все пары найдены правильно. Сначала определяют вид зависимости, затем составляют и решают пропорцию."
  }
};

export default function D23_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={23} task={6}/>;
}
