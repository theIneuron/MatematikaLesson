#!/usr/bin/env node

import { ESLint } from 'eslint';

const lessonName = (index) => `Dars${String(index).padStart(2, '0')}`;
const targetFiles = [
  ...Array.from({ length: 30 }, (_, index) => `src/components/grade4/${lessonName(index + 1)}.jsx`),
  ...Array.from({ length: 21 }, (_, index) => `src/components/grade4/${lessonName(index + 1)}Practice.jsx`),
  'src/components/shared/LessonPage.jsx',
  'scripts/check-grade4.mjs',
  'scripts/grade4-i18n-audit.mjs',
  'scripts/grade4-lessons-02-16-rules-audit.mjs',
  'scripts/grade4-lessons-17-21-audit.mjs',
  'scripts/grade4-lessons-22-30-audit.mjs',
  'scripts/grade4-practice-17-21-audit.mjs',
  'scripts/grade4-trilingual-audit.mjs',
  'scripts/grade4-trilingual-browser-smoke.mjs',
  'scripts/grade4-trilingual-lint.mjs',
];

const eslint = new ESLint();
const results = await eslint.lintFiles(targetFiles);
const formatter = await eslint.loadFormatter('stylish');
const report = formatter.format(results);

if (report) process.stdout.write(report);

const errorCount = results.reduce((sum, result) => sum + result.errorCount, 0);
const warningCount = results.reduce((sum, result) => sum + result.warningCount, 0);

if (errorCount > 0) {
  process.exitCode = 1;
} else {
  console.log(`Grade 4 trilingual lint o'tdi: ${targetFiles.length} target, ${warningCount} warning.`);
}
