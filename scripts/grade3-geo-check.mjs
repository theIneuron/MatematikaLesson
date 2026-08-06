// grade3-geo-check.mjs — проверка геометрического набора из кита.
//
// Зачем: фигуры блока Б5 (`GridFig`, `AngleFig`, `TriangleFig`, `LinePairFig`, `SymFig`,
// `SolidFig`, `RectFig`) собраны из наработок 1, 2 и 5 классов и переписаны без опоры на
// CSS. Ошибку в такой фигуре глазами в уроке не поймать: она либо не отрисуется, либо
// вылезет за viewBox. Скрипт рендерит каждую фигуру во всех режимах и проверяет:
//   · рендер без исключения;
//   · есть корневой <svg> с viewBox;
//   · все координаты точек и линий лежат внутри viewBox (фигура не обрезана);
//   · у каждой фигуры есть хотя бы один контур (не пустая картинка).
//
// Запуск: node scripts/grade3-geo-check.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { build } from 'vite';

const KIT = path.resolve('src/components/grade3/_kit/index.jsx');
const TMP = path.resolve('.geo-check');

const CASES = [
  ['GridFig', { w: 4, h: 3, mode: 'plain' }],
  ['GridFig', { w: 5, h: 4, mode: 'area', filled: 12, unit: 'sm2' }],
  ['GridFig', { w: 6, h: 2, mode: 'perimeter', walk: 8, labels: ['6', '2'] }],
  ['AngleFig', { deg: 90, lab: '90' }],
  ['AngleFig', { deg: 45 }],
  ['AngleFig', { deg: 130, tone: 'accent' }],
  ['TriangleFig', { kind: 'right', lab: 'to\'g\'ri' }],
  ['TriangleFig', { kind: 'acute' }],
  ['TriangleFig', { kind: 'obtuse' }],
  ['TriangleFig', { kind: 'equilateral' }],
  ['TriangleFig', { kind: 'isosceles', size: 'sm' }],
  ['TriangleFig', { kind: 'scalene' }],
  ['LinePairFig', { kind: 'parallel' }],
  ['LinePairFig', { kind: 'perpendicular' }],
  ['LinePairFig', { kind: 'intersect' }],
  ['SymFig', { shape: 'house', axis: 'v' }],
  ['SymFig', { shape: 'arrow', axis: 'v' }],
  ['SymFig', { shape: 'leaf', axis: 'h' }],
  ['SymFig', { shape: 'flag', axis: 'none' }],
  ['SolidFig', { kind: 'pyramid4' }],
  ['SolidFig', { kind: 'pyramid3' }],
  ['SolidFig', { kind: 'cone' }],
  ['SolidFig', { kind: 'cylinder' }],
  ['RectFig', { a: 5, b: 3 }],
  ['RectFig', { a: 6, b: 4, showArea: true, lab: '24' }]
];

const numbers = (svg) => {
  const box = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (!box) return null;
  const W = Number(box[1]);
  const H = Number(box[2]);
  const bad = [];
  // точки полигонов и линий
  for (const m of svg.matchAll(/(?:points|d)="([^"]+)"/g)) {
    for (const p of m[1].matchAll(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g)) {
      const x = Number(p[1]);
      const y = Number(p[2]);
      if (x < -1 || y < -1 || x > W + 1 || y > H + 1) bad.push(`${x},${y}`);
    }
  }
  for (const m of svg.matchAll(/x1="(-?[\d.]+)" y1="(-?[\d.]+)" x2="(-?[\d.]+)" y2="(-?[\d.]+)"/g)) {
    const v = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
    if (v[0] < -1 || v[2] > W + 1 || v[1] < -1 || v[3] > H + 1) bad.push(`line ${v.join(' ')}`);
  }
  return { W, H, bad };
};

const run = async () => {
  fs.mkdirSync(TMP, { recursive: true });
  const entry = path.join(TMP, 'entry.jsx');
  fs.writeFileSync(entry, `export * from '${pathToFileURL(KIT).href}';\n`, 'utf8');
  await build({
    logLevel: 'error',
    esbuild: { jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' },
    oxc: { jsx: { runtime: 'classic' } },
    build: {
      lib: { entry, formats: ['es'], fileName: 'kit' },
      outDir: TMP,
      emptyOutDir: false,
      rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/server'] }
    }
  });
  const mod = await import(pathToFileURL(path.join(TMP, 'kit.js')).href);

  let bad = 0;
  for (const [name, props] of CASES) {
    const Comp = mod[name];
    const tag = `${name}(${Object.entries(props).map(([k, v]) => `${k}=${v}`).join(' ')})`.slice(0, 58);
    if (typeof Comp !== 'function') { console.log(`${tag.padEnd(60)} XATO | китда yo'q`); bad++; continue; }
    let html;
    try { html = renderToString(createElement(Comp, props)); }
    catch (e) { console.log(`${tag.padEnd(60)} XATO | ${e.message.slice(0, 40)}`); bad++; continue; }
    const geo = numbers(html);
    const shapes = (html.match(/<(rect|polygon|polyline|path|line|circle|ellipse)/g) || []).length;
    const problems = [];
    if (!geo) problems.push('viewBox yo\'q');
    else if (geo.bad.length) problems.push(`viewBox tashqarisida ${geo.bad.length} nuqta`);
    if (shapes < 1) problems.push('bo\'sh rasm');
    if (problems.length) { console.log(`${tag.padEnd(60)} XATO | ${problems.join('; ')}`); bad++; }
    else console.log(`${tag.padEnd(60)} OK   | ${shapes} shakl, ${geo.W}x${geo.H}`);
  }
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log(`\nxato: ${bad} / ${CASES.length}`);
  process.exit(bad ? 1 : 0);
};

run();
