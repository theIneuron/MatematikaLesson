import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import * as espree from 'espree';

import { GRADE6_CONCEPT_BRIDGES } from '../src/components/grade6/Grade6ConceptBridges.js';
import { GRADE6_LIFE_CONTEXTS } from '../src/components/grade6/Grade6LifeContexts.js';
import { GRADE6_THEORY_16_26 } from '../src/components/grade6/Grade6TheoryData16_26.js';
import { GRADE6_THEORY_27_46 } from '../src/components/grade6/Grade6TheoryData27_46.js';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const sourceDir = path.join(rootDir, 'src', 'components', 'grade6');
const outputDir = path.join(rootDir, 'lms-grade6-standalone');
const themePath = path.join(sourceDir, 'Grade6TheoryTheme.css');
const fractionHostPath = path.join(sourceDir, 'FractionTheoryLesson.jsx');
const ttsMathColonPath = path.join(sourceDir, 'ttsMathColon.js');

const ENTRY_ID = path.join(rootDir, '.grade6-lms-virtual-entry.jsx');
const RESOLVED_ENTRY_ID = '\0virtual:grade6-lms-entry';
const LIFE_ID = '\0virtual:grade6-life-context';
const BRIDGE_ID = '\0virtual:grade6-concept-bridges';

const ALLOWED_IMPORTS = new Set([
  'react',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-dom',
  'react-dom/client',
  'framer-motion',
  'motion/react',
  'lucide-react',
  'recharts',
  'mathjs',
  '@lesson/runtime',
]);

const toImportPath = (filePath) => filePath.split(path.sep).join('/');
const lessonFileName = (lessonNumber) => `Dars${String(lessonNumber).padStart(2, '0')}.jsx`;

function parseSelection(args) {
  if (args.includes('--check')) return { checkOnly: true, lessons: [] };
  const selections = args.length ? args : ['1-46'];
  const selected = new Set();
  for (const value of selections) {
    const match = /^(\d{1,2})(?:-(\d{1,2}))?$/.exec(value);
    if (!match) throw new Error(`Noto'g'ri diapazon: ${value}. Misol: 1-6 yoki 16-26.`);
    const start = Number(match[1]);
    const end = Number(match[2] || match[1]);
    if (start < 1 || end > 46 || start > end) throw new Error(`Diapazon 1-46 ichida bo'lishi kerak: ${value}`);
    for (let lesson = start; lesson <= end; lesson += 1) selected.add(lesson);
  }
  return { checkOnly: false, lessons: [...selected].sort((a, b) => a - b) };
}

function jsonForSource(value) {
  return JSON.stringify(value)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

async function readInlineLesson(lessonNumber) {
  const sourcePath = path.join(sourceDir, lessonFileName(lessonNumber));
  const source = await fs.readFile(sourcePath, 'utf8');
  const start = source.indexOf('const LESSON =');
  const end = source.indexOf('export default function', start);
  if (start < 0 || end < 0) throw new Error(`${lessonFileName(lessonNumber)} ichidan LESSON topilmadi.`);
  const lessonCode = source
    .slice(start, end)
    .replace('const LESSON =', 'globalThis.LESSON =');
  const context = { L: (uz, ru) => ({ uz, ru }) };
  vm.runInNewContext(lessonCode, context, { filename: sourcePath });
  return JSON.parse(JSON.stringify(context.LESSON));
}

async function getLessonData(lessonNumber) {
  if (lessonNumber >= 8 && lessonNumber <= 15) return readInlineLesson(lessonNumber);
  if (lessonNumber >= 16 && lessonNumber <= 26) return GRADE6_THEORY_16_26[lessonNumber];
  if (lessonNumber >= 27 && lessonNumber <= 46) return GRADE6_THEORY_27_46[lessonNumber];
  return null;
}

function makeEntryCode(lessonNumber, lesson) {
  const themeImport = `${toImportPath(themePath)}?inline`;
  const componentName = `LmsStandaloneDars${String(lessonNumber).padStart(2, '0')}`;

  if (lessonNumber <= 7) {
    const sourcePath = toImportPath(path.join(sourceDir, lessonFileName(lessonNumber)));
    return `
import { createElement, Fragment } from 'react';
import SourceLesson from ${JSON.stringify(sourcePath)};
import grade6Css from ${JSON.stringify(themeImport)};

export default function ${componentName}(props) {
  return createElement(
    Fragment,
    null,
    createElement('style', { 'data-grade6-lms-theme': ${JSON.stringify(lessonNumber)} }, grade6Css),
    createElement(SourceLesson, props),
  );
}
`;
  }

  return `
import { createElement, Fragment } from 'react';
import FractionTheoryLesson from ${JSON.stringify(toImportPath(fractionHostPath))};
import grade6Css from ${JSON.stringify(themeImport)};

const LESSON = ${jsonForSource(lesson)};

export default function ${componentName}(props) {
  return createElement(
    Fragment,
    null,
    createElement('style', { 'data-grade6-lms-theme': ${JSON.stringify(lessonNumber)} }, grade6Css),
    createElement(FractionTheoryLesson, { lesson: LESSON, ...props }),
  );
}
`;
}

function makeBundlePlugin({ entryCode, lesson }) {
  const lessonId = lesson?.id;
  const lifeContexts = lessonId && GRADE6_LIFE_CONTEXTS[lessonId]
    ? { [lessonId]: GRADE6_LIFE_CONTEXTS[lessonId] }
    : {};
  const conceptBridges = lessonId && GRADE6_CONCEPT_BRIDGES[lessonId]
    ? { [lessonId]: GRADE6_CONCEPT_BRIDGES[lessonId] }
    : {};

  return {
    name: 'grade6-lms-standalone',
    enforce: 'pre',
    resolveId(source) {
      if (source === ENTRY_ID || source.endsWith('.grade6-lms-virtual-entry.jsx')) return RESOLVED_ENTRY_ID;
      if (source.endsWith('Grade6LifeContexts.js')) return LIFE_ID;
      if (source.endsWith('Grade6ConceptBridges.js')) return BRIDGE_ID;
      return null;
    },
    load(id) {
      if (id === RESOLVED_ENTRY_ID) return entryCode;
      if (id === LIFE_ID) {
        return `export const GRADE6_LIFE_CONTEXTS = ${jsonForSource(lifeContexts)};`;
      }
      if (id === BRIDGE_ID) {
        return `export const GRADE6_CONCEPT_BRIDGES = ${jsonForSource(conceptBridges)};`;
      }
      return null;
    },
  };
}

function normalizeBuildOutputs(result) {
  const builds = Array.isArray(result) ? result : [result];
  return builds.flatMap((item) => item?.output || []);
}

async function buildGrade5StyleDirectSource(lessonNumber) {
  if (lessonNumber !== 1) return null;

  const fileName = lessonFileName(lessonNumber);
  const sourcePath = path.join(sourceDir, fileName);
  const [source, themeCss, ttsMathColonSource] = await Promise.all([
    fs.readFile(sourcePath, 'utf8'),
    fs.readFile(themePath, 'utf8'),
    fs.readFile(ttsMathColonPath, 'utf8'),
  ]);

  const reactImport = source.match(/^import React[^\r\n]+[\r\n]+/);
  if (!reactImport) throw new Error(`${fileName}: React import topilmadi.`);

  let directSource = source
    .replace(/^import ['"]\.\/Grade6TheoryTheme\.css['"];?[\r\n]+/m, '')
    .replace(/^import \{ normalizeTtsColons \} from ['"]\.\/ttsMathColon\.js['"];?[\r\n]+/m, '');

  const helperSource = ttsMathColonSource
    .replace('export function normalizeTtsColons', 'function normalizeTtsColons')
    .trim();
  const inlineInfrastructure = [
    helperSource,
    `const GRADE6_THEORY_THEME = ${jsonForSource(themeCss)};`,
    `const GRADE6_DARS01_LMS_FONT_FIX = ${jsonForSource(`
.lesson-root h1:not(.ttl-h1),
.lesson-root h2,
.lesson-root h3,
.lesson-root h4,
.lesson-root .title:not(.ttl-h1),
.lesson-root .display:not(.ttl-h1) {
  font-family: 'Manrope', system-ui, sans-serif !important;
  font-variation-settings: normal !important;
}
.lesson-root .ttl-h1,
.lesson-root .eq-var,
.lesson-root .rv-lbl {
  font-family: 'Source Serif 4', Georgia, serif !important;
}
`) };`,
  ].join('\n\n');

  const importEnd = directSource.indexOf('\n') + 1;
  directSource = `${directSource.slice(0, importEnd)}\n${inlineInfrastructure}\n\n${directSource.slice(importEnd)}`;

  const styleNode = '<style>{STYLES}</style>';
  if (!directSource.includes(styleNode)) {
    throw new Error(`${fileName}: root ichidagi style elementi topilmadi.`);
  }
  directSource = directSource.replace(
    styleNode,
    `<style data-grade6-lms-theme="${lessonNumber}">{GRADE6_THEORY_THEME + '\\n' + STYLES + '\\n' + GRADE6_DARS01_LMS_FONT_FIX}</style>`,
  );

  // Avtonom fayl faqat darsning public default exportini beradi. Dars07 kabi
  // ichki source-modullar uchun kerak bo'lgan named exportlar LMS fayliga kirmaydi.
  const sharedExportsStart = directSource.indexOf('\n// 6-sinfning keyingi nazariy darslari');
  if (sharedExportsStart >= 0) directSource = directSource.slice(0, sharedExportsStart);

  return `${directSource.trimEnd()}\n`;
}

async function exposeDirectLessonRoot(code, lessonNumber) {
  if (lessonNumber > 7) return code;

  const fileName = lessonFileName(lessonNumber);
  const sourcePath = path.join(sourceDir, fileName);
  const source = await fs.readFile(sourcePath, 'utf8');
  const rootMatch = source.match(/export\s+default\s+function\s+([A-Za-z_$][\w$]*)\s*\(/);
  if (!rootMatch) throw new Error(`${fileName}: manbadagi default root topilmadi.`);

  const rootName = rootMatch[1];
  const rootDeclaration = `function ${rootName}({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished }) {`;
  if (!code.includes(rootDeclaration)) {
    throw new Error(`${fileName}: bundle ichidagi LMS root imzosi topilmadi.`);
  }

  const styleNode = 'jsx("style", { children: STYLES })';
  if (!code.includes(styleNode)) {
    throw new Error(`${fileName}: root ichidagi style elementi topilmadi.`);
  }

  const wrapperName = `LmsStandaloneDars${String(lessonNumber).padStart(2, '0')}`;
  const wrapperStart = code.lastIndexOf(`function ${wrapperName}(props) {`);
  const wrapperExport = `export { ${wrapperName} as default };`;
  const wrapperExportStart = code.lastIndexOf(wrapperExport);
  if (wrapperStart < 0 || wrapperExportStart < wrapperStart) {
    throw new Error(`${fileName}: vaqtinchalik bundle wrapper topilmadi.`);
  }

  // Grade5/Dars01 bilan bir xil LMS shakli: haqiqiy darsning o'zi public
  // propslarni qabul qiladigan default export bo'ladi, CSS ham shu root ichida.
  let directCode = code
    .replace(rootDeclaration, `export default ${rootDeclaration}`)
    .replace(
      styleNode,
      `jsx("style", { "data-grade6-lms-theme": ${lessonNumber}, children: Grade6TheoryTheme_default + "\\n" + STYLES })`,
    );

  const directWrapperStart = directCode.lastIndexOf(`function ${wrapperName}(props) {`);
  const wrapperRegionStart = directCode.lastIndexOf('//#region', directWrapperStart);
  const cutStart = wrapperRegionStart >= 0 && directWrapperStart - wrapperRegionStart < 120
    ? wrapperRegionStart
    : directWrapperStart;
  directCode = directCode.slice(0, cutStart).trimEnd();
  return `${directCode}\n`;
}

function validateCode(code, fileName) {
  const ast = espree.parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  });
  const imports = ast.body
    .filter((node) => node.type === 'ImportDeclaration')
    .map((node) => node.source.value);
  const forbidden = imports.filter((source) => !ALLOWED_IMPORTS.has(source));
  if (forbidden.length) throw new Error(`${fileName}: LMS ruxsat bermaydigan importlar: ${forbidden.join(', ')}`);
  if (!code.includes('data-grade6-lms-theme')) throw new Error(`${fileName}: ichki CSS topilmadi.`);
  if (!ast.body.some((node) => node.type === 'ExportNamedDeclaration' || node.type === 'ExportDefaultDeclaration')) {
    throw new Error(`${fileName}: default export topilmadi.`);
  }
  return imports;
}

async function bundleLesson(lessonNumber) {
  const directSource = await buildGrade5StyleDirectSource(lessonNumber);
  if (directSource) {
    const banner = `/* 6-sinf ${lessonNumber}-dars: LMS uchun avtonom fayl. Grade5/Dars01 kabi to'g'ridan-to'g'ri JSX root. */\n`;
    const code = `${banner}${directSource}`;
    const imports = validateCode(code, lessonFileName(lessonNumber));
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, lessonFileName(lessonNumber)), code, 'utf8');
    return { lessonNumber, bytes: Buffer.byteLength(code), imports };
  }

  const lesson = await getLessonData(lessonNumber);
  const entryCode = makeEntryCode(lessonNumber, lesson);
  const result = await build({
    configFile: false,
    root: rootDir,
    logLevel: 'error',
    plugins: [react(), makeBundlePlugin({ entryCode, lesson })],
    build: {
      write: false,
      minify: false,
      sourcemap: false,
      target: 'es2020',
      cssCodeSplit: false,
      reportCompressedSize: false,
      lib: {
        entry: ENTRY_ID,
        formats: ['es'],
        fileName: () => lessonFileName(lessonNumber),
      },
      rollupOptions: {
        external: (id) => ALLOWED_IMPORTS.has(id),
        output: {},
      },
    },
  });

  const chunk = normalizeBuildOutputs(result).find((item) => item.type === 'chunk' && item.isEntry);
  if (!chunk) throw new Error(`${lessonFileName(lessonNumber)} uchun JS bundle yaratilmagan.`);
  const banner = `/* 6-sinf ${lessonNumber}-dars: LMS uchun avtonom fayl. Avtomatik yaratilgan; manba kontenti o'zgartirilmagan. */\n`;
  const bundledCode = await exposeDirectLessonRoot(chunk.code, lessonNumber);
  const code = `${banner}${bundledCode}`;
  const imports = validateCode(code, lessonFileName(lessonNumber));
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, lessonFileName(lessonNumber)), code, 'utf8');
  return { lessonNumber, bytes: Buffer.byteLength(code), imports };
}

async function validateExistingFiles() {
  const rows = [];
  for (let lessonNumber = 1; lessonNumber <= 46; lessonNumber += 1) {
    const fileName = lessonFileName(lessonNumber);
    const filePath = path.join(outputDir, fileName);
    const code = await fs.readFile(filePath, 'utf8');
    const imports = validateCode(code, fileName);
    rows.push({ lessonNumber, bytes: Buffer.byteLength(code), imports });
  }
  return rows;
}

async function writeReadme() {
  const readme = `# 6-sinf LMS standalone darslari

Bu papkadagi \`Dars01.jsx\`–\`Dars46.jsx\` fayllari LMS ga bittadan yuklash uchun yig'ilgan.

- Har bir faylda o'z dars kontenti, kerakli render logikasi va \`Grade6TheoryTheme.css\` uslublari ichkariga joylangan.
- \`./...\` yoki \`../...\` ko'rinishidagi lokal importlar yo'q.
- Faqat LMS ruxsat bergan tashqi paketlar import qilinadi.
- Asosiy \`src/components/grade6\` fayllari o'zgartirilmagan.

Qayta yaratish:

\`\`\`powershell
node scripts/build-grade6-lms.mjs 1-46
node scripts/build-grade6-lms.mjs --check
\`\`\`
`;
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'README.md'), readme, 'utf8');
}

function printRows(rows) {
  for (const row of rows) {
    const imports = row.imports.length ? row.imports.join(', ') : 'none';
    console.log(`${lessonFileName(row.lessonNumber)}\t${row.bytes} bytes\timports: ${imports}`);
  }
}

const selection = parseSelection(process.argv.slice(2));
if (selection.checkOnly) {
  const rows = await validateExistingFiles();
  printRows(rows);
  console.log(`OK: ${rows.length} ta LMS fayli tekshirildi.`);
} else {
  const rows = [];
  for (const lessonNumber of selection.lessons) rows.push(await bundleLesson(lessonNumber));
  await writeReadme();
  printRows(rows);
  console.log(`OK: ${rows.length} ta LMS fayli yaratildi: ${outputDir}`);
}
