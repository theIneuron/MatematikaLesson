// ============================================================================
// PRIBOR 6C, 10-sinf: FAZOVIY KARKAS. B8 bloki, 50-55 darslar (koordinatalar,
// vektorlar, amallar, skalyar ko'paytma, tekislik tenglamasi, DTM).
//
// ASBOB QAYTA YOZILMAYDI. U allaqachon bor -- 11-sinfning `SpaceFrame` i, B5
// bloki uchun yozilgan va yetti darsda ishlagan. Uning o'nta rejimi B8 ning
// satrlari bilan bir-biriga to'g'ri keladi. Loyihaning qoidasi: umumiy kod
// nusxalanmaydi, import qilinadi (CLAUDE.md §5); 9-sinf 8-sinfning qatlamini
// shunday oladi.
//
// LEKIN TIL O'Z-O'ZIDAN KELMAYDI, va bu shu faylning butun sababi.
// `SpaceFrame` o'z yozuvlarini («masofa», «qiya», «javob») 11-sinfning
// LangContext idan oladi. 10-sinfning darsi esa O'ZINING kontekstini
// to'ldiradi, 11-sinfning kontekstiga esa hech kim tegmaydi -- natijada
// o'zbekcha darsda «расстояние» chiqadi. Bu stendda o'lchab ko'rilgan
// (2026-08-21): 10-sinf tili `uz` bo'lganda asbob ruscha yozgan.
//
// Shuning uchun asbob 11-sinfning provayderiga o'raladi, va unga 10-sinfning
// tili beriladi. O'ram BIR MARTA yoziladi -- har darsda takrorlash aynan
// o'sha xatoni qaytarish bo'lardi.
//
// 11-SINFNING FAYLLARIGA TEGILMAYDI. Asbobni umumiy modulga chiqarish
// toza'roq bo'lardi, lekin u yerda yetti ishlayotgan dars turadi, va 11-sinf
// hozir parallel sessiyaning ishi -- uning 79 fayli steshda yotadi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useLayoutEffect, useRef, useState } from 'react'
import { LangProvider as G11Lang } from '../grade11/core.jsx'
import { SpaceFrame } from '../grade11/tools.jsx'
import { useLang } from './core.jsx'

// RAKURS NOMI ham moslanadi. 10-sinfning `SpinScene` mexanikasi sahnaga `yaw`
// beradi (`React.cloneElement(scene, { yaw })`), 11-sinfning asbobi esa
// boshlang'ich rakursni `yaw0` deb ataydi. Nomlarni moslamasak, burish tugmasi
// bosiladi, savol ochiladi -- va chizma JOYIDA turadi, ya'ni ekran o'quvchiga
// yolg'on gapiradi (etalon: savol burilgan sahna haqida).
// BALANDLIK ham moslanadi, va bu ikkinchi tuzoq. 10-sinfning `Scene` si
// figuraga QUTINING o'lchamini `size` bilan beradi va o'zining figuralari shu
// bo'yicha kichrayadi. 11-sinfning asbobi esa `size` ni bilmaydi, u `height`
// bilan ishlaydi -- natijada telefonda (393 px, past ekran) quti `--g10-fig`
// bilan qisqaradi, chizma esa qisqarmaydi va qutidan o'n sakkiz piksel chiqib
// KESILADI. Qo'l bilan o'tish shu sakkiz ekranda buni ushladi (2026-08-21).
//
// Shuning uchun quti bo'lsa, balandlik UNDAN hisoblanadi. Yigirma olti piksel
// asbob rasm OSTIGA yozadigan qiymat satriga qoldiriladi (uzunlik, masofa,
// burchak): u ham qutining ichida turishi kerak.
// UCHINCHI TUZOQ, va u eng yashiringani. Asbobning `svg` i `width="100%"` bilan
// chiziladi, ya'ni u O'ZI o'lchamini bilmaydi va ota-elementdan oladi.
// 11-sinfda uni aniq kengligi bor blok o'raydi. 10-sinfning `Scene` si esa
// figurani flex markazlagichga soladi, va u yerda `width: 100%` hech narsaga
// tayanmaydi: brauzer `svg` ning STANDART o'lchamini oladi -- 300 piksel.
// Natijada chizma o'z qutisidan (732 px) ikki barobar kichik chiqadi, va u
// bilan birga hamma yozuv ham: viewBox 430 da 300 ga siqilib, o'n uch birlik
// to'qqiz pikselga aylanadi -- 10,5 piksellik poldan past (o'lchangan,
// 2026-08-21). Shuning uchun o'ram ANIQ kenglik beradi.
export function Space3D({ yaw, size, height, ...rest }) {
  const lang = useLang()
  const hostRef = useRef(null)
  const tries = useRef(0)
  const [fit, setFit] = useState(null)
  // KENGLIK qutidan to'liq olinadi, `size` dan emas. `Scene` beradigan `size`
  // KVADRATNING tomoni (`min(kenglik, balandlik)`), va 10-sinfning figuralari
  // kvadrat -- bu asbob esa emas. 2-ekranda tomon 158 chiqib, asbobning eng
  // kichik kengligi 190 ga urilardi, va masshtab 0,83 da qotib qolardi.
  // Balandlik esa tomondan olinadi: u qutidan chiqmasligi kerak.
  const side = size ? Math.round(size) : null
  const base = side ? Math.max(96, side - 26) : (height || 176)
  const h = fit || base

  // TO'RTINCHI TUZOQ, va uni faqat o'lchov ko'rsatadi. Asbobning yozuvlari
  // BIRLIKDA berilgan (11, 11,5, 13), va ular ekranda birlikni masshtabga
  // ko'paytirib chiqadi. Masshtab esa `viewBox` ning kengligi bilan berilgan
  // kenglikning nisbati. 11-sinfda slot keng va masshtab birga teng, 10-sinfda
  // esa tor slotlarda 0,83 chiqadi -- va o'n bir birlik to'qqiz pikselga
  // aylanadi, ya'ni 10,5 piksellik poldan past tushadi. Bu «koeffitsiyent polni
  // teshadi» grablisining aynan o'zi, faqat boshqa qatlamda.
  //
  // Yechim: balandlikni MOSLASH. Balandlik kamaysa, asbob `viewBox` ni ham
  // kichraytiradi, masshtab birga yaqinlashadi va yozuv o'sadi -- chizma
  // kichrayadi, matn esa o'qiladigan bo'ladi. Ikki qadamdan ko'p emas: birinchi
  // moslashdan keyin nisbat allaqachon birga yaqin.
  useLayoutEffect(() => {
    const el = hostRef.current
    if (!el || tries.current >= 3) return
    // Masshtab MATRITSADAN o'qiladi, kenglikdan taxmin qilinmaydi:
    // `preserveAspectRatio` `svg` ni ham kenglik, ham balandlik bo'yicha
    // cheklaydi, va qaysi biri kichigi ekanini faqat matritsa aytadi.
    // Kenglikdan hisoblash 2-ekranda yolg'on javob bergan edi.
    const svg = el.querySelector('svg')
    const m = svg && svg.getScreenCTM && svg.getScreenCTM()
    // POL BIRGA YAQIN bo'lishi kerak, 0,98 ga emas: asbobning eng kichik
    // yozuvi 11 birlik, pol 10,5 piksel, ya'ni masshtab 0,955 dan past
    // bo'lmasligi kerak. 0,98 da to'xtaganda 10,47 chiqib, pol teshilardi --
    // arzimagan ikki yuzdan, lekin tekshiruv haq.
    if (!m || !m.a || m.a >= 0.995) return
    const next = Math.max(96, Math.floor(h * m.a) - 3)
    if (Math.abs(next - h) <= 2) return
    tries.current += 1
    setFit(next)
  })

  return (
    <G11Lang value={lang}>
      <div ref={hostRef} style={{ width: '100%', maxWidth: '100%' }}>
        <SpaceFrame
          {...rest}
          height={h}
          yaw0={yaw === undefined ? rest.yaw0 : yaw}
        />
      </div>
    </G11Lang>
  )
}
