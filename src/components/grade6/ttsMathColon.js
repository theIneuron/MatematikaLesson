const TIME_COLON_RE = /\b([01]?\d|2[0-3]):([0-5]\d)\b/g;
const COMPACT_OPERAND_COLON_RE =
  /(\b\d+(?:[,.]\d+)?\b|[a-zA-Z](?:[\u0300-\u036f])?|[πΠ]|\b(?:qism|butun)\b):(?=(?:[−-]?\d|[a-zA-Z]\b|[πΠ]|qism\b|butun\b|\())/g;
const COMPACT_PAREN_COLON_RE = /\):(?=(?:[−-]?\d|[a-zA-Z]\b|[πΠ]|\())/g;

/**
 * TTS uchun ":" belgisini kontekstga qarab tayyorlaydi.
 * - 7:00 kabi vaqt yozuvida belgi ovozga chiqarilmaydi;
 * - 12 : 3 va a:b kabi matematik yozuvlarda amal nomiga aylanadi;
 * - "Qoida: ..." kabi oddiy matnda faqat tabiiy pauza bo'lib qoladi.
 */
export function normalizeTtsColons(
  text,
  { divisionWord, ratioWord = divisionWord, ratioContext = false } = {},
) {
  const operationWord = ratioContext ? ratioWord : divisionWord;
  return String(text ?? '')
    .replace(
      TIME_COLON_RE,
      (_, hour, minute) => minute === '00' ? hour : `${hour} ${minute}`,
    )
    .replace(/\s+:\s+/g, operationWord)
    .replace(
      COMPACT_OPERAND_COLON_RE,
      (_, left) => `${left}${operationWord}`,
    )
    .replace(COMPACT_PAREN_COLON_RE, `)${operationWord}`)
    .replace(/\s*:\s*/g, ', ');
}
