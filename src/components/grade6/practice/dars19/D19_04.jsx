import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Tezlik va vaqt",
    "ru": "Практика к уроку 19. Прямая и обратная пропорциональность"
  },
  "prompt": {
    "uz": "Mashina 60 km/soat tezlikda yo'lni 4 soatda bosadi. Xuddi shu yo'lni 80 km/soatda necha soatda bosib o'tadi?",
    "ru": "Автомобиль проходит путь за 4 часа со скоростью 60 км/ч. За сколько часов он пройдёт этот путь со скоростью 80 км/ч?"
  },
  "options": [
    "2 soat",
    "3 soat",
    "5 soat",
    "6 soat"
  ],
  "answer": "3 soat",
  "translationsRu": {
    "2 soat": "2 часа",
    "3 soat": "3 часа",
    "5 soat": "5 часа",
    "6 soat": "6 часа"
  },
  "explanation": {
    "uz": "Yo'l 60 × 4 = 240 km. Vaqt 240 : 80 = 3 soat.",
    "ru": "Правильный ответ: 3 часа. При прямой зависимости величины меняются одинаково, при обратной — в противоположных направлениях."
  }
};

export default function D19_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={19} task={4}/>;
}
