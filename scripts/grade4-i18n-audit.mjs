#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { parse } from '@babel/parser';

const ROOT = process.cwd();
const GRADE4_DIR = path.join(ROOT, 'src/components/grade4');
const LANGS = ['uz', 'ru', 'en'];
const LOCALE_HELPERS = new Set(['B', 'b', 'bi', 'L']);
const CYRILLIC = /[\u0400-\u052f]/u;
const TTS_UNSAFE = /\d|[=<>≥≤×÷+−/%$€]|[—–«»“”„‟‘’ʻʼ✓✔✗✘]/u;
const failures = [];
const stats = { files: 0, theory: 0, practice: 0, localizedNodes: 0, audioNodes: 0, helperCalls: 0 };

function fail(file, node, message) {
  const line = node?.loc?.start?.line;
  failures.push(`${file}${line ? `:${line}` : ''} — ${message}`);
}

function propertyName(property) {
  if (!property || property.computed) return null;
  if (property.key?.type === 'Identifier') return property.key.name;
  if (property.key?.type === 'StringLiteral') return property.key.value;
  return null;
}

function objectProperty(node, name) {
  if (node?.type !== 'ObjectExpression') return null;
  return node.properties.find((property) => propertyName(property) === name) ?? null;
}

function isLocalizedValue(node) {
  if (node?.type === 'CallExpression'
    && node.callee?.type === 'Identifier'
    && LOCALE_HELPERS.has(node.callee.name)) {
    return node.arguments.length === 3 && node.arguments.every(isNonEmpty);
  }
  if (node?.type !== 'ObjectExpression') return false;
  const names = new Set(node.properties.map(propertyName).filter(Boolean));
  return LANGS.every((lang) => names.has(lang) && isNonEmpty(objectProperty(node, lang)?.value));
}

function inspectDars08AudioCoverage(file, source, ast) {
  let content = null;
  const visit = (node) => {
    if (!node || typeof node !== 'object' || content) return;
    if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier' && node.id.name === 'CONTENT') {
      content = node.init;
      return;
    }
    for (const [key, value] of Object.entries(node)) {
      if (['loc', 'start', 'end', 'extra', 'comments', 'tokens'].includes(key)) continue;
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object') visit(value);
    }
  };
  visit(ast.program);

  if (content?.type !== 'ObjectExpression') {
    fail(file, content, 'Dars08 CONTENT object literal topilmadi');
    return;
  }
  for (let index = 0; index < 16; index += 1) {
    const screen = objectProperty(content, `s${index}`)?.value;
    if (screen?.type !== 'ObjectExpression') {
      fail(file, screen, `Dars08 CONTENT.s${index} topilmadi`);
      continue;
    }
    const audio = objectProperty(screen, 'audio')?.value;
    const intro = objectProperty(audio, 'intro')?.value ?? audio;
    if (!isLocalizedValue(intro)) {
      fail(file, audio ?? screen, `Dars08 CONTENT.s${index} UZ/RU/EN intro audiosiga ega emas`);
    }
  }

  const rendererNames = [
    'ChoiceScreen', 'ReasoningRoundsScreen', 'ExplanationScreen', 'BuildPracticeScreen',
    'RuleBuilderScreen', 'RapidTestConsoleScreen', 'MatchingScreen', 'SummaryScreen',
  ];
  if (!/function\s+useScreenAudio\b|const\s+useScreenAudio\s*=/.test(source)) {
    fail(file, null, 'Dars08 canonical useScreenAudio adapteri topilmadi');
  }
  for (const name of rendererNames) {
    const definition = source.search(new RegExp(`(?:function\\s+${name}\\b|const\\s+${name}\\s*=)`));
    if (definition < 0) {
      fail(file, null, `Dars08 ${name} rendereri topilmadi`);
      continue;
    }
    const excerpt = source.slice(definition, definition + 10_000);
    if (!/useScreenAudio\s*\(/.test(excerpt)) {
      fail(file, null, `Dars08 ${name} useScreenAudio orqali ozvuchkaga ulanmagan`);
    }
  }
}

function literalText(node) {
  if (!node) return '';
  if (node.type === 'StringLiteral') return node.value;
  if (node.type === 'TemplateLiteral') {
    return node.quasis.map((item) => item.value.cooked ?? item.value.raw).join(' ');
  }
  if (node.type === 'JSXText') return node.value;
  if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
    return (node.children ?? []).map(literalText).join(' ');
  }
  if (node.type === 'JSXExpressionContainer') return literalText(node.expression);
  if (node.type === 'ArrayExpression') return node.elements.map(literalText).join(' ');
  if (node.type === 'ObjectExpression') return node.properties.map((property) => literalText(property.value)).join(' ');
  if (node.type === 'ConditionalExpression') return `${literalText(node.consequent)} ${literalText(node.alternate)}`;
  return '';
}

function directConditionalLiteralText(node) {
  if (node?.type !== 'ConditionalExpression') return '';
  return [node.consequent, node.alternate]
    .filter((branch) => branch?.type === 'StringLiteral' || branch?.type === 'TemplateLiteral')
    .map(literalText)
    .join(' ');
}

function isNonEmpty(node) {
  if (!node || node.type === 'NullLiteral') return false;
  if (node.type === 'Identifier' && node.name === 'undefined') return false;
  if (node.type === 'StringLiteral') return node.value.trim().length > 0;
  if (node.type === 'TemplateLiteral') return node.expressions.length > 0 || literalText(node).trim().length > 0;
  if (node.type === 'ArrayExpression') return node.elements.length > 0 && node.elements.every(Boolean);
  if (node.type === 'JSXFragment') return node.children.length > 0;
  return true;
}

function localeCardinality(node) {
  if (node?.type === 'ArrayExpression') return node.elements.length;
  return isNonEmpty(node) ? 1 : 0;
}

function isLangCodeArray(node) {
  if (node.type !== 'ArrayExpression') return false;
  const values = node.elements.map((item) => item?.type === 'StringLiteral' ? item.value : null);
  return values.length >= 2 && values.every((value) => LANGS.includes(value));
}

function localeCodeFromTest(node) {
  if (node?.type !== 'BinaryExpression') return null;
  const { left, right } = node;
  const isLangValue = (value) => {
    if (!value) return false;
    if (value.type === 'Identifier') return /lang(?:uage)?/i.test(value.name);
    if (value.type === 'CallExpression' && value.callee?.type === 'Identifier') {
      return /^(?:use|normalize|normalise|get|resolve)?(?:Safe|Preview|Current)?Lang(?:uage)?$/i.test(value.callee.name);
    }
    if (value.type === 'MemberExpression') {
      const property = value.computed
        ? (value.property?.type === 'StringLiteral' ? value.property.value : '')
        : value.property?.name;
      return /^(?:lang|language)$/i.test(property ?? '');
    }
    return false;
  };
  const leftLang = isLangValue(left);
  const rightLang = isLangValue(right);
  const leftCode = left?.type === 'StringLiteral' && LANGS.includes(left.value);
  const rightCode = right?.type === 'StringLiteral' && LANGS.includes(right.value);
  if (leftLang && rightCode) return right.value;
  if (rightLang && leftCode) return left.value;
  return null;
}

function localeCodesInConditional(node, codes = new Set()) {
  if (node?.type !== 'ConditionalExpression') return codes;
  const code = localeCodeFromTest(node.test);
  if (code) codes.add(code);
  localeCodesInConditional(node.consequent, codes);
  localeCodesInConditional(node.alternate, codes);
  return codes;
}

function finalLocaleAlternate(node) {
  let current = node;
  while (current?.type === 'ConditionalExpression' && localeCodeFromTest(current.test)) {
    current = current.alternate;
  }
  return current;
}

function inspectAst(file, source, ast, practice) {
  let selectorArrays = 0;
  let lessonTitleFields = 0;
  let audioNodes = 0;

  function visit(node, context = { path: '', inAudio: false, inLocaleChain: false }) {
    if (!node || typeof node !== 'object') return;

    if (node.type === 'JSXText' && CYRILLIC.test(node.value)) {
      fail(file, node, 'lokalizatsiyasiz ko\'rinadigan JSX matnida kirill bor');
    }
    if (node.type === 'JSXAttribute' && node.value?.type === 'StringLiteral' && CYRILLIC.test(node.value.value)) {
      fail(file, node, `lokalizatsiyasiz JSX ${node.name?.name ?? 'attribute'} qiymatida kirill bor`);
    }
    const rawJsxExpressionText = node.type === 'JSXExpressionContainer'
      ? node.expression?.type === 'ConditionalExpression'
        ? (localeCodeFromTest(node.expression.test) ? '' : directConditionalLiteralText(node.expression))
        : ['StringLiteral', 'TemplateLiteral'].includes(node.expression?.type)
          ? literalText(node.expression)
          : ''
      : '';
    if (CYRILLIC.test(rawJsxExpressionText)) {
      fail(file, node, 'lokalizatsiyasiz JSX expression matnida kirill bor');
    }
    if (
      node.type === 'CallExpression' &&
      node.callee?.type === 'Identifier' &&
      /^(?:t|tx)$/.test(node.callee.name) &&
      ['StringLiteral', 'TemplateLiteral'].includes(node.arguments[0]?.type) &&
      CYRILLIC.test(literalText(node.arguments[0]))
    ) {
      fail(file, node, `${node.callee.name}(...) ga lokalizatsiya nodesiz kirill matni berilgan`);
    }

    if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier' && node.id.name === 'LESSON_META') {
      const titleProperty = node.init?.type === 'ObjectExpression'
        ? node.init.properties.find((property) => propertyName(property) === 'lessonTitle')
        : null;
      if (titleProperty) lessonTitleFields += 1;
    }

    if (isLangCodeArray(node)) {
      selectorArrays += 1;
      const values = node.elements.map((item) => item.value);
      if (values.join(',') !== LANGS.join(',')) {
        fail(file, node, `til selectorining tartibi [${values.join(', ')}], kutilgan [uz, ru, en]`);
      }
    }

    const localeTestCode = node.type === 'ConditionalExpression' ? localeCodeFromTest(node.test) : null;
    if (localeTestCode === 'en' && CYRILLIC.test(literalText(node.consequent))) {
      fail(file, node.consequent, 'locale conditional EN branchida kirill bor');
    }
    if (localeTestCode && !context.inLocaleChain) {
      const localeCodes = localeCodesInConditional(node);
      if (localeCodes.size < 2) {
        fail(file, node, 'binary locale conditional EN qiymatini boshqa tilga tushiradi');
      }
      const implicitEnglish = !localeCodes.has('en') ? finalLocaleAlternate(node) : null;
      if (implicitEnglish && CYRILLIC.test(literalText(implicitEnglish))) {
        fail(file, implicitEnglish, 'locale conditional EN branchida kirill bor');
      }
    }
    if (localeTestCode) {
      visit(node.test, context);
      visit(node.consequent, { ...context, inLocaleChain: true });
      visit(node.alternate, { ...context, inLocaleChain: true });
      return;
    }

    if (node.type === 'CallExpression' && node.callee?.type === 'Identifier' && LOCALE_HELPERS.has(node.callee.name)) {
      stats.helperCalls += 1;
      if (context.inAudio) {
        audioNodes += 1;
        stats.audioNodes += 1;
      }
      if (node.arguments.length !== 3) {
        fail(file, node, `${node.callee.name}(...) lokalizatsiya helperida ${node.arguments.length} argument, 3 emas`);
      } else {
        node.arguments.forEach((argument, index) => {
          if (!isNonEmpty(argument)) {
            fail(file, argument, `${node.callee.name}(...) ${index + 1}-argumenti bo'sh`);
          }
        });
        const english = literalText(node.arguments[2]);
        if (CYRILLIC.test(english)) fail(file, node.arguments[2], `${node.callee.name}(...) EN argumentida kirill bor`);
        if (context.inAudio) {
          node.arguments.forEach((argument, index) => {
            if (TTS_UNSAFE.test(literalText(argument))) {
              fail(file, argument, `${node.callee.name}(...) ${LANGS[index].toUpperCase()} audio argumentida raqam yoki TTS uchun taqiqlangan belgi bor`);
            }
          });
        }
      }
    }

    if (node.type === 'ObjectExpression') {
      const properties = new Map();
      for (const property of node.properties) {
        if (property.type === 'ObjectProperty' || property.type === 'ObjectMethod') {
          const name = propertyName(property);
          if (name) properties.set(name, property);
        }
      }

      const presentLocales = LANGS.filter((lang) => properties.has(lang));
      if (presentLocales.length > 0) {
        stats.localizedNodes += 1;
        for (const lang of LANGS) {
          const property = properties.get(lang);
          if (!property) {
            fail(file, node, `localized node ichida ${lang} yo'q (${context.path || 'root'})`);
            continue;
          }
          if (!isNonEmpty(property.value)) fail(file, property, `${context.path || 'localized node'}.${lang} bo'sh`);
        }

        const englishProperty = properties.get('en');
        if (englishProperty) {
          const english = literalText(englishProperty.value);
          if (CYRILLIC.test(english)) fail(file, englishProperty, `${context.path || 'localized node'}.en ichida kirill bor`);
          if (context.inAudio && TTS_UNSAFE.test(english)) {
            fail(file, englishProperty, `${context.path || 'localized node'}.en audio ichida raqam yoki TTS uchun taqiqlangan belgi bor`);
          }
        }

        if (context.inAudio) {
          audioNodes += 1;
          stats.audioNodes += 1;
          const sizes = LANGS.map((lang) => localeCardinality(properties.get(lang)?.value));
          if (!sizes.every((size) => size === sizes[0])) {
            fail(file, node, `${context.path} audio segment parity buzilgan: uz=${sizes[0]}, ru=${sizes[1]}, en=${sizes[2]}`);
          }
        }
      }

      for (const property of node.properties) {
        if (property.type !== 'ObjectProperty' && property.type !== 'ObjectMethod') continue;
        const name = propertyName(property) ?? '<computed>';
        visit(property.value ?? property.body, {
          path: context.path ? `${context.path}.${name}` : name,
          inAudio: context.inAudio || /audio/i.test(name),
        });
      }
      return;
    }

    if (node.type === 'ArrayExpression') {
      node.elements.forEach((item, index) => visit(item, { ...context, path: `${context.path}[${index}]` }));
      return;
    }

    for (const [key, value] of Object.entries(node)) {
      if (key === 'loc' || key === 'start' || key === 'end' || key === 'extra' || key === 'comments' || key === 'tokens') continue;
      if (Array.isArray(value)) value.forEach((item) => visit(item, context));
      else if (value && typeof value === 'object' && typeof value.type === 'string') visit(value, context);
    }
  }

  visit(ast.program);

  if (selectorArrays === 0) fail(file, null, 'standalone UZ/RU/EN selector arrayi topilmadi');
  if (lessonTitleFields === 0) fail(file, null, 'LESSON_META.lessonTitle field topilmadi');

  if (practice) {
    if (/\b(?:AudioEngine|useAudio|useNarration|SpeechSynthesisUtterance|BitSVG)\b|<Bit\b|\/api\/tts/.test(source)) {
      fail(file, null, 'practice audio-free kontraktini buzuvchi audio yoki Bit kodi topildi');
    }
  } else {
    if (audioNodes === 0) fail(file, null, 'theory EN audio localized node topilmadi');
    if (!/["']en-GB["']/.test(source)) fail(file, null, 'Web Speech uchun en-GB locale topilmadi');
    if (!/\/api\/tts\?text=/.test(source) || !/[?&]g=/.test(source)) {
      fail(file, null, 'production TTS text + g kontrakti topilmadi');
    }
    if (/\/api\/tts[\s\S]{0,240}[?&](?:lang|language)=/i.test(source)) {
      fail(file, null, "production TTS URLga taqiqlangan lang/language parametri qo'shilgan");
    }
  }

  if (!/(?:includes\(langProp\)|normali[sz]eLang\([^)]*langProp[^)]*\))/.test(source)) {
    fail(file, null, 'langProp uchun uz/ru/en validatsiyasi topilmadi');
  }
  if (/lessonTitle:\s*LESSON_META\.lessonTitle\s*[,}]/.test(source)) {
    fail(file, null, 'onFinished.lessonTitle tanlangan tilga resolve qilinmagan');
  }
}

const requested = new Set(process.argv.slice(2).map((value) => value.replace(/\.jsx$/, '')));
const targetNames = new Set([
  ...Array.from({ length: 51 }, (_, index) => `Dars${String(index + 1).padStart(2, '0')}.jsx`),
  ...Array.from({ length: 30 }, (_, index) => `Dars${String(index + 1).padStart(2, '0')}Practice.jsx`),
]);
const discoveredEntries = (await readdir(GRADE4_DIR))
  .filter((name) => /^Dars\d{2}(?:Practice)?\.jsx$/.test(name))
  .sort();
const unexpectedEntries = discoveredEntries.filter((name) => !targetNames.has(name));
const allEntries = discoveredEntries.filter((name) => targetNames.has(name));
const entries = requested.size === 0
  ? allEntries
  : allEntries.filter((name) => requested.has(name.replace(/\.jsx$/, '')));

const theory = allEntries.filter((name) => !name.includes('Practice'));
const practice = allEntries.filter((name) => name.includes('Practice'));
if (requested.size === 0 && unexpectedEntries.length) failures.push(`Inventory — scope tashqarisidagi fayllar: ${unexpectedEntries.join(', ')}`);
if (requested.size === 0 && allEntries.length !== 81) failures.push(`Inventory — jami ${allEntries.length}, kutilgan 81`);
if (requested.size === 0 && theory.length !== 51) failures.push(`Inventory — theory ${theory.length}, kutilgan 51`);
if (requested.size === 0 && practice.length !== 30) failures.push(`Inventory — practice ${practice.length}, kutilgan 30`);
if (requested.size > 0 && entries.length !== requested.size) failures.push(`Inventory — so'ralgan ${requested.size} fayldan ${entries.length} tasi topildi`);

for (const file of entries) {
  const source = await readFile(path.join(GRADE4_DIR, file), 'utf8');
  let ast;
  try {
    ast = parse(source, { sourceType: 'module', plugins: ['jsx'], errorRecovery: false });
  } catch (error) {
    failures.push(`${file}:${error.loc?.line ?? '?'} — JSX parse xatosi: ${error.message}`);
    continue;
  }
  const isPractice = file.includes('Practice');
  stats.files += 1;
  stats[isPractice ? 'practice' : 'theory'] += 1;
  inspectAst(file, source, ast, isPractice);
  if (file === 'Dars08.jsx') inspectDars08AudioCoverage(file, source, ast);
}

const lessonPage = await readFile(path.join(ROOT, 'src/components/shared/LessonPage.jsx'), 'utf8');
if (!lessonPage.includes("gradeId === '4-sinf'")) failures.push('LessonPage — 4-sinf uch tilli host panelga ulanmagan');
if (!lessonPage.includes("['uz', 'ru', 'en']")) failures.push('LessonPage — host selector UZ/RU/EN emas');

if (failures.length > 0) {
  console.error(`Grade 4 i18n audit: ${failures.length} ta xato`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log(`Grade 4 i18n audit o'tdi: ${stats.files} fayl (${stats.theory} theory, ${stats.practice} practice), ${stats.localizedNodes} localized node, ${stats.audioNodes} audio node, ${stats.helperCalls} helper call.`);
}
