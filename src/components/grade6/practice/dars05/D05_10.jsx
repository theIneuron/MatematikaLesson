import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Teng guruhlarga ajratish",
    "ru": "Практика к уроку 5. Наибольший общий делитель",
    "en": "Splitting into equal groups"
  },
  "prompt": {
    "uz": "36 ta qizil va 48 ta ko'k kartani bir xil tarkibli eng ko'p guruhlarga ajratsak, nechta guruh hosil bo'ladi?",
    "ru": "36 красных и 48 синих карточек делят на наибольшее число одинаковых групп. Сколько групп получится?",
    "en": "36 red cards and 48 blue cards are split into the largest possible number of groups with the same contents. How many groups will there be?"
  },
  "options": [
    "6",
    "8",
    "12",
    "16"
  ],
  "answer": "12",
  "explanation": {
    "uz": "EKUB(36,48)=12, demak kartalarni eng ko'pi bilan 12 ta teng guruhga ajratamiz.",
    "ru": "Правильный ответ: 12. НОД — наибольший из общих делителей.",
    "en": "GCD(36, 48) = 12, so the cards go into 12 equal groups at most."
  }
};

export default function D05_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={5} task={10}/>;
}
