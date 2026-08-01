import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Amalni tanlash",
    "ru": "Практика к уроку 16. Задачи с дробями и десятичными дробями"
  },
  "prompt": {
    "uz": "Masala mazmuniga qarab bajariladigan birinchi amalni moslashtiring. Har bir vaziyatda nima topilayotganiga e'tibor bering.",
    "ru": "Соедините каждую ситуацию с первым действием, необходимым для решения."
  },
  "left": [
    "Ikki idishdagi yog'ni birlashtirish",
    "Jami yo'ldan yurilganini topish",
    "Sonning 4/7 qismini aniqlash"
  ],
  "right": [
    "Ayirish",
    "Ko'paytirish",
    "Qo'shish"
  ],
  "pairs": [
    2,
    0,
    1
  ],
  "translationsRu": {
    "Ikki idishdagi yog'ni birlashtirish": "Объединить масло из двух сосудов",
    "Jami yo'ldan yurilganini topish": "Найти пройденную часть всего пути",
    "Sonning 4/7 qismini aniqlash": "Найти 4/7 числа",
    "Ayirish": "Вычитание",
    "Ko'paytirish": "Умножение",
    "Qo'shish": "Сложение"
  },
  "explanation": {
    "uz": "Birlashtirishda qo'shamiz, qoldiqda ayiramiz, sonning qismini topishda ko'paytiramiz.",
    "ru": "Все пары найдены правильно. Сначала величины приводят к одному виду, затем выполняют нужное действие."
  }
};

export default function D16_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={16} task={6}/>;
}
