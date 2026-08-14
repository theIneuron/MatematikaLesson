import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { canUseGrade4TheoryContinue } from './theoryNavigation.js';

// 4-SINF · 18-DARS · Kasr tushunchasi
// Approved frame vector: 3,4,4,4,4,4,4,4,5,2,2,2,2,2,3,5.

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];

const bi = (uz, ru, en) => ({ uz, ru, en });

const D18_SCREENS = [
  {
    type: 'hook', eyebrow: bi('Taqsimlash markazi', 'Распределительный центр', "Distribution centre"),
    title: bi("Kasr har qanday bo'laklardan tuziladimi?", 'Можно ли составить дробь из любых частей?', "Can a fraction be made from any parts?"), bit: 'think',
    frames: [bi('Lumo taqsimlash markazi', 'Распределительный центр Лумо', "Lumo distribution centre"), bi("5 ta bo'lakdan 2 tasi bo'yalgan", 'Закрашены 2 части из 5', "2 of 5 parts are shaded"), bi("Bu model 2/5 ni ko'rsatadimi?", 'Показывает ли модель 2/5?', "Does this model show 2/5?")],
    audio: {
      uz: ["Lumo taqsimlash markazidagi panel beshta bo'lakka ajratilgan.", "Bo'laklardan ikkitasi bo'yalgan, ammo ularning kattaligi bir xil emas.", "Bu model beshdan ikki kasrini ko'rsatadimi? Taxminingizni belgilang yoki shunchaki kuzating."],
      ru: ['Панель в распределительном центре Лумо разделена на пять частей.', 'Две части закрашены, но части имеют разный размер.', 'Показывает ли эта модель дробь две пятых? Отметьте предположение или просто наблюдайте.'], en: ["The panel at the Lumo distribution centre is divided into five parts.","Two parts are shaded, but they are not the same size.","Does this model show two fifths? Mark your estimate or simply observe."],
    },
    visual: { kind: 'unequal', denominator: 5, numerator: 2 },
    neutralOptions: [bi('Ha', 'Да', "Yes"), bi("Yo'q", 'Нет', "No"), bi('Hali bilmayman', 'Пока не знаю', "I don't know yet")],
    neutral: bi("Taxmin saqlandi. Endi bo'laklarning o'lchamini tekshiramiz.", 'Предположение сохранено. Теперь проверим размер частей.', "Estimate saved. Now we will check the sizes of the parts."),
  },
  {
    type: 'exploration', eyebrow: bi('Teng taqsimlash', 'Равное распределение', "Equal sharing"), title: bi('Har bir stansiyaga nechta batareya?', 'Сколько батарей получит каждая станция?', "How many batteries will each station receive?"),
    frames: [bi('12 ta batareya', '12 батарей', "12 batteries"), bi('4 ta stansiya', '4 станции', "4 stations"), bi('Har bir stansiyaga ? tadan', 'Каждой станции по ?', "? for each station"), bi('12 : 4 = ?', '12 : 4 = ?', "12 : 4 = ?")],
    audio: {
      uz: ["Taqsimlash markazida o'n ikkita bir xil batareya bor.", "Ularni to'rtta stansiyaga teng taqsimlaymiz.", "Har bir stansiyada bir xil miqdor bo'lishi kerak. Mos javobni tanlang.", "Tanlagan javobingizda barcha o'n ikkita batareya teng taqsimlanishini tekshiring."],
      ru: ['В распределительном центре есть двенадцать одинаковых батарей.', 'Распределим их поровну между четырьмя станциями.', 'На каждой станции должно быть одинаковое количество. Выберите подходящий ответ.', 'Проверьте, что при выбранном ответе все двенадцать батарей распределены поровну.'], en: ["There are twelve identical batteries at the distribution centre.","We will share them equally among four stations.","Each station must receive the same number. Choose the suitable answer.","Check that your answer shares all twelve batteries equally."],
    },
    visual: { kind: 'batteryShare', total: 12, groups: 4, interaction: { type: 'diagnosticChoice', options: [bi('2 tadan', 'По 2', "2 each"), bi('3 tadan', 'По 3', "3 each"), bi('4 tadan', 'По 4', "4 each")], values: [2, 3, 4], correctIndex: 1, feedback: [bi('Har biriga 2 tadan bersak, 4 ta batareya ortib qoladi.', 'Если дать каждой по 2, останутся 4 батареи.', "If each station gets 2, 4 batteries remain."), bi("To'g'ri: har bir stansiyaga 3 tadan batareya tegadi.", 'Верно: каждая станция получит по 3 батареи.', "Correct: each station receives 3 batteries."), bi('Har biriga 4 tadan berish uchun 16 ta batareya kerak.', 'Чтобы дать каждой по 4, нужны 16 батарей.', "To give each station 4 batteries, 16 batteries are needed.")], audioFeedback: [bi("Har biriga ikkitadan bersak, to'rtta batareya ortib qoladi.", 'Если дать каждой по две, останутся четыре батареи.', "If each station gets two, four batteries remain."), bi("To'g'ri. Har bir stansiyaga uchtadan batareya tegadi.", 'Верно. Каждая станция получит по три батареи.', "Correct. Each station receives three batteries."), bi("Har biriga to'rttadan berish uchun o'n oltita batareya kerak.", 'Чтобы дать каждой по четыре, нужны шестнадцать батарей.', "To give each station four batteries, sixteen batteries are needed.")] } },
  },
  {
    type: 'exploration', eyebrow: bi('Butunni tanlash', 'Выбор целого', "Choosing the whole"), title: bi('Kasr qaysi butunga tegishli?', 'К какому целому относится дробь?', "Which whole does the fraction belong to?"),
    frames: [bi('Ikki obyektning o\'lchami turlicha', 'Два объекта разного размера', "Two objects of different sizes"), bi('Tanlangan obyekt: 1 ta butun', 'Выбранный объект: 1 целое', "Chosen object: 1 whole"), bi('Kattaroq obyekt boshqa butun', 'Большой объект является другим целым', "The larger object is another whole"), bi('Kasrning butuni oldindan aniqlanadi', 'Целое для дроби определяют заранее', "The whole for a fraction is chosen first")],
    audio: {
      uz: ["Ekranda o'lchami turlicha bo'lgan ikkita obyekt bor.", "Kasr tuzishdan oldin qaysi obyektni bitta butun deb olayotganimizni aniqlaymiz.", "Kattaroq obyekt tanlangan butunning davomiy qismi emas. U boshqa butundir.", "Demak, kasr doimo oldindan tanlangan bitta butunga tegishli bo'ladi."],
      ru: ['На экране два объекта разного размера.', 'Перед составлением дроби определим, какой объект считаем одним целым.', 'Большой объект не является продолжением выбранного целого. Это другое целое.', 'Значит, дробь всегда относится к заранее выбранному одному целому.'], en: ["There are two objects of different sizes on the screen.","Before making a fraction, decide which object counts as one whole.","The larger object is not a continuation of the chosen whole. It is another whole.","So a fraction always belongs to one whole that was chosen first."],
    },
    visual: { kind: 'wholeChoice', interaction: { type: 'wholeTap', inline: true, options: [bi('Tanlangan butun', 'Выбранное целое', "Chosen whole"), bi('Boshqa butun', 'Другое целое', "Another whole")], feedback: [bi('Bu obyekt tanlangan bitta butun.', 'Этот объект выбран как одно целое.', "This object is the chosen whole."), bi('Bu kattaroq obyekt alohida boshqa butun.', 'Этот большой объект является отдельным другим целым.', "This larger object is a separate whole.")], audioFeedback: [bi('Bu obyekt tanlangan bitta butun.', 'Этот объект выбран как одно целое.', "This object is the chosen whole."), bi('Bu kattaroq obyekt alohida boshqa butun.', 'Этот большой объект является отдельным другим целым.', "This larger object is a separate whole.")] } },
  },
  {
    type: 'exploration', eyebrow: bi('Teng qismlar', 'Равные части', "Equal parts"), title: bi("Teng bo'lmagan qismlardan teng ulushlarga", 'От неравных частей к равным долям', "From unequal parts to equal shares"),
    frames: [bi('1 ta butun panel', 'Одна целая панель', "1 whole panel"), bi("Teng bo'lmagan qismlar", 'Неравные части', "Unequal parts"), bi('5 ta teng qism', '5 равных частей', "5 equal parts"), bi("Kasr uchun qismlar teng bo'lishi kerak", 'Для дроби части должны быть равными', "A fraction needs equal parts")],
    audio: {
      uz: ["Avval bitta butun panelni ko'ramiz.", "Teng bo'lmagan bo'laklarni bir xil ulushlar deb sanay olmaymiz.", "Panelni beshta teng qismga bo'lamiz.", "Kasr butunning teng qismlaridan tuziladi."],
      ru: ['Сначала видим одну целую панель.', 'Неравные части нельзя считать одинаковыми долями.', 'Разделим панель на пять равных частей.', 'Дробь составляют из равных частей целого.'], en: ["First, look at one whole panel.","Unequal parts cannot be counted as equal shares.","Divide the panel into five equal parts.","A fraction is made from equal parts of a whole."],
    },
    visual: { kind: 'equalize', denominator: 5, interaction: { type: 'equalToggle', correctIndex: 1, options: [bi('Teng emas', 'Неравные', "Unequal"), bi('Teng', 'Равные', "Equal")], feedback: [bi("Bu bo'laklarning kattaligi turlicha, shuning uchun ular teng ulushlar emas.", 'Эти части имеют разный размер, поэтому это не равные доли.', "These parts are different sizes, so they are not equal shares."), bi("Endi beshta bo'lak teng. Kasr modelini tuzish mumkin.", 'Теперь пять частей равны. Можно составить модель дроби.', "Now all five parts are equal. We can make a fraction model.")], audioFeedback: [bi("Bu bo'laklarning kattaligi turlicha. Ular teng ulushlar emas.", 'Эти части имеют разный размер. Это не равные доли.', "These parts are different sizes. They are not equal shares."), bi("Endi beshta bo'lak teng. Kasr modelini tuzish mumkin.", 'Теперь пять частей равны. Можно составить модель дроби.', "Now all five parts are equal. We can make a fraction model.")] } },
  },
  {
    type: 'exploration', eyebrow: bi('Maxraj', 'Знаменатель', "Denominator"), title: bi("Butun nechta teng qismga bo'lindi?", 'На сколько равных частей разделили целое?', "How many equal parts was the whole divided into?"),
    frames: [bi('1 ta butun', '1 целое', "1 whole"), bi('8 ta teng qism', '8 равных частей', "8 equal parts"), bi('Pastdagi son: 8', 'Нижнее число: 8', "Bottom number: 8"), bi("Maxraj jami teng qismlar sonini bildiradi", 'Знаменатель показывает число всех равных частей', "The denominator shows the total number of equal parts")],
    audio: {
      uz: ["Bu bitta butun tasma.", "Uni sakkizta teng qismga bo'ldik.", "Kasr chizig'ining pastidagi sakkiz soni maxraj deyiladi.", "Maxraj butun jami nechta teng qismga bo'linganini bildiradi."],
      ru: ['Это одна целая полоска.', 'Мы разделили её на восемь равных частей.', 'Число восемь под дробной чертой называется знаменателем.', 'Знаменатель показывает, на сколько равных частей разделено целое.'], en: ["This is one whole strip.","It is divided into eight equal parts.","The number eight below the fraction bar is called the denominator.","The denominator shows how many equal parts the whole is divided into."],
    },
    visual: { kind: 'bar', denominator: 8, numerator: 0, formula: '□/8', interaction: { type: 'partCount', options: ['1', '2', '3', '4', '5', '6', '7', '8'], correctIndex: 7, feedback: [bi('Birinchi qism sanaldi. Tasma davom etadi.', 'Посчитана первая часть. Полоска продолжается.', "The first part is counted. The strip continues."), bi('Ikki qism sanaldi. Tasma davom etadi.', 'Посчитаны две части. Полоска продолжается.', "Two parts are counted. The strip continues."), bi('Uch qism sanaldi. Tasma davom etadi.', 'Посчитаны три части. Полоска продолжается.', "Three parts are counted. The strip continues."), bi("To'rt qism sanaldi. Tasma davom etadi.", 'Посчитаны четыре части. Полоска продолжается.', "Four parts are counted. The strip continues."), bi('Besh qism sanaldi. Tasma davom etadi.', 'Посчитаны пять частей. Полоска продолжается.', "Five parts are counted. The strip continues."), bi('Olti qism sanaldi. Tasma davom etadi.', 'Посчитаны шесть частей. Полоска продолжается.', "Six parts are counted. The strip continues."), bi('Yetti qism sanaldi. Yana bitta qism bor.', 'Посчитаны семь частей. Осталась ещё одна.', "Seven parts are counted. One part remains."), bi("To'g'ri. Butun sakkizta teng qismga bo'lingan.", 'Верно. Целое разделено на восемь равных частей.', "Correct. The whole is divided into eight equal parts.")], audioFeedback: [bi('Birinchi qism sanaldi. Tasma davom etadi.', 'Посчитана первая часть. Полоска продолжается.', "The first part is counted. The strip continues."), bi('Ikki qism sanaldi. Tasma davom etadi.', 'Посчитаны две части. Полоска продолжается.', "Two parts are counted. The strip continues."), bi('Uch qism sanaldi. Tasma davom etadi.', 'Посчитаны три части. Полоска продолжается.', "Three parts are counted. The strip continues."), bi("To'rt qism sanaldi. Tasma davom etadi.", 'Посчитаны четыре части. Полоска продолжается.', "Four parts are counted. The strip continues."), bi('Besh qism sanaldi. Tasma davom etadi.', 'Посчитаны пять частей. Полоска продолжается.', "Five parts are counted. The strip continues."), bi('Olti qism sanaldi. Tasma davom etadi.', 'Посчитаны шесть частей. Полоска продолжается.', "Six parts are counted. The strip continues."), bi('Yetti qism sanaldi. Yana bitta qism bor.', 'Посчитаны семь частей. Осталась ещё одна.', "Seven parts are counted. One part remains."), bi("To'g'ri. Butun sakkizta teng qismga bo'lingan.", 'Верно. Целое разделено на восемь равных частей.', "Correct. The whole is divided into eight equal parts.")] } },
  },
  {
    type: 'exploration', eyebrow: bi('Surat', 'Числитель', "Numerator"), title: bi("Nechta teng qism olindi?", 'Сколько равных частей взяли?', "How many equal parts were taken?"),
    frames: [bi('8 ta teng qism', '8 равных частей', "8 equal parts"), bi("3 ta qism bo'yaldi", 'Закрашены 3 части', "3 parts are shaded"), bi('Yuqoridagi son: 3', 'Верхнее число: 3', "Top number: 3"), bi("Surat olingan qismlar sonini bildiradi", 'Числитель показывает число взятых частей', "The numerator shows the number of parts taken")],
    audio: {
      uz: ["Butun sakkizta teng qismga bo'linganicha qoladi.", "Ulardan uchtasini bo'yaymiz.", "Kasr chizig'ining yuqorisidagi uch soni surat deyiladi.", "Surat nechta teng qism olinganini yoki bo'yalganini bildiradi."],
      ru: ['Целое остаётся разделённым на восемь равных частей.', 'Закрасим три из них.', 'Число три над дробной чертой называется числителем.', 'Числитель показывает, сколько равных частей взяли или закрасили.'], en: ["The whole remains divided into eight equal parts.","Shade three of them.","The number three above the fraction bar is called the numerator.","The numerator shows how many equal parts were taken or shaded."],
    },
    visual: { kind: 'bar', denominator: 8, numerator: 3, formula: '3/□', interaction: { type: 'sliderNumerator', min: 0, max: 8, initial: 3, label: bi("Bo'yalgan qismlar", 'Закрашенные части', "Shaded parts") } },
  },
  {
    type: 'exploration', eyebrow: bi('Kasr yozuvi', 'Запись дроби', "Fraction notation"), title: bi("3/8 qanday quriladi?", 'Как строится 3/8?', "How is 3/8 built?"), bit: 'point',
    frames: [bi('Butun: 8 ta teng qism', 'Целое: 8 равных частей', "Whole: 8 equal parts"), bi("Olingan qism: 3 ta", 'Взято частей: 3', "Parts taken: 3"), bi('Surat 3, maxraj 8', 'Числитель 3, знаменатель 8', "Numerator 3, denominator 8"), bi("3/8 — bitta son", '3/8 — одно число', "3/8 — one number")],
    audio: {
      uz: ["Butun sakkizta teng qismga bo'lingan.", "Ulardan uchtasi olingan.", "Shuning uchun surat uch, maxraj sakkiz bo'ladi.", "Uch sakkizdan yozuvi miqdorni bildiradigan bitta kasr sonidir."],
      ru: ['Целое разделено на восемь равных частей.', 'Из них взяли три части.', 'Поэтому числитель равен трём, а знаменатель восьми.', 'Запись три восьмых является одним дробным числом, которое обозначает количество.'], en: ["The whole is divided into eight equal parts.","Three of those parts are taken.","So the numerator is three and the denominator is eight.","Three eighths is one fraction that represents a quantity."],
    },
    visual: { kind: 'notation', denominator: 8, numerator: 3, interaction: { type: 'notationTap', options: [bi('Surat', 'Числитель', "Numerator"), bi("Kasr chizig'i", 'Дробная черта', "Fraction bar"), bi('Maxraj', 'Знаменатель', "Denominator")], feedback: [bi("Surat olingan qismlar sonini ko'rsatadi.", 'Числитель показывает число взятых частей.', "The numerator shows the number of parts taken."), bi("Kasr chizig'i surat bilan maxrajni ajratadi.", 'Дробная черта разделяет числитель и знаменатель.', "The fraction bar separates the numerator and denominator."), bi("Maxraj jami teng qismlar sonini ko'rsatadi.", 'Знаменатель показывает число всех равных частей.', "The denominator shows the total number of equal parts.")], audioFeedback: [bi("Surat olingan qismlar sonini ko'rsatadi.", 'Числитель показывает число взятых частей.', "The numerator shows the number of parts taken."), bi("Kasr chizig'i surat bilan maxrajni ajratadi.", 'Дробная черта разделяет числитель и знаменатель.', "The fraction bar separates the numerator and denominator."), bi("Maxraj jami teng qismlar sonini ko'rsatadi.", 'Знаменатель показывает число всех равных частей.', "The denominator shows the total number of equal parts.")] } },
  },
  {
    type: 'exploration', eyebrow: bi('Uchta model', 'Три модели', "Three models"), title: bi("Shakl o'zgarsa, kasr o'zgarmaydi", 'Форма меняется, дробь сохраняется', "The shape changes, but the fraction stays the same"),
    frames: [bi('Tasma: 3/8', 'Полоска: 3/8', "Strip: 3/8"), bi('Doira: 3/8', 'Круг: 3/8', "Circle: 3/8"), bi('Katakli model: 3/8', 'Клетчатая модель: 3/8', "Grid model: 3/8"), bi('Uchala model ham bir xil kasrni ko\'rsatadi', 'Все три модели показывают одну дробь', "All three models show the same fraction")],
    audio: {
      uz: ["Tasmada sakkizta teng qismdan uchtasi bo'yalgan.", "Doirada sakkizta teng sektordan uchtasi bo'yalgan.", "Katakli modelda ham sakkizta teng katakdan uchtasi bo'yalgan.", "Shakllar turlicha, ammo uchala model ham uch sakkizdan kasrini ko'rsatadi."],
      ru: ['На полоске закрашены три из восьми равных частей.', 'В круге закрашены три из восьми равных секторов.', 'В клетчатой модели закрашены три из восьми равных клеток.', 'Формы различаются, но все три модели показывают дробь три восьмых.'], en: ["Three of eight equal parts are shaded on the strip.","Three of eight equal sectors are shaded in the circle.","Three of eight equal squares are also shaded in the grid model.","The shapes are different, but all three models show three eighths."],
    },
    visual: { kind: 'threeModels', denominator: 8, numerator: 3, interaction: { type: 'modelZoom', inline: true, options: [bi('Tasma', 'Полоска', "Strip"), bi('Doira', 'Круг', "Circle"), bi('Katak', 'Сетка', "Grid")], feedback: [bi("Tasma modeli kattalashtirildi: sakkizdan uch qismi bo'yalgan.", 'Модель-полоска увеличена: закрашены три восьмых.', "The strip model is enlarged: three eighths are shaded."), bi("Doira modeli kattalashtirildi: sakkizdan uch qismi bo'yalgan.", 'Модель-круг увеличена: закрашены три восьмых.', "The circle model is enlarged: three eighths are shaded."), bi("Katakli model kattalashtirildi: sakkizdan uch qismi bo'yalgan.", 'Клетчатая модель увеличена: закрашены три восьмых.', "The grid model is enlarged: three eighths are shaded.")], audioFeedback: [bi("Tasma modeli kattalashtirildi. Sakkizdan uch qismi bo'yalgan.", 'Модель полоска увеличена. Закрашены три восьмых.', "The strip model is enlarged. Three eighths are shaded."), bi("Doira modeli kattalashtirildi. Sakkizdan uch qismi bo'yalgan.", 'Модель круг увеличена. Закрашены три восьмых.', "The circle model is enlarged. Three eighths are shaded."), bi("Katakli model kattalashtirildi. Sakkizdan uch qismi bo'yalgan.", 'Клетчатая модель увеличена. Закрашены три восьмых.', "The grid model is enlarged. Three eighths are shaded.")] } },
  },
  {
    type: 'rule', eyebrow: bi('Sonlar nuri', 'Числовой луч', "Number line"), title: bi("Noldan butungacha", 'От нуля до целого', "From zero to one whole"), bit: 'idea',
    frames: [bi('0/8 — hech bir ulush olinmagan', '0/8 — ни одной доли не взято', "0/8 — no parts taken"), bi('0 dan 1 gacha kesma 8 teng intervalga bo\'lindi', 'Отрезок от 0 до 1 разделён на 8 равных интервалов', "The segment from 0 to 1 is divided into 8 equal intervals"), bi('3 ta qadam: 3/8', '3 шага: 3/8', "3 steps: 3/8"), bi('8 ta qadam: 8/8', '8 шагов: 8/8', "8 steps: 8/8"), bi('8/8 = 1 butun', '8/8 = 1 целое', "8/8 = 1 whole")],
    audio: {
      uz: ["Nol sakkizdan hech bir sakkizinchi ulush olinmaganini bildiradi.", "Noldan birgacha bo'lgan kesmani sakkizta teng intervalga bo'lamiz.", "Noldan uchta sakkizinchi qadam yurib, uch sakkizdan nuqtasiga kelamiz.", "Sakkizta sakkizinchi qadam bizni sakkiz sakkizdan nuqtasiga olib keladi.", "Sakkiz sakkizdan bir butunga teng."],
      ru: ['Ноль восьмых означает, что ни одной восьмой доли не взяли.', 'Разделим отрезок от нуля до единицы на восемь равных интервалов.', 'Сделав три шага по одной восьмой, приходим к точке три восьмых.', 'Восемь шагов по одной восьмой приводят к точке восемь восьмых.', 'Восемь восьмых равны одному целому.'], en: ["Zero eighths means that no eighths have been taken.","Divide the segment from zero to one into eight equal intervals.","Take three steps of one eighth from zero to reach three eighths.","Eight steps of one eighth take us to eight eighths.","Eight eighths equal one whole."],
    },
    visual: { kind: 'line', denominator: 8, markers: [{ at: 0, label: '0/8', revealAt: 0 }, { at: 3, label: '3/8', revealAt: 2 }, { at: 8, label: '8/8 = 1', revealAt: 3 }], interaction: { type: 'lineMarker', min: 0, max: 8, initial: 3, label: bi('Erkin nuqta', 'Свободная точка', "Free point") } },
  },
  {
    type: 'test', eyebrow: bi('Mashq · 1/6', 'Тренировка · 1/6', "Practice · 1/6"), title: bi("3/5 ni ko'rsatadigan model", 'Модель дроби 3/5', "A model showing 3/5"),
    question: bi("Qaysi model 3/5 ni to'g'ri ko'rsatadi?", 'Какая модель правильно показывает 3/5?', "Which model correctly shows 3/5?"),
    options: [bi('5 teng qismdan 3 tasi bo\'yalgan', 'Закрашены 3 из 5 равных частей', "3 of 5 equal parts are shaded"), bi('5 teng bo\'lmagan qismdan 3 tasi bo\'yalgan', 'Закрашены 3 из 5 неравных частей', "3 of 5 unequal parts are shaded"), bi('Faqat 3 ta alohida shakl', 'Только 3 отдельные фигуры', "Only 3 separate shapes")], correctIndex: 0,
    feedback: [bi("To'g'ri. Kasr modeli uchun qismlar teng bo'lishi kerak.", 'Верно. В модели дроби части должны быть равными.', "Correct. The parts in a fraction model must be equal."), bi("Qismlar teng emas, shuning uchun ularni bir xil ulushlar deb sanab bo'lmaydi.", 'Части не равны, поэтому их нельзя считать одинаковыми долями.', "The parts are not equal, so they cannot be counted as equal shares."), bi("Avval bitta butun va uning teng qismlari kerak.", 'Сначала нужны одно целое и его равные части.', "First, you need one whole and its equal parts.")],
    feedbackAudio: [bi("To'g'ri. Kasr modeli uchun qismlar teng bo'lishi kerak.", 'Верно. В модели дроби части должны быть равными.', "Correct. The parts in a fraction model must be equal."), bi("Qismlar teng emas. Ularni bir xil ulushlar deb sanab bo'lmaydi.", 'Части не равны. Их нельзя считать одинаковыми долями.', "The parts are not equal. They cannot be counted as equal shares."), bi("Avval bitta butun va uning teng qismlari kerak.", 'Сначала нужны одно целое и его равные части.', "First, you need one whole and its equal parts.")],
    proof: bi("5 ta teng qism → kasr modeli", '5 равных частей → модель дроби', "5 equal parts → fraction model"),
    audio: { intro: { uz: ["Kasrni to'g'ri ko'rsatadigan modelni tanlang."], ru: ['Выберите модель, которая правильно показывает дробь.'], en: ["Choose the model that shows the fraction correctly."] }, on_correct: bi("To'g'ri. Kasr modeli uchun qismlar teng bo'lishi kerak.", 'Верно. В модели дроби части должны быть равными.', "Correct. The parts in a fraction model must be equal."), on_wrong: bi("Qismlarning tengligini yana tekshiring.", 'Ещё раз проверьте, равны ли части.', "Check again whether the parts are equal.") },
    visual: { kind: 'choiceModels' },
  },
  {
    type: 'test', eyebrow: bi('Mashq · 2/6', 'Тренировка · 2/6', "Practice · 2/6"), title: bi("Kasrni yozing", 'Запишите дробь', "Write the fraction"),
    question: bi("7 ta teng qismdan 4 tasi bo'yalgan. Qaysi kasr?", 'Закрашены 4 из 7 равных частей. Какая это дробь?', "4 of 7 equal parts are shaded. Which fraction is it?"),
    options: ['4/7', '7/4', '4/3'], correctIndex: 0,
    feedback: [bi("To'g'ri. Surat 4, maxraj 7.", 'Верно. Числитель 4, знаменатель 7.', "Correct. The numerator is 4 and the denominator is 7."), bi("Surat va maxraj almashib qolgan: olingan qismlar 4 ta.", 'Числитель и знаменатель перепутаны: взято 4 части.', "The numerator and denominator are swapped: 4 parts were taken."), bi("Jami qismlar 7 ta, 3 ta emas.", 'Всего частей 7, а не 3.', "There are 7 parts in total, not 3.")],
    feedbackAudio: [bi("To'g'ri. Surat to'rt, maxraj yetti.", 'Верно. Числитель четыре, знаменатель семь.', "Correct. The numerator is four and the denominator is seven."), bi("Surat va maxraj almashib qolgan. Olingan qismlar to'rtta.", 'Числитель и знаменатель перепутаны. Взято четыре части.', "The numerator and denominator are swapped. Four parts were taken."), bi("Jami qismlar yettita, uchta emas.", 'Всего частей семь, а не три.', "There are seven parts in total, not three.")],
    proof: bi("4 ta olingan / 7 ta teng qism = 4/7", '4 взятые части / 7 равных частей = 4/7', "4 parts taken / 7 equal parts = 4/7"),
    audio: { intro: { uz: ["Yetti teng qismdan to'rttasi bo'yalgan modelga mos kasrni tanlang."], ru: ['Выберите дробь для модели, где закрашены четыре из семи равных частей.'], en: ["Choose the fraction that matches a model with four of seven equal parts shaded."] }, on_correct: bi("To'g'ri. Surat to'rt, maxraj yetti.", 'Верно. Числитель четыре, знаменатель семь.', "Correct. The numerator is four and the denominator is seven."), on_wrong: bi('Olingan va jami qismlarning vazifasini yana tekshiring.', 'Ещё раз проверьте, что обозначают взятые и все части.', "Check again what the parts taken and all the parts mean.") },
    visual: { kind: 'bar', denominator: 7, numerator: 4 },
  },
  {
    type: 'test', eyebrow: bi('Mashq · 3/6', 'Тренировка · 3/6', "Practice · 3/6"), title: bi("Qaysi kasr modelga mos?", 'Какая дробь соответствует модели?', "Which fraction matches the model?"),
    question: bi("6 ta teng qismdan 2 tasi bo'yalgan.", 'Закрашены 2 из 6 равных частей.', "2 of 6 equal parts are shaded."),
    options: ['2/6', '2/5', '6/2'], correctIndex: 0,
    feedback: [bi("To'g'ri. Ikki qism olingan, jami olti teng qism bor.", 'Верно. Взяты две части из шести равных.', "Correct. Two parts were taken from six equal parts."), bi("Maxraj jami qismlarni bildiradi: ular 6 ta.", 'Знаменатель показывает число всех частей: их 6.', "The denominator shows all the parts: there are 6."), bi("Surat olingan qismlarni bildiradi: ular 2 ta.", 'Числитель показывает число взятых частей: их 2.', "The numerator shows the parts taken: there are 2.")],
    feedbackAudio: [bi("To'g'ri. Ikki qism olingan, jami olti teng qism bor.", 'Верно. Взяты две части из шести равных.', "Correct. Two parts were taken from six equal parts."), bi("Maxraj jami qismlarni bildiradi. Ular oltita.", 'Знаменатель показывает число всех частей. Их шесть.', "The denominator shows all the parts. There are six."), bi("Surat olingan qismlarni bildiradi. Ular ikkita.", 'Числитель показывает число взятых частей. Их две.', "The numerator shows the parts taken. There are two.")],
    proof: bi("Surat 2, maxraj 6 → 2/6", 'Числитель 2, знаменатель 6 → 2/6', "Numerator 2, denominator 6 → 2/6"),
    audio: { intro: { uz: ["Olti teng qismdan ikkitasi bo'yalgan modelga mos kasrni tanlang."], ru: ['Выберите дробь для модели, где закрашены две из шести равных частей.'], en: ["Choose the fraction that matches a model with two of six equal parts shaded."] }, on_correct: bi("To'g'ri. Surat ikki, maxraj olti.", 'Верно. Числитель два, знаменатель шесть.', "Correct. The numerator is two and the denominator is six."), on_wrong: bi('Jami qismlar va olingan qismlarni yana sanang.', 'Ещё раз посчитайте все и взятые части.', "Count all the parts and the parts taken again.") },
    visual: { kind: 'bar', denominator: 6, numerator: 2 },
  },
  {
    type: 'test', eyebrow: bi('Mashq · 4/6', 'Тренировка · 4/6', "Practice · 4/6"), title: bi("Bitning xatosini toping", 'Найдите ошибку Бита', "Find Bit's mistake"), bit: 'happy',
    question: bi("Bit 3/7 modelini 7/3 deb o'qidi. Xato nimada?", 'Бит прочитал модель 3/7 как 7/3. В чём ошибка?', "Bit read the 3/7 model as 7/3. What is the mistake?"),
    options: [bi('Surat bilan maxrajni almashtirdi', 'Перепутал числитель и знаменатель', "The numerator and denominator were swapped"), bi("Qismlar teng bo'lmagan", 'Части не равны', "The parts were unequal"), bi("Bo'yalgan qismlarni sanamadi", 'Не посчитал закрашенные части', "The shaded parts were not counted")], correctIndex: 0,
    feedback: [bi("To'g'ri. Olingan 3 ta qism suratga, jami 7 ta qism maxrajga yoziladi.", 'Верно. Три взятые части записывают в числитель, все семь частей записывают в знаменатель.', "Correct. The 3 parts taken go in the numerator, and all 7 parts go in the denominator."), bi("Modeldagi yetti qism teng. Xato bo'linishda emas.", 'Семь частей модели равны. Ошибка не в делении.', "The seven parts in the model are equal. The mistake is not in the division."), bi("Bit 3 va 7 ni ko'rdi, ammo ularning o'rnini almashtirdi.", 'Бит увидел числа 3 и 7, но поменял их местами.', "Bit saw 3 and 7, but swapped their positions.")],
    feedbackAudio: [bi("To'g'ri. Olingan uchta qism suratga, jami yettita qism maxrajga yoziladi.", 'Верно. Три взятые части записывают в числитель, все семь частей записывают в знаменатель.', "Correct. The three parts taken go in the numerator, and all seven parts go in the denominator."), bi("Modeldagi yetti qism teng. Xato bo'linishda emas.", 'Семь частей модели равны. Ошибка не в делении.', "The seven parts in the model are equal. The mistake is not in the division."), bi("Bit uch va yetti sonlarini ko'rdi, ammo ularning o'rnini almashtirdi.", 'Бит увидел числа три и семь, но поменял их местами.', "Bit saw the numbers three and seven, but swapped their positions.")],
    proof: bi("3 ta olingan, 7 ta jami → 3/7", '3 взяты, 7 всего → 3/7', "3 taken, 7 in total → 3/7"),
    audio: { intro: { uz: ["Bit yettita teng qismdan uchtasi bo'yalgan modelda surat bilan maxrajni almashtirdi. Uning xatosini toping."], ru: ['Бит поменял местами числитель и знаменатель в модели с тремя закрашенными частями из семи. Найдите его ошибку.'], en: ["Bit swapped the numerator and denominator in a model with three of seven equal parts shaded. Find his mistake."] }, on_correct: bi("To'g'ri. Olingan qismlar suratga, jami qismlar maxrajga yoziladi.", 'Верно. Взятые части записывают в числитель, все части в знаменатель.', "Correct. The parts taken go in the numerator, and all the parts go in the denominator."), on_wrong: bi('Surat va maxraj nimani bildirishini yana tekshiring.', 'Ещё раз проверьте, что обозначают числитель и знаменатель.', "Check again what the numerator and denominator mean.") },
    visual: { kind: 'error', denominator: 7, numerator: 3, wrong: '7/3', right: '3/7' },
  },
  {
    type: 'test', eyebrow: bi('Mashq · 5/6', 'Тренировка · 5/6', "Practice · 5/6"), title: bi("5/8 sonlar nurida qayerda?", 'Где находится 5/8 на числовом луче?', "Where is 5/8 on the number line?"),
    question: bi("To'g'ri nuqtani tanlang.", 'Выберите правильную точку.', "Choose the correct point."), options: [bi('A: 3/8', 'A: 3/8', "A: 3/8"), bi('B: 5/8', 'Б: 5/8', "B: 5/8"), bi('C: 7/8', 'В: 7/8', "C: 7/8")], correctIndex: 1,
    feedback: [bi("Bu nuqta noldan uchta sakkizinchi qadam uzoqda.", 'Эта точка находится в трёх восьмых шагах от нуля.', "This point is three steps of one eighth from zero."), bi("To'g'ri. Noldan beshta sakkizinchi qadam — 5/8.", 'Верно. Пять шагов по одной восьмой от нуля — это 5/8.', "Correct. Five steps of one eighth from zero give 5/8."), bi("Bu nuqta noldan yettita sakkizinchi qadam uzoqda.", 'Эта точка находится в семи восьмых шагах от нуля.', "This point is seven steps of one eighth from zero.")],
    feedbackAudio: [bi("Bu nuqta noldan uchta sakkizinchi qadam uzoqda.", 'Эта точка находится в трёх шагах по одной восьмой от нуля.', "This point is three steps of one eighth from zero."), bi("To'g'ri. Noldan beshta sakkizinchi qadam yurildi.", 'Верно. От нуля сделано пять шагов по одной восьмой.', "Correct. Five steps of one eighth were taken from zero."), bi("Bu nuqta noldan yettita sakkizinchi qadam uzoqda.", 'Эта точка находится в семи шагах по одной восьмой от нуля.', "This point is seven steps of one eighth from zero.")],
    proof: bi("0 dan 5 ta teng qadam → 5/8", '5 равных шагов от 0 → 5/8', "5 equal steps from 0 → 5/8"),
    audio: { intro: { uz: ["Noldan beshta sakkizinchi qadam uzoqlikdagi nuqtani tanlang."], ru: ['Выберите точку, которая находится в пяти шагах по одной восьмой от нуля.'], en: ["Choose the point that is five steps of one eighth from zero."] }, on_correct: bi("To'g'ri. Noldan beshta sakkizinchi qadam yurildi.", 'Верно. От нуля сделано пять шагов по одной восьмой.', "Correct. Five steps of one eighth were taken from zero."), on_wrong: bi('Noldan boshlab teng qadamlarni yana sanang.', 'Ещё раз посчитайте равные шаги от нуля.', "Count the equal steps again, starting at zero.") },
    visual: { kind: 'line', denominator: 8, markers: [{ at: 3, label: 'A' }, { at: 5, label: 'B' }, { at: 7, label: 'C' }] },
  },
  {
    type: 'case', eyebrow: bi('Mashq · 6/6', 'Тренировка · 6/6', "Practice · 6/6"), title: bi('Faol panellar ulushi', 'Доля активных панелей', "Fraction of active panels"),
    frames: [bi('10 ta teng panel', '10 одинаковых панелей', "10 equal panels"), bi('6 ta panel faol', '6 панелей активны', "6 panels are active"), bi('Faol panellar ulushi: 6/10', 'Доля активных панелей: 6/10', "Fraction of active panels: 6/10")],
    question: bi("10 ta teng paneldan 6 tasi faol. Faol qismini qaysi kasr ko'rsatadi?", 'Из 10 одинаковых панелей активны 6. Какая дробь показывает активную часть?', "6 of 10 equal panels are active. Which fraction shows the active part?"),
    options: ['6/10', '10/6', '4/10'], correctIndex: 0,
    feedback: [bi("To'g'ri. Oltita faol panel — surat, o'nta jami panel — maxraj.", 'Верно. Шесть активных панелей — числитель, все десять — знаменатель.', "Correct. The six active panels are the numerator, and all ten panels are the denominator."), bi("Surat va maxraj almashgan. Olingan qism 6 ta.", 'Числитель и знаменатель перепутаны. Взято 6 частей.', "The numerator and denominator are swapped. The part taken is 6."), bi("To'rtta panel faol emas. Savol faol panellar haqida.", 'Четыре панели неактивны, а вопрос задан об активных.', "Four panels are inactive, but the question is about the active panels.")],
    feedbackAudio: [bi("To'g'ri. Oltita faol panel suratni, o'nta jami panel maxrajni bildiradi.", 'Верно. Шесть активных панелей обозначают числитель, все десять панелей знаменатель.', "Correct. The six active panels are the numerator, and all ten panels are the denominator."), bi("Surat va maxraj almashgan. Olingan qism oltita.", 'Числитель и знаменатель перепутаны. Взято шесть частей.', "The numerator and denominator are swapped. The part taken is six."), bi("To'rtta panel faol emas. Savol faol panellar haqida.", 'Четыре панели неактивны, а вопрос задан об активных.', "Four panels are inactive. The question is about the active panels.")],
    proof: bi("6 ta faol / 10 ta jami = 6/10", '6 активных / 10 всего = 6/10', "6 active / 10 in total = 6/10"),
    audio: { intro: { uz: ["Lumo markazida o'nta teng panel bor.", "Ulardan oltitasi faol. Faol panellar ulushini ko'rsatadigan kasrni tanlang."], ru: ['В центре Лумо есть десять одинаковых панелей.', 'Из них активны шесть. Выберите дробь, которая показывает долю активных панелей.'], en: ["There are ten equal panels at the Lumo centre.","Six of them are active. Choose the fraction that shows the active panels."] }, on_correct: bi("To'g'ri. Oltita faol panel suratni, o'nta jami panel maxrajni bildiradi. Demak, faol panellar ulushi olti o'ndan.", 'Верно. Шесть активных панелей обозначают числитель, а все десять панелей обозначают знаменатель. Значит, доля активных панелей равна шести десятым.', "Correct. The six active panels are the numerator, and all ten panels are the denominator. So the fraction of active panels is six tenths."), on_wrong: bi('Faol panellar va jami panellar sonini yana ajrating.', 'Ещё раз разделите число активных и всех панелей.', "Separate the number of active panels from the total number of panels again.") },
    visual: { kind: 'grid', denominator: 10, numerator: 6 },
  },
  {
    type: 'summary', eyebrow: bi('Yakun', 'Итог', "Summary"), title: bi('Kasr — teng qismlardan tuzilgan bitta son', 'Дробь — одно число из равных частей', "A fraction — one number made from equal parts"), bit: 'happy',
    frames: [bi("Butun teng qismlarga bo'linadi", 'Целое делят на равные части', "The whole is divided into equal parts"), bi('Maxraj — jami teng qismlar', 'Знаменатель — все равные части', "Denominator — all equal parts"), bi('Surat — olingan qismlar', 'Числитель — взятые части', "Numerator — parts taken"), bi('Model, yozuv va sonlar nuri bir sonni ko\'rsatadi', 'Модель, запись и луч показывают одно число', "The model, notation and number line show the same number"), bi('Keyingi dars: kasrlarni taqqoslash', 'Следующий урок: сравнение дробей', "Next lesson: comparing fractions")],
    audio: {
      uz: ["Kasr hosil bo'lishi uchun butun teng qismlarga bo'linadi.", "Maxraj butun jami nechta teng qismga bo'linganini bildiradi.", "Surat nechta teng qism olinganini bildiradi.", "Model, kasr yozuvi va sonlar nuri bir xil miqdorni uch xil ko'rinishda ifodalaydi.", "Keyingi darsda kasrlardan qaysi biri katta yoki kichik ekanini aniqlaymiz."],
      ru: ['Чтобы получить дробь, целое делят на равные части.', 'Знаменатель показывает число всех равных частей целого.', 'Числитель показывает число взятых равных частей.', 'Модель, запись дроби и числовой луч представляют одно количество тремя способами.', 'На следующем уроке будем определять, какая дробь больше или меньше.'], en: ["To make a fraction, divide the whole into equal parts.","The denominator shows how many equal parts the whole is divided into.","The numerator shows how many equal parts were taken.","The model, fraction notation and number line show the same quantity in three different ways.","In the next lesson, we will find which fraction is greater and which is less."],
    },
    visual: { kind: 'summary', denominator: 8, numerator: 3 },
  },
];

const TOTAL_SCREENS = 16;
const MOBILE_DESIGN_W = 390;

const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'story-prediction', template: 'StoryChoice', mechanic: 'StoryChoice', goal: 'Predict whether unequal parts can represent a fraction', misconceptions: ['any parts form a fraction'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'exploration', subtype: 'equal-sharing-diagnostic', template: 'DiagnosticChoice', mechanic: 'DiagnosticChoice', goal: 'Recover equal sharing before introducing fractions', misconceptions: ['unequal distribution'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's2', type: 'model', subtype: 'whole-selection', template: 'WholeTap', mechanic: 'WholeTap', goal: 'Choose the whole to which a fraction belongs', misconceptions: ['mixing different wholes'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's3', type: 'discovery', subtype: 'equal-parts-discovery', template: 'EqualToggle', mechanic: 'EqualToggle', goal: 'Discover that fraction parts must be equal', misconceptions: ['counting unequal pieces as equal shares'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's4', type: 'discovery', subtype: 'denominator-discovery', template: 'PartCount', mechanic: 'PartCount', goal: 'Connect all equal parts with the denominator', misconceptions: ['denominator counts shaded parts'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's5', type: 'discovery', subtype: 'numerator-discovery', template: 'NumeratorSlider', mechanic: 'NumeratorSlider', goal: 'Connect selected equal parts with the numerator', misconceptions: ['numerator counts all parts'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's6', type: 'model', subtype: 'notation-construction', template: 'NotationTap', mechanic: 'NotationTap', goal: 'Build fraction notation from numerator and denominator', misconceptions: ['swapped numerator and denominator'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's7', type: 'strategy', subtype: 'representation-strategy', template: 'ModelZoom', mechanic: 'ModelZoom', goal: 'Choose and compare bar, circle and grid representations', misconceptions: ['shape changes the fraction'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's8', type: 'rule', subtype: 'number-line-rule-and-transfer', template: 'LineMarker', mechanic: 'LineMarker', goal: 'Formulate the fraction rule and transfer it to the number line', misconceptions: ['fraction is two unrelated numbers'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's9', type: 'test', subtype: 'model-selection', template: 'ModelChoice', mechanic: 'ModelChoice', goal: 'Identify a correct equal-parts model', misconceptions: ['unequal parts', 'loose objects without a whole'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's10', type: 'test', subtype: 'notation-check', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Write the fraction represented by a model', misconceptions: ['swapped numerator and denominator', 'unshaded parts counted'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's11', type: 'test', subtype: 'model-to-fraction', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Match a model to fraction notation', misconceptions: ['all parts used as numerator', 'remaining parts used'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's12', type: 'error', subtype: 'misconception-repair', template: 'ErrorRepairChoice', mechanic: 'ErrorRepairChoice', goal: "Repair Bit's numerator-denominator reversal", misconceptions: ['swapped numerator and denominator'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's13', type: 'test', subtype: 'number-line-transfer', template: 'NumberLineChoice', mechanic: 'NumberLineChoice', goal: 'Locate a fraction on the number line', misconceptions: ['counting ticks instead of intervals', 'starting from one'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's14', type: 'case', subtype: 'life-context-transfer', template: 'CaseChoice', mechanic: 'CaseChoice', goal: 'Transfer fraction meaning to active city panels', misconceptions: ['inactive parts counted', 'whole and part swapped'], active: true, scored: true, scoreUnits: 1, scope: 'final' },
  { id: 's15', type: 'summary', subtype: 'reflection-and-title', template: 'ReflectionClaim', mechanic: 'ReflectionClaim', goal: 'Reflect on the strategy, claim the title and bridge to comparison', misconceptions: ['fraction as two unrelated numbers'], active: true, scored: false, scope: null },
];

const LESSON_META = {
  lessonId: 'frac-4-18-v1', slug: 'dars18-kasr-tushunchasi',
  lessonTitle: bi('18-dars. Kasr tushunchasi', 'Урок 18. Понятие дроби', "Lesson 18. Understanding fractions"),
  skillTags: ['fraction', 'equal_parts', 'numerator', 'denominator', 'number_line'],
  badge: bi('Kasrlar tadqiqotchisi', 'Исследователь дробей', "Fraction explorer"),
  frameCounts: FRAME_COUNTS, screens: D18_SCREENS, screenMeta: SCREEN_META, totalScreens: TOTAL_SCREENS,
};

const stableChoiceOffset = (lessonId, length) => {
  let hash = 2166136261;
  for (const char of `${lessonId}:${length}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return length > 0 ? (hash >>> 0) % length : 0;
};

const buildOptionOrder = (length, correctIndex, lessonId, ordinal = 0) => {
  const natural = Array.from({ length: Math.max(0, length) }, (_, index) => index);
  if (length < 2 || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= length) return natural;
  const target = (stableChoiceOffset(lessonId, length) + ordinal * (length - 1)) % length;
  const order = natural.filter((index) => index !== correctIndex);
  order.splice(target, 0, correctIndex);
  return order;
};

let runtimeConfig = { ttsApiBase: '', voiceGender: 'f', correctSoundUrl: '', wrongSoundUrl: '', previewMode: false };
const configureLesson = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };
const normalizeLang = (value) => ['uz', 'ru', 'en'].includes(value) ? value : 'uz';
const LangContext = createContext('uz');
const LessonContext = createContext(LESSON_META);
const useLang = () => useContext(LangContext);
const useLesson = () => useContext(LessonContext);
const useT = () => { const lang = useLang(); return useCallback((value) => { if (value == null) return ''; if (React.isValidElement(value)) return value; if (typeof value === 'string' || typeof value === 'number') return String(value); return value[lang] ?? value.uz ?? ''; }, [lang]); };

function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
  useEffect(() => { if (typeof window === 'undefined') return undefined; const update = () => setMobile(window.innerWidth < breakpoint); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update); }, [breakpoint]);
  return mobile;
}

function useMobileZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = document.documentElement;
    const update = () => {
      const zoom = window.innerWidth < breakpoint ? window.innerWidth / MOBILE_DESIGN_W : 1;
      root.style.setProperty('--g4z', String(zoom));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      root.style.removeProperty('--g4z');
    };
  }, [breakpoint]);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => { if (typeof window === 'undefined' || !window.matchMedia) return undefined; const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(media.matches); media.addEventListener?.('change', update); return () => media.removeEventListener?.('change', update); }, []);
  return reduced;
}

const buildTtsUrl = (base, text, gender) => `${base}/api/tts?text=${encodeURIComponent(String(text).slice(0, 1000))}&g=${gender === 'm' ? 'm' : 'f'}`;

class AudioEngine {
  constructor() { this.queue = []; this.index = 0; this.audio = null; this.previewUtterance = null; this.timer = null; this.lang = 'uz'; this.muted = false; this.listener = null; }
  emit(extra = {}) { this.listener?.({ muted: this.muted, ...extra }); }
  setLang(lang) { this.lang = lang; }
  stop() { if (this.timer && typeof window !== 'undefined') window.clearTimeout(this.timer); this.timer = null; if (this.audio) { this.audio.pause(); this.audio.onended = null; this.audio.onerror = null; } if (this.previewUtterance) { this.previewUtterance.onstart = null; this.previewUtterance.onend = null; this.previewUtterance.onerror = null; this.previewUtterance = null; } if (typeof window !== 'undefined' && window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch { /* preview only */ } } }
  load(queue) { this.stop(); this.queue = queue || []; this.index = 0; this.emit({ completed: false, currentSegment: null }); }
  start() { this.play(); }
  timed(item, duration = null) { if (this.timer) window.clearTimeout(this.timer); if (this.audio) { this.audio.onended = null; this.audio.onerror = null; } this.emit({ isPlaying: false, completed: false, currentSegment: item.id, visualOnly: true }); this.timer = window.setTimeout(() => { this.index += 1; this.play(); }, duration ?? 980); }
  play() { const item = this.queue[this.index]; if (!item) { this.emit({ isPlaying: false, completed: true, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase }); return; } if (this.muted || !runtimeConfig.ttsApiBase) { if (!this.muted && runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) { try { window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(String(item.text)); utterance.lang = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' }[this.lang] || 'uz-UZ'; utterance.rate = 0.94; utterance.onstart = () => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false }); utterance.onend = () => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); }; utterance.onerror = () => this.timed(item); this.previewUtterance = utterance; this.timer = window.setTimeout(() => { try { window.speechSynthesis.speak(utterance); } catch { this.timed(item); } }, 50); return; } catch { /* deterministic timer fallback */ } } this.timed(item); return; } if (!this.audio) { this.audio = new Audio(); this.audio.crossOrigin = 'anonymous'; } this.audio.onended = () => { this.index += 1; this.play(); }; this.audio.onerror = () => this.timed(item); this.audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, item.text, runtimeConfig.voiceGender); this.audio.play().then(() => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false })).catch(() => this.timed(item)); }
  toggleMute() { this.muted = !this.muted; this.stop(); this.index = 0; this.emit({ muted: this.muted }); this.start(); }
  pushOneOff(value) { const texts = Array.isArray(value) ? value : [value]; this.load(texts.filter(Boolean).map((text, index) => ({ id: `feedback-${Date.now()}-${index}`, text }))); this.start(); }
}

let audioEngineInstance = null;
const getAudioEngine = () => { if (typeof window === 'undefined') return null; if (!audioEngineInstance) audioEngineInstance = new AudioEngine(); return audioEngineInstance; };

function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState({ muted: audioEngineInstance?.muted ?? false, completed: false, currentSegment: null, visualOnly: !runtimeConfig.ttsApiBase });
  /* eslint-disable react-hooks/refs -- stable audio queue */
  const segmentsRef = useRef(segments); const segmentsKey = JSON.stringify(segments || []); const prevKeyRef = useRef(segmentsKey);
  if (prevKeyRef.current !== segmentsKey) { segmentsRef.current = segments; prevKeyRef.current = segmentsKey; }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */
  useEffect(() => { const engine = getAudioEngine(); if (!engine) return undefined; engine.setLang(lang); engine.listener = (next) => setState((previous) => ({ ...previous, ...next })); engine.load(stableSegments); const timer = window.setTimeout(() => engine.start(), 220); return () => { window.clearTimeout(timer); engine.stop(); engine.listener = null; }; }, [lang, stableSegments]);
  return { ...state, replay: () => { const engine = getAudioEngine(); engine?.load(stableSegments); engine?.start(); }, toggleMute: () => getAudioEngine()?.toggleMute(), pushOneOff: (text) => getAudioEngine()?.pushOneOff(text) };
}

function useNarration(value, screen) {
  const lang = useLang(); const reduced = usePrefersReducedMotion(); const lesson = useLesson();
  const segments = useMemo(() => { const source = value?.intro ?? value; const texts = source?.[lang] ?? source?.uz ?? []; return (Array.isArray(texts) ? texts : [texts]).filter(Boolean).map((text, index) => ({ id: `s${screen}-beat-${index}`, text })); }, [lang, screen, value]);
  const audio = useAudio(segments); const active = segments.findIndex((segment) => segment.id === audio.currentSegment); const finalFrame = Math.max(0, lesson.frameCounts[screen] - 1); const feedbackPlaying = audio.currentSegment?.startsWith('feedback-') === true; const frame = reduced || feedbackPlaying || audio.completed ? finalFrame : active >= 0 ? active : 0;
  return { ...audio, frame, caption: active >= 0 ? segments[active].text : '' };
}

const playSfx = (kind) => { const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl; if (!url || typeof window === 'undefined') return; try { new Audio(url).play().catch(() => {}); } catch { /* optional */ } };

const BitSVG = ({ state = 'present', className = '' }) => {
  const isWave = state === 'wave';
  const isHappy = state === 'happy' || isWave || state === 'idea' || state === 'nod';
  const isThinking = state === 'hint' || state === 'think';
  const isAwkward = state === 'awkward';

  return (
  <svg className={`g1-char g1-char-bit g1-char-state-${state} ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g4bbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2ECF2" />
        <stop offset="100%" stopColor="#B6C7D2" />
      </linearGradient>
      <linearGradient id="g4bhead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EBF2F6" />
        <stop offset="100%" stopColor="#C4D3DC" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)" />
    <g className="g1-bit-ant">
      <path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="11" r="6" fill="#FF4F28" />
      <circle cx="58" cy="9" r="2" fill="#FFB9A6" />
    </g>
    <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g4bbody)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5" />
    {(state === 'happy' || isWave) && (
      <g className={isWave ? 'bit-double-wave' : ''}>
        <g className="bit-wave-left">
          <path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="47" r="5" fill="#B6C7D2" />
        </g>
        <g className="bit-wave-right">
          <path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="47" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'present' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="g1-bit-wave">
          <path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="43" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isThinking && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-think-hand">
          <path d="M84 76 C 92 74 92 66 84 61" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="83" cy="60" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isAwkward && (
      <g className="bit-awkward-hands">
        <path d="M36 76 C 39 88 46 96 54 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="54" cy="99" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 81 88 74 96 66 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="66" cy="99" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'point' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-point-arm">
          <path d="M84 76 C 94 72 101 67 108 62" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="109" cy="61" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'idea' && (
      <g>
        <path d="M36 76 C 29 82 27 91 30 101" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="102" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 92 68 95 58 94 50" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="94" cy="49" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-hands">
        <path d="M36 77 C 41 88 47 93 53 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="53" cy="94" r="5" fill="#B6C7D2" />
        <path d="M84 77 C 79 88 73 93 67 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="67" cy="94" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'nod' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-nod-hand">
          <path d="M84 75 C 93 70 99 62 99 54" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="99" cy="53" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g4bhead)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C" />
    <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)" />
    <g className="g1-eyes" fill="#5BD6F2">
      {isAwkward
        ? <><ellipse cx="50" cy="53" rx="4.8" ry="3.2" /><ellipse cx="70" cy="53" rx="4.8" ry="3.2" /></>
        : isThinking
        ? <><circle cx="50" cy="50" r="4.5" /><circle cx="70" cy="49" r="5.5" /></>
        : <><circle cx="50" cy="50" r="5" /><circle cx="70" cy="50" r="5" /></>}
    </g>
    {isHappy && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
    {(state === 'present' || state === 'point' || state === 'focus') && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round" />}
    {isThinking && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2" />}
    {isAwkward && (
      <g className="bit-awkward-face">
        <path d="M53 62 Q60 57 67 62" stroke="#5BD6F2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
        <circle cx="77" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
      </g>
    )}
    {isThinking && (
      <g>
        <circle cx="99" cy="38" r="9" fill="#FFC23C" />
        <text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text>
      </g>
    )}
    {state === 'point' && (
      <g className="bit-point-target">
        <circle cx="110" cy="61" r="8" fill="none" stroke="#FF5B35" strokeWidth="2" />
        <circle cx="110" cy="61" r="2" fill="#FF5B35" />
      </g>
    )}
    {state === 'idea' && (
      <g className="bit-idea-bulb">
        <circle cx="99" cy="36" r="9" fill="#FFC23C" />
        <path d="M95 36 Q99 31 103 36 M97 42 h4" stroke="#7A5200" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-scan">
        <path d="M43 45 h34" stroke="#95C93D" strokeWidth="2" strokeLinecap="round" />
        <circle cx="80" cy="45" r="3" fill="#95C93D" />
      </g>
    )}
    {state === 'nod' && (
      <g className="bit-nod-check">
        <circle cx="99" cy="38" r="9" fill="#95C93D" />
        <path d="M95 38 l3 3 6-7" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </svg>
  );
};
const AudioIndicator = ({ audio }) => { const t = useT(); const muteLabel = audio.muted ? t(bi('Ovozni yoqish', 'Включить звук', 'Turn sound on')) : t(bi("Ovozni o'chirish", 'Выключить звук', 'Turn sound off')); const replayLabel = t(bi('Qayta eshitish', 'Повторить', 'Replay')); return <div className="audio-controls"><button type="button" className="icon-btn" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>{audio.muted ? '🔇' : audio.isPlaying ? '🔊' : '🔉'}</button>{!audio.muted && <button type="button" className="icon-btn" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>↻</button>}</div>; };

const ScreenTypeLabel = ({ type }) => { const lang = useLang(); const labels = { hook: bi('Missiya', 'Миссия', "Mission"), exploration: bi('Kashfiyot', 'Исследование', "Explore"), rule: bi('Qoida', 'Правило', "Rule"), test: bi('Tekshiruv', 'Проверка', "Check"), case: bi('Vazifa', 'Задача', "Task"), summary: bi('Yakun', 'Итог', "Summary") }; return <span className="screen-type">{labels[type]?.[lang] ?? labels[type]?.uz ?? type}</span>; };

function Stage({ screen, audio, onPrev, onNext, nextDisabled: originalNextDisabled = false, finish = false, children }) {
  const originalGatePassed = !originalNextDisabled && Boolean(onNext);
  const nextDisabled = !canUseGrade4TheoryContinue(originalGatePassed, finish);
  const t = useT(); const mobile = useIsMobile(); const lesson = useLesson(); const c = lesson.screens[screen]; const pad = mobile ? 14 : 48;
  const captionVisible = Boolean(audio.caption && (audio.muted || audio.visualOnly));
  return <main className={`stage stage-${c.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${lesson.screens.length}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / lesson.screens.length * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={c.type}/><AudioIndicator audio={audio}/><span className="screen-count">{String(screen + 1).padStart(2, '0')} / {lesson.screens.length}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>{children}<div className={`caption-slot ${captionVisible ? 'is-visible' : ''}`} aria-live="polite"><span>{captionVisible ? audio.caption : ''}</span></div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t(bi('Orqaga', 'Назад', "Back"))}</button>}<button type="button" className="btn-white-accent" disabled={nextDisabled || !onNext} onClick={onNext}>{finish ? t(bi('Darsni yakunlash', 'Завершить урок', "Finish lesson")) : t(bi('Davom etish', 'Продолжить', "Continue"))} →</button></footer></main>;
}

const Heading = ({ c, hook = false }) => { const t = useT(); return <div className="heading"><div><span data-g4-role={hook ? 'hook-topic' : undefined}>{t(c.eyebrow)}</span><h1 data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1></div>{c.bit && !hook && <BitSVG state={c.bit}/>}</div>; };

function FractionBar({ denominator, numerator = 0, color = 'cyan', label, unequal = false, frame = 99, revealAt = 1, onSegmentClick, activeSegment = null }) {
  const widths = [1, 1.55, .72, 1.25, .58, 1.4, .8, 1.15];
  return <div className="fraction-model"><div className={`fraction-bar ${unequal ? 'unequal' : ''}`}>{Array.from({ length: denominator }, (_, index) => { const className = `${index < numerator && frame >= revealAt ? `filled ${color}` : ''} ${activeSegment === index ? 'segment-active' : ''}`; return onSegmentClick ? <button type="button" key={index} className={className} aria-label={`${index + 1}`} onClick={() => onSegmentClick(index)}/> : <i key={index} className={className} style={unequal ? { flex: widths[index] ?? 1 } : undefined}/>; })}</div>{label && <b>{label}</b>}</div>;
}

const polar = (cx, cy, r, angle) => { const radians = (angle - 90) * Math.PI / 180; return { x: cx + r * Math.cos(radians), y: cy + r * Math.sin(radians) }; };
const sectorPath = (index, count) => { const start = polar(50, 50, 42, index * 360 / count); const end = polar(50, 50, 42, (index + 1) * 360 / count); return `M50 50 L${start.x} ${start.y} A42 42 0 ${360 / count > 180 ? 1 : 0} 1 ${end.x} ${end.y} Z`; };

function FractionCircle({ denominator, numerator, frame, revealAt = 2 }) { return <svg className="fraction-circle" viewBox="0 0 100 100" aria-hidden="true">{Array.from({ length: denominator }, (_, index) => <path key={index} d={sectorPath(index, denominator)} className={index < numerator && frame >= revealAt ? 'filled' : ''}/>)}</svg>; }

function NumberLine({ denominator, marker, markers = [], frame = 99, interactiveMarker = null, answerState = null }) {
  const allMarkers = marker == null ? markers : [{ at: marker, label: `${marker}/${denominator}` }];
  return <div className={`number-line-wrap ${answerState ? 'number-line-choice' : ''}`}><svg className="number-line-svg" viewBox="0 0 640 110" role="img"><line x1="35" y1="55" x2="605" y2="55" className="axis"/>{Array.from({ length: denominator + 1 }, (_, index) => { const x = 35 + 570 * index / denominator; return <g key={index}><line x1={x} y1="44" x2={x} y2="66" className="tick"/>{(index === 0 || index === denominator) && <text x={x} y="90" textAnchor="middle">{index === 0 ? '0' : '1'}</text>}</g>; })}{allMarkers.map((item, index) => { const x = 35 + 570 * item.at / denominator; const revealAt = item.revealAt ?? (markers.length ? 0 : 2); const picked = answerState?.picked === index; const right = answerState?.solved && answerState.correctIndex === index; const bad = picked && !right; return <g key={`${item.at}-${item.label}`} className={`${frame >= revealAt ? 'marker on' : 'marker'} ${picked ? 'answer-picked' : ''} ${right ? 'answer-right' : ''} ${bad ? 'answer-bad' : ''}`}><circle cx={x} cy="55" r={answerState ? 22 : 13}/><text x={x} y="25" textAnchor="middle">{item.label}</text></g>; })}{interactiveMarker !== null && <g className="marker free-marker on"><circle cx={35 + 570 * interactiveMarker / denominator} cy="55" r="10"/><text x={35 + 570 * interactiveMarker / denominator} y="105" textAnchor="middle">{interactiveMarker}/{denominator}</text></g>}</svg>{answerState && <div className="number-line-hit-targets">{allMarkers.map((item, index) => <button type="button" key={`${item.at}-${item.label}`} className="number-line-marker-action" style={{ left: `${(35 + 570 * item.at / denominator) / 640 * 100}%` }} aria-label={String(item.label)} disabled={answerState.disabled || answerState.solved} onClick={() => answerState.onPick(index)}/>)}</div>}</div>;
}

function GridModel({ denominator, numerator, frame, revealAt = 1 }) { return <div className="grid-model" style={{ gridTemplateColumns: `repeat(${Math.min(5, denominator)},1fr)` }}>{Array.from({ length: denominator }, (_, index) => <i key={index} className={index < numerator && frame >= revealAt ? 'filled' : ''}/>)}</div>; }

function VisualModel({ visual, frame, solved = false, promptReady = false, interactionState = null, onInteract, answerState = null }) {
  const t = useT();
  if (!visual) return null;
  const visibleFrame = solved || promptReady ? 99 : frame;
  const revealFrame = solved ? 99 : frame;
  if (visual.kind === 'batteryShare') { const perGroup = typeof interactionState === 'number' ? visual.interaction.values[interactionState] : 0; const correct = interactionState === visual.interaction.correctIndex; return <div className="model-card battery-share"><div className="battery-bank">{Array.from({ length: visual.total }, (_, index) => <i key={index}>▰</i>)}</div><div className={`station-grid ${visibleFrame >= 1 ? 'show' : ''}`}>{Array.from({ length: visual.groups }, (_, group) => <div key={group}><b>{group + 1}</b><span>{Array.from({ length: perGroup }, (_, index) => <i key={index} className={visibleFrame >= 2 ? 'assigned' : ''}>▰</i>)}</span></div>)}</div><strong className={correct ? 'show' : ''}>12 : 4 = 3</strong></div>; }
  if (visual.kind === 'wholeChoice') return <div className="model-card whole-choice">{[0, 1].map((index) => <button type="button" key={index} className={`whole-object ${(interactionState === index || (interactionState === null && index === 0 && visibleFrame >= 1)) ? 'chosen' : ''}`} onClick={() => onInteract?.(index, index)} aria-label={String(index + 1)}><span>1</span></button>)}</div>;
  if (visual.kind === 'unequal') return <div className="model-card"><FractionBar {...visual} unequal frame={visibleFrame}/></div>;
  if (visual.kind === 'equalize') return <div className={`model-card model-pair equal-toggle state-${interactionState ?? 'auto'}`}><div className={interactionState === 0 ? 'model-selected' : ''}><FractionBar denominator={visual.denominator} unequal frame={visibleFrame}/></div><span>→</span><div className={interactionState === 1 ? 'model-selected' : ''}><FractionBar denominator={visual.denominator} frame={visibleFrame}/></div></div>;
  if (visual.kind === 'differentWholes') return <div className={`model-card different-wholes ${interactionState === 1 ? 'same-size' : ''}`}><div className="small-whole"><FractionBar denominator={visual.denominator} numerator={visual.numerator} frame={99} label="1/2"/></div><div className="large-whole"><FractionBar denominator={visual.denominator} numerator={visual.numerator} frame={99} label="1/2"/></div></div>;
  if (visual.kind === 'bar') { const liveNumerator = visual.interaction?.type === 'sliderNumerator' && typeof interactionState === 'number' ? interactionState : visual.numerator; const baseLabel = visual.interaction?.type === 'sliderNumerator' ? `${liveNumerator}/${visual.denominator}` : visual.formula ?? `${visual.numerator}/${visual.denominator}`; const liveLabel = visual.interaction?.type === 'partCount' && visibleFrame < 2 ? '□/?' : baseLabel; return <div className="model-card"><FractionBar {...visual} numerator={liveNumerator} frame={visibleFrame} label={liveLabel}/></div>; }
  if (visual.kind === 'notation') return <div className={`model-card notation notation-focus-${interactionState ?? 'none'}`}><FractionBar {...visual} frame={visibleFrame}/><div><b className={interactionState === 0 ? 'notation-active' : ''}>{visual.numerator}</b><span className={interactionState === 1 ? 'notation-active' : ''}/><b className={interactionState === 2 ? 'notation-active' : ''}>{visual.denominator}</b><small>{visibleFrame >= 2 ? t({ uz: 'surat · maxraj', ru: 'числитель · знаменатель', en: 'numerator · denominator' }) : ''}</small></div></div>;
  if (visual.kind === 'circleBar') return <div className="model-card model-pair"><FractionBar {...visual} frame={visibleFrame} label={`${visual.numerator}/${visual.denominator}`}/><FractionCircle {...visual} frame={visibleFrame}/></div>;
  if (visual.kind === 'threeModels') return <div className="model-card three-models"><button type="button" className={`model-zoom ${interactionState === 0 ? 'zoomed' : ''}`} onClick={() => onInteract?.(0, 0)}><FractionBar {...visual} frame={visibleFrame} revealAt={0} label={`${visual.numerator}/${visual.denominator}`}/></button><button type="button" className={`model-zoom ${interactionState === 1 ? 'zoomed' : ''}`} onClick={() => onInteract?.(1, 1)}><FractionCircle {...visual} frame={visibleFrame} revealAt={1}/></button><button type="button" className={`model-zoom ${interactionState === 2 ? 'zoomed' : ''}`} onClick={() => onInteract?.(2, 2)}><GridModel {...visual} frame={visibleFrame} revealAt={2}/></button></div>;
  if (visual.kind === 'line') return <div className="model-card"><NumberLine {...visual} frame={visibleFrame} interactiveMarker={visual.interaction?.type === 'lineMarker' && typeof interactionState === 'number' ? interactionState : null} answerState={answerState}/></div>;
  if (visual.kind === 'representations') return <div className="model-card triple-model"><GridModel {...visual} frame={visibleFrame}/><FractionBar {...visual} frame={visibleFrame}/><NumberLine denominator={visual.denominator} marker={visual.numerator} frame={visibleFrame}/></div>;
  if (visual.kind === 'choiceModels') { const models = [<FractionBar denominator={5} numerator={3} frame={99}/>, <FractionBar denominator={5} numerator={3} unequal frame={99}/>, <div className="loose-shapes"><i/><i/><i/></div>]; return <div className="model-card choice-models">{models.map((model, index) => { const picked = answerState?.picked === index; const right = answerState?.solved && answerState.correctIndex === index; return <button type="button" key={index} className={`model-answer ${picked ? 'picked' : ''} ${right ? 'right' : ''} ${picked && !right ? 'bad' : ''}`} onClick={() => answerState?.onPick(index)} disabled={answerState?.solved}><b>{String.fromCharCode(65 + index)}</b><span>{t(answerState?.options?.[index])}</span>{model}</button>; })}</div>; }
  if (visual.kind === 'grid') return <div className="model-card"><GridModel {...visual} frame={visibleFrame}/></div>;
  if (visual.kind === 'error') return <div className="model-card error-model"><FractionBar {...visual} frame={99}/><s>{visual.wrong}</s><span>→</span><b className={solved ? 'show' : ''}>{visual.right}</b></div>;
  if (visual.kind === 'comparison') { const items = visual.items.map((item) => ({ ...item })); let relation = visual.relation; if (visual.interaction?.type === 'numeratorSlider' && typeof interactionState === 'number') { items[1].numerator = interactionState; const sign = visual.interaction.fixedNumerator < interactionState ? '<' : visual.interaction.fixedNumerator > interactionState ? '>' : '='; relation = `${visual.interaction.fixedNumerator}/${visual.interaction.denominator} ${sign} ${interactionState}/${visual.interaction.denominator}`; } if (visual.interaction?.type === 'denominatorDial' && typeof interactionState === 'number') { items[1].denominator = interactionState; const sign = visual.interaction.fixedDenominator < interactionState ? '>' : visual.interaction.fixedDenominator > interactionState ? '<' : '='; relation = `${visual.interaction.numerator}/${visual.interaction.fixedDenominator} ${sign} ${visual.interaction.numerator}/${interactionState}`; } return <div className="model-card compare-model">{items.map((item, index) => <FractionBar key={`${index}-${item.numerator}/${item.denominator}`} {...item} frame={visibleFrame} revealAt={item.revealAt ?? (visual.simultaneous ? 1 : index + 1)} onSegmentClick={visual.interaction?.type === 'segmentTap' ? (segment) => onInteract?.({ model: index, segment }, 0) : undefined} activeSegment={interactionState?.model === index ? interactionState.segment : null} label={`${item.numerator}/${item.denominator}`}/>)}<strong className={revealFrame >= (visual.relationRevealAt ?? (promptReady ? 1 : 3)) ? 'show' : ''}>{relation}</strong></div>; }
  if (visual.kind === 'half') return <div className={`model-card compare-model half-model ${interactionState === true ? 'half-marked' : ''}`}>{visual.items.map((item, index) => <FractionBar key={`${item.numerator}/${item.denominator}`} {...item} frame={visibleFrame} revealAt={item.revealAt ?? index + 1} label={`${item.numerator}/${item.denominator}`}/>)}<strong className={revealFrame >= (visual.relationRevealAt ?? (promptReady ? 1 : 3)) ? 'show' : ''}>{visual.relation}</strong></div>;
  if (visual.kind === 'errorCompare') return <div className="model-card error-compare"><div className="compare-model">{visual.items.map((item) => <FractionBar key={`${item.numerator}/${item.denominator}`} {...item} frame={99} label={`${item.numerator}/${item.denominator}`}/>)}</div><div className="error-formula"><s>{visual.wrong}</s><span>→</span><b className={solved ? 'show' : ''}>{visual.right}</b></div></div>;
  if (visual.kind === 'summary') return <div className="model-card summary-model"><FractionBar {...visual} frame={99} label={`${visual.numerator}/${visual.denominator}`}/><NumberLine denominator={visual.denominator} marker={visual.numerator} frame={99}/></div>;
  return <div className="model-card strategy-visual">◆</div>;
}

function G4TitleReveal({ active, title, onComplete }) {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const wasActiveRef = useRef(active);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const wasActive = wasActiveRef.current;
    wasActiveRef.current = active;
    if (!active || wasActive || typeof window === 'undefined') return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const frame = window.requestAnimationFrame(() => setVisible(true));
    const timer = window.setTimeout(() => { setVisible(false); onCompleteRef.current?.(); }, reduced ? 120 : 3900);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [active]);

  if (!visible || typeof document === 'undefined') return null;
  const localizedTitle = t(title);
  const ariaLabel = `${t(bi('Unvon', 'Звание', 'Title'))}: ${localizedTitle}`;
  return createPortal(
    <div className="rank-boost-overlay g4-title-reveal-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={ariaLabel}>
      <div className="rank-boost-card g4-title-reveal-card">
        <div className="rank-boost-rays g4-title-reveal-rays" aria-hidden="true" />
        <div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ left: `${3 + index * 5.35}%`, animationDelay: `${(index % 7) * -0.21}s` }} />)}</div>
        <div className="rank-boost-medal g4-title-reveal-medal" aria-hidden="true">★</div>
        <h2 className="g4-title-reveal-title">{localizedTitle}</h2>
      </div>
    </div>,
    document.body,
  );
}

function G4TitleCard({ title, firstTry, total }) {
  const t = useT();
  return <aside className="g4-title-card g4-title-card-stage g4-title-card-compact" data-g4-role="title-card" role="status" aria-live="polite" aria-atomic="true">
    <div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
    <div className="g4-title-card-bit" data-g4-role="reward-bit"><BitSVG state="happy" /></div>
    <div className="g4-title-card-medal" data-g4-role="reward-medal" aria-hidden="true">★</div>
    <span className="g4-title-card-kicker">{t({ uz: "UNVON OLINDI", ru: 'ЗВАНИЕ ПОЛУЧЕНО', en: "TITLE EARNED" })}</span>
    <h2 className="g4-title-card-title">{t(title)}</h2>
    <div className="g4-title-card-score"><strong>{firstTry}/{total}</strong><span>{t({ uz: "birinchi urinishda", ru: 'с первой попытки', en: 'on the first attempt' })}</span></div>
  </aside>;
}

function G4FinalTitleReward({ ready, titleClaimed, reflectionChoice, onClaim, title, firstTry, total }) {
  const t = useT();
  const [revealRequested, setRevealRequested] = useState(false);
  const completeReveal = () => { setRevealRequested(false); onClaim(); };
  return <>
    <G4TitleReveal active={revealRequested} title={title} onComplete={completeReveal} />
    {titleClaimed && <G4TitleCard title={title} firstTry={firstTry} total={total} />}
    {!titleClaimed && <button type="button" className="g4-title-claim" data-g4-role="title-claim" disabled={!ready || reflectionChoice === null || revealRequested} onClick={() => setRevealRequested(true)}><span aria-hidden="true">★</span><strong>{t({ uz: "Unvonni olish", ru: 'Получить звание', en: "Claim title" })}</strong><small>{ready && reflectionChoice !== null ? t(title) : t(bi('Avval xulosani tanlang', 'Сначала выберите вывод', 'Choose a reflection first'))}</small></button>}
  </>;
}

const RANGE_INTERACTIONS = new Set(['sliderNumerator', 'lineMarker', 'numeratorSlider', 'denominatorDial']);

function OptionalInteraction({ interaction, state, onChange, disabled = false }) {
  const t = useT();
  if (!interaction) return null;
  const liveValue = typeof state === 'number' ? state : interaction.initial;
  let feedbackIndex = null;
  if (state === true || (state && typeof state === 'object')) feedbackIndex = 0;
  else if (typeof state === 'number' && !RANGE_INTERACTIONS.has(interaction.type)) feedbackIndex = state;
  const liveFormula = interaction.type === 'denominatorDial' ? `${interaction.numerator}/${liveValue}` : interaction.type === 'numeratorSlider' ? `${liveValue}/${interaction.denominator}` : interaction.type === 'lineMarker' || interaction.type === 'sliderNumerator' ? `${liveValue}/8` : String(liveValue ?? '');
  return <section className="optional-lab" aria-label={t(bi("Ixtiyoriy tajriba", 'Необязательный эксперимент', "Optional experiment"))}>
    {!interaction.inline && RANGE_INTERACTIONS.has(interaction.type) && <label className="range-lab"><span>{t(interaction.label)}</span><input type="range" min={interaction.min} max={interaction.max} value={liveValue} disabled={disabled} onChange={(event) => onChange(Number(event.target.value), null)}/><output>{liveFormula}</output></label>}
    {!interaction.inline && !RANGE_INTERACTIONS.has(interaction.type) && interaction.type !== 'halfMarker' && interaction.options && <div className={`mini-options ${interaction.type === 'partCount' ? 'count-options' : ''}`}>{interaction.options.map((option, index) => <button type="button" key={`${index}-${t(option)}`} className={state === index ? 'active' : ''} disabled={disabled} onClick={() => onChange(index, index)}>{t(option)}</button>)}</div>}
    {interaction.type === 'halfMarker' && <button type="button" className={`mini-action ${state === true ? 'active' : ''}`} disabled={disabled} onClick={() => onChange(true, 0)}>{t(interaction.options[0])}</button>}
    <FeedbackBlock show={feedbackIndex !== null} correct={interaction.correctIndex == null || feedbackIndex === interaction.correctIndex}>{feedbackIndex !== null ? t(interaction.feedback?.[feedbackIndex]) : ''}</FeedbackBlock>
  </section>;
}

function VisualPanel({ visual, frame, solved = false, promptReady = false, audio, hintLevel = 0, answerState = null, disabled = false, onActivityChange }) {
  const lang = useLang(); const t = useT(); const [interactionState, setInteractionState] = useState(null); const interaction = visual?.interaction; const flashTimer = useRef(null);
  useEffect(() => () => { if (flashTimer.current !== null) window.clearTimeout(flashTimer.current); }, []);
  if (!visual) return null;
  const interact = (value, feedbackIndex = null) => { if (disabled) return; setInteractionState(value); const completed = interaction?.correctIndex == null || feedbackIndex === interaction.correctIndex; onActivityChange?.(completed); if (flashTimer.current !== null) window.clearTimeout(flashTimer.current); if (['notationTap', 'segmentTap', 'halfMarker'].includes(interaction?.type)) flashTimer.current = window.setTimeout(() => setInteractionState(null), 3000); if (feedbackIndex !== null) { const feedback = interaction?.audioFeedback?.[feedbackIndex]; const spoken = feedback?.[lang] ?? feedback?.uz; if (spoken) audio?.pushOneOff(spoken); } };
  return <div className={`visual-shell ${hintLevel >= 2 ? 'hint-emphasis' : ''} ${disabled ? 'is-locked' : ''}`} data-g4-role="visual-frame" aria-disabled={disabled}><VisualModel visual={visual} frame={frame} solved={solved} promptReady={promptReady} interactionState={interactionState} onInteract={interact} answerState={answerState}/><OptionalInteraction interaction={interaction} state={interactionState} onChange={interact} disabled={disabled}/>{hintLevel >= 2 && !solved && <div className="model-hint" role="status" aria-live="polite">{t(bi("Modeldagi teng qismlar va berilgan sonlarni yana taqqoslang.", 'Ещё раз сравните равные части модели и данные числа.', "Compare the equal parts in the model with the given numbers again."))}</div>}</div>;
}

function BeatList({ frames = [], frame, conditional = false, solved = false, onReplay }) { const t = useT(); return <div className={`beat-list ${conditional ? 'conditional' : ''}`}>{frames.map((item, index) => { const className = index <= frame || solved ? 'beat show' : 'beat'; const content = <><b>{index + 1}</b><span>{t(item)}</span></>; return onReplay ? <button type="button" key={`${index}-${t(item)}`} className={className} onClick={() => onReplay(index)}>{content}</button> : <div key={`${index}-${t(item)}`} className={className}>{content}</div>; })}</div>; }

function FeedbackBlock({ show, correct, children, proof = null }) { const t = useT(); const [open, setOpen] = useState(false); useEffect(() => { if (!show) { const frame = requestAnimationFrame(() => setOpen(false)); return () => cancelAnimationFrame(frame); } let second = 0; const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setOpen(true)); }); return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); }; }, [show]); return <div data-g4-role={show ? (correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame') : undefined} data-g4-feedback={show ? (correct ? 'solution' : 'wrong') : undefined} role={show ? 'status' : undefined} aria-hidden={!show} className={`feedback feedback-slot ${correct ? 'correct' : 'wrong'} ${open ? 'open' : ''}`}><span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state={correct ? 'nod' : 'awkward'}/></span><p data-g4-role={show && correct ? 'bit-answer-comment' : undefined}>{show && correct && <b className="proof-label">{t({ uz: 'YECHIM', ru: 'РЕШЕНИЕ', en: 'SOLUTION' })}</b>}<span>{show ? children : ''}</span>{show && proof && <strong className="feedback-proof">{proof}</strong>}</p></div>; }

function Options({ values, picked, solved, correctIndex, onPick, neutral = false, disabled = false, order = null }) { const t = useT(); const sourceOrder = order ?? values.map((_, index) => index); return <div className="options">{sourceOrder.map((sourceIndex, displayIndex) => { const value = values[sourceIndex]; return <button type="button" data-g4-role="answer-card" data-g4-source-index={order ? sourceIndex : undefined} data-g4-correct={order ? (sourceIndex === correctIndex ? 'true' : 'false') : undefined} key={`${sourceIndex}-${t(value)}`} className={`option ${picked === sourceIndex ? 'picked' : ''} ${!neutral && solved && sourceIndex === correctIndex ? 'right' : ''} ${!neutral && picked === sourceIndex && !solved ? 'bad' : ''}`} onClick={() => onPick(sourceIndex)} disabled={disabled || solved}><b>{String.fromCharCode(65 + displayIndex)}</b><span>{t(value)}</span></button>; })}</div>; }

function LessonScreen({ screen, storedAnswer, answers, onAnswer, onPrev, onNext, finishLesson }) {
  const t = useT(); const lang = useLang(); const lesson = useLesson(); const c = lesson.screens[screen]; const meta = SCREEN_META[screen]; const audio = useNarration(c.audio, screen); const scored = meta.scored === true;
  const choiceOrdinal = [10, 11, 12, 14].indexOf(screen);
  const order = choiceOrdinal >= 0 ? buildOptionOrder(c.options.length, c.correctIndex, LESSON_META.lessonId, choiceOrdinal) : null;
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const [neutralPicked, setNeutralPicked] = useState(storedAnswer?.neutralChoice ?? null);
  const [activityComplete, setActivityComplete] = useState(storedAnswer?.activityComplete === true);
  const [hintLevel, setHintLevel] = useState((storedAnswer?.attempts ?? 0) >= 2 && storedAnswer?.correct !== true ? 2 : 0);
  const [reflectionChoice, setReflectionChoice] = useState(storedAnswer?.reflectionChoice ?? null);
  const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const clean = useRef(storedAnswer?.firstTry ?? true);
  const narrationReady = audio.muted || audio.completed;
  const choose = (index) => { if (solved || !narrationReady) return; attempts.current += 1; const ok = index === c.correctIndex; if (!ok) clean.current = false; setPicked(index); setSolved(ok); setHintLevel(ok ? 0 : attempts.current >= 2 ? 2 : 0); playSfx(ok ? 'correct' : 'wrong'); const feedbackAudio = ok ? c.audio.on_correct : (c.feedbackAudio?.[index] ?? c.audio.on_wrong); const spoken = feedbackAudio?.[lang] ?? feedbackAudio?.uz ?? (ok ? "To'g'ri." : 'Yana tekshiring.'); audio.pushOneOff(spoken); onAnswer({ screenIdx: screen, stage: meta.scope, question: t(c.question), options: c.options.map(t), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok }); };
  const chooseNeutral = (index) => { if (!narrationReady) return; setNeutralPicked(index); const spoken = c.neutralAudio?.[lang] ?? c.neutralAudio?.uz ?? c.neutral?.[lang] ?? c.neutral?.uz; if (spoken) audio.pushOneOff(spoken); onAnswer({ screenIdx: screen, stage: meta.scope, question: t(c.frames[c.frames.length - 1]), options: c.neutralOptions.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: index, studentAnswer: t(c.neutralOptions[index]), correct: true, firstTry: true, attempts: 1, solved: true, neutralChoice: index }); };
  const completeActivity = (complete) => { if (!complete) return; setActivityComplete(true); if (storedAnswer?.activityComplete !== true) onAnswer({ screenIdx: screen, stage: meta.scope, question: t(c.title), options: [], correctIndex: null, correctAnswer: null, studentAnswerIndex: null, studentAnswer: null, correct: true, firstTry: true, attempts: 1, solved: true, activityComplete: true }); };
  const introSource = c.audio?.intro?.[lang] ?? c.audio?.intro?.uz ?? [];
  const introLastFrame = Math.max(0, (Array.isArray(introSource) ? introSource.length : 1) - 1);
  const frame = scored ? (solved ? lesson.frameCounts[screen] - 1 : Math.min(audio.frame, introLastFrame)) : audio.frame;
  const finish = screen === lesson.screens.length - 1;
  const directVisualChoice = scored && (c.visual?.kind === 'choiceModels' || (c.visual?.kind === 'line' && Array.isArray(c.visual.markers)));
  const answerState = directVisualChoice ? { picked, solved, correctIndex: c.correctIndex, onPick: choose, options: c.options, disabled: !narrationReady } : null;
  const narrationTexts = c.audio?.intro?.[lang] ?? c.audio?.intro?.uz ?? c.audio?.[lang] ?? c.audio?.uz ?? [];
  const replayStrategy = c.visual?.interaction?.type === 'strategyReplay' ? (index) => { if (!narrationReady) return; completeActivity(true); const text = (Array.isArray(narrationTexts) ? narrationTexts : [narrationTexts])[index]; if (text) audio.pushOneOff(text); } : undefined;
  const requiresInteraction = Boolean(c.visual?.interaction);
  const canAdvance = finish
    ? titleClaimed
    : scored
      ? solved && narrationReady
      : c.neutralOptions
        ? neutralPicked !== null && narrationReady
        : requiresInteraction
          ? activityComplete && narrationReady
          : narrationReady;
  const reflectionOptions = [
    bi("Avval butunni teng qismlarga bo'laman", 'Сначала разделю целое на равные части', 'First, I divide the whole into equal parts'),
    bi("Maxrajda jami, suratda olingan qismlarni tekshiraman", 'Проверю все части в знаменателе и взятые части в числителе', 'I check all parts in the denominator and the taken parts in the numerator'),
    bi("Model, yozuv va sonlar nurini solishtiraman", 'Сопоставлю модель, запись и числовой луч', 'I compare the model, notation and number line'),
  ];
  const chooseReflection = (index) => { if (!narrationReady || titleClaimed) return; setReflectionChoice(index); onAnswer({ ...(storedAnswer ?? {}), screenIdx: screen, stage: null, reflectionChoice: index, titleClaimed: false }); audio.pushOneOff(t(reflectionOptions[index])); };
  const claimTitle = () => {
    if (!narrationReady || reflectionChoice === null || titleClaimed) return;
    setTitleClaimed(true);
    onAnswer({ screenIdx: screen, stage: null, question: t(bi("Kasrni tekshirishda qaysi qadamdan foydalanasiz?", 'Какой шаг вы будете использовать для проверки дроби?', 'Which step will you use to check a fraction?')), options: reflectionOptions.map((option) => t(option)), correctIndex: null, correctAnswer: null, studentAnswerIndex: reflectionChoice, studentAnswer: t(reflectionOptions[reflectionChoice]), correct: true, firstTry: true, attempts: 1, solved: true, reflectionChoice, titleClaimed: true });
  };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finish ? (titleClaimed ? finishLesson : undefined) : onNext} nextDisabled={!canAdvance} finish={finish}><div className={`stack ${screen === 0 ? "hook-stack" : ""}`} data-g4-screen={screen === 0 ? "hook" : undefined}><Heading c={c} hook={screen === 0}/>{screen === 0 && <h2 className="hook-question-prompt" data-g4-role="hook-question">{t(c.frames[c.frames.length - 1])}</h2>}{screen === 0 ? <section className="hook-scene-adapter" data-g4-role="hook-scene"><div className="hook-scene-visual" data-g4-role="visual-frame"><VisualPanel visual={c.visual} frame={frame} solved={solved} promptReady={scored && introLastFrame === 0} audio={audio} hintLevel={hintLevel} answerState={answerState} disabled={!narrationReady} onActivityChange={completeActivity}/><div className="hook-frame-bit" data-g4-role="hook-bit"><BitSVG state={c.bit || 'think'}/></div></div></section> : <VisualPanel visual={c.visual} frame={frame} solved={solved} promptReady={scored && introLastFrame === 0} audio={audio} hintLevel={hintLevel} answerState={answerState} disabled={!narrationReady} onActivityChange={completeActivity}/>}<BeatList frames={c.frames} frame={frame} conditional={scored} solved={solved} onReplay={replayStrategy}/>{c.neutralOptions && <section className="question" data-g4-role="answer-card"><h2>{t(c.frames[c.frames.length - 1])}</h2><Options values={c.neutralOptions} picked={neutralPicked} onPick={chooseNeutral} neutral disabled={!narrationReady}/><FeedbackBlock show={neutralPicked !== null} correct>{t(c.neutral)}</FeedbackBlock></section>}{scored && <section className="question"><h2>{t(c.question)}</h2>{!directVisualChoice && <Options values={c.options} picked={picked} solved={solved} correctIndex={c.correctIndex} onPick={choose} disabled={!narrationReady} order={order}/>}<FeedbackBlock show={picked !== null} correct={solved} proof={solved ? t(c.proof) : null}>{picked !== null ? t(c.feedback[picked]) : ''}</FeedbackBlock></section>}{finish && <section className="final-reflection" data-g4-role="reflection"><strong>{t(bi("Kasrni tekshirishda qaysi qadamdan foydalanasiz?", 'Какой шаг вы будете использовать для проверки дроби?', 'Which step will you use to check a fraction?'))}</strong><div>{reflectionOptions.map((option, index) => <button type="button" key={t(option)} className={reflectionChoice === index ? 'is-selected' : ''} aria-pressed={reflectionChoice === index} disabled={!narrationReady || titleClaimed} onClick={() => chooseReflection(index)}><span>{index + 1}</span>{t(option)}</button>)}</div></section>}{finish && <G4FinalTitleReward ready={narrationReady} titleClaimed={titleClaimed} reflectionChoice={reflectionChoice} onClaim={claimTitle} title={lesson.badge} firstTry={answers.filter((answer, index) => index >= 9 && index <= 14 && answer?.firstTry === true).length} total={6} />}</div></Stage>;
}

export function FractionLessonShell({ lesson, studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const showPreviewControls = langProp === undefined || langProp === null; const preview = previewMode ?? showPreviewControls; const initialLang = normalizeLang(langProp); const [previewLang, setPreviewLang] = useState(initialLang); const lang = showPreviewControls ? normalizeLang(previewLang) : initialLang;
  configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview });
  const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]);
  useMobileZoom();
  // eslint-disable-next-line react-hooks/purity -- lesson duration starts when this component mounts
  const started = useRef(Date.now()); const finished = useRef(false);
  const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old?.firstTry === false ? false : answer.firstTry }; return next; }), []);
  const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = [9, 10, 11, 12, 13, 14]; const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - started.current) / 1000), totalQuestions: 6, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / 6 * 100), finalScore: firstTryCorrect, finalTotal: 6, passed: firstTryCorrect / 6 >= 0.6, firstTryStats: { total: 6, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: lesson.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log(`[${lesson.slug} preview]`, payload); }, [answers, lang, lesson, onFinished, studentName]);
  return <LessonContext.Provider value={lesson}><LangContext.Provider value={lang}><style>{STYLES + G4_ETALON_OVERRIDES}</style><div className={`lesson-root ${preview ? 'lesson-root-preview' : ''}`}>{showPreviewControls && <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{['uz', 'ru', 'en'].map((code) => <button type="button" key={code} className={previewLang === code ? 'active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<LessonScreen key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(lesson.screens.length - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider></LessonContext.Provider>;
}

export default function Grade4Dars18({ studentName, lang, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) { return <FractionLessonShell lesson={LESSON_META} studentName={studentName} lang={lang} ttsApiBase={ttsApiBase} voiceGender={voiceGender} correctSoundUrl={correctSoundUrl} wrongSoundUrl={wrongSoundUrl} onFinished={onFinished} previewMode={previewMode}/>; }

const G4_ETALON_OVERRIDES = `
/* Local Dars01 visual contract. Content, narration and scoring stay lesson-owned. */
html:has(.lesson-root),body:has(.lesson-root),.lesson-root,.lesson-root button,.lesson-root input,.lesson-root textarea,.lesson-root select{font-family:'Manrope',system-ui,sans-serif}
.lesson-root h1,.lesson-root [data-g4-role="hook-title"] h1{font-family:'Source Serif 4',Georgia,serif!important;font-size:clamp(26px,4.2vw,36px)!important;font-weight:650!important;line-height:1.08!important;letter-spacing:-.012em!important;text-align:left!important}
.lesson-root .question h2,.lesson-root .hook-question-prompt{font-family:'Manrope',system-ui,sans-serif!important;font-size:clamp(17px,2.5vw,21px)!important;font-weight:800!important;line-height:1.28!important;text-align:left!important}
.lesson-root .summary-stack h2,.lesson-root .final-reflection h2,.lesson-root .reflection-card h2,.lesson-root [data-g4-role="title-card"] h2{font-family:'Source Serif 4',Georgia,serif!important}
.lesson-root .screen-count,.lesson-root .formula,.lesson-root .formula-card,.lesson-root .equation,.lesson-root .proof,.lesson-root .proof-label,.lesson-root .result-chip,.lesson-root .model-label,.lesson-root .frac{font-family:'JetBrains Mono',monospace!important}
.lesson-root [data-g4-role="hook-topic"]{font-size:clamp(14px,1.8vw,16px)!important}.lesson-root .summary-stack h2{font-size:25px}.lesson-root .option{font-size:clamp(15px,2vw,18px)}
[data-g4-role="hook-title"]{display:block;width:100%;font-size:36px!important;justify-content:flex-start!important;text-align:left}
.hook-stack{height:100%;min-height:0;display:flex!important;flex-direction:column;align-items:stretch;gap:9px!important;overflow:hidden}
.hook-stack>.heading{height:auto!important;min-height:0!important;overflow:visible!important;align-items:flex-start!important;flex:0 0 auto}
.hook-question-prompt{flex:0 0 auto;margin:0;padding:0 2px;color:#173B52;font-size:21px!important}
.hook-stack>.question{flex:0 0 auto;height:auto!important;min-height:0}
.hook-stack .feedback[aria-hidden="true"]{display:none!important}
.stage-hook .hook-question>h2,.hook-stack>.question>h2{display:none}
[data-g4-role="hook-scene"]{position:relative;isolation:isolate;width:100%!important;height:206px!important;min-width:0;min-height:206px!important;flex:0 0 206px!important;display:block!important;grid-template-columns:1fr!important;overflow:hidden}
[data-g4-role~="visual-frame"]{position:relative;isolation:isolate;min-width:0;min-height:0;max-width:100%;overflow:hidden!important;contain:paint}
[data-g4-screen="hook"] [data-g4-role~="visual-frame"],.stage-hook [data-g4-role="hook-scene"]>[data-g4-role~="visual-frame"]{width:min(760px,100%);min-height:206px;height:100%;margin-inline:auto;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
.stage-hook .hook-card{padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
.hook-scene-visual{width:100%!important;max-width:100%!important;height:100%;min-height:130px;padding:14px 112px 14px 16px;box-sizing:border-box}
.hook-scene-visual>[data-g4-role~="visual-frame"]{height:100%;padding:0;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;contain:layout paint}
.hook-frame-bit{position:absolute;right:42px;bottom:-4px;z-index:4;width:88px;height:110px;overflow:hidden;pointer-events:none}
.hook-frame-bit>.g1-char,.hook-frame-bit>.bit,.hook-frame-bit>svg{width:100%;height:100%;display:block}
[data-g4-role~="visual-frame"] img,[data-g4-role~="visual-frame"] picture,[data-g4-role~="visual-frame"] video,[data-g4-role~="visual-frame"] canvas,[data-g4-role~="visual-frame"] svg{display:block;max-width:100%!important;max-height:100%!important;object-fit:contain;overflow:hidden!important}
.visual-shell,.attempt-model,.model-card,.test-model,.topic-visual,.conversion-visual,.time-visual,.area-visual,.length-visual,.mass-visual,.hook-model{min-width:0;min-height:0;max-width:100%;overflow:hidden}
.lesson-root .feedback[data-g4-role~="feedback-frame"]{height:auto!important;min-height:88px!important;padding:8px 15px 8px 9px!important;border-radius:18px!important;display:grid!important;grid-template-columns:62px minmax(0,1fr)!important;align-items:center!important;gap:12px!important;overflow:hidden}
.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-role~="feedback-frame"]>.feedback-bit{width:62px!important;height:76px!important;display:block;overflow:hidden}
.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]>.g1-char,.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]>.bit,.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]>svg{width:100%!important;height:100%!important}
.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]{height:auto!important;min-height:72px!important;border-radius:15px!important;grid-template-columns:51px minmax(0,1fr)!important;background:linear-gradient(135deg,#FFFFFF,#E7F3EC)!important;box-shadow:inset 5px 0 #227A53,0 13px 26px -23px rgba(34,122,83,.75)!important}
.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]>.feedback-bit{width:51px!important;height:64px!important}
.lesson-root .feedback[data-g4-feedback="wrong"]{height:auto!important;min-height:88px!important;border-radius:18px!important;background:linear-gradient(135deg,#FFFFFF,#FFF5D9)!important;box-shadow:inset 5px 0 #A96F13,0 13px 26px -23px rgba(169,111,19,.72)!important}
.lesson-root .feedback[data-g4-role~="feedback-frame"] p{min-width:0;margin:0;font-family:'Manrope',system-ui,sans-serif!important;font-size:15px!important;line-height:1.42!important;text-align:left}
.rank-boost-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.9s ease both}.rank-boost-overlay .g4-title-reveal-title{font-size:58px!important}
[data-g4-role="title-card"]{position:relative;isolation:isolate;max-width:100%;overflow:hidden}
[data-g4-role="title-claim"]{font-family:'Manrope',system-ui,sans-serif}
.hook-scene-visual{width:min(760px,100%)!important;margin-inline:auto!important}
.lesson-frame .preview-language{display:none!important}
@media(max-width:639.98px){.lesson-root{zoom:1!important;width:100%!important}.stage{width:min(390px,100%)!important}}
@media(max-width:639.98px){
  .lesson-root h1,.lesson-root [data-g4-role="hook-title"] h1{font-size:clamp(22px,6.2vw,28px)!important}
  .lesson-root [data-g4-role="hook-title"]{font-size:25px!important}
  .lesson-root .question h2,.lesson-root .hook-question-prompt{font-size:17px!important}
  [data-g4-role="hook-scene"]{height:164px!important;min-height:164px!important;flex:0 0 164px!important}
  [data-g4-screen="hook"] [data-g4-role~="visual-frame"],.stage-hook [data-g4-role="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px;border-radius:18px}
  .hook-scene-visual{min-height:112px;padding:10px 78px 10px 11px}
  .hook-stack>.question .options,.stage-hook .hook-question .options{grid-template-columns:repeat(3,minmax(0,1fr))!important}
  .hook-stack>.question .option,.stage-hook .hook-question .option{min-height:44px!important;grid-template-columns:1fr!important;justify-items:center!important;text-align:center!important}
  .hook-frame-bit{right:12px;bottom:-7px;width:68px;height:85px}
  .lesson-root .feedback[data-g4-role~="feedback-frame"]{height:auto!important;min-height:88px!important;grid-template-columns:54px minmax(0,1fr)!important;gap:9px!important}
  .lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-role~="feedback-frame"]>.feedback-bit{width:54px!important;height:68px!important}
  .lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]{height:auto!important;min-height:68px!important;border-radius:15px!important;grid-template-columns:47px minmax(0,1fr)!important}
  .lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]>.feedback-bit{width:47px!important;height:59px!important}
  .lesson-root .feedback[data-g4-role~="feedback-frame"] p{font-size:14px!important}.rank-boost-overlay .g4-title-reveal-title{font-size:29px!important}
}
@media(prefers-reduced-motion:reduce){.rank-boost-overlay,.rank-boost-overlay * ,[data-g4-role="title-card"],[data-g4-role="title-card"] *{animation:none!important;transition:none!important}.rank-boost-overlay{opacity:1}.g4-title-reveal-confetti,.g4-title-card-confetti{display:none!important}}
.lesson-root [class*="formula"],.lesson-root [class*="equation"]{font-family:'JetBrains Mono',monospace!important}
.hook-stack>.question[data-g4-role="answer-card"]{display:contents!important}
.hook-stack>.question[data-g4-role="answer-card"]:has(.feedback.open)>.options{display:none!important}
.lesson-root .question:has(.feedback[data-g4-feedback="solution"].open)>.options{display:none!important}
.visual-shell{overflow:hidden!important}
.visual-shell>.model-card{min-height:0!important;max-height:none!important;padding:8px!important;gap:5px!important;overflow:hidden!important}
.visual-shell>.model-card .fraction-model{gap:4px!important}
.visual-shell>.model-card .fraction-model>b{font-size:16px!important;line-height:1!important}
.visual-shell>.model-card .fraction-bar{height:54px!important}
.visual-shell>.model-card.three-models,.visual-shell>.model-card.choice-models,.visual-shell>.model-card.summary-model{min-height:0!important;height:auto!important}
.visual-shell>.model-card.three-models{grid-template-columns:repeat(3,minmax(0,1fr))!important}
.visual-shell>.model-card.three-models .model-zoom{min-height:96px!important;padding:3px!important;overflow:hidden!important}
.visual-shell>.model-card.three-models .fraction-circle{width:84px!important;height:84px!important}
.visual-shell>.model-card.three-models .grid-model i{height:24px!important}
.visual-shell>.model-card.choice-models{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important}
.visual-shell>.model-card.choice-models .model-answer{min-width:0!important;min-height:96px!important;height:auto!important;padding:5px!important;grid-template-columns:24px minmax(0,1fr)!important;gap:3px!important;overflow:hidden!important}
.visual-shell>.model-card.choice-models .model-answer>b{width:23px!important;height:23px!important}
.visual-shell>.model-card.choice-models .model-answer>span{min-width:0;font-size:10px!important;line-height:1.12!important}
.visual-shell>.model-card.choice-models .model-answer>.fraction-model,.visual-shell>.model-card.choice-models .model-answer>.loose-shapes{grid-column:1/-1}
.visual-shell>.model-card.choice-models .fraction-bar{height:30px!important}
.visual-shell>.model-card.choice-models .loose-shapes i{width:24px!important;height:24px!important}
.visual-shell>.model-card.summary-model{padding-block:7px!important;grid-template-columns:1fr 1fr!important;gap:5px!important}
.visual-shell>.model-card.summary-model .number-line-wrap,.visual-shell>.model-card.summary-model .number-line-svg{height:68px!important}
.stack:has(>.visual-shell>.summary-model)>.visual-shell{min-height:88px!important}
.stack:has(>.visual-shell>.summary-model)>.beat-list{padding:6px!important}
.stack:has(>.visual-shell>.summary-model)>.beat-list .beat{min-height:44px!important;padding:4px!important;gap:4px!important}
.stack:has(>.visual-shell>.summary-model)>.beat-list .beat>span{font-size:10px!important;line-height:1.1!important}
@media(max-width:639.98px){
  .visual-shell>.model-card{padding:5px!important;gap:3px!important}
  .visual-shell>.model-card .fraction-bar{height:36px!important}
  .visual-shell>.model-card .fraction-model>b{font-size:12px!important}
  .visual-shell>.model-card.three-models{min-height:0!important;max-height:none!important;padding-block:3px!important}
  .visual-shell>.model-card.three-models .model-zoom{min-height:82px!important;padding:2px!important}
  .visual-shell>.model-card.three-models .fraction-circle{width:70px!important;height:70px!important}
  .visual-shell>.model-card.three-models .grid-model i{height:20px!important}
  .visual-shell>.model-card.choice-models{gap:3px!important}
  .visual-shell>.model-card.choice-models .model-answer{min-height:80px!important;padding:3px!important;grid-template-columns:20px minmax(0,1fr)!important}
  .visual-shell>.model-card.choice-models .model-answer>b{width:19px!important;height:19px!important;font-size:7px!important}
  .visual-shell>.model-card.choice-models .model-answer>span{font-size:7px!important;line-height:1.05!important}
  .visual-shell>.model-card.choice-models .fraction-bar{height:23px!important;border-width:2px!important}
  .visual-shell>.model-card.choice-models .loose-shapes i{width:18px!important;height:18px!important}
  .visual-shell>.model-card.summary-model{min-height:0!important;max-height:none!important;padding-block:4px!important;grid-template-columns:1fr 1fr!important;gap:3px!important}
  .visual-shell>.model-card.summary-model .number-line-wrap,.visual-shell>.model-card.summary-model .number-line-svg{height:52px!important}
  .stack:has(>.visual-shell>.summary-model)>.visual-shell{min-height:62px!important}
  .stack:has(>.visual-shell>.summary-model)>.beat-list{padding:4px!important}
  .stack:has(>.visual-shell>.summary-model)>.beat-list .beat{min-height:34px!important;padding:3px!important}
  .stack:has(>.visual-shell>.summary-model)>.beat-list .beat>span{font-size:8px!important;line-height:1.05!important}
}
.lesson-root [data-g4-role="title-card"]{width:100%!important;min-height:116px!important;height:auto!important;margin:0!important;padding:12px 82px 11px 67px!important;border-radius:17px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;gap:4px!important;color:#FFF!important;background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978)!important;box-shadow:0 28px 58px -27px rgba(22,143,163,.8)!important}
.lesson-root [data-g4-role="title-card"] [data-g4-role="reward-bit"]{width:72px!important;height:90px!important}
.lesson-root [data-g4-role="title-card"] [data-g4-role="reward-medal"]{width:44px!important;height:44px!important}
@media(max-width:639.98px){
  .lesson-root [data-g4-role="title-card"]{min-height:88px!important;padding:9px 59px 8px 51px!important;border-radius:14px!important}
  .lesson-root [data-g4-role="title-card"] [data-g4-role="reward-bit"]{width:57px!important;height:71px!important}
  .lesson-root [data-g4-role="title-card"] [data-g4-role="reward-medal"]{width:34px!important;height:34px!important}
}
.hook-stack>.beat-list{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;padding:5px!important}
.hook-stack>.beat-list .beat{min-height:38px!important;padding:4px!important;grid-template-columns:23px minmax(0,1fr)!important;gap:4px!important}
.hook-stack>.beat-list .beat>b{width:22px!important;height:22px!important}.hook-stack>.beat-list .beat>span{font-size:9px!important;line-height:1.12!important}
@media(max-width:639.98px) and (max-height:700px){.hook-stack>.beat-list{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;padding:2px!important;gap:2px!important}.hook-stack>.beat-list .beat{min-height:26px!important;padding:2px!important;grid-template-columns:16px minmax(0,1fr)!important;gap:2px!important}.hook-stack>.beat-list .beat>b{width:16px!important;height:16px!important}.hook-stack>.beat-list .beat>span{font-size:7px!important;line-height:1.05!important}}
`;

const STYLES = `
.g4-title-card-placeholder{width:100%;min-height:116px}
.g4-title-card{position:relative;isolation:isolate;width:100%;min-height:116px;margin:0;padding:12px 82px 11px 67px;border-radius:17px;display:flex;flex-direction:column;justify-content:center;gap:4px;overflow:hidden;color:#FFF;background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978);box-shadow:0 28px 58px -27px rgba(22,143,163,.8);transform:translateY(-2px)}
.g4-title-card-medal{position:absolute;left:11px;top:50%;width:44px;height:44px;border:3px solid rgba(255,255,255,.58);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);box-shadow:0 0 0 8px rgba(255,255,255,.08),0 15px 30px -15px rgba(0,0,0,.6);font-size:19px;z-index:2}
.g4-title-card-bit{position:absolute;right:3px;bottom:2px;width:72px;height:90px;z-index:2;animation:g4-title-card-bit-float 2.8s ease-in-out 1 both}.g4-title-card-bit>svg,.g4-title-card-bit .bit,.g4-title-card-bit .g1-char{width:100%;height:100%}
.g4-title-card-kicker{position:relative;color:#A8EAF0;font:900 10px/1.2 'JetBrains Mono',monospace;letter-spacing:.13em;z-index:2}.g4-title-card-title{position:relative;margin:0!important;font:750 clamp(16px,2.2vw,21px)/1.05 'Source Serif 4',Georgia,serif;z-index:2}.g4-title-card-score{position:relative;align-self:flex-start;margin-top:5px;padding:5px 9px;border-radius:10px;display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.10);z-index:2}.g4-title-card-score strong{color:#FFE284;font-family:'JetBrains Mono',monospace}.g4-title-card-score span{color:rgba(255,255,255,.72);font-size:9px}
.g4-title-card-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-card-confetti i{position:absolute;top:-16px;width:7px;height:12px;border-radius:2px;animation:g4-title-card-fall 2.4s linear 2 both}.g4-title-card-confetti i:nth-child(4n+1){background:#FFC23C}.g4-title-card-confetti i:nth-child(4n+2){background:#FF5B35}.g4-title-card-confetti i:nth-child(4n+3){background:#77E1EA}.g4-title-card-confetti i:nth-child(4n){background:#95C93D}.g4-title-card-confetti i:nth-child(1){left:8%;animation-delay:-.3s}.g4-title-card-confetti i:nth-child(2){left:17%;animation-delay:-1.1s}.g4-title-card-confetti i:nth-child(3){left:29%;animation-delay:-.7s}.g4-title-card-confetti i:nth-child(4){left:41%;animation-delay:-1.7s}.g4-title-card-confetti i:nth-child(5){left:52%;animation-delay:-.2s}.g4-title-card-confetti i:nth-child(6){left:63%;animation-delay:-1.3s}.g4-title-card-confetti i:nth-child(7){left:73%;animation-delay:-.8s}.g4-title-card-confetti i:nth-child(8){left:84%;animation-delay:-1.9s}.g4-title-card-confetti i:nth-child(9){left:12%;animation-delay:-2s}.g4-title-card-confetti i:nth-child(10){left:36%;animation-delay:-1.4s}.g4-title-card-confetti i:nth-child(11){left:68%;animation-delay:-.5s}.g4-title-card-confetti i:nth-child(12){left:91%;animation-delay:-1.6s}
.g4-title-reveal-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;pointer-events:none;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.2s ease both}.g4-title-reveal-card{position:relative;isolation:isolate;width:100%;min-height:100dvh;padding:36px 24px;border:0;border-radius:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;overflow:hidden;color:#FFF;text-align:center;background:radial-gradient(circle at 50% 50%,rgba(255,214,80,.17),transparent 31%)}.g4-title-reveal-card::after{content:'';position:absolute;z-index:0;top:50%;left:50%;width:min(440px,82vw);height:min(440px,82vw);border-radius:50%;background:radial-gradient(circle,rgba(255,222,105,.17),transparent 68%);transform:translate(-50%,-50%)}
.g4-title-reveal-rays{position:absolute;z-index:0;top:50%;left:50%;width:160vmax;height:160vmax;border-radius:50%;opacity:.28;background:repeating-conic-gradient(from -4deg,rgba(255,218,91,.88) 0 8deg,transparent 8deg 20deg);transform:translate(-50%,-50%);animation:g4-title-reveal-rays-in .8s cubic-bezier(.16,1,.3,1) both,g4-title-reveal-rays-turn 26s linear .8s 1 both}.g4-title-reveal-medal{position:absolute;top:50%;left:50%;z-index:2;width:112px;height:112px;border:6px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;color:#653C00;background:linear-gradient(145deg,#FFF2A0,#FFC13B);box-shadow:0 0 0 13px rgba(255,255,255,.09),0 0 54px 10px rgba(255,204,63,.38),0 22px 38px -18px rgba(0,0,0,.7);font-size:52px;animation:g4-title-reveal-medal-in 1s cubic-bezier(.16,1,.3,1) .15s both}.g4-title-reveal-title{position:absolute;top:calc(50% + 82px);left:50%;z-index:2;width:min(680px,calc(100vw - 48px));margin:0!important;font:750 clamp(34px,5vw,58px)/1.02 'Source Serif 4',Georgia,serif;text-shadow:0 4px 24px rgba(0,0,0,.72);transform:translateX(-50%);animation:g4-title-reveal-title-in .7s ease .52s both}
.g4-title-reveal-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-reveal-confetti i{position:absolute;top:-20px;width:8px;height:14px;border-radius:2px;background:#FFE284;animation:g4-title-reveal-fall 2.4s linear 2 both}.g4-title-reveal-confetti i:nth-child(3n+2){background:#FF7050}.g4-title-reveal-confetti i:nth-child(3n){background:#77E1EA}
@keyframes g4-title-card-bit-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes g4-title-card-fall{to{transform:translateY(230px) rotate(460deg)}}@keyframes g4-title-reveal-life{0%{opacity:0}12%,84%{opacity:1}100%{opacity:0}}@keyframes g4-title-reveal-medal-in{from{opacity:0;transform:translate(-50%,-50%) scale(.25) rotate(-25deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}}@keyframes g4-title-reveal-title-in{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}@keyframes g4-title-reveal-rays-in{from{opacity:0;transform:translate(-50%,-50%) scale(.5)}to{opacity:.28;transform:translate(-50%,-50%) scale(1)}}@keyframes g4-title-reveal-rays-turn{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes g4-title-reveal-fall{to{transform:translateY(470px) rotate(560deg)}}
@media(max-width:639.98px){.g4-title-card-placeholder{min-height:88px}.g4-title-card{min-height:88px;padding:9px 59px 8px 51px;border-radius:14px}.g4-title-card-medal{left:8px;width:34px;height:34px;font-size:14px}.g4-title-card-bit{width:57px;height:71px}.g4-title-card-title{font-size:14px}.g4-title-reveal-card{min-height:100dvh;padding:24px 18px}.g4-title-reveal-medal{width:88px;height:88px;border-width:5px;font-size:40px}.g4-title-reveal-title{top:calc(50% + 62px);font-size:29px}}
@media(prefers-reduced-motion:reduce){.g4-title-card,.g4-title-card-bit,.g4-title-reveal-overlay,.g4-title-reveal-rays,.g4-title-reveal-medal,.g4-title-reveal-title{animation:none!important}.g4-title-card{opacity:1;transform:none!important}.g4-title-card-confetti,.g4-title-reveal-confetti{display:none}.g4-title-reveal-overlay{opacity:1}.g4-title-reveal-rays{opacity:.28;transform:translate(-50%,-50%)}.g4-title-reveal-medal{opacity:1;transform:translate(-50%,-50%)}.g4-title-reveal-title{opacity:1;transform:translateX(-50%)}}
.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol{margin:0}.lesson-root button,.lesson-root input{font:inherit}.stage-chrome{min-width:0}.chrome-actions{flex:none}.progress-track{width:100%}.stage{margin:0 auto}.stage-header{flex-shrink:0}.stage-content{flex:1 1 auto}.stage-nav{flex:0 0 auto;gap:12px}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover{color:#fff;background:${T.accent}}.lesson-root .stack{animation-duration:.5s!important}.fraction-bar button{flex:1;min-width:0;background:#fff;box-shadow:inset -2px 0 rgba(23,59,82,.25);transition:background .4s ease,transform .28s ease}.fraction-bar button:last-child{box-shadow:none}.fraction-bar button.filled{background:${T.cyan}}.fraction-bar button.filled.lime{background:${T.lime}}.compare-model>strong,.error-formula b,.error-model>b{transition:opacity .32s ease}.caption,.proof{animation:feedback-in .32s ease both}.beat-list button.beat{border:0;text-align:left;cursor:pointer}.beat-list button.beat:hover{box-shadow:inset 0 0 0 2px rgba(22,143,163,.25)}
.lesson-root button:focus-visible,.lesson-root input:focus-visible,.lesson-root input[type="range"]:focus-visible{outline:3px solid ${T.cyan};outline-offset:3px}.lesson-root .icon-btn{width:44px!important;height:44px!important}.compare-model>strong.show,.error-formula b.show,.error-model>b.show{opacity:1}@media(max-width:639.98px){.btn-white-accent,.btn-ghost{min-width:110px;padding:0 11px}}
.battery-share{gap:10px}.battery-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;color:${T.cyan};font-size:24px}.station-grid{width:100%;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;opacity:.12;transition:.4s ease}.station-grid.show,.battery-share>strong.show{opacity:1}.station-grid>div{padding:10px;border-radius:14px;display:grid;gap:7px;text-align:center;background:${T.cyanSoft}}.station-grid b{color:${T.navy};font:900 13px 'JetBrains Mono',monospace}.station-grid span{display:flex;justify-content:center;gap:3px}.station-grid i{opacity:.12;color:${T.lime};font-style:normal;transition:.35s ease}.station-grid i.assigned{opacity:1}.battery-share>strong{opacity:.12;color:${T.success};font:900 22px 'JetBrains Mono',monospace;transition:opacity .32s ease}.whole-choice{grid-template-columns:.75fr 1.25fr;align-items:end}.whole-choice>.whole-object{width:100%;height:95px;border:4px solid rgba(23,59,82,.28);border-radius:16px;display:grid;place-items:center;background:#fff;cursor:pointer;transition:.4s ease}.whole-choice>.whole-object:last-child{height:145px}.whole-choice>.whole-object.chosen{border-color:${T.accent};background:${T.accentSoft};box-shadow:0 0 0 5px rgba(255,91,53,.12)}.whole-choice span{color:${T.navy};font:900 22px 'JetBrains Mono',monospace}.three-models{grid-template-columns:1.2fr .7fr .9fr;align-items:center}.three-models .grid-model{grid-template-columns:repeat(4,1fr)!important}.three-models .grid-model i{height:38px}.model-zoom{width:100%;min-height:150px;padding:8px;border:0;border-radius:16px;display:grid;place-items:center;background:transparent;cursor:pointer;transition:transform .4s ease,background .32s ease}.model-zoom.zoomed{transform:scale(1.06);background:${T.cyanSoft}}.model-zoom .fraction-model{width:100%}
.different-wholes{grid-template-columns:.65fr 1.35fr!important;align-items:end}.different-wholes>div{width:100%;transition:max-width .4s ease}.different-wholes .small-whole{max-width:250px}.different-wholes .large-whole{max-width:520px}.different-wholes.same-size{grid-template-columns:1fr 1fr!important}.different-wholes.same-size .small-whole,.different-wholes.same-size .large-whole{max-width:380px}.equal-toggle>div{padding:8px;border-radius:15px;transition:.35s ease}.equal-toggle .model-selected{background:${T.accentSoft};box-shadow:0 0 0 3px rgba(255,91,53,.2)}.notation-active{filter:drop-shadow(0 0 8px rgba(255,91,53,.65));color:${T.accent}!important}.error-compare{gap:10px}.error-compare>.compare-model{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:16px}.error-formula{display:flex;align-items:center;justify-content:center;gap:14px}.error-formula s{color:${T.warn};font:900 22px 'JetBrains Mono',monospace}.error-formula span{color:${T.accent};font-size:24px}.error-formula b{opacity:.12;color:${T.success};font:900 22px 'JetBrains Mono',monospace;transition:opacity .32s ease}.heading .g1-char{width:76px;height:95px;flex:none;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.reward .g1-char{width:72px;height:90px}.g1-bit-ant{transform-origin:60px 28px;animation:antenna .55s ease-out 1 both}.g1-bit-wave,.bit-wave-left,.bit-wave-right,.bit-think-hand,.bit-point-arm,.bit-nod-hand{transform-origin:84px 76px;animation:think .65s ease-out 1 both}.bit-double-wave,.bit-awkward-hands,.bit-focus-hands{transform-origin:center;animation:happy .65s ease-out 1 both}.bit-idea-bulb,.bit-point-target,.bit-focus-scan,.bit-nod-check{animation:pulse .55s ease-out 1 both}
.visual-shell{display:grid;gap:9px}.visual-shell.hint-emphasis>.model-card{box-shadow:0 0 0 4px rgba(22,143,163,.28),0 18px 34px -28px rgba(${T.shadowBase},.48)}.model-hint{padding:10px 13px;border-radius:13px;color:${T.navy};background:${T.cyanSoft};font-size:12px;font-weight:850;animation:feedback-in .32s ease both}.optional-lab{padding:10px 12px;border-radius:16px;display:grid;gap:8px;background:rgba(255,255,255,.88);box-shadow:0 12px 25px -23px rgba(${T.shadowBase},.5)}.mini-options{display:flex;flex-wrap:wrap;justify-content:center;gap:7px}.mini-options button,.mini-action{min-height:44px;padding:8px 12px;border:0;border-radius:12px;color:${T.navy};background:${T.cyanSoft};cursor:pointer;font-size:12px;font-weight:850}.mini-options button.active,.mini-action.active{color:#fff;background:${T.cyan}}.count-options{display:grid;grid-template-columns:repeat(8,1fr)}.range-lab{display:grid;grid-template-columns:auto minmax(120px,1fr) 54px;align-items:center;gap:10px;color:${T.ink2};font-size:12px;font-weight:850}.range-lab input{width:100%;accent-color:${T.accent}}.range-lab output{color:${T.navy};font:900 14px 'JetBrains Mono',monospace}.fraction-bar button{padding:0;border:0;cursor:pointer}.fraction-bar button.segment-active{box-shadow:inset 0 0 0 4px ${T.accent}!important}.half-model.half-marked .fraction-bar{box-shadow:0 0 0 4px rgba(255,91,53,.22)}
.stage-hook .model-card{position:relative;isolation:isolate;overflow:hidden;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
@media(max-width:639.98px){.stage-hook .model-card{border-radius:18px}}
@media(max-width:639.98px){.different-wholes,.whole-choice,.three-models{grid-template-columns:1fr!important}.whole-choice>.whole-object,.whole-choice>.whole-object:last-child{height:70px}.station-grid{grid-template-columns:repeat(2,1fr)}.error-compare>.compare-model{grid-template-columns:1fr}.heading .g1-char{width:62px;height:78px}.range-lab{grid-template-columns:1fr 55px}.range-lab span{grid-column:1/-1}.count-options{grid-template-columns:repeat(4,1fr)}}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root p{margin:0}.lesson-root button{font:inherit}.lesson-root{position:fixed;inset:0;width:100%;height:100dvh;overflow:hidden;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif;zoom:var(--g4z,1)}.stage{width:min(936px,100%);height:100%;margin:auto;display:flex;flex-direction:column;overflow:hidden}.stage-header{flex:none;padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px);z-index:5}.progress-track{height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome,.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center}.stage-chrome{justify-content:space-between;gap:12px}.chrome-title,.chrome-actions,.audio-controls{gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font:700 12px 'JetBrains Mono',monospace}.icon-btn{width:36px;height:36px;border:0;border-radius:10px;background:#fff;cursor:pointer}.stage-content{flex:1;min-height:0;padding-top:10px;padding-bottom:8px;overflow:hidden;display:flex;flex-direction:column;gap:6px}.stage-nav{flex:none;min-height:72px;display:flex;align-items:center;justify-content:space-between;background:rgba(245,245,240,.95)}.btn-primary,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-primary{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-primary:hover{color:#fff;background:${T.accent}}.btn-ghost{color:${T.ink2};background:transparent}.btn-white-accent:disabled,.btn-ghost:disabled{cursor:not-allowed;opacity:.48;filter:saturate(.45)}.stack{flex:1;min-height:0;max-height:100%;overflow:hidden;display:grid;align-content:center;gap:9px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:74px;display:flex;align-items:center;justify-content:space-between;gap:14px}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(24px,4vw,36px)/1.06 'Source Serif 4',Georgia,serif}.heading .bit{width:76px;height:95px;flex:none;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.model-card,.question,.beat-list,.reward{padding:16px;border-radius:21px;background:rgba(255,255,255,.92);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.model-card{min-height:190px;display:grid;place-items:center;gap:16px}.fraction-model{width:min(520px,92%);display:grid;gap:9px;text-align:center}.fraction-model>b{color:${T.navy};font:900 20px 'JetBrains Mono',monospace}.fraction-bar{height:78px;display:flex;border:4px solid ${T.navy};border-radius:13px;overflow:hidden;background:#fff}.fraction-bar i{flex:1;min-width:0;background:#fff;box-shadow:inset -2px 0 rgba(23,59,82,.25);transition:background .45s ease,transform .28s ease}.fraction-bar i:last-child{box-shadow:none}.fraction-bar i.filled{background:${T.cyan}}.fraction-bar i.filled.lime{background:${T.lime}}.fraction-bar i:active{transform:scale(.92)}.fraction-bar.unequal i{flex-basis:0}.model-pair{grid-template-columns:1fr 40px 1fr}.model-pair>span{color:${T.accent};font:900 28px 'JetBrains Mono',monospace}.fraction-circle{width:150px;height:150px}.fraction-circle path{fill:#fff;stroke:${T.navy};stroke-width:1.8;transition:fill .45s ease}.fraction-circle path.filled{fill:${T.lime}}.notation{grid-template-columns:1.2fr .8fr}.notation>div:last-child{display:grid;justify-items:center}.notation>div:last-child>b{font:900 34px 'JetBrains Mono',monospace}.notation>div:last-child>span{width:70px;height:4px;background:${T.navy}}.notation small{margin-top:8px;color:${T.ink2};font-size:11px}.number-line-svg{width:min(680px,100%);height:120px;overflow:visible}.number-line-svg .axis,.number-line-svg .tick{stroke:${T.navy};stroke-width:4;stroke-linecap:round}.number-line-svg .tick{stroke-width:2}.number-line-svg text{fill:${T.navy};font:900 14px 'JetBrains Mono',monospace}.number-line-svg .marker{opacity:.12;transition:.4s ease}.number-line-svg .marker.on{opacity:1}.number-line-svg .marker circle{fill:${T.accent}}.number-line-svg .marker text{fill:${T.accent}}.grid-model{width:min(520px,92%);display:grid;gap:6px}.grid-model i{height:52px;border-radius:10px;background:#F1F3F1;box-shadow:inset 0 0 0 2px rgba(23,59,82,.15);transition:.4s ease}.grid-model i.filled{background:${T.cyanSoft};box-shadow:inset 0 0 0 3px ${T.cyan}}.triple-model{grid-template-columns:1fr 1fr;align-items:center}.triple-model .number-line-svg{grid-column:1/-1;height:92px}.choice-models{grid-template-columns:repeat(3,1fr)}.choice-models .fraction-bar{height:54px}.loose-shapes{display:flex;justify-content:center;gap:7px}.loose-shapes i{width:42px;height:42px;border-radius:50%;background:${T.lime}}.error-model{grid-template-columns:1fr auto auto auto;align-items:center}.error-model s{color:${T.warn};font:900 24px 'JetBrains Mono',monospace}.error-model>span{color:${T.accent};font-size:25px}.error-model>b{opacity:.12;color:${T.success};font:900 24px 'JetBrains Mono',monospace}.compare-model{grid-template-columns:1fr 1fr;position:relative}.compare-model>strong{grid-column:1/-1;opacity:.12;color:${T.success};font:900 23px 'JetBrains Mono',monospace}.half-model .fraction-bar{background:linear-gradient(90deg,#fff 0 49.2%,rgba(255,91,53,.35) 49.2% 50.8%,#fff 50.8%)}.summary-model{grid-template-columns:1fr 1fr}.summary-model .number-line-svg{height:92px}.beat-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px}.beat{min-height:54px;padding:9px;border-radius:13px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;opacity:.12;transform:translateY(6px);background:#F8F8F4;transition:.4s ease}.beat.show{opacity:1;transform:none;background:${T.cyanSoft}}.beat>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 10px 'JetBrains Mono',monospace}.beat span{font-size:12px;font-weight:800;line-height:1.3}.question{display:grid;gap:12px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.option{min-height:58px;padding:10px;border:0;border-radius:15px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{transform:translateY(-2px);background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:28px 1fr;gap:9px;animation:feedback-in .3s ease both}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback p{font-size:13px;line-height:1.45}.proof{padding:12px;border-radius:14px;color:${T.success};background:${T.successSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace;animation:feedback-in .35s ease both}.caption-slot{flex:none;min-height:42px;padding:7px 12px;border-radius:13px;display:flex;align-items:center;visibility:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:11px;line-height:1.3}.caption-slot.is-visible{visibility:visible}.reward{display:grid;grid-template-columns:90px 1fr;align-items:center;color:#fff;background:${T.navy}}.reward .bit{width:72px;height:90px}.reward small,.reward span{display:block;color:#9DE3E7}.reward strong{font:900 25px 'JetBrains Mono',monospace}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:#fff}.preview-language button{padding:5px 10px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language button.active{color:#fff;background:${T.accent}}.bit-ant{transform-origin:60px 28px;animation:antenna 2.1s ease-in-out 1 both}.bit-hand{transform-origin:84px 76px;animation:think 1.7s ease-in-out 1 both}.bit-spark{animation:pulse 1.35s ease-in-out 1 both}@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes feedback-in{from{opacity:0;transform:translateY(7px)}}@keyframes antenna{50%{transform:rotate(5deg)}}@keyframes think{50%{transform:rotate(-5deg) translateY(-2px)}}@keyframes pulse{to{transform:scale(1.08)}}
@media(max-width:639.98px){.stage{width:min(390px,100%)}.stage-header{padding-top:58px}.screen-type{display:none}.heading{min-height:66px}.heading h1{font-size:25px}.heading .bit{width:62px;height:78px}.model-card,.question,.beat-list,.reward{padding:12px;border-radius:17px}.model-card{min-height:155px}.model-pair,.notation,.triple-model,.summary-model{grid-template-columns:1fr}.model-pair>span{transform:rotate(90deg)}.fraction-bar{height:60px}.fraction-circle{width:112px;height:112px}.triple-model .number-line-svg{grid-column:auto}.choice-models{grid-template-columns:1fr}.beat-list{grid-template-columns:1fr 1fr}.options{grid-template-columns:1fr}.option{min-height:50px}.stage-nav{min-height:68px}.btn-primary,.btn-ghost{min-width:110px;padding:0 11px}.error-model{grid-template-columns:1fr auto auto}.error-model .fraction-model{grid-column:1/-1}.compare-model{grid-template-columns:1fr}.compare-model>strong{grid-column:1}.number-line-svg{height:95px}.grid-model i{height:40px}}
.g4-title-claim{width:100%;min-height:116px;padding:15px 22px;border:0;border-radius:18px;display:grid;grid-template-columns:48px 1fr;grid-template-rows:auto auto;align-items:center;column-gap:13px;color:#fff;background:linear-gradient(135deg,#0E6978,#173B52);cursor:pointer;text-align:left;box-shadow:0 22px 42px -25px rgba(14,105,120,.9)}.g4-title-claim>span{grid-row:1/3;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);font-size:21px}.g4-title-claim>strong{font:750 18px 'Source Serif 4',Georgia,serif}.g4-title-claim>small{color:#A8EAF0;font-size:12px;font-weight:800}.g4-title-claim:hover{transform:translateY(-2px);box-shadow:0 25px 48px -24px rgba(14,105,120,1)}
.feedback{min-height:76px!important;padding:11px 15px 11px 10px!important;grid-template-columns:52px 1fr!important;align-items:center!important;gap:11px!important}.feedback.correct{background:linear-gradient(135deg,#DDF2E6,#F7FFF9)!important;box-shadow:inset 5px 0 ${T.success},0 13px 26px -23px rgba(34,122,83,.75)!important}.feedback.wrong{background:linear-gradient(135deg,#FFF0BE,#FFF9E8)!important;box-shadow:inset 5px 0 ${T.warn},0 13px 26px -23px rgba(169,111,19,.72)!important}.feedback-bit{width:50px;height:62px;display:block;overflow:visible}.feedback-bit .g1-char,.feedback-bit .bit,.feedback-bit>svg{width:100%;height:100%}.feedback p{display:grid;gap:7px;font-size:15px!important;line-height:1.48!important}.feedback-proof{padding-top:7px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 15px/1.35 'JetBrains Mono',monospace}
.choice-models{grid-template-columns:1fr!important;gap:11px!important}.model-answer{width:100%;min-height:104px;padding:12px 14px;border:0;border-radius:17px;display:grid;grid-template-columns:34px minmax(150px,.85fr) minmax(250px,1.15fr);align-items:center;gap:12px;color:${T.ink};background:#F8F8F4;cursor:pointer;text-align:left;transition:.32s ease}.model-answer>b{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 12px 'JetBrains Mono',monospace}.model-answer>span{font-size:14px;font-weight:850}.model-answer .fraction-model{width:100%}.model-answer.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 3px rgba(255,91,53,.25)}.model-answer.right{background:${T.successSoft};box-shadow:inset 0 0 0 3px rgba(34,122,83,.3)}.model-answer.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 3px rgba(169,111,19,.26)}.model-answer:disabled{cursor:default}.number-line-choice .marker{cursor:pointer}.number-line-choice .marker:focus-visible{outline:3px solid ${T.cyan};outline-offset:4px}.number-line-choice .marker.answer-picked circle{fill:${T.warn}}.number-line-choice .marker.answer-right circle{fill:${T.success}}.number-line-choice .marker.answer-bad circle{fill:${T.warn}}
.number-line-wrap{width:min(680px,100%);height:120px;position:relative}.number-line-wrap .number-line-svg{width:100%;height:100%}.number-line-hit-targets{position:absolute;inset:0;pointer-events:none}.number-line-marker-action{width:44px;height:44px;position:absolute;top:50%;padding:0;border:0;border-radius:50%;transform:translate(-50%,-50%);background:transparent;cursor:pointer;pointer-events:auto}.number-line-marker-action:disabled{cursor:default}.number-line-marker-action:focus-visible{outline:3px solid ${T.cyan};outline-offset:3px}
@media(max-width:639.98px){.g4-title-claim{min-height:88px;grid-template-columns:40px 1fr;padding:10px 13px}.g4-title-claim>span{width:38px;height:38px}.model-answer{min-height:132px;grid-template-columns:32px 1fr}.model-answer>.fraction-model,.model-answer>.loose-shapes{grid-column:1/-1}.feedback{grid-template-columns:44px 1fr!important}.feedback-bit{width:43px;height:54px}.feedback p{font-size:14px!important}}
.visual-shell.is-locked{pointer-events:none;opacity:.68}.feedback.feedback-slot{height:76px;min-height:76px!important;overflow:hidden;visibility:hidden;opacity:0;animation:none}.feedback.feedback-slot.open{visibility:visible;opacity:1;animation:feedback-in .3s ease both}.feedback-proof small{display:block;margin-bottom:3px;font:900 9px/1.1 'JetBrains Mono',monospace;letter-spacing:.12em}.g4-title-claim:disabled{cursor:not-allowed;opacity:.48;transform:none;box-shadow:none}.final-reflection{padding:9px 11px;border-radius:16px;display:grid;gap:7px;background:rgba(255,255,255,.9);box-shadow:0 12px 25px -23px rgba(${T.shadowBase},.5)}.final-reflection>strong{font:750 14px/1.2 'Source Serif 4',Georgia,serif}.final-reflection>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.final-reflection button{min-height:44px;padding:6px;border:0;border-radius:12px;display:grid;grid-template-columns:24px 1fr;align-items:center;gap:5px;color:${T.navy};background:${T.cyanSoft};cursor:pointer;text-align:left;font-size:10px;font-weight:850}.final-reflection button>span{width:23px;height:23px;border-radius:8px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 9px 'JetBrains Mono',monospace}.final-reflection button.is-selected{color:#fff;background:${T.cyan}}.final-reflection button:disabled{cursor:default}
@media(max-width:639.98px){.lesson-root{width:390px}.stage{width:390px}.stage-header{padding-top:8px;padding-bottom:5px}.lesson-root-preview .stage-header{padding-top:52px}.progress-track{height:4px;margin-bottom:5px}.stage-chrome{gap:5px}.chrome-title{font-size:8px}.chrome-actions,.audio-controls{gap:4px}.icon-btn{width:32px;height:32px}.stage-content{padding-top:3px;padding-bottom:3px;gap:3px}.caption-slot{min-height:30px;padding:4px 8px;border-radius:9px;font-size:9px;line-height:1.16}.stage-nav{min-height:56px}.btn-primary,.btn-ghost{min-width:106px;min-height:44px;padding:0 9px;border-radius:12px;font-size:12px}.stack{gap:4px}.heading{min-height:42px;gap:6px}.heading>div>span{font-size:8px}.heading h1{margin-top:1px!important;font-size:18px;line-height:1.02}.heading .bit,.heading .g1-char{width:42px;height:52px}.model-card,.question,.beat-list,.reward,.optional-lab{padding:6px;border-radius:12px}.model-card{min-height:88px;max-height:116px;gap:4px}.fraction-model{gap:3px}.fraction-model>b{font-size:13px}.fraction-bar{height:40px;border-width:3px;border-radius:9px}.fraction-circle{width:82px;height:82px}.number-line-svg,.triple-model .number-line-svg,.summary-model .number-line-svg{height:64px}.grid-model{gap:3px}.grid-model i,.three-models .grid-model i{height:25px;border-radius:6px}.model-pair,.notation,.triple-model,.summary-model{grid-template-columns:1fr 28px 1fr}.model-pair>span{transform:none;font-size:17px}.notation>div:last-child>b{font-size:22px}.notation>div:last-child>span{width:45px;height:3px}.notation small{margin-top:3px;font-size:8px}.three-models,.different-wholes,.whole-choice{grid-template-columns:repeat(3,minmax(0,1fr))!important}.different-wholes{grid-template-columns:1fr 1fr!important}.whole-choice{grid-template-columns:1fr 1fr!important}.whole-choice>.whole-object,.whole-choice>.whole-object:last-child{height:52px}.beat-list{grid-template-columns:repeat(2,minmax(0,1fr));gap:3px}.beat{min-height:32px;padding:3px;border-radius:8px;grid-template-columns:19px 1fr;gap:3px}.beat>b{width:19px;height:19px;border-radius:6px;font-size:7px}.beat span{font-size:9px;line-height:1.12}.question{gap:4px}.question h2{font-size:13px;line-height:1.12}.options{grid-template-columns:1fr;gap:3px}.option{min-height:44px;padding:4px;border-radius:10px;grid-template-columns:24px 1fr;gap:4px;font-size:10px}.option>b{width:23px;height:23px;border-radius:7px;font-size:8px}.feedback.feedback-slot{height:56px;min-height:56px!important;padding:5px 7px!important;grid-template-columns:34px 1fr!important;gap:5px!important}.feedback-bit{width:33px;height:41px}.feedback p{gap:2px;font-size:9px!important;line-height:1.18!important}.feedback-proof{padding-top:2px;font-size:9px;line-height:1.12}.optional-lab{gap:4px}.mini-options{gap:3px}.mini-options button,.mini-action{min-height:44px;padding:4px 7px;border-radius:9px;font-size:9px}.range-lab{grid-template-columns:1fr 44px;gap:4px;font-size:9px}.range-lab span{grid-column:1/-1}.range-lab output{font-size:10px}.choice-models{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:3px!important}.model-answer{min-height:92px;padding:4px;border-radius:10px;grid-template-columns:22px 1fr;gap:3px}.model-answer>b{width:21px;height:21px;border-radius:6px;font-size:8px}.model-answer>span{font-size:8px}.model-answer>.fraction-model,.model-answer>.loose-shapes{grid-column:1/-1}.model-answer .fraction-bar{height:27px;border-width:2px}.loose-shapes{gap:2px}.loose-shapes i{width:22px;height:22px}.model-hint{padding:4px 6px;border-radius:8px;font-size:9px}.station-grid{grid-template-columns:repeat(4,1fr);gap:3px}.station-grid>div{padding:3px;border-radius:7px;gap:2px}.station-grid b{font-size:8px}.battery-bank{gap:2px;font-size:14px}.battery-share>strong{font-size:14px}.error-formula{gap:5px}.error-formula s,.error-formula b{font-size:14px}.error-formula span{font-size:15px}.final-reflection{padding:5px 6px;border-radius:11px;gap:4px}.final-reflection>strong{font-size:11px}.final-reflection>div{gap:3px}.final-reflection button{min-height:44px;padding:3px;border-radius:8px;grid-template-columns:18px 1fr;gap:2px;font-size:8px}.final-reflection button>span{width:18px;height:18px;border-radius:5px;font-size:7px}.g4-title-claim{min-height:68px;padding:6px 9px;grid-template-columns:32px 1fr;column-gap:7px}.g4-title-claim>span{width:31px;height:31px;font-size:14px}.g4-title-claim>strong{font-size:13px}.g4-title-claim>small{font-size:8px}.g4-title-card-placeholder,.g4-title-card{min-height:68px}.g4-title-card{padding:6px 46px 5px 40px}.g4-title-card-medal{left:6px;width:29px;height:29px}.g4-title-card-bit{width:44px;height:55px}.g4-title-card-title{font-size:11px}.g4-title-card-kicker,.g4-title-card-score span{font-size:7px}.g4-title-card-score{margin-top:2px;padding:3px 5px}}
@media(max-width:639.98px) and (max-height:700px){.stage-header{padding-top:5px}.lesson-root-preview .stage-header{padding-top:46px}.stage-nav{min-height:50px}.caption-slot{min-height:27px}.stack{gap:3px}.heading{min-height:38px}.heading h1{font-size:16px}.heading .bit,.heading .g1-char{width:36px;height:45px}.model-card{min-height:78px;max-height:100px}.fraction-circle{width:70px;height:70px}.number-line-svg,.triple-model .number-line-svg,.summary-model .number-line-svg{height:56px}.feedback.feedback-slot{height:52px;min-height:52px!important}.beat{min-height:29px}.g4-title-claim,.g4-title-card-placeholder,.g4-title-card{min-height:62px}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}.beat,.marker,.compare-model>strong,.error-model>b{opacity:1!important;transform:none!important}}
`;
