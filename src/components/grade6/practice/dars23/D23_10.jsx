import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ish unumdorligi",
    "ru": "Практика к уроку 23. Задачи на пропорции",
    "en": "The rate of work"
  },
  "prompt": {
    "uz": "18 ishchi 20 kunda 540 ta detal tayyorlaydi. Ish unumdorligi bir xil bo'lsa, 24 ishchi 15 kunda nechta detal tayyorlaydi?",
    "ru": "18 рабочих за 20 дней изготавливают 540 деталей. Сколько деталей изготовят 24 рабочих за 15 дней?",
    "en": "18 workers make 540 parts in 20 days. If the rate of work stays the same, how many parts do 24 workers make in 15 days?"
  },
  "options": [
    "480",
    "510",
    "540",
    "600"
  ],
  "answer": "540",
  "explanation": {
    "uz": "Ishchi-kunlar ikkala holatda ham 360: ishlab chiqarilgan detal soni 540 bo'lib qoladi.",
    "ru": "Правильный ответ: 540. Сначала определяют вид зависимости, затем составляют и решают пропорцию.",
    "en": "The worker-days are 360 in both cases, so the number of parts made stays 540."
  }
};

export default function D23_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={23} task={10}/>;
}
