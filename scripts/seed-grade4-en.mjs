import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parse } from '@babel/parser';

const ROOT = process.cwd();
const GRADE4_DIR = path.join(ROOT, 'src/components/grade4');
const requested = process.argv.slice(2);

if (requested.length === 0) {
  console.error('Usage: node scripts/seed-grade4-en.mjs Dars11Practice [Dars12Practice ...]');
  process.exit(1);
}

const parseFile = (filePath) => parse(fs.readFileSync(filePath, 'utf8'), {
  sourceType: 'module',
  plugins: ['jsx'],
});

const walk = (node, visit) => {
  if (!node || typeof node !== 'object') return;
  visit(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach((item) => walk(item, visit));
    else if (value && typeof value === 'object' && typeof value.type === 'string') walk(value, visit);
  }
};

const keyName = (property) => {
  if (property.computed) return null;
  if (property.key?.type === 'Identifier') return property.key.name;
  if (property.key?.type === 'StringLiteral') return property.key.value;
  return null;
};

const localeStrings = (node) => {
  if (node.type !== 'ObjectExpression') return null;
  const values = {};
  for (const property of node.properties) {
    if (property.type !== 'ObjectProperty') continue;
    const key = keyName(property);
    if (!['uz', 'ru', 'en'].includes(key) || property.value.type !== 'StringLiteral') continue;
    values[key] = property.value.value;
  }
  return values.uz !== undefined && values.ru !== undefined ? values : null;
};

const referenceFiles = fs.readdirSync(GRADE4_DIR)
  .filter((name) => /^Dars\d+(Practice)?\.jsx$/.test(name))
  .map((name) => path.join(GRADE4_DIR, name));

const translations = new Map();
const conflicts = new Set();
for (const filePath of referenceFiles) {
  const ast = parseFile(filePath);
  walk(ast, (node) => {
    const locale = localeStrings(node);
    if (!locale?.en) return;
    const key = JSON.stringify([locale.uz, locale.ru]);
    const existing = translations.get(key);
    if (existing && existing !== locale.en) conflicts.add(key);
    else translations.set(key, locale.en);
  });
}
for (const key of conflicts) translations.delete(key);

let total = 0;
for (const requestedName of requested) {
  const name = requestedName.endsWith('.jsx') ? requestedName : `${requestedName}.jsx`;
  const filePath = path.join(GRADE4_DIR, path.basename(name));
  const source = fs.readFileSync(filePath, 'utf8');
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  const insertions = [];

  walk(ast, (node) => {
    const locale = localeStrings(node);
    if (!locale || locale.en !== undefined) return;
    const languageNeutral = locale.uz === locale.ru && !/[А-Яа-яЁё]/.test(locale.uz) ? locale.uz : null;
    const english = translations.get(JSON.stringify([locale.uz, locale.ru])) ?? languageNeutral;
    if (!english) return;
    const beforeClose = source.slice(node.start, node.end - 1).trimEnd();
    const prefix = beforeClose.endsWith(',') ? ' en: ' : ', en: ';
    insertions.push({ at: node.end - 1, text: `${prefix}${JSON.stringify(english)}` });
  });

  let next = source;
  for (const insertion of insertions.sort((a, b) => b.at - a.at)) {
    next = `${next.slice(0, insertion.at)}${insertion.text}${next.slice(insertion.at)}`;
  }
  if (next !== source) fs.writeFileSync(filePath, next);
  total += insertions.length;
  console.log(`${path.basename(filePath)}: ${insertions.length} exact EN node seeded`);
}

console.log(`Seeded ${total} node from ${translations.size} unambiguous UZ+RU pairs.`);
