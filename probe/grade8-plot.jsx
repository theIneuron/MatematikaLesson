// GRAFIK ASBOBLARI STENDI (8-sinf, 7-dars uchun).
//   npx vite --port 5199
//   http://localhost:5199/probe/grade8-plot.html
//
// NEGA STEND. Asbob darsga ulanishdan OLDIN shu yerda ko'riladi: chizma
// chizilib chiqadimi, uzilish ko'rinadimi, to'rt oyna 400 pikselga sig'adimi.
// Ikki ustun: chapda noutbukning ish zonasi (904), o'ngda telefon (390).
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { createRoot } from 'react-dom/client'
import { LangProvider, STYLES } from '../src/components/grade8/core.jsx'
import { MATH_STYLES } from '../src/components/grade8/math.jsx'
import { FourWindows, HyperFig, PLOT_STYLES, Plot } from '../src/components/grade8/plot.jsx'
import { PowerLadder, TOOLS_STYLES } from '../src/components/grade8/tools.jsx'
import { TWOSIDES_STYLES, TwoSides } from '../src/components/grade8/twosides.jsx'
import { ZOOM_STYLES, ZoomLine } from '../src/components/grade8/zoom.jsx'
import { METHOD_STYLES } from '../src/components/grade8/method.jsx'

const L = (uz, ru, en) => ({ uz, ru, en })
const WIDTH = Number(new URLSearchParams(location.search).get('w') || 904)

// Ovoz zaxirasi: stendda dvijok yo'q, asboblar esa `audio.muted` ni o'qiydi.
const MUTE = { muted: true, completed: true, say: () => {}, step: () => {} }

const TITLES = {
  text: L('SHART', 'УСЛОВИЕ', 'THE SITUATION'),
  formula: L('FORMULA', 'ФОРМУЛА', 'FORMULA'),
  table: L('JADVAL', 'ТАБЛИЦА', 'TABLE'),
  plot: L('GRAFIK', 'ГРАФИК', 'GRAPH'),
}

const TEXT = L(
  "To'rtburchakning yuzi {k}. Bir tomoni x, ikkinchisi y.",
  'Площадь прямоугольника {k}. Одна сторона x, другая y.',
  'The area of a rectangle is {k}. One side is x, the other is y.',
)

function Col({ w, label }) {
  return (
    <div style={{ width: w, flex: '0 0 auto' }}>
      <div style={{ font: '600 12px Manrope, sans-serif', color: '#687078', padding: '6px 2px' }}>
        {label}
      </div>

      {/* B2 BLOKINING MEXANIKASI: lupa va ikki tomon. */}
      <div className="g8-body" style={{ background: '#F3EFE7', padding: 8, borderRadius: 12, marginBottom: 14 }}>
        <div className="g8-stack">
          <ZoomLine
            expr="sqrt(2)"
            label="√2"
            depth={3}
            audio={MUTE}
            ask={L(
              "Yana kattalashtirsak, metka bo'linishga tushadimi?",
              'Если увеличивать дальше, ляжет ли метка на деление?',
              'Zooming further, will the mark land on a tick?',
            )}
            items={[
              { id: 'never', right: true, label: L('Hech qachon', 'Никогда', 'Never') },
              {
                id: 'soon',
                label: L('Ha, tez orada', 'Да, скоро', 'Yes, soon'),
                hint: L(
                  'Uch marta kattalashtirdik va har safar metka ichida qoldi.',
                  'Мы увеличили три раза, и каждый раз метка оставалась внутри.',
                  'We zoomed three times and each time the mark stayed inside.',
                ),
              },
              {
                id: 'ten',
                label: L("O'ninchi kattalashtirishda", 'На десятом увеличении', 'At the tenth zoom'),
                hint: L(
                  'Qadamlar soni ahamiyatsiz, har qadamda yangi raqam paydo bo\'ladi.',
                  'Число шагов ни при чём: на каждом шаге появляется новая цифра.',
                  'The number of steps is irrelevant: each step brings a new digit.',
                ),
              },
            ]}
            after={L(
              'Raqamlar tugamaydi, shuning uchun bu son kasr bilan yozilmaydi.',
              'Цифры не заканчиваются, поэтому это число не записать дробью.',
              'The digits never end, so this number cannot be written as a fraction.',
            )}
          />
        </div>
      </div>

      <div className="g8-body" style={{ background: '#F3EFE7', padding: 8, borderRadius: 12, marginBottom: 14 }}>
        <div className="g8-stack">
          <TwoSides
            audio={MUTE}
            from={-6}
            to={6}
            start={{ left: '−3x + 1', rel: '>', right: '7', set: null }}
            steps={[
              {
                ask: L('Nima qilamiz?', 'Что делаем?', 'What do we do?'),
                actions: [
                  {
                    id: 'sub1',
                    right: true,
                    label: L('Ikki tomondan 1 ni ayirish', 'Вычесть 1 из обеих частей', 'Subtract 1 from both sides'),
                    to: { left: '−3x', rel: '>', right: '6' },
                  },
                  {
                    id: 'div1',
                    label: L('Ikki tomonni 3 ga bo\'lish', 'Разделить обе части на 3', 'Divide both sides by 3'),
                    hint: L(
                      'Avval yolg\'iz had qoldiriladi, keyin bo\'linadi.',
                      'Сначала оставляют одно слагаемое, потом делят.',
                      'First isolate the term, then divide.',
                    ),
                  },
                ],
              },
              {
                ask: L('Endi nima qilamiz?', 'Что теперь?', 'And now?'),
                actions: [
                  {
                    id: 'divm3',
                    right: true,
                    label: L("Minus 3 ga bo'lish", 'Разделить на минус 3', 'Divide by minus 3'),
                    to: { left: 'x', rel: '<', right: '−2' },
                    set: { lt: -2 },
                    flip: true,
                    note: L(
                      'Manfiy songa bo\'lganda ishora aylanadi.',
                      'При делении на отрицательное знак переворачивается.',
                      'Dividing by a negative flips the sign.',
                    ),
                  },
                  {
                    id: 'keep',
                    label: L("Ishorani qoldirib bo'lish", 'Разделить, оставив знак', 'Divide and keep the sign'),
                    hint: L(
                      'Tekshiring: bu holda x noldan katta chiqadi.',
                      'Проверь: тогда x выходит больше нуля.',
                      'Check: then x comes out greater than zero.',
                    ),
                    counter: {
                      at: 'x = 0',
                      gives: '1 > 7',
                      verdict: L('yolg\'on', 'ложь', 'false'),
                    },
                  },
                ],
              },
            ]}
            note={L(
              'Yechim x minus ikkidan kichik.',
              'Решение: x меньше минус двух.',
              'The solution is x less than minus two.',
            )}
          />
        </div>
      </div>

      {/* LESTNITSA DARAJALARI: 8-dars (kasr ko'rsatkich) va 31-dars (butun). */}
      <div className="g8-body" style={{ background: '#F3EFE7', padding: 8, borderRadius: 12, marginBottom: 14 }}>
        <div className="g8-stack">
          <PowerLadder
            base={4}
            known={2}
            rows={[
              { e: 3 }, { e: 2.5, show: '5/2' }, { e: 2 }, { e: 1.5, show: '3/2' },
              { e: 1 }, { e: 0.5, show: '1/2' }, { e: 0 },
            ]}
            stepLabel={L(': 2', ': 2', ': 2')}
            labels={{ pow: L('DARAJA', 'СТЕПЕНЬ', 'POWER'), val: L('QIYMAT', 'ЗНАЧЕНИЕ', 'VALUE') }}
            audio={MUTE}
            ask={L('Keyingi qiymatni yozing', 'Запиши следующее значение', 'Write the next value')}
            hints={{ '0': L('Nol emas.', 'Не нуль.', 'Not zero.') }}
            after={L("Yarim ko'rsatkich ildizni beradi.", 'Половинный показатель даёт корень.', 'A half exponent gives the root.')}
          />
        </div>
      </div>

      <div className="g8-body" style={{ background: '#F3EFE7', padding: 8, borderRadius: 12, marginBottom: 14 }}>
        <div className="g8-stack">
          <PowerLadder
            base={10}
            known={2}
            rows={[{ e: 3 }, { e: 2 }, { e: 1 }, { e: 0 }, { e: -1 }]}
            stepLabel={L(': 10', ': 10', ': 10')}
            labels={{ pow: L('DARAJA', 'СТЕПЕНЬ', 'POWER'), val: L('QIYMAT', 'ЗНАЧЕНИЕ', 'VALUE') }}
            audio={MUTE}
            ask={L('Keyingi qiymatni yozing', 'Запиши следующее значение', 'Write the next value')}
            after={L('Nolinchi daraja bir.', 'Нулевая степень это единица.', 'The zero power is one.')}
          />
        </div>
      </div>

      {/* LENTA FIGURASI: giperbola to'rt holatda yig'iladi. */}
      <div className="g8-body" style={{ background: '#F3EFE7', padding: 8, borderRadius: 12, marginBottom: 14 }}>
        <div className="g8-stack" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[0, 1, 2, 3].map((ph) => (
            <div key={ph} style={{ width: WIDTH < 500 ? '100%' : '48%' }}>
              <div style={{ font: '600 10px Manrope, sans-serif', color: '#9AA2A9' }}>{'kadr ' + ph}</div>
              <HyperFig data={{ k: 6, xs: [1, 2, 3, 6], h: 150 }} phase={ph} />
            </div>
          ))}
        </div>
      </div>

      <div className="g8-body" style={{ background: '#F3EFE7', padding: 8, borderRadius: 12, marginBottom: 14 }}>
        <div className="g8-stack">
          <Plot
            f={(x) => (x === 0 ? null : 6 / x)}
            from={-7} to={7} yFrom={-7} yTo={7} h={196}
            caption={L('y = 6/x', 'y = 6/x', 'y = 6/x')}
          />
        </div>
      </div>

      <div className="g8-body" style={{ background: '#F3EFE7', padding: 8, borderRadius: 12, marginBottom: 14 }}>
        <div className="g8-stack">
          <FourWindows
            k={6}
            text={TEXT}
            xs={[1, 2, 3, 6]}
            given="table"
            holeAt={3}
            answer="y"
            titles={TITLES}
            audio={MUTE}
            ask={L('Jadvalning bo\'sh katagiga qanday son turadi?', 'Какое число стоит в пустой клетке таблицы?', 'Which number goes in the empty cell?')}
            hints={{ '3': L('Uch bu x, y esa boshqa.', 'Три это x, а спрашивают y.', 'Three is x, and y is asked.') }}
            after={L('Yuzi o\'sha, olti.', 'Площадь та же, шесть.', 'The area is the same, six.')}
          />
        </div>
      </div>

      <div className="g8-body" style={{ background: '#F3EFE7', padding: 8, borderRadius: 12 }}>
        <div className="g8-stack">
          <FourWindows
            k={8}
            text={TEXT}
            xs={[1, 2, 4, 8]}
            given="plot"
            answer="k"
            titles={TITLES}
            audio={MUTE}
            ask={L('Grafikdan koeffitsiyentni toping', 'Найди коэффициент по графику', 'Find the coefficient from the graph')}
            hints={{ '2': L('Ikki bu x, ko\'paytma esa boshqa.', 'Два это x, а нужно произведение.', 'Two is x, but the product is needed.') }}
            after={L('Har nuqtada ko\'paytma bir xil.', 'В каждой точке произведение одно и то же.', 'At every point the product is the same.')}
          />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <LangProvider value="ru">
      <div className="lesson-root" style={{ padding: 10 }}>
        <style>{STYLES}{MATH_STYLES}{TOOLS_STYLES}{PLOT_STYLES}{METHOD_STYLES}{TWOSIDES_STYLES}{ZOOM_STYLES}</style>
        {/* Ширина колонки берётся из адреса: ?w=390 — телефон, иначе ноутбук.
            Две колонки рядом ВРУТ: медиазапрос смотрит на окно браузера, а не
            на колонку, и телефонная раскладка на широком окне не включается. */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <Col w={WIDTH} label={WIDTH < 500 ? 'ТЕЛЕФОН 390' : 'НОУТБУК: рабочая зона 904'} />
        </div>
      </div>
    </LangProvider>
  )
}

createRoot(document.getElementById('r')).render(<App />)
