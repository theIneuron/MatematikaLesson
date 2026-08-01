import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Umumiy maxrajni tekshirish",
    "ru": "Практика к уроку 9. Приведение дробей к общему знаменателю"
  },
  "prompt": {
    "uz": "2/3 va 5/6 kasrlarini 4/6 va 5/6 ko'rinishida umumiy maxrajga keltirish mumkin.",
    "ru": "Верно ли, что 2/3 и 5/6 можно привести к виду 4/6 и 5/6?"
  },
  "options": [
    "Ha",
    "Yo'q"
  ],
  "answer": "Ha",
  "translationsRu": {
    "Ha": "Да",
    "Yo'q": "Нет"
  },
  "explanation": {
    "uz": "2/3 ni 2 ga kengaytirsak 4/6; ikkinchi kasr 5/6 bo'lib qoladi.",
    "ru": "Правильный ответ: Да. Наименьший общий знаменатель равен НОК знаменателей."
  }
};

export default function D09_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={9} task={5}/>;
}
