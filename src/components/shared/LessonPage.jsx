import { Suspense } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './LessonPage.css'

function LessonPage({ lesson, gradeId, subjectId, sectionId }) {
  const { Component } = lesson
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const supportsThreeLanguages =
    gradeId === '7-sinf' || gradeId === '8-sinf' || gradeId === '9-sinf' ||
    gradeId === '10-sinf' || gradeId === '11-sinf'
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
  const ttsApiBase = searchParams.get('tts') || undefined
  const isGrade6Math = gradeId === '6-sinf' && subjectId === 'matematika'

  const previewProps = supportsThreeLanguages
    ? {
        studentName: searchParams.get('student') || 'Aziza',
        lang: previewLang,
        // `?tts=<baza>` — HTTP TTS yo'lini previewda yoqish. Bo'lmasa dars
        // brauzer Web Speech zaxirasiga tushadi (faqat preview uchun).
        ...(ttsApiBase ? { ttsApiBase } : {}),
        onFinished: (payload) => console.log('[Lesson preview] onFinished', payload),
      }
    : isGrade6Math
      ? {
          ...(requestedLang === 'ru' || requestedLang === 'uz' ? { lang: requestedLang } : {}),
          ...(ttsApiBase ? { ttsApiBase } : {}),
          onFinished: (payload) => console.log('[Lesson preview] onFinished', payload),
        }
      : closesItself
        ? { onFinished: () => navigate(backTo) }
        : {}

  return (
    <div className="lesson-page">
      <Link to={backTo} className="lesson-back">← Darslar ro'yxati</Link>
      {supportsThreeLanguages && !lesson.ownLangSwitch && (
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
