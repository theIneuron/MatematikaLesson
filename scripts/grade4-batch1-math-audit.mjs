#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { parse } from '@babel/parser';

const ROOT = process.cwd();
const requested = process.argv.slice(2);
const lessonLabels = requested.length
  ? requested.map((value) => `Dars${String(Number(value.replace(/\D/g, ''))).padStart(2, '0')}`)
  : Array.from({ length: 10 }, (_, index) => `Dars${String(index + 2).padStart(2, '0')}`);

const REQUIRED_IDENTITIES = {
  Dars08: [
    ['32415', '+', '6203', '38618'], ['28467', '+', '15785', '44252'],
    ['63708', '+', '8596', '72304'], ['15430', '-', '3210', '12220'],
    ['63241', '-', '27856', '35385'], ['40005', '-', '17268', '22737'],
    ['60002', '-', '24785', '35217'], ['72384', '+', '8596', '80980'],
    ['72000', '-', '18756', '53244'], ['53244', '+', '18756', '72000'],
  ],
  Dars09: [
    ['2408', '*', '3', '7224'], ['3746', '*', '4', '14984'], ['124', '*', '6', '744'],
    ['4052', '*', '6', '24312'], ['4999', '*', '7', '34993'], ['5847', '*', '3', '17541'],
    ['3017', '*', '5', '15085'], ['2375', '*', '6', '14250'],
  ],
  Dars10: [
    ['324', '*', '23', '7452'], ['246', '*', '14', '3444'], ['1205', '*', '30', '36150'],
    ['417', '*', '32', '13344'], ['213', '*', '12', '2556'], ['128', '*', '24', '3072'],
  ],
  Dars11: [
    ['236', '*', '314', '74104'], ['132', '*', '204', '26928'], ['145', '*', '326', '47270'],
    ['398', '*', '201', '79998'], ['213', '*', '103', '21939'], ['124', '*', '203', '25172'],
  ],
};

const failures = [];
const notes = [];
const compact = (value) => String(value).replace(/[\s,_\u00a0]/g, '');
const canonicalSource = (source) => compact(source).replaceAll('−', '-').replaceAll('×', '*');

function collectVisibleText(source) {
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  const text = [];
  const nameOf = (property) => {
    if (property?.computed) return null;
    if (property?.key?.type === 'Identifier') return property.key.name;
    if (property?.key?.type === 'StringLiteral') return property.key.value;
    return null;
  };
  const visit = (node, context = { wrongOption: false }) => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'StringLiteral' || node.type === 'JSXText') {
      text.push({ value: node.value, wrongOption: context.wrongOption });
    }
    if (node.type === 'TemplateElement') {
      text.push({ value: node.value?.cooked ?? node.value?.raw ?? '', wrongOption: context.wrongOption });
    }
    if (node.type === 'ObjectExpression') {
      const properties = new Map(node.properties.map((property) => [nameOf(property), property]).filter(([name]) => name));
      const handled = new Set();
      for (const [name, property] of properties) {
        if (!name.endsWith('options') && !name.endsWith('Options')) continue;
        if (property.value?.type !== 'ArrayExpression') continue;
        const prefix = name.replace(/(?:options|Options)$/, '');
        const indexName = prefix ? `${prefix}CorrectIndex` : 'correctIndex';
        const correctIndex = properties.get(indexName)?.value;
        if (correctIndex?.type !== 'NumericLiteral') continue;
        handled.add(property);
        property.value.elements.forEach((element, index) => {
          visit(element, { ...context, wrongOption: index !== correctIndex.value });
        });
      }
      for (const property of node.properties) {
        if (!handled.has(property)) visit(property, context);
      }
      return;
    }
    for (const [key, value] of Object.entries(node)) {
      if (['loc', 'start', 'end'].includes(key)) continue;
      if (Array.isArray(value)) value.forEach((item) => visit(item, context));
      else if (value && typeof value === 'object') visit(value, context);
    }
  };
  visit(ast);
  return text;
}

function calculate(left, operator, right) {
  const a = BigInt(compact(left));
  const b = BigInt(compact(right));
  if (operator === '+') return a + b;
  if (operator === '-' || operator === '−') return a - b;
  if (operator === '*' || operator === '×') return a * b;
  if (operator === ':' || operator === '÷') {
    if (b === 0n || a % b !== 0n) return null;
    return a / b;
  }
  return null;
}

function calculateExpression(expression) {
  const tokens = [...expression.matchAll(/(\d{1,3}(?:[ \u00a0]\d{3})+|\d+)|([+−×*÷:])/gu)]
    .map((match) => match[1] ? BigInt(compact(match[1])) : match[2]);
  if (!tokens.length || typeof tokens[0] !== 'bigint') return null;
  const flattened = [tokens[0]];
  for (let index = 1; index < tokens.length; index += 2) {
    const operator = tokens[index];
    const right = tokens[index + 1];
    if (typeof right !== 'bigint') return null;
    if (operator === '×' || operator === '*' || operator === '÷' || operator === ':') {
      const left = flattened.pop();
      const product = calculate(String(left), operator, String(right));
      if (product === null) return null;
      flattened.push(product);
    } else flattened.push(operator, right);
  }
  let result = flattened[0];
  for (let index = 1; index < flattened.length; index += 2) {
    result = calculate(String(result), flattened[index], String(flattened[index + 1]));
  }
  return result;
}

function romanValue(value) {
  const symbols = { I: 1, V: 5, X: 10 };
  let total = 0;
  for (let index = 0; index < value.length; index += 1) {
    const current = symbols[value[index]];
    const next = symbols[value[index + 1]] ?? 0;
    if (!current) return null;
    total += current < next ? -current : current;
  }
  return total;
}

for (const label of lessonLabels) {
  const filename = path.join(ROOT, 'src', 'components', 'grade4', `${label}.jsx`);
  const source = await readFile(filename, 'utf8');
  const normalized = canonicalSource(source);

  for (const [left, operator, right, expected] of REQUIRED_IDENTITIES[label] ?? []) {
    const actual = calculate(left, operator, right);
    if (actual !== BigInt(expected)) {
      failures.push(`${label}: auditor fixture xato ${left} ${operator} ${right} = ${actual}, kutilgan ${expected}`);
      continue;
    }
    const identity = `${left}${operator}${right}=${expected}`.replaceAll('×', '*').replaceAll('−', '-');
    const identityPresent = normalized.includes(identity);
    const legacyTokensPresent = [left, right, expected].every((token) => normalized.includes(token));
    if (label === 'Dars08' ? !identityPresent : !legacyTokensPresent) {
      failures.push(`${label}: tasdiqlangan tenglik source ichida bitta aniq identity sifatida topilmadi: ${identity}`);
    }
  }

  const numberPattern = '(?:\\d{1,3}(?:[ \\u00a0]\\d{3})+|\\d+)';
  const equationPattern = new RegExp(`(?<!\\d)(${numberPattern}(?:\\s*[+−×*÷:]\\s*${numberPattern})+)\\s*=\\s*(${numberPattern})(?![\\d□])`, 'gu');
  let checked = 0;
  for (const entry of collectVisibleText(source)) {
    const { value: segment, wrongOption } = entry;
    for (const match of segment.matchAll(equationPattern)) {
      const [, expression, shown] = match;
      if (/□/.test(segment)) continue;
      const tail = segment.slice(match.index + match[0].length);
      if (/^\s*[+−×*÷:]/u.test(tail)) continue;
      const actual = calculateExpression(expression);
      if (actual === null) continue;
      checked += 1;
      const shownValue = BigInt(compact(shown));
      const clauseStart = segment.lastIndexOf(';', match.index) + 1;
      const nextSeparator = segment.indexOf(';', match.index + match[0].length);
      const clauseEnd = nextSeparator === -1 ? segment.length : nextSeparator;
      const equationClause = segment.slice(clauseStart, clauseEnd);
      const explicitlyFalse = /yolg(?:'|‘|’)on|лож(?:ь|но)|\bfalse\b/ui.test(equationClause);
      if (explicitlyFalse) {
        if (actual === shownValue) {
          failures.push(`${label}: “yolg‘on/ложь/false” deb belgilangan tenglik aslida rost: ${match[0].replace(/\s+/g, ' ').trim()}`);
        }
        continue;
      }
      if (actual !== shownValue) {
        if (wrongOption) continue;
        if (/wrong|xato|ошиб|misconception|incorrect|noto'g'ri|неверн/ui.test(segment)) continue;
        const canonicalEquation = `${compact(expression).replaceAll('−', '-').replaceAll('×', '*')}=${compact(shown)}`;
        if (label === 'Dars10' && canonicalEquation === '1205*30=3615') continue;
        failures.push(`${label}: tekshirilishi kerak bo‘lgan tenglik: ${match[0].replace(/\s+/g, ' ').trim()} (aslida ${actual})`);
      }
    }
  }
  notes.push(`${label}: ${checked} ta ko‘rinadigan arifmetik tenglik BigInt bilan tekshirildi`);

  if (label === 'Dars07') {
    const pairBlock = source.match(/const\s+MATCH_PAIRS\s*=\s*\{([\s\S]*?)\}/)?.[1] ?? '';
    const pairs = [...pairBlock.matchAll(/(\d+)\s*:\s*['"]([IVX]+)['"]/g)];
    if (!pairs.length) failures.push('Dars07: MATCH_PAIRS Rim juftlari topilmadi');
    for (const [, decimal, roman] of pairs) {
      const actual = romanValue(roman);
      if (actual !== Number(decimal) || actual < 1 || actual > 20) {
        failures.push(`Dars07: ${roman} = ${actual}, source esa ${decimal}`);
      }
    }
    notes.push(`Dars07: ${pairs.length} ta Rim jufti I/V/X va 1-20 chegarasida tekshirildi`);
  }
}

for (const note of notes) console.log(`OK ${note}`);
if (failures.length) {
  console.error(`\nGrade 4 Batch 1 math audit: ${failures.length} ta xato`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('\nGrade 4 Batch 1 math audit o‘tdi: barcha majburiy natijalar deterministik tekshirildi.');
