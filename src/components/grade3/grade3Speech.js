const SPEECH_WORDS = Object.freeze({
  uz: {
    multiply: " ko'paytirish ",
    divide: " bo'lish ",
    plus: " qo'shuv ",
    minus: ' ayiruv ',
    variable: ' iks ',
    equal: ' teng ',
    greater: ' katta ',
    less: ' kichik ',
    greaterEqual: ' katta yoki teng ',
    lessEqual: ' kichik yoki teng ',
    square: ' kvadrat ',
    centimeter: ' santimetr ',
    decimeter: ' detsimetr ',
    millimeter: ' millimetr ',
    kilometer: ' kilometr ',
    meter: ' metr ',
    gram: ' gramm ',
    kilogram: ' kilogramm ',
    tonne: ' tonna ',
    liter: ' litr ',
    milliliter: ' millilitr ',
    second: ' soniya ',
    minute: ' minut ',
    hour: ' soat ',
    percent: ' foiz ',
    degree: ' gradus ',
  },
  ru: {
    multiply: ' умножить на ',
    divide: ' разделить на ',
    plus: ' плюс ',
    minus: ' минус ',
    variable: ' икс ',
    equal: ' равно ',
    greater: ' больше ',
    less: ' меньше ',
    greaterEqual: ' больше или равно ',
    lessEqual: ' меньше или равно ',
    square: ' квадратных ',
    centimeter: ' сантиметров ',
    decimeter: ' дециметров ',
    millimeter: ' миллиметров ',
    kilometer: ' километров ',
    meter: ' метров ',
    gram: ' граммов ',
    kilogram: ' килограммов ',
    tonne: ' тонн ',
    liter: ' литров ',
    milliliter: ' миллилитров ',
    second: ' секунд ',
    minute: ' минут ',
    hour: ' часов ',
    percent: ' процентов ',
    degree: ' градусов ',
  },
})

export function toGrade3SpeechText(value, language = 'uz') {
  const lang = language === 'ru' ? 'ru' : 'uz'
  const words = SPEECH_WORDS[lang]
  const fraction = lang === 'ru'
    ? (numerator, denominator) => ` дробь с числителем ${numerator} и знаменателем ${denominator} `
    : (numerator, denominator) => ` surati ${numerator}, maxraji ${denominator} bo'lgan kasr `
  const clockTime = lang === 'ru'
    ? (hours, minutes) => ` ${Number(hours)} часов ${Number(minutes)} минут `
    : (hours, minutes) => ` ${Number(hours)} soat ${Number(minutes)} minut `

  return String(value ?? '')
    .replace(/(?<![\p{L}])(?:cm²|см²)(?![\p{L}])/giu, `${words.square}${words.centimeter}`)
    .replace(/(?<![\p{L}])(?:dm²|дм²)(?![\p{L}])/giu, `${words.square}${words.decimeter}`)
    .replace(/(?<![\p{L}])(?:mm²|мм²)(?![\p{L}])/giu, `${words.square}${words.millimeter}`)
    .replace(/(?<![\p{L}])(?:km²|км²)(?![\p{L}])/giu, `${words.square}${words.kilometer}`)
    .replace(/(?<![\p{L}])(?:m²|м²)(?![\p{L}])/giu, `${words.square}${words.meter}`)
    .replace(/≥/g, words.greaterEqual)
    .replace(/≤/g, words.lessEqual)
    .replace(/(\d+)\s*\/\s*(\d+)/g, (_, numerator, denominator) => fraction(numerator, denominator))
    .replace(
      /\b([01]?\d|2[0-3]):([0-5]\d)\b/g,
      (_, hours, minutes) => clockTime(hours, minutes),
    )
    .replace(/(?<=\d)\s*[xх]\s*(?=\d)/giu, words.multiply)
    .replace(
      /(^|[^\p{L}\p{N}_])[xх](?=$|[^\p{L}\p{N}_])/giu,
      (_, prefix) => `${prefix}${words.variable}`,
    )
    .replace(/[×*·]/g, words.multiply)
    .replace(/(\d)\s*:\s*(\d)/g, `$1${words.divide}$2`)
    .replace(/[÷/]/g, words.divide)
    .replace(/\+/g, words.plus)
    .replace(/(?<=\d)\s+-\s+(?=\d)/g, words.minus)
    .replace(/−/g, words.minus)
    .replace(/=/g, words.equal)
    .replace(/>/g, words.greater)
    .replace(/</g, words.less)
    .replace(/²/g, words.square)
    .replace(/(?<![\p{L}])(?:kg|кг)(?![\p{L}])/giu, words.kilogram)
    .replace(/(?<![\p{L}])(?:ml|мл)(?![\p{L}])/giu, words.milliliter)
    .replace(/(?<![\p{L}])(?:km|км)(?![\p{L}])/giu, words.kilometer)
    .replace(/(?<![\p{L}])(?:mm|мм)(?![\p{L}])/giu, words.millimeter)
    .replace(/(?<![\p{L}])(?:cm|см)(?![\p{L}])/giu, words.centimeter)
    .replace(/(?<![\p{L}])(?:dm|дм)(?![\p{L}])/giu, words.decimeter)
    .replace(/(?<![\p{L}])(?:min|мин)(?![\p{L}])/giu, words.minute)
    .replace(/(?<![\p{L}])(?:hour|hr)(?![\p{L}])/giu, words.hour)
    .replace(/(?<![\p{L}])sec(?![\p{L}])/giu, words.second)
    .replace(/(\d(?:[.,]\d+)?\s*)ч(?![\p{L}])/giu, `$1${words.hour}`)
    .replace(/(\d(?:[.,]\d+)?\s*)с(?![\p{L}])/giu, `$1${words.second}`)
    .replace(/(\d(?:[.,]\d+)?\s*)(?:g|г)(?![\p{L}])/giu, `$1${words.gram}`)
    .replace(/(\d(?:[.,]\d+)?\s*)(?:t|т)(?![\p{L}])/giu, `$1${words.tonne}`)
    .replace(/(\d(?:[.,]\d+)?\s*)(?:l|л)(?![\p{L}])/giu, `$1${words.liter}`)
    .replace(/(\d(?:[.,]\d+)?\s*)(?:m|м)(?![\p{L}])/giu, `$1${words.meter}`)
    .replace(/%/g, words.percent)
    .replace(/°/g, words.degree)
    .replace(/[□△◇▭▦■●│└┼∥⟂→↔]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function speakGrade3Text(value, {
  language = 'uz',
  rate = 0.94,
  ttsApiBase = '',
  voiceGender = 'f',
  onEnd,
  onError,
} = {}) {
  const speechText = toGrade3SpeechText(value, language)
  const configuredApiBase = String(
    ttsApiBase ||
    import.meta.env?.VITE_TTS_API_BASE ||
    (typeof window !== 'undefined' ? window.__MATEMATIKA_TTS_API_BASE__ : '') ||
    '',
  ).replace(/\/+$/, '')
  let cancelled = false
  let fallbackStarted = false
  let browserCancel = () => {}

  const speakWithBrowser = () => {
    if (cancelled || fallbackStarted) return
    fallbackStarted = true

    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      typeof window.SpeechSynthesisUtterance !== 'function'
    ) {
      onError?.(new Error('Speech playback is unavailable.'))
      return
    }

    const utterance = new window.SpeechSynthesisUtterance(speechText)
    utterance.lang = language === 'ru' ? 'ru-RU' : 'uz-UZ'
    utterance.rate = rate
    utterance.onend = () => onEnd?.()
    utterance.onerror = (event) => onError?.(event)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)

    browserCancel = () => {
      utterance.onend = null
      utterance.onerror = null
      window.speechSynthesis.cancel()
    }
  }

  if (
    configuredApiBase &&
    typeof window !== 'undefined' &&
    typeof window.Audio === 'function'
  ) {
    const audio = new window.Audio()
    const gender = voiceGender === 'm' ? 'm' : 'f'
    audio.src = `${configuredApiBase}/api/tts?text=${encodeURIComponent(speechText.slice(0, 1000))}&g=${gender}`
    audio.onended = () => onEnd?.()
    audio.onerror = () => speakWithBrowser()
    const playPromise = audio.play()
    playPromise?.catch?.(() => speakWithBrowser())

    return () => {
      cancelled = true
      audio.onended = null
      audio.onerror = null
      audio.pause()
      browserCancel()
    }
  }

  speakWithBrowser()

  return () => {
    cancelled = true
    browserCancel()
  }
}
