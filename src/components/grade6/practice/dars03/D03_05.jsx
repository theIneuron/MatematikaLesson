import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "3 va 9 ni farqlash",
    "ru": "Практика к уроку 3. Признаки делимости на 3 и 9",
    "en": "Telling 3 and 9 apart"
  },
  "prompt": {
    "uz": "642 sonining raqamlari yig'indisini tekshiring: bu son 3 ga bo'linadi, ammo 9 ga bo'linmaydi, degan fikr to'g'rimi?",
    "ru": "Проверьте сумму цифр числа 642. Верно ли, что оно делится на 3, но не делится на 9?",
    "en": "Check the sum of the digits of 642. Is it true that this number divides by 3 but does not divide by 9?"
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
  "translationsEn": {
    "Ha": "Yes",
    "Yo'q": "No"
  },
  "explanation": {
    "uz": "6 + 4 + 2 = 12; 12 soni 3 ga bo'linadi, ammo 9 ga bo'linmaydi.",
    "ru": "Правильный ответ: Да. Для делимости на 3 и 9 проверяют сумму цифр числа.",
    "en": "6 + 4 + 2 = 12; 12 divides by 3 but does not divide by 9."
  }
};

export default function D03_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={3} task={5}/>;
}
