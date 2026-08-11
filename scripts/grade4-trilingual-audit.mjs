#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const targetLessons = [
  ...Array.from({ length: 30 }, (_, index) => `Dars${String(index + 1).padStart(2, '0')}`),
  ...Array.from({ length: 21 }, (_, index) => `Dars${String(index + 1).padStart(2, '0')}Practice`),
];

const result = spawnSync(
  process.execPath,
  [path.join(ROOT, 'scripts/grade4-i18n-audit.mjs'), ...targetLessons],
  { cwd: ROOT, stdio: 'inherit' },
);

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
