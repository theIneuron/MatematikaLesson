import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kasr qismli masala",
    "ru": "Практика к уроку 11. Умножение обыкновенных дробей",
    "en": "A problem with a fractional part"
  },
  "prompt": {
    "uz": "Omborda 48 kilogramm guruch bor. Uning 5/6 qismi paketlarga joylandi. Paketlangan guruch massasini toping.",
    "ru": "На складе 48 кг риса. В пакеты расфасовали 5/6 всего риса. Сколько килограммов расфасовали?",
    "en": "A store has 48 kilograms of rice. 5/6 of it was put into packets. Find the mass of the rice in the packets."
  },
  "options": [
    "36 kg",
    "38 kg",
    "40 kg",
    "42 kg"
  ],
  "answer": "40 kg",
  "translationsRu": {
    "36 kg": "36 кг",
    "38 kg": "38 кг",
    "40 kg": "40 кг",
    "42 kg": "42 кг"
  },
  "explanation": {
    "uz": "48 ning 5/6 qismini topamiz: 48 : 6 × 5 = 8 × 5 = 40 kilogramm.",
    "ru": "Правильный ответ: 40 кг. При умножении дробей перемножают числители и знаменатели, а результат сокращают.",
    "en": "Find 5/6 of 48: 48 : 6 × 5 = 8 × 5 = 40 kilograms."
  }
};

export default function D11_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={11} task={10}/>;
}
