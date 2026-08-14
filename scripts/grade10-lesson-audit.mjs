// ============================================================================
// grade10-lesson-audit.mjs — СТАТИЧЕСКАЯ проверка урока 10 класса по контракту
// эталона (§4.1 роли, §2 и §8.5 теги, §4.5 запреты, §4.6 пороги, §7.2 озвучка,
// §10.1 список машинных проверок). Браузер не нужен, работает за секунду.
//
// Зачем: до этого скрипта соблюдение контракта проверялось только глазами
// методиста, то есть на каждом из 53 уроков заново. В 3 классе ровно эту работу
// делает `grade3-lesson-audit.mjs`, и именно он заменил ручное ревью.
//
// Как читаются данные: объекты экранов вырезаются из файла и выполняются как
// НАСТОЯЩИЙ JS в песочнице (`node:vm`) с подставленными `L` и `A`. Регексом
// содержимое не угадывается — иначе строка озвучки и строка экрана путаются
// местами, и проверка начинает врать в обе стороны.
//
// Список тегов НЕ хардкодится: он вычитывается из `ETALON_10SINF.md`. Добавили
// тег в эталон — скрипт принимает его сам. Иначе документ и проверка расходятся.
//
// Запуск:
//   node scripts/grade10-lesson-audit.mjs                      (урок 3 по умолчанию)
//   node scripts/grade10-lesson-audit.mjs src/components/grade10/Dars01.jsx
//   node scripts/grade10-lesson-audit.mjs --release            (жёсткий режим сдачи)
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

const args = process.argv.slice(2)
const RELEASE = args.includes('--release')
const FILE = path.resolve(args.find((a) => !a.startsWith('--')) || 'src/components/grade10/Dars03.jsx')
const ETALON = path.resolve('src/books/grade10/ETALON_10SINF.md')
const REGISTRY = path.resolve('src/lessons/grade10.js')
const CORE = path.resolve('src/components/grade10/core.jsx')

// Роли и их порядок — эталон §4.1. Порядок не переставляется.
const ROLES = [
  'hook', 'support', 'explain1', 'explain2', 'explain3', 'explain4', 'explain5',
  'rule', 'drill', 'guided', 'paper', 'trap', 'transfer', 'blitz', 'summary',
]

// Как сдаётся ответ — эталон §4.6. `pick4` расходует квоту, `pick2` нет.
// `build` и `number` — те, где ответ ПИШЕТ ученик. `pickset` запрещён везде,
// кроме экранов 1 и 14: ответ-множество выбором не сдаётся.
const ANSWER_KINDS = ['pick4', 'pick2', 'build', 'number', 'lead', 'match', 'multi', 'order', 'mixed', 'none', 'pickset']
const WRITTEN = ['build', 'number']

const problems = []
const notes = []
const bad = (s) => problems.push(s)
const note = (s) => notes.push(s)

// ---------------------------------------------------------------------------
// Теги — из эталона: §2 (последняя колонка таблиц ошибок) и §8.5 (теги работы).
// ---------------------------------------------------------------------------
function tagsFromEtalon() {
  const src = fs.readFileSync(ETALON, 'utf8')
  const from = src.indexOf('## §2.')
  const to = src.indexOf('## §3.')
  if (from < 0 || to < 0) { bad('эталон: не нашёл §2 — теги проверить нечем'); return new Set() }
  const set = new Set()
  for (const line of src.slice(from, to).split('\n')) {
    if (line[0] !== '|') continue
    const cells = line.split('|').map((c) => c.trim())
    const last = cells[cells.length - 2] || ''
    const m = last.match(/^`([a-z0-9-]+)`$/)
    if (m) set.add(m[1])
  }
  // §8.5: четыре тега на ошибку работы, а не блока.
  const work = src.slice(src.indexOf('### 8.5.'), src.indexOf('## §9.'))
  for (const m of work.matchAll(/`([a-z0-9-]+)`\s*\((?:экран\s*)?\d+\)/g)) set.add(m[1])
  return set
}

// ---------------------------------------------------------------------------
// Вырезаем объявления верхнего уровня и выполняем их как JS.
// ---------------------------------------------------------------------------
// Строки выкидываются перед подсчётом скобок: иначе `'{'` внутри текста
// сдвигает баланс и объявление обрывается на середине.
const noStrings = (s) => s.replace(/'[^']*'|"[^"]*"|`[^`]*`/g, "''")
const balance = (s) => {
  let n = 0
  for (const ch of noStrings(s)) {
    if (ch === '{' || ch === '[' || ch === '(') n += 1
    if (ch === '}' || ch === ']' || ch === ')') n -= 1
  }
  return n
}

function readData(src) {
  const lines = src.split('\n')
  const ctx = vm.createContext({
    L: (uz, ru, en) => ({ uz, ru, en }),
    A: (on, uz, ru, en) => ({ on, text: { uz, ru, en } }),
  })
  const unread = new Map()
  for (let i = 0; i < lines.length; i += 1) {
    const open = lines[i].match(/^const (\w+) = /)
    // Стрелка в первой строке — это функция, а не данные: их подставляем сами.
    if (!open || lines[i].includes('=>')) continue
    let depth = balance(lines[i])
    let end = i
    // Граница объявления — либо закрытые скобки, либо начало следующего
    // объявления верхнего уровня. Без второго условия одно нечитаемое
    // объявление проглатывает соседние, и они «пропадают» без объяснения.
    while (depth > 0 && end + 1 < lines.length && !/^(const |function |export |import )/.test(lines[end + 1])) {
      end += 1
      depth += balance(lines[end])
    }
    // `const` в песочнице не становится свойством объекта — переписываем на `var`,
    // иначе прочитать значение снаружи нечем.
    const body = lines.slice(i, end + 1).join('\n')
    try {
      vm.runInContext('var ' + body.slice('const '.length), ctx)
    } catch (e) {
      // Причина обязана называться: «не прочитал S7» без причины не отлаживается.
      const why = /<[A-Z]|\/>/.test(body)
        ? 'в данных JSX — по §5.3 в файле урока только данные, разметку рисует шаблон экрана'
        : /(\w+) is not defined/.test(e.message)
          ? `данные ссылаются на код: ${e.message.replace(' is not defined', '')}`
          : e.message
      unread.set(open[1], why)
    }
    i = end
  }
  return { ctx, unread }
}

// ---------------------------------------------------------------------------
// Обход всех строк данных: отдельно текст экрана, отдельно озвучка.
// ---------------------------------------------------------------------------
const LANGS = ['uz', 'ru', 'en']
const isL = (v) => v && typeof v === 'object' && !Array.isArray(v) && LANGS.every((k) => k in v)

function walkL(value, onL, trail = '') {
  if (!value || typeof value !== 'object') return
  if (isL(value)) { onL(value, trail); return }
  if (Array.isArray(value)) { value.forEach((v, i) => walkL(v, onL, `${trail}[${i}]`)); return }
  for (const [k, v] of Object.entries(value)) walkL(v, onL, trail ? `${trail}.${k}` : k)
}

const CYR = /[А-Яа-яЁё]/
const BAD_APOS = /[ʻ‘’ʼ]/
// §7.2 и §10.1: в озвучке символов нет, всё словами.
const BAD_AUDIO = /[%$/×÷=<>✗π√²—–]/

// РАЗБОР ТОЖЕ ПРОИЗНОСИТСЯ, и это проверялось только глазами.
//
// `useAnswerFx` вызывает `audio.say(t(hint))` и `audio.say(t(okText))` — то есть
// каждый разбор неверного варианта и каждый вывод после верного ответа уходят в
// TTS ровно так же, как реплики из `audio`. А проверка символов смотрела только
// на массив `audio`, и разборы проходили молча. В уроке 1 из-за этого движку
// доставалось «Bu π/2.»: `π` и `/` он читать не обязан, и ученик услышит либо
// пропуск, либо мусор.
//
// Правило то же самое: в произносимом тексте символов нет, всё словами. Здесь
// определяется, какие ключи данных доезжают до `say()`:
//   hint, hints, ok            -- разбор варианта и похвала (Probe, ProbeChain)
//   okText, wrongText, badText -- то же под именами пропсов
//   wrong, bad                 -- как их называют в данных уроков
//   wrongNote, swapNote        -- разборы таблицы
//   tryText                    -- разбор попытки в ReachLimit
// НЕ произносятся и потому не проверяются: prompt, notes, steps, show, done,
// label, title, proof, insight -- это текст ЭКРАНА, там формулы уместны.
const SPOKEN_KEY = /(^|\.)(hint|hints|ok|okText|wrong|wrongText|bad|badText|wrongNote|swapNote|tryText)(\[|\.|$)/

function checkStrings(screens) {
  screens.forEach((s, idx) => {
    if (!s) return
    const n = idx + 1
    const audioIds = new Set((s.audio || []).map((a) => a && a.text).filter(Boolean))
    walkL(s, (l, trail) => {
      for (const k of LANGS) {
        if (typeof l[k] !== 'string' || !l[k].trim()) bad(`экран ${n}, ${trail}: пустой ${k.toUpperCase()}`)
      }
      if (CYR.test(l.uz || '')) bad(`экран ${n}, ${trail}: кириллица в UZ — «${(l.uz || '').slice(0, 40)}»`)
      if (CYR.test(l.en || '')) bad(`экран ${n}, ${trail}: кириллица в EN — «${(l.en || '').slice(0, 40)}»`)
      if (BAD_APOS.test(l.uz || '')) bad(`экран ${n}, ${trail}: апостроф не ASCII в UZ`)
      // Озвучка: строки из массива audio И произносимые разборы (см. SPOKEN_KEY).
      const spoken = audioIds.has(l) || SPOKEN_KEY.test(trail)
      if (spoken) {
        const where = audioIds.has(l) ? 'озвучка' : `разбор ${trail}`
        for (const k of LANGS) {
          const m = (l[k] || '').match(BAD_AUDIO)
          if (m) bad(`экран ${n}, ${where} ${k.toUpperCase()}: символ «${m[0]}» — надо словами`)
        }
      }
    })
  })
}

// ---------------------------------------------------------------------------
// СКАЗАНО, НО НЕ ПОКАЗАНО.
//
// Правило эталона §5.1: если озвучка говорит «движется» — на экране движется,
// пока она это говорит. Нарушение не видно ни глазом при быстром просмотре, ни
// прогоном вёрстки: экран проходится, консоль чиста, а ученик слышит про
// движение и смотрит на неподвижную картинку. Именно так было в уроке 1:
// «Отложим его длину по самой окружности» — а на экране пустая окружность.
//
// Проверить движение статически нельзя, поэтому проверяется ОБЪЯВЛЕНИЕ: реплика
// с глаголом движения обязана быть названа в `motion` своего экрана. Автор либо
// подтверждает, что движение есть, либо переписывает реплику. Молча оставить
// нельзя.
// ---------------------------------------------------------------------------
// Ловятся ТОЛЬКО глаголы, которые обещают движение СЕЙЧАС, на экране: «едет»,
// «ложится», «крутится». Указания ученику («подвигай», «продолжи сам») сюда не
// входят: там движение делает он, и обещания картинке нет. Проверка, которая
// врёт, приучает себя не читать — поэтому список узкий намеренно.
const MOTION = {
  ru: /(отлож[иу]м|улож[иу]м|вед[её]м|ед[её]т|двига(?:ется|ются)|движ[еу]тся|поднима(?:ется|ются)|опуска(?:ется|ются)|ложится|ложатся|сгиба(?:ется|ются)|крутится|враща(?:ется|ются)|разворачива(?:ется|ются)|раст[её]т|растут|вырастает|вырастают|уезжает|уезжают|исчеза(?:ет|ют)|катится|заметает|пересыпа(?:ется|ются)|превраща(?:ется|ются)|зеркалится)/i,
  // `qo'yamiz` va `to'ldiradi` ATAYIN yo'q: birinchisi «o'rniga qo'yamiz»
  // (podstavim) ma'nosida ham keladi, ikkinchisi «to'ldiradi» (dopolnyaet)
  // ma'nosida -- ikkalasi ham harakat emas, va tekshiruv yolg'on gapirardi.
  uz: /(yotqizamiz|yotadi|ko'tariladi|tushadi|aylanadi|buriladi|o'sadi|yo'qoladi|suriladi|aylanmoqda|ko'tarilmoqda)/i,
  en: /(we lay|lays down|is moving|moves|rises|falls|is turning|turns|rotates|grows|disappears|sweeps|rolls|unfolds)/i,
}

// Показ идёт только на этих ролях. На практике движение — ответ на действие
// ученика, и там обещаний нет.
const SHOW_ROLES = ['hook', 'explain1', 'explain2', 'explain3', 'explain4', 'explain5', 'rule']
// Реплика с этим именем — передача хода ученику, а не показ.
const HANDOFF = ['work', 'ask']

function checkMotion(screens) {
  screens.forEach((s, idx) => {
    if (!s) return
    const n = idx + 1
    if (SHOW_ROLES.indexOf(s.role) === -1) return
    const declared = Array.isArray(s.motion) ? s.motion : []
    for (const seg of s.audio || []) {
      if (!seg || !seg.text) continue
      if (HANDOFF.indexOf(seg.on) !== -1) continue
      // «счётчик НЕ двигается» -- это не обещание движения, а наоборот.
      // Отрицание выкидывается ВМЕСТЕ со следующим словом: «счётчик не
      // двигается» обещает как раз обратное. Сделано разбором на слова, а не
      // регексом с `\b`: экранирование границы слова через генератор кода уже
      // дважды превращалось в невидимый управляющий символ, и проверка молча
      // перестала ловить отрицание.
      const clean = (v) => {
        const w = String(v || '').split(/\s+/)
        const out = []
        for (let i = 0; i < w.length; i += 1) {
          const low = w[i].toLowerCase().replace(/[.,!?;:«»"()]/g, '')
          if (low === 'не' || low === 'not') { i += 1; continue }
          out.push(w[i])
        }
        return out.join(' ')
      }
      const hit = LANGS.find((k) => MOTION[k] && MOTION[k].test(clean(seg.text[k])))
      if (!hit) continue
      if (declared.indexOf(seg.on) !== -1) continue
      bad(
        `экран ${n}, реплика «${seg.on}»: озвучка говорит о движении, а экран этого не обещал.`
        + ` Либо на экране в это время движется (тогда добавь «${seg.on}» в motion),`
        + ` либо перепиши реплику. Текст: «${(seg.text.ru || '').slice(0, 70)}»`,
      )
    }
    // Обратная сторона: объявили движение, а реплики с таким именем нет.
    for (const name of declared) {
      if (!(s.audio || []).some((a) => a && a.on === name)) {
        bad(`экран ${n}: в motion названа реплика «${name}», а её в озвучке нет`)
      }
    }
  })

  // ЭКРАН ОБЪЯСНЕНИЯ ОБЯЗАН ДВИГАТЬСЯ.
  //
  // Проверка выше ловит «сказано, но не показано» — то есть обещание движения
  // без движения. Но экран, который НИЧЕГО не обещает, для неё безупречен, и
  // застывшая картинка проходит молча. Так и вышло: 2026-08-13 в уроке 2 два
  // экрана объяснения из пяти не двигались вовсе, а в уроке 3 — все пять, и
  // никакая проверка этого не сказала. Нашлось только чтением кода глазами,
  // то есть ровно тем способом, который конвейер и должен был заменить.
  //
  // Поэтому требование прямое: у объяснения хотя бы одна реплика идёт вместе с
  // движением. Это не значит «добавь анимацию куда попало» — это значит, что
  // автор обязан назвать момент, когда речь и картинка идут вместе, а ревьюер
  // может его проверить.
  //
  // Оговорка `motionBy: 'student'` — для экранов, где движение делает сам
  // ученик (тянет ползунок, ведёт точку) и показа нет по замыслу. Это НАЗВАННАЯ
  // оговорка: её видно грепом, в отличие от молчания.
  screens.forEach((s, idx) => {
    if (!s) return
    const n = idx + 1
    if (!/^explain/.test(s.role || '')) return
    const declared = Array.isArray(s.motion) ? s.motion : []
    if (declared.length) return
    if (s.motionBy === 'student') { note(`экран ${n}: движение делает ученик, показа нет (объявлено)`); return }
    const msg = `экран ${n} (${s.role}): движения нет ни в одной реплике.`
      + ' Экран объяснения показывает, а не только рассказывает (§5.1):'
      + ' назови в motion реплику, во время которой на экране движется,'
      + " либо объяви motionBy: 'student', если движение делает сам ученик."
    // Мягко в работе, жёстко при сдаче — как с `FREE_NAV`. Причина: проверка
    // появилась 2026-08-13, когда урок 3 уже был опубликован, и там показ
    // подменяется вместо того чтобы двигаться на всех пяти экранах объяснения.
    // Сделать это нарушением сразу — значит заблокировать урок, который уже
    // идёт у учеников, ничего этим не починив. Замечание видно на каждом
    // прогоне, а к сдаче класса требование становится обязательным.
    if (RELEASE) bad(msg); else note(msg + ' (в режиме сдачи это нарушение)')
  })
}

// ---------------------------------------------------------------------------
// КАДРОВ ПОКАЗА НЕ БОЛЬШЕ, ЧЕМ РЕПЛИК МИНУС ОДНА.
//
// Фаза раскрытия считается по репликам озвучки: `phase` растёт, когда реплика
// закончилась, и упирается в `реплик - 1`. Значит если кадров показа столько
// же, сколько реплик, последний кадр НИКОГДА не уступит место рабочему прибору
// -- экран становится непроходимым. Ни сборка, ни прогон вёрстки этого не
// видят: экран рисуется, консоль чиста. Поймано на 13-м экране урока 1.
// ---------------------------------------------------------------------------
function checkFrames(screens) {
  screens.forEach((s, idx) => {
    if (!s) return
    const n = idx + 1
    const frames = Array.isArray(s.show) ? s.show.length : 0
    const segs = Array.isArray(s.audio) ? s.audio.length : 0
    if (!frames) return
    if (frames > segs - 1) {
      bad(
        `экран ${n}: кадров показа ${frames}, а реплик ${segs}.`
        + ` Фаза считается по репликам и дальше ${Math.max(0, segs - 1)} не уходит,`
        + ' поэтому последний кадр не уступит место работе ученика:'
        + ' экран не пройти. Нужна ещё одна реплика или на кадр меньше.',
      )
    }
  })
}

// ---------------------------------------------------------------------------
// Варианты ответа: ровно 4 там, где выбор; на каждый неверный свой разбор.
// ---------------------------------------------------------------------------
function checkProbes(screens) {
  screens.forEach((s, idx) => {
    if (!s) return
    const n = idx + 1
    const found = []
    const collect = (v, trail) => {
      if (!v || typeof v !== 'object') return
      if (Array.isArray(v)) { v.forEach((x, i) => collect(x, `${trail}[${i}]`)); return }
      // `typeof it === 'object'` ОБЯЗАТЕЛЕН: `items` бывает списком простых
      // строк (порядок шагов, чипы таблицы), и оператор `in` по строке бросает
      // TypeError — проверка падала целиком вместо того чтобы доложить. Поймано
      // 2026-08-13 на данных, собранных из документа контента.
      if (Array.isArray(v.items)
        && v.items.some((it) => it && typeof it === 'object' && ('correct' in it || 'label' in it))) {
        found.push([trail, v])
      }
      // Внутрь `items` тоже заходим. Иначе цепочка вопросов (блиц, опора)
      // остаётся непроверенной: у самих вопросов нет ни `correct`, ни `label`,
      // варианты лежат на уровень глубже, и без этого захода у блица можно
      // было оставить неверный вариант без разбора — молча.
      for (const [k, x] of Object.entries(v)) collect(x, trail ? `${trail}.${k}` : k)
    }
    collect(s, '')
    for (const [trail, probe] of found) {
      const items = probe.items
      // Три разных прибора, три разных контракта. Мерить их одной линейкой нельзя:
      // у «отметь все» верных несколько, у «расставь по порядку» верного варианта
      // нет вовсе -- ответ лежит в `answer`.
      // Хук — прогноз: у его вариантов нет ни верного, ни разбора (§4.4),
      // поэтому по полям он неотличим от списка «расставь по порядку».
      const isHookList = s.role === 'hook'
      const kind = items.some((it) => it && 'correct' in it) ? 'pick'
        : items.some((it) => it && 'ok' in it) ? 'multi'
          : Array.isArray(probe.answer) ? 'order' : isHookList ? 'pick' : 'unknown'
      if (kind === 'unknown') {
        bad(`экран ${n}, ${trail}: непонятный список вариантов — ни correct, ни ok, ни answer`)
        continue
      }
      if (kind === 'order') continue // порядок проверяется массивом `answer`, а не полями вариантов

      // Хук — прогноз: ни верного варианта, ни разбора у него не бывает (§4.4).
      const isHook = s.role === 'hook'
      const right = items.filter((it) => it && (kind === 'pick' ? it.correct : it.ok))
      const wrong = items.filter((it) => it && !(kind === 'pick' ? it.correct : it.ok))

      if (kind === 'pick' && items.length !== 4 && items.length !== 2) {
        bad(`экран ${n}, ${trail}: вариантов ${items.length}, эталон требует 4 (или 2 у чека различения)`)
      }
      if (!isHook && kind === 'pick' && right.length !== 1) {
        bad(`экран ${n}, ${trail}: верных вариантов ${right.length}, должен быть один`)
      }
      if (!isHook && kind === 'multi' && right.length < 2) {
        bad(`экран ${n}, ${trail}: «отметь все» с ${right.length} верными — это обычный выбор, а не различение`)
      }
      if (isHook) continue

      const hints = []
      for (const it of wrong) {
        const h = it.hint
        if (!h) { bad(`экран ${n}, ${trail}, вариант «${it.id}»: разбора нет`); continue }
        const key = LANGS.map((k) => (isL(h) ? h[k] : String(h))).join('|')
        if (hints.includes(key)) bad(`экран ${n}, ${trail}: у двух неверных вариантов ОДИН разбор`)
        hints.push(key)
      }
    }
  })
}

// ---------------------------------------------------------------------------
// Роли, теги, пороги.
// ---------------------------------------------------------------------------
function checkPlan(screens, tags) {
  screens.forEach((s, idx) => {
    if (!s) return
    const n = idx + 1
    if (!s.role) { bad(`экран ${n}: роль не объявлена (эталон §4.1 требует план из пятнадцати строк)`); return }
    if (s.role !== ROLES[idx]) bad(`экран ${n}: роль «${s.role}», по §4.1 здесь «${ROLES[idx]}»`)
  })

  screens.forEach((s, idx) => {
    if (!s) return
    const n = idx + 1
    const needsTag = n >= 2 && n <= 14
    if (needsTag && !s.tag) bad(`экран ${n}: тега нет — экран без названного заблуждения в урок не берётся`)
    if (!needsTag && s.tag) bad(`экран ${n}: тег есть, а на экранах 1 и 15 его быть не должно`)
    if (s.tag && tags.size && !tags.has(s.tag)) {
      bad(`экран ${n}: тег «${s.tag}» в эталоне не назван — либо опечатка, либо его надо добавить в §2`)
    }
  })

  screens.forEach((s, idx) => {
    if (!s) return
    const n = idx + 1
    if (!s.answer) { bad(`экран ${n}: не объявлено, как сдаётся ответ (${ANSWER_KINDS.join(', ')})`); return }
    if (!ANSWER_KINDS.includes(s.answer)) bad(`экран ${n}: неизвестный способ ответа «${s.answer}»`)
    if (s.answer === 'pickset' && n !== 1 && n !== 14) {
      bad(`экран ${n}: ответ-множество сдаётся выбором — запрещено везде, кроме 1 и 14 (§4.5)`)
    }
  })

  // Блиц тоже расходует квоту: внутри него есть вопросы с четырьмя вариантами,
  // и эталон §4.8 считает экран 14 среди трёх выборных.
  const pick4 = screens.filter((s) => s && (s.answer === 'pick4' || s.answer === 'mixed')).length
  const written = screens.filter((s) => s && WRITTEN.includes(s.answer)).length
  if (pick4 > 3) bad(`экранов с выбором из четырёх ${pick4}, эталон разрешает не больше трёх (§4.6)`)
  if (written < 3) bad(`экранов, где ответ пишет ученик, ${written}, эталон требует не меньше трёх (§4.6)`)
  note(`выбор из четырёх: ${pick4} из 3 · ответ пишет ученик: ${written}, нужно 3 и больше`)

  // §4.5: в блоке практики форматы не повторяются.
  const drill = screens.slice(8, 14)
  const formats = new Set(drill.filter(Boolean).map((s) => s.format || s.answer))
  if (formats.size < 3) bad(`в блоке 9–14 форматов ${formats.size}, эталон требует не меньше трёх (§4.5)`)
  note(`форматы блока 9–14: ${[...formats].join(', ')}`)

  // §5.0: минимум один экран практики без прибора.
  const noTool = screens.filter((s) => s && s.noTool).length
  if (!noTool) bad('нет ни одного экрана без прибора — эталон §5.0 требует минимум один (экран 11)')
}

// ---------------------------------------------------------------------------
// Файл целиком: реестр, React, число оцениваемых вопросов, freeNav.
// ---------------------------------------------------------------------------
function checkFile(src, ctx) {
  if (!/import React/.test(src)) bad('нет `import React` — в LMS классический режим, без него урок не откроется')
  const hard = src.match(/totalQuestions:\s*\d+/)
  if (hard) bad(`число оцениваемых вопросов записано числом (${hard[0]}) — его считают из данных блица (§4.2)`)

  const id = ctx.LESSON_ID
  const no = ctx.LESSON_NO
  if (!id || !no) { bad('нет LESSON_ID или LESSON_NO — метка урока не собирается'); return }
  const want = `grade10-${String(no).padStart(2, '0')}`
  if (id !== want) bad(`LESSON_ID «${id}», по правилу метки должен быть «${want}»`)

  const reg = fs.readFileSync(REGISTRY, 'utf8')
  const nn = String(no).padStart(2, '0')
  if (!reg.includes(`dars${nn}-`)) bad(`урок ${no} не записан в src/lessons/grade10.js — на Vercel его не будет`)
  if (!new RegExp(`Dars${nn}\\.jsx`).test(reg)) bad(`реестр не импортирует Dars${nn}.jsx`)

  const core = fs.readFileSync(CORE, 'utf8')
  const freeNav = (core.match(/export const FREE_NAV = (\w+)/) || [])[1]
  if (freeNav === undefined) {
    note('FREE_NAV в ядре не найден — проверить вручную')
  } else if (freeNav === 'true') {
    const msg = 'FREE_NAV = true в ядре: замок навигации выключен, экран можно оставить позади без ответа'
    if (RELEASE) bad(msg + ' — в режиме сдачи это запрещено'); else note(msg + ' (для сдачи нужен false)')
  }
}

// ---------------------------------------------------------------------------
const src = fs.readFileSync(FILE, 'utf8')
const tags = tagsFromEtalon()
const { ctx, unread } = readData(src)

// `TOTAL` теперь общий (screens.jsx), в уроке его нет. Считаем по данным.
// Считаем ИМЕННО массив SCREENS: упоминания ScreenN по всему файлу дают
// двойной счёт -- объявление плюс запись в массиве.
const arr = (src.match(/const SCREENS = \[([\s\S]*?)\]/) || [])[1] || ''
const listed = new Set(arr.match(/Screen\d+/g) || []).size
const total = Object.keys(ctx).filter((k) => /^S\d+$/.test(k)).length
// Нечитаемый экран не отменяет проверку остальных: иначе одна ошибка в данных
// прячет четырнадцать других.
const screens = Array.from({ length: 15 }, (_, i) => ctx['S' + (i + 1)] || null)
screens.forEach((s, i) => {
  if (s) return
  const why = unread.get('S' + (i + 1))
  bad(`экран ${i + 1}: данные не читаются — ${why || `объект S${i + 1} в файле не найден`}`)
})
const other = [...unread.keys()].filter((k) => !/^S\d+$/.test(k))
if (other.length) note(`не данные, пропущено: ${other.join(', ')}`)
if (total !== 15) bad(`объектов экрана ${total}, эталон §4.1 требует ровно 15`)
if (listed !== 15) bad(`в массиве SCREENS ${listed} экранов, должно быть 15`)

// Каркас, сгенерированный командой, полон заглушек. Пока они на месте, урок не
// сдаётся: в режиме сдачи это нарушение, в работе -- напоминание.
const todo = (src.match(/TODO/g) || []).length
if (todo && RELEASE) bad(`в файле ${todo} заглушек TODO -- урок не заполнен`)
else if (todo) note(`заглушек TODO: ${todo} (каркас ещё не заполнен)`)

checkPlan(screens, tags)
checkStrings(screens)
checkMotion(screens)
checkFrames(screens)
checkProbes(screens)
checkFile(src, ctx)

console.log(`\nУрок: ${path.relative(process.cwd(), FILE)}${RELEASE ? '  (режим сдачи)' : ''}`)
console.log(`Тегов в эталоне: ${tags.size}\n`)
notes.forEach((n) => console.log('  · ' + n))
if (problems.length) {
  console.log(`\nНАРУШЕНИЯ КОНТРАКТА: ${problems.length}`)
  problems.forEach((p) => console.log('  - ' + p))
  process.exit(1)
}
console.log('\nOK: контракт эталона соблюдён — роли, теги, пороги, варианты, три языка, озвучка.')
