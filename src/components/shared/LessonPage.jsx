import { Suspense } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './LessonPage.css'

// Darsning ovozi qaysi TTS bazasidan kelishini hal qiladi.
// Boshqaruv `VITE_TTS_BASE` da (Vercel loyiha sozlamalari yoki .env.local):
//   yo'q / bo'sh  -> hech narsa o'zgarmaydi, dars brauzer Web Speech ini o'qiydi
//   self | on | 1 -> shu saytning o'zi, ya'ni /api/tts (Fish Audio funksiyasi)
//   to'liq URL    -> tashqi TTS bazasi
// URL dagi `?tts=` shu qiymatni bosib o'tadi, `?tts=off` — ovozni butunlay
// o'chiradi. Shunday qilib kalit qo'yilmagan holatda sayt bugungi holida qoladi:
// jimjitlik emas, o'sha zaxira ovoz.
function resolveTtsBase(param) {
  const raw = param == null ? import.meta.env.VITE_TTS_BASE : param
  const value = String(raw || '').trim()
  if (!value || value === 'off' || value === 'false' || value === '0') return undefined
  if (value === 'self' || value === 'on' || value === '1') {
    return typeof window === 'undefined' ? undefined : window.location.origin
  }
  return value.replace(/\/+$/, '')
}

function LessonPage({ lesson, gradeId, subjectId, sectionId }) {
  const { Component } = lesson
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const supportsThreeLanguages = gradeId === '7-sinf' || gradeId === '8-sinf'
  // Informatika darslari yangi sxemada yig'ilgan: yakunda platformaga onFinished
  // yuboriladi. Uni qabul qilmasak, «Darsni yakunlash» tugmasi hech narsa
  // qilmaydi — o'quvchi oxirgi ekranda qolib ketadi. Boshqa fanlarga tegmaydi:
  // eski monolit darslar bu propni boshqacha tushunadi.
  const closesItself = subjectId === 'informatika'
  const requestedLang = searchParams.get('lang')
  const previewLang = ['uz', 'ru', 'en'].includes(requestedLang) ? requestedLang : 'uz'

  // Darsdan chiqqanda aynan shu bo'lim (sinf+fan+bo'lim) darslar ro'yxatiga qaytamiz,
  // eng yuqoridagi "Fanni tanlang" ga emas.
  const backTo =
    gradeId && subjectId && sectionId
      ? `/?subject=${subjectId}&grade=${gradeId}&section=${sectionId}`
      : '/'

  // 6-sinf darslari `lang` va `ttsApiBase` proplarini platformadan oladi.
  // Previewda ular berilmasa, dars o'zining ichki holatiga tushib qolardi:
  // til doim `uz` bo'lib qolar va HTTP TTS yo'li umuman ishga tushmasdi
  // (brauzer Web Speech zaxirasi o'qirdi). Shu sababli LMS dagi talaffuz
  // muammosini previewda ko'rish ham, tekshirish ham imkonsiz edi.
  // `?lang=ru|uz` — tilni majburlash, `?tts=<baza>` — HTTP TTS ni yoqish.
  // Endi ovoz bazasi BARCHA fan va sinflarga uzatiladi, faqat 6-sinfga emas:
  // `/api/tts` bu loyihaning o'zida turadi va 140 darsning hammasi shu bitta
  // kontraktni (v5.2) chaqiradi.
  const ttsApiBase = resolveTtsBase(searchParams.get('tts'))
  const ttsProps = ttsApiBase ? { ttsApiBase } : {}
  const isGrade6Math = gradeId === '6-sinf' && subjectId === 'matematika'

  const previewProps = supportsThreeLanguages
    ? {
        studentName: searchParams.get('student') || 'Aziza',
        lang: previewLang,
        ...ttsProps,
        onFinished: (payload) => console.log('[Lesson preview] onFinished', payload),
      }
    : isGrade6Math
      ? {
          ...(requestedLang === 'ru' || requestedLang === 'uz' ? { lang: requestedLang } : {}),
          ...ttsProps,
          onFinished: (payload) => console.log('[Lesson preview] onFinished', payload),
        }
      : closesItself
        ? { ...ttsProps, onFinished: () => navigate(backTo) }
        : ttsProps

  return (
    <div className="lesson-page">
      <Link to={backTo} className="lesson-back">← Darslar ro'yxati</Link>
      {supportsThreeLanguages && (
        <div className="lesson-language" aria-label="Preview language">
          {['uz', 'ru', 'en'].map((code) => (
            <button
              type="button"
              key={code}
              className={previewLang === code ? 'is-active' : ''}
              onClick={() => {
                const next = new URLSearchParams(searchParams)
                next.set('lang', code)
                setSearchParams(next, { replace: true })
              }}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      <div className="lesson-frame">
        <Suspense fallback={<div className="lesson-loading">Yuklanmoqda…</div>}>
          <Component {...previewProps} />
        </Suspense>
      </div>
    </div>
  )
}

export default LessonPage
