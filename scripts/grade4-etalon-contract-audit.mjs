#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { parse } from '@babel/parser';

const root = process.cwd();
const requested = process.argv.slice(2);
const lessons = requested.length
  ? [...new Set(requested
    .map((value) => Number(value.replace(/\D/g, '')))
    .filter((value) => value >= 2 && value <= 51))]
  : Array.from({ length: 50 }, (_, index) => index + 2);

const rows = [];
const failures = [];
const criticalFailures = [];

const THEORY_TYPES = new Set(['exploration', 'model', 'discovery', 'rule', 'strategy', 'consolidation']);
const NO_FINAL_REFLECTION_LESSONS = new Set(
  Array.from({ length: 50 }, (_, index) => index + 2),
);
const sharedFinaleSource = await readFile(
  path.join(root, 'src', 'components', 'grade4', 'Grade4Finale.jsx'),
  'utf8',
);
// Dars04 slide 1 deliberately stretches the main scene to the answer-frame width.
const FULL_WIDTH_HOOK_LESSONS = new Set([4]);
// Metodist qarori 2026-08-19: 21-30 darslarning yakuniy slaydi etalon Dars01
// tuzilishida quriladi - yakuniy savol, qoida royxati va mukofot paneli.
// Bu darslar uchun uch-xulosa qolipi emas, etalon tuzilishi tekshiriladi.
const REBUILT_ETALON_FINAL = new Set([21, 22, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]);
const has = (source, pattern) => pattern.test(source);
const count = (source, pattern) => (source.match(pattern) || []).length;
const award = (checks) => checks.reduce((score, check) => score + (check.pass ? check.points : 0), 0);

function walk(node, visitor) {
  if (!node || typeof node !== 'object') return;
  visitor(node);
  for (const [key, value] of Object.entries(node)) {
    if (key === 'loc' || key === 'start' || key === 'end') continue;
    if (Array.isArray(value)) value.forEach((item) => walk(item, visitor));
    else if (value && typeof value === 'object' && typeof value.type === 'string') walk(value, visitor);
  }
}

function propertyName(property) {
  if (!property || property.computed) return null;
  if (property.key?.type === 'Identifier') return property.key.name;
  if (property.key?.type === 'StringLiteral') return property.key.value;
  return null;
}

function literalValue(node) {
  if (!node) return undefined;
  if (node.type === 'StringLiteral' || node.type === 'NumericLiteral' || node.type === 'BooleanLiteral') return node.value;
  if (node.type === 'NullLiteral') return null;
  if (node.type === 'ArrayExpression') return node.elements.map(literalValue);
  if (node.type === 'ObjectExpression') return objectValue(node);
  return undefined;
}

function objectValue(node) {
  const result = {};
  for (const property of node.properties ?? []) {
    if (property.type !== 'ObjectProperty') continue;
    const key = propertyName(property);
    if (key) result[key] = literalValue(property.value);
  }
  return result;
}

function extractScreenMeta(ast) {
  const arrays = new Map();
  walk(ast, (node) => {
    if (node.type !== 'VariableDeclarator' || node.id?.type !== 'Identifier') return;
    if (!['SCREEN_META', 'SCREEN_PLAN'].includes(node.id.name)) return;
    if (node.init?.type !== 'ArrayExpression') return;
    arrays.set(node.id.name, node.init.elements
      .filter((element) => element?.type === 'ObjectExpression')
      .map(objectValue));
  });
  return arrays.get('SCREEN_META') ?? arrays.get('SCREEN_PLAN') ?? [];
}

function extractObjectVariable(ast, variableName) {
  let value = null;
  walk(ast, (node) => {
    if (value || node.type !== 'VariableDeclarator' || node.id?.type !== 'Identifier') return;
    if (node.id.name !== variableName || node.init?.type !== 'ObjectExpression') return;
    value = objectValue(node.init);
  });
  return value ?? {};
}

function longestPassiveRun(meta) {
  let longest = 0;
  let current = 0;
  for (const screen of meta) {
    if (screen.active === true) current = 0;
    else {
      current += 1;
      longest = Math.max(longest, current);
    }
  }
  return longest;
}

function containsRole(meta, pattern) {
  return meta.some((screen) => pattern.test([
    screen.type,
    screen.subtype,
    screen.template,
    screen.goal,
  ].filter(Boolean).join(' ')));
}

function disabledGateExpression(attributes) {
  const match = attributes.match(/\bdisabled\s*=\s*\{([^}]*)\}/);
  if (!match) return null;
  const expression = match[1].trim();
  if (!expression || /^(?:!?\s*(?:false|true|null|undefined)|["'][^"']*["']|\d+)$/i.test(expression)) return null;
  if (/\bFREE_NAV\b/.test(expression)) return null;
  return /[A-Za-z_$]/.test(expression) ? expression : null;
}

function inspectActivityGate(source) {
  const issues = [];
  let evidence = 0;

  if (/\bFREE_NAV\b/.test(source)) issues.push('FREE_NAV identifikatori taqiqlangan');

  const navNextTags = [...source.matchAll(/<NavNext\b([\s\S]*?)\/?\s*>/g)];
  for (const [index, match] of navNextTags.entries()) {
    if (disabledGateExpression(match[1])) evidence += 1;
    else issues.push(`NavNext #${index + 1} mazmunli disabled gate olmagan`);
  }

  const allButtons = [...source.matchAll(/<button\b([\s\S]*?)>/g)];
  const directNextButtons = allButtons.filter((match) => {
    if (/\bonClick\s*=\s*\{\s*onNext\s*\}/.test(match[1])) return true;
    const buttonBlock = source.slice(match.index, source.indexOf('</button>', match.index) + 9);
    return /Davom etish/.test(buttonBlock)
      && /(?:Продолжить|Дальше)/u.test(buttonBlock)
      && /Continue/.test(buttonBlock);
  });
  for (const [index, match] of directNextButtons.entries()) {
    if (disabledGateExpression(match[1])) evidence += 1;
    else issues.push(`onNext CTA #${index + 1} mazmunli disabled gate olmagan`);
  }

  if (!navNextTags.length && !directNextButtons.length) {
    issues.push('Davom etish CTA gate kontrakti aniqlanmadi');
  }
  if (evidence === 0) issues.push('javob yoki faoliyat holatiga bog\'langan disabled gate dalili yo\'q');

  return { pass: issues.length === 0, evidence, issues };
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function hasPreClaimReflectionPersistence(source) {
  const choiceHandlers = [...source.matchAll(
    /const\s+(?:chooseReflection|persistReflection)\s*=\s*(?:useCallback\(\s*)?\([^)]*\)\s*=>\s*\{([\s\S]*?)\}\s*(?:,\s*\[[^\]]*\]\s*\))?\s*;/g,
  )].map((match) => match[1]);

  // Pattern A: the lesson root owns the reflection state, passes the same
  // state/setter pair to the final screen, and the final-screen interaction
  // invokes that setter prop before title claim.
  const parentOwned = [...source.matchAll(
    /\[\s*([A-Za-z_$][\w$]*)\s*,\s*([A-Za-z_$][\w$]*)\s*\]\s*=\s*useState\(null\)/g,
  )].some((match) => {
    if (!/reflection/i.test(match[1]) || !/reflection/i.test(match[2])) return false;
    const state = escapeRegExp(match[1]);
    const setter = escapeRegExp(match[2]);
    const props = new RegExp(`reflection(?:Choice)?\\s*=\\s*\\{\\s*${state}\\s*\\}`)
      .test(source)
      && new RegExp(`onReflectionChoice\\s*=\\s*\\{\\s*${setter}\\s*\\}`).test(source);
    const invokedBeforeClaim = /onReflectionChoice(?:\?\.)?\s*\(\s*(?:index|value|choice)\s*\)/.test(source);
    return props && invokedBeforeClaim;
  });

  // Pattern B: remount state comes from storedAnswer and the choice handler
  // itself snapshots the selected reflection. An onAnswer call that appears
  // only in claimTitle is deliberately not accepted.
  const storedAnswerInit = /\[(?:reflection|reflectionChoice),\s*set(?:Reflection|ReflectionChoice)\]\s*=\s*useState\((?:\(\)\s*=>\s*)?storedAnswer\?\.reflection(?:Choice)?[\s\S]{0,180}?\)/.test(source);
  const storedAnswerChoiceSnapshot = choiceHandlers.some((body) => (
    /onAnswer\s*\(/.test(body)
      && /reflection(?:Choice)?\s*:\s*(?:index|value|choice)\b/.test(body)
  ));

  // Pattern C: a finalState/finalRewardState object lives above the remounted
  // screen, is wired through props or context, and its reflection field is
  // updated inside the reflection-choice handler.
  const parentSnapshot = [...source.matchAll(
    /\[\s*(finalRewardState|finalState)\s*,\s*(setFinalRewardState|setFinalState)\s*\]\s*=\s*useState\(\{([^}]+)\}\)/g,
  )].some((match) => {
    const stateName = match[1];
    const setterName = match[2];
    if (!/\breflection(?:Choice)?\s*:\s*null\b/.test(match[3])) return false;
    const state = escapeRegExp(stateName);
    const setter = escapeRegExp(setterName);
    const propWiring = new RegExp(`${state}\\s*=\\s*\\{\\s*${state}\\s*\\}`).test(source)
      && new RegExp(`onFinalState\\s*=\\s*\\{\\s*${setter}\\s*\\}`).test(source);
    const contextWiring = new RegExp(`value=\\{\\{[^}]*\\b${state}\\b[^}]*\\b${setter}\\b[^}]*\\}\\}`).test(source);
    if (!propWiring && !contextWiring) return false;
    const blockHandlerUpdate = choiceHandlers.some((body) => (
      (new RegExp(`\\b${setter}\\s*\\(`).test(body)
        || (propWiring && /\bonFinalState\s*\(/.test(body)))
        && /reflection(?:Choice)?\s*:\s*(?:index|value|choice)\b/.test(body)
    ));
    const expressionHandlerUpdate = new RegExp(
      `const\\s+setReflectionChoice\\s*=\\s*useCallback\\(\\s*\\([^)]*\\)\\s*=>\\s*${setter}\\([\\s\\S]{0,500}?reflection(?:Choice)?\\s*:\\s*(?:index|value|choice)\\b`,
    ).test(source);
    return blockHandlerUpdate || expressionHandlerUpdate;
  });

  return parentOwned || (storedAnswerInit && storedAnswerChoiceSnapshot) || parentSnapshot;
}

for (const lesson of lessons) {
  const label = `Dars${String(lesson).padStart(2, '0')}`;
  const filename = path.join(root, 'src', 'components', 'grade4', `${label}.jsx`);
  const source = await readFile(filename, 'utf8');
  const usesSharedFinale = /from\s+['"]\.\/Grade4Finale\.jsx['"]/.test(source)
    && /<Grade4Finale\b/.test(source);
  const finaleSource = usesSharedFinale ? `${source}\n${sharedFinaleSource}` : source;
  let ast;

  try {
    ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  } catch (error) {
    failures.push(`${label}: JSX parse xatosi — ${error.message}`);
    criticalFailures.push(`${label}: JSX parse`);
    continue;
  }

  const meta = extractScreenMeta(ast);
  const dars08Content = lesson === 8 ? extractObjectVariable(ast, 'CONTENT') : {};
  const screenCount = meta.length;
  const activeCount = meta.filter((screen) => screen.active === true).length;
  const explicitActivity = meta.length > 0 && meta.every((screen) => typeof screen.active === 'boolean');
  const invalidMetaRows = meta
    .map((screen, index) => {
      const valid = screen.id === `s${index}`
        && typeof screen.type === 'string' && screen.type.trim()
        && typeof screen.goal === 'string' && screen.goal.trim()
        && typeof (screen.template ?? screen.mechanic) === 'string'
        && (screen.template ?? screen.mechanic).trim()
        && typeof screen.active === 'boolean'
        && typeof screen.scored === 'boolean'
        && Object.hasOwn(screen, 'scope')
        && Array.isArray(screen.misconceptions);
      return valid ? null : `s${index}`;
    })
    .filter(Boolean);
  const metadataContract = meta.length > 0 && invalidMetaRows.length === 0;
  if (invalidMetaRows.length) {
    failures.push(`${label}: SCREEN_META kontrakti noto'g'ri — ${invalidMetaRows.join(', ')}`);
  }
  const activeRatio = screenCount ? activeCount / screenCount : 0;
  const passiveRun = longestPassiveRun(meta);
  const mechanics = new Set(meta
    .filter((screen) => screen.active === true)
    .map((screen) => screen.template)
    .filter((template) => typeof template === 'string' && template.trim()));
  const first = meta[0] ?? {};
  const last = meta.at(-1) ?? {};
  const theoryCount = meta.filter((screen) => THEORY_TYPES.has(screen.type)).length;
  const scoredUnits = meta.reduce((total, screen) => {
    if (screen.scored !== true) return total;
    return total + (Number.isInteger(screen.scoreUnits) && screen.scoreUnits > 0 ? screen.scoreUnits : 1);
  }, 0);
  const hasMatching = meta.some((screen) => (
    screen.type === 'matching' || /matching/i.test(`${screen.subtype ?? ''} ${screen.template ?? ''}`)
  ));

  const roleCompleteness = containsRole(meta, /strategy/i)
    && containsRole(meta, /error|misconception|repair/i)
    && containsRole(meta, /life|context|transfer|case/i)
    && containsRole(meta, /reflection|summary/i);
  const hasMisconceptions = meta
    .filter((screen) => screen.active === true && /test|case|error|matching|construction/i.test(
      `${screen.type ?? ''} ${screen.subtype ?? ''} ${screen.template ?? ''}`,
    ))
    .every((screen) => Array.isArray(screen.misconceptions)
      ? screen.misconceptions.length > 0
      : /error|matching|construction|case/i.test(`${screen.type} ${screen.template ?? ''}`));

  const hookMarkers = has(source, /data-g4-screen=["'{][^\n>]*hook/)
    && has(source, /data-g4-role=["'{][^\n>]*hook-scene/)
    && has(source, /data-g4-role=["'{][^\n>]*answer-card/);
  const canonicalHookRoles = label === 'Dars05'
    ? ['hook-title', 'hook-question', 'hook-scene', 'visual-frame', 'hook-bit']
    : ['hook-topic', 'hook-title', 'hook-question', 'hook-scene', 'visual-frame', 'hook-bit'];
  const canonicalHookMarkers = canonicalHookRoles
    .every((role) => new RegExp(`data-g4-role=["'{][^\\n>]*${role}`).test(source));
  const hookWidthPattern = FULL_WIDTH_HOOK_LESSONS.has(lesson)
    ? /\[data-g4-role~=["']hook-scene["']\]\s*\{\s*width\s*:\s*100%/
    : /width\s*:\s*min\(760px\s*,\s*100%\)/;
  const canonicalHookFrame = [
    hookWidthPattern,
    /min-height\s*:\s*206px/,
    /border-radius\s*:\s*24px/,
    /overflow\s*:\s*(?:hidden|clip)/,
    /isolation\s*:\s*isolate/,
    /radial-gradient\(circle at 87% 24%,\s*rgba\(121\s*,\s*211\s*,\s*218\s*,\s*\.16\)/,
    /radial-gradient\(circle at 9% 88%,\s*rgba\(149\s*,\s*201\s*,\s*61\s*,\s*\.11\)/,
    /linear-gradient\(145deg,\s*rgba\(22\s*,\s*143\s*,\s*163\s*,\s*\.25\)\s*,\s*transparent 48%\)/,
    /linear-gradient\(135deg,\s*#153B50\s*,\s*#0B2232 72%\)/i,
    /box-shadow\s*:\s*0 22px 50px -30px rgba\(14\s*,\s*33\s*,\s*44\s*,\s*\.75\)/,
    /min-height\s*:\s*164px/,
    /border-radius\s*:\s*18px/,
  ].every((pattern) => pattern.test(source));
  const canonicalHookBit = [
    /width\s*:\s*88px/,
    /height\s*:\s*110px/,
    /right\s*:\s*42px/,
    /bottom\s*:\s*-4px/,
    /width\s*:\s*68px/,
    /height\s*:\s*85px/,
    /right\s*:\s*12px/,
    /bottom\s*:\s*-7px/,
  ].every((pattern) => pattern.test(source));
  const canonicalTypography = [
    /font-family\s*:\s*['"]Source Serif 4['"]/,
    /font-family\s*:\s*['"]Manrope['"]/,
    /font-family\s*:\s*['"]JetBrains Mono['"]/,
    /clamp\(26px\s*,\s*4\.2vw\s*,\s*36px\)/,
    /font-size\s*:\s*25px/,
    /clamp\(17px\s*,\s*2\.5vw\s*,\s*21px\)/,
    /clamp\(14px\s*,\s*1\.8vw\s*,\s*16px\)/,
    /clamp\(15px\s*,\s*2vw\s*,\s*18px\)/,
    /text-align\s*:\s*left/,
  ].every((pattern) => pattern.test(source)) && !/(?:Nunito Sans|Fraunces|Arial)/.test(source);
  const canonicalFeedbackVisual = [
    /data-g4-role=["'{][^\n>]*feedback-frame/,
    /data-g4-role=["'{][^\n>]*feedback-bit/,
    /data-g4-role=["'{][^\n>]*bit-answer-comment/,
    /data-g4-feedback=[{][^}]*['"](?:solution|correct)['"]/,
    /data-g4-feedback=[{][^}]*['"]wrong['"]/,
    /min-height\s*:\s*88px/,
    /padding\s*:\s*8px 15px 8px 9px/,
    /width\s*:\s*62px/,
    /height\s*:\s*76px/,
    /width\s*:\s*54px/,
    /height\s*:\s*68px/,
    /width\s*:\s*51px/,
    /height\s*:\s*64px/,
    /width\s*:\s*47px/,
    /height\s*:\s*59px/,
    /linear-gradient\(135deg\s*,\s*#(?:FFF|FFFFFF)\s*,\s*#E7F3EC\)/i,
    /linear-gradient\(135deg\s*,\s*#(?:FFF|FFFFFF)\s*,\s*#FFF5D9\)/i,
    /#227A53/i,
    /#A96F13/i,
  ].every((pattern) => pattern.test(source));
  const visualFrameContainment = /data-g4-role=["'{][^\n>]*visual-frame/.test(source)
    && /position\s*:\s*relative/.test(source)
    && /min-width\s*:\s*0/.test(source)
    && /isolation\s*:\s*isolate/.test(source)
    && /overflow\s*:\s*(?:hidden|clip)/.test(source)
    && /(?:svg|img|canvas)[^{]*\{[^}]*max-width\s*:\s*100%/s.test(source);
  const noEtalonOnlyCallout = !/Kod qanday tuzilgan\??/i.test(source);
  // Returning to the hook must preserve the learner's answer. Accept either
  // the explicit metadata marker used by older shells or a parent-owned answer
  // snapshot restored through storedAnswer in the hook itself.
  const hookScreenBlock = source.match(
    /(?:function\s+(?:HookScreen|Screen0)|const\s+(?:HookScreen|Screen0)\s*=)[\s\S]*?(?=(?:function\s+|const\s+)[A-Z][A-Za-z0-9_]*(?:\s*=|\s*\())/,
  )?.[0] ?? '';
  const persistentHookAnswer = /storedAnswer/.test(hookScreenBlock)
    && /studentAnswerIndex/.test(hookScreenBlock)
    && /onAnswer\s*\(/.test(hookScreenBlock);
  const hookReset = first.resetOnReturn === true || persistentHookAnswer;
  const feedbackMarker = has(source, /data-g4-feedback=/);
  const contextualBit = has(source, /BitSVG[\s\S]{0,180}?state=\{[^}]*\?\s*["']nod["'][^:]*:\s*["']awkward["']/)
    || (has(source, /function\s+BitAnswerComment|const\s+BitAnswerComment\s*=/)
      && has(source, /function\s+FeedbackBlock|const\s+FeedbackBlock\s*=/)
      && has(source, /["']nod["']/)
      && has(source, /["']awkward["']/));
  const localizedSolution = /YECHIM/.test(source)
    && /\u0420\u0415\u0428\u0415\u041D\u0418\u0415/u.test(source)
    && /SOLUTION/.test(source);
  const retryState = /attempt|firstTry|firstAttempt|retry|wrong(?:By|Set|Pair|Index)|lastWrong/.test(source);

  const matchingConnector = !hasMatching || (
    /function MatchingLines\s*\(|const MatchingLines\s*=/.test(source)
    && /data-match-left=/.test(source)
    && /data-match-right=/.test(source)
    && /ResizeObserver/.test(source)
    && /matching-connector-(?:correct|wrong)|wrongPair/.test(source)
    && /aria-live=|ariaLive/.test(source)
  );

  const noScrollViolations = [
    ['CSS overflow auto/scroll', /\boverflow(?:-[xy])?\s*:\s*(?:auto|scroll)\b/i],
    ['inline-style overflow auto/scroll', /\boverflow(?:X|Y)?\s*:\s*['"](?:auto|scroll)['"]/i],
    ['scrollTo/scrollIntoView', /\b(?:scrollIntoView|scrollTo)(?:\?\.)?\s*\(/],
    ['scrollbar CSS', /\bscrollbar-(?:gutter|width|color)\s*:|::-webkit-scrollbar/i],
  ].filter(([, pattern]) => pattern.test(source)).map(([name]) => name);
  const bannedScroll = noScrollViolations.length > 0;
  noScrollViolations.forEach((name) => failures.push(`${label}: no-scroll buzilishi — ${name}`));
  const stickyCaption = /\.caption[^{}]*\{[^}]*position\s*:\s*sticky/s.test(source);
  const fixedRootSelector = /\.(?:lesson-root|d8-root)[^{}]*\{[^}]*position\s*:\s*fixed/s;
  const insetRootSelector = /\.(?:lesson-root|d8-root)[^{}]*\{[^}]*inset\s*:\s*0/s;
  const fixedViewport = /100dvh/.test(source)
    && /className=["'{][^\n>]*(?:lesson-root|d8-root)/.test(source)
    && fixedRootSelector.test(source)
    && insetRootSelector.test(source);
  const correctWidth = /max-width\s*:\s*936px/.test(source) || /width\s*:\s*min\(936px,\s*100%\)/.test(source);
  const noInfiniteMotion = !/animation\s*:[^;{}]*\binfinite\b/.test(source);
  const reducedMotion = /prefers-reduced-motion\s*:\s*reduce/.test(source);

  const sharedFinaleContract = usesSharedFinale
    && /data-g4-final-layout=["']title-left-steps-right["']/.test(sharedFinaleSource)
    && /data-g4-final-reflection=["']none["']/.test(sharedFinaleSource)
    && /Array\.from\(\{\s*length:\s*3\s*\}/.test(sharedFinaleSource)
    && /data-g4-role=["']final-proof["']/.test(sharedFinaleSource)
    && /data-g4-role=["']final-bridge["']/.test(sharedFinaleSource);
  const booleanClaimState = /\[titleClaimed,\s*setTitleClaimed\]\s*=\s*useState\((?:false|storedAnswer\?\.titleClaimed\s*===\s*true)\)/.test(source)
    || (sharedFinaleContract
      && /useGrade4TitleClaim\(\{/.test(source)
      && /storedAnswer\?\.titleClaimed\s*===\s*true/.test(sharedFinaleSource));
  const finiteClaimTransitions = /setTitleState\([\s\S]{0,260}["']revealing["']/.test(source)
    && /setTitleState\(["']claimed["']\)/.test(source);
  const finiteClaimState = /\[titleState,\s*setTitleState\]\s*=\s*useState\(["'](?:unclaimed|claimed)["']\)/.test(source)
    && finiteClaimTransitions;
  const persistedFiniteClaimState = /\[titleState,\s*setTitleState\]\s*=\s*useState\(finalState\.titleClaimed\s*\?\s*["']claimed["']\s*:\s*["']unclaimed["']\)/.test(source)
    && /\[finalState,\s*setFinalState\]\s*=\s*useState\(\{\s*step:\s*0,\s*reflection:\s*null,\s*titleClaimed:\s*false\s*\}\)/.test(source)
    && /finalState=\{finalState\}/.test(source)
    && /onFinalState=\{setFinalState\}/.test(source)
    && /onFinalState\(\(previous\)\s*=>\s*\(\{\s*\.\.\.previous,\s*step:\s*nextStep\s*\}\)\)/.test(source)
    && /onFinalState\(\(previous\)\s*=>\s*\(\{\s*\.\.\.previous,\s*reflection:\s*index\s*\}\)\)/.test(source)
    && /onFinalState\(\(previous\)\s*=>\s*\(\{\s*\.\.\.previous,\s*titleClaimed:\s*true\s*\}\)\)/.test(source)
    && finiteClaimTransitions;
  const persistedContextClaimState = /\[finalRewardState,\s*setFinalRewardState\]\s*=\s*useState\(\{\s*reflectionChoice:\s*null,\s*titleState:\s*["']unclaimed["']\s*\}\)/.test(source)
    && /value=\{\{[^}]*\bfinalRewardState\b[^}]*\bsetFinalRewardState\b[^}]*\}\}/.test(source)
    && /\{\s*reflectionChoice,\s*titleState\s*\}\s*=\s*finalRewardState/.test(source)
    && /const\s+setTitleState\s*=\s*useCallback\(\s*\(value\)\s*=>\s*setFinalRewardState\(\(previous\)\s*=>\s*\(\{\s*\.\.\.previous,\s*titleState:\s*value\s*\}\)\)/.test(source)
    && finiteClaimTransitions;
  const claimState = booleanClaimState || finiteClaimState || persistedFiniteClaimState || persistedContextClaimState;
  const claimButton = /className=["'{][^\n>]*g4-title-claim/.test(finaleSource)
    && /Claim title/.test(finaleSource)
    && /\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0437\u0432\u0430\u043d\u0438\u0435/ui.test(finaleSource)
    && /Unvonni olish/.test(finaleSource);
  const contextReflectionState = /\{\s*reflectionChoice,\s*titleState\s*\}\s*=\s*finalRewardState/.test(source)
    && /const\s+setReflectionChoice\s*=\s*useCallback\(\s*\(value\)\s*=>\s*setFinalRewardState\(/.test(source);
  const finalReflectionRemoved = NO_FINAL_REFLECTION_LESSONS.has(lesson)
    && /finalReflectionRequired\s*:\s*false/.test(source)
    && /data-g4-final-reflection=["']none["']/.test(finaleSource);
  const reflectionUi = /(?:data-g4-role=["'{][^\n>]*reflection|className=["'{][^\n>]*(?:finale-reflection|final-reflection))/.test(source)
    && (/\[(?:reflection|reflectionChoice),\s*set(?:Reflection|ReflectionChoice)\]\s*=\s*useState\(/.test(source)
      || contextReflectionState);
  const reflectionGate = /disabled=\{[^}]*reflection(?:Choice)?\s*===\s*null/.test(source)
    || /disabled=\{[^}]*reflection(?:Choice)?\s*!==\s*null/.test(source)
    || /if\s*\([^)]*reflection(?:Choice)?\s*===\s*null[^)]*\)\s*return/.test(source);
  const claimHandlers = [
    ...source.matchAll(
      /const\s+claimTitle\s*=\s*(?:useCallback\(\s*)?\(\)\s*=>\s*\{([\s\S]*?)\}(?:\s*,\s*\[[^\]]*\]\s*\))?/g,
    ),
    ...source.matchAll(/const\s+claim\s*=\s*\(\)\s*=>\s*\{([\s\S]*?)\}/g),
  ].map((match) => match[1]);
  const claimButtonTags = [...source.matchAll(/<button\b[^>]*>/g)]
    .map((match) => match[0])
    .filter((tag) => /g4-title-claim/.test(tag));
  const directHandlerGate = claimHandlers.some((handler) => (
    /reflection(?:Choice)?\s*===\s*null/.test(handler)
    || /!reflectionSolved/.test(handler)
  ));
  const directButtonGate = claimButtonTags.some((tag) => (
    /disabled=\{[^}]*reflection(?:Choice)?[^}]*(?:===|!==)[^}]*null/.test(tag)
    || /disabled=\{[^}]*reflectionSolved/.test(tag)
  ));
  // Some shells own the claim state in the lesson root and expose an onClaim
  // callback to the final screen. In those cases both the real button and the
  // only call site must be guarded by the local reflection state.
  const delegatedButtonGate = claimButtonTags.some((tag) => (
    /disabled=\{[^}]*reflection(?:Choice)?[^}]*(?:===|!==)[^}]*null/.test(tag)
    || /disabled=\{[^}]*reflectionSolved/.test(tag)
  )) && /onClick=\{(?:onClaimTitle|onClaim)\}/.test(source);
  const delegatedInlineGate = claimButtonTags.some((tag) => (
    /disabled=\{[^}]*reflection(?:Choice)?[^}]*(?:===|!==)[^}]*null/.test(tag)
    || /disabled=\{[^}]*reflectionSolved/.test(tag)
  )) && /onClick=\{\(\)\s*=>\s*\{[^}]*onClaimTitle/.test(source);
  const reflectionBeforeClaim = (directHandlerGate && directButtonGate)
    || delegatedButtonGate
    || delegatedInlineGate;
  const localFinalStateClaimGate = /const\s+canClaimTitle\s*=\s*audio\.completed\s*\|\|\s*audio\.muted/.test(source)
    && /disabled=\{!canClaimTitle\}/.test(source)
    && /if\s*\([^)]*!canClaimTitle[^)]*\)\s*return/.test(source);
  const sharedFinalStateClaimGate = sharedFinaleContract
    && /const\s+canClaimTitle\s*=\s*audio\?\.completed\s*===\s*true\s*\|\|\s*audio\?\.muted\s*===\s*true/.test(sharedFinaleSource)
    && /disabled=\{!canClaimTitle\}/.test(sharedFinaleSource)
    && /if\s*\(!canClaimTitle\s*\|\|\s*titleClaimed\)\s*return false/.test(sharedFinaleSource)
    && /canFinish=\{titleClaimed\}/.test(source);
  const finalStateClaimGate = localFinalStateClaimGate || sharedFinalStateClaimGate;
  const localFinalComposition = /className=["']screen-stack finale-screen["']/.test(source)
    && /className=["']finale-heading["']/.test(source)
    && /className=["']finale-mastery["']/.test(source)
    && /className=\{`finale-proof/.test(source)
    && /className=\{`finale-bridge/.test(source)
    && /className=["']finale-actions["']/.test(source);
  const sharedFinalComposition = sharedFinaleContract
    && /takeaways=\{/.test(source)
    && /proof=\{\{/.test(source)
    && /bridge=\{/.test(source)
    && /renderTitleCard=\{/.test(source)
    && /bitSlot=\{/.test(source)
    && /const\s+activeBitSlot\s*=\s*titleClaimed\s*\?\s*null\s*:\s*bitSlot/.test(sharedFinaleSource);
  const standardFinalComposition = finalReflectionRemoved
    && !reflectionUi
    && (localFinalComposition || sharedFinalComposition);
  const etalonFinal = REBUILT_ETALON_FINAL.has(lesson);
  const etalonFinalComposition = [
    /className=["']screen-stack summary-stack["']/,
    /className=["']final-mission-heading["']/,
    /summary-action-layout summary-final-layout/,
    /summary-card reflection-card final-question-card/,
    /className=["']summary-question-kicker["']/,
    /data-g4-role=["']reflection-options["']/,
    /className=\{`reflection-option /,
    /summary-rules-disclosure/,
    /summary-rules-panel/,
    /className=["']summary-rule-items["']/,
    /reward-stage reward-stage-compact/,
    /reward-kicker/,
    /reward-score/,
  ].every((pattern) => pattern.test(source));
  // Unvon faqat yakuniy savoldan keyin ochiladi va tanlov Back dan keyin saqlanadi.
  const etalonReflectionGate = /\[reflection, setReflection\]\s*=\s*useState\(storedAnswer\?\.reflection/.test(source)
    && /const solved = reflection === c.correctIndex;/.test(source)
    && /if \(solved \|\| wrongSet\.has\(sourceIndex\) \|\| !\(audio\.muted \|\| audio\.completed\)\) return;/.test(source)
    && /reflection: sourceIndex,/.test(source)
    && /solved \? ['"]reward-unlocked['"] : ['"]reward-locked['"]/.test(source)
    && /if \(!solved \|\| finished/.test(source)
    && /nextDisabled=\{!solved \|\| finished/.test(source);
  const rankOverlay = /className=["'{][^\n>]*rank-boost-overlay/.test(finaleSource)
    && /data-g4-role=["'{][^\n>]*rank-overlay/.test(finaleSource)
    && /rank-boost-(?:card|medal|confetti)/.test(finaleSource);
  const gatedReveal = rankOverlay || /<(?:G4)?TitleReveal\s+active=\{titleClaimed\}/.test(source)
    || (/<(?:G4)?TitleReveal\s+active=\{revealRequested\}/.test(source)
      && /setRevealRequested\(true\)/.test(finaleSource))
    || (/<(?:G4)?TitleReveal\s+active=\{titleState\s*===\s*["']revealing["']\}/.test(source)
      && /setTitleState\([\s\S]{0,260}["']revealing["']/.test(source))
    || (/<(?:G4)?TitleReveal\s+active=\{revealing\}/.test(source)
      && /const\s+revealing\s*=\s*titleState\s*===\s*["']revealing["']/.test(source)
      && /setTitleState\([\s\S]{0,260}["']revealing["']/.test(source));
  const persistentTitle = /data-g4-role=["'{][^\n>]*title-card/.test(finaleSource)
    && (/titleClaimed\s*&&/.test(source)
      || /titleState\s*===\s*["']claimed["']\s*&&/.test(source)
      || /titleState\s*!==\s*["']claimed["']\s*\?[\s\S]{0,900}:\s*<(?:G4)?TitleCard\b/.test(source)
      || (sharedFinaleContract
        && /!titleClaimed\s*\?\s*\(/.test(sharedFinaleSource)
        && /:\s*renderTitleCard\?\.\(\)/.test(sharedFinaleSource))
      || (/const\s+claimed\s*=\s*titleState\s*===\s*["']claimed["']/.test(source)
        && /claimed\s*&&\s*</.test(source)));
  const claimBeforeFinish = /titleClaimed\s*\?\s*finishLesson/.test(source)
    || /disabled=\{!titleClaimed/.test(source)
    || /canFinish=\{titleClaimed\}/.test(source)
    || /canFinish=\{titleState\s*===\s*["']claimed["']\}/.test(source)
    || (/const\s+claimed\s*=\s*titleState\s*===\s*["']claimed["']/.test(source)
      && /(?:NavNext|button)[^>]*disabled=\{!claimed\}/.test(source));
  const solvedReflectionAlias = /\[reflectionSolved,\s*setReflectionSolved\]\s*=\s*useState\(/.test(source)
    && /setReflectionSolved\(true\)/.test(source)
    && /(?:disabled=\{[^}]*!reflectionSolved|if\s*\([^)]*!reflectionSolved[^)]*\)\s*return)/.test(source);
  const titleRevealBlock = source.match(
    /(?:function\s+(?:(?:G4)?TitleReveal|(?:G4)?RankBoost)|const\s+(?:(?:G4)?TitleReveal|(?:G4)?RankBoost)\s*=)[\s\S]*?(?=(?:function\s+(?:G4)?TitleCard|const\s+(?:G4)?TitleCard\s*=))/,
  )?.[0] ?? '';
  const revealDuration = /setTimeout\([\s\S]*?3900/.test(titleRevealBlock)
    || (sharedFinaleContract && /setTimeout\([\s\S]*?4300/.test(sharedFinaleSource));
  const reducedRevealDuration = /matchMedia\?\.\(['"]\(prefers-reduced-motion:\s*reduce\)['"]\)[\s\S]*?\?\s*(?:0|80|120)\s*:\s*3900/.test(titleRevealBlock)
    || (sharedFinaleContract && /reduced\s*\?\s*350\s*:\s*4300/.test(sharedFinaleSource));
  const standardHappyReward = /(?:reward-stage|g4-title-card-stage)/.test(finaleSource)
    && /data-g4-role=["'{][^\n>]*reward-confetti/.test(finaleSource)
    && /data-g4-role=["'{][^\n>]*reward-bit/.test(finaleSource)
    && /data-g4-role=["'{][^\n>]*reward-medal/.test(finaleSource)
    && /<BitSVG\b[^>]*\bstate=\{?[^>]*["']happy["']/.test(finaleSource);
  const dars04NoBitReward = lesson === 4
    && /data-g4-title-bit=["']absent["']/.test(source)
    && /data-g4-role=["'{][^\n>]*reward-confetti/.test(source)
    && /data-g4-role=["'{][^\n>]*reward-medal/.test(source)
    && /data-g4-duration-ms=["']5000["']/.test(source)
    && !/data-g4-role=["'{][^\n>]*reward-bit/.test(source);
  const dars05NoBitReward = lesson === 5
    && /data-g4-title-bit=["']absent["']/.test(source)
    && /data-g4-role=["'{][^\n>]*reward-confetti/.test(source)
    && /data-g4-role=["'{][^\n>]*reward-medal/.test(source)
    && !/data-g4-role=["'{][^\n>]*reward-bit/.test(source);
  const dars03NoBitReward = lesson === 3
    && /data-g4-title-bit=["']absent["']/.test(source)
    && /data-g4-role=["'{][^\n>]*reward-confetti/.test(source)
    && /data-g4-role=["'{][^\n>]*reward-medal/.test(source)
    && !/data-g4-role=["'{][^\n>]*reward-bit/.test(source);
  const dars06NoBitReward = lesson === 6
    && /data-g4-title-bit=["']absent["']/.test(source)
    && /data-g4-role=["'{][^\n>]*reward-confetti/.test(source)
    && /data-g4-role=["'{][^\n>]*reward-medal/.test(source)
    && !/data-g4-role=["'{][^\n>]*reward-bit/.test(source);
  const dars07NoBitReward = lesson === 7
    && /data-g4-title-bit=["']absent["']/.test(source)
    && /data-g4-role=["'{][^\n>]*reward-confetti/.test(source)
    && /data-g4-role=["'{][^\n>]*reward-medal/.test(source)
    && /data-g4-duration-ms=["']3000["']/.test(source)
    && !/data-g4-role=["'{][^\n>]*reward-bit/.test(source);
  const dars09NoBitReward = lesson === 9
    && /data-g4-title-bit=["']absent["']/.test(source)
    && /data-g4-role=["'{][^\n>]*reward-confetti/.test(source)
    && /data-g4-role=["'{][^\n>]*reward-medal/.test(source)
    && !/data-g4-role=["'{][^\n>]*reward-bit/.test(source);
  const persistentHappyReward = standardHappyReward || dars03NoBitReward || dars04NoBitReward || dars05NoBitReward || dars06NoBitReward || dars07NoBitReward || dars09NoBitReward;

  const explicitLocaleTriples = count(source, /\buz\s*:/g) >= 10
    && count(source, /\bru\s*:/g) >= 10
    && count(source, /\ben\s*:/g) >= 10;
  // Some self-contained lessons build all three locale branches through a
  // small B()/b()/bi() helper instead of repeating object keys at every call.
  // Count those calls as triples only when the helper itself exposes uz/ru/en.
  const localeHelperDefined = /function\s+(?:B|b|bi)\s*\([^)]*\)[\s\S]{0,500}\buz\b[\s\S]{0,500}\bru\b[\s\S]{0,500}\ben\b/
    .test(source)
    || /const\s+(?:B|b|bi)\s*=\s*\([^)]*\)\s*=>[\s\S]{0,500}\buz\b[\s\S]{0,500}\bru\b[\s\S]{0,500}\ben\b/
      .test(source);
  const localeHelperTriples = count(source, /\b(?:B|b|bi)\s*\(/g) >= 10;
  const localizedTriples = explicitLocaleTriples || (localeHelperDefined && localeHelperTriples);
  const audioContract = /class AudioEngine/.test(source)
    && /function useAudio\s*\(|const useAudio\s*=/.test(source)
    && /pushOneOff/.test(source)
    && /en-GB/.test(source)
    && /ttsApiBase/.test(source);
  const previewContract = /previewMode/.test(source);
  const componentProps = /export default function Grade4Dars\d+\s*\(\{[^}]*lang[^}]*onFinished[^}]*\}/s.test(source)
    && /studentName/.test(source)
    && /ttsApiBase/.test(source);
  const completionGuard = /finished(?:Ref)?\.current|if\s*\(finished\)|setFinished\(true\)/.test(source);
  const payloadContract = /onFinished/.test(source)
    && /lessonId/.test(source)
    && /lessonTitle/.test(source)
    && /durationSec/.test(source)
    && /answers/.test(source)
    && completionGuard;
  const accessibility = /aria-live=|ariaLive/.test(source)
    && /focus-visible/.test(source)
    && /min-(?:width|height)\s*:\s*44px|width\s*:\s*44px|height\s*:\s*44px/.test(source);
  const activityGate = inspectActivityGate(source);
  const preClaimReflectionPersistence = hasPreClaimReflectionPersistence(source);
  activityGate.issues.forEach((issue) => failures.push(`${label}: ${issue}`));

  const methodologyChecks = [
    { points: 7, pass: screenCount >= 13 && screenCount <= 17 && first.type === 'hook' && last.type === 'summary' },
    { points: 8, pass: explicitActivity && activeRatio >= 0.7 },
    { points: 5, pass: passiveRun <= 2 },
    { points: 5, pass: theoryCount >= 4 && scoredUnits >= 4 },
    { points: 5, pass: roleCompleteness },
    { points: 5, pass: hasMisconceptions },
  ];

  const interactionChecks = [
    { points: 5, pass: hookMarkers && first.active === true && hookReset },
    { points: 6, pass: feedbackMarker && contextualBit },
    { points: 4, pass: localizedSolution },
    { points: 4, pass: retryState },
    { points: 3, pass: mechanics.size >= 4 },
    { points: 3, pass: matchingConnector },
  ];

  const visualChecks = [
    { points: 6, pass: fixedViewport },
    { points: 6, pass: !bannedScroll && !stickyCaption },
    { points: 4, pass: correctWidth && /@media\s*\([^)]*max-width/.test(source) },
    { points: 4, pass: noInfiniteMotion },
  ];

  const motionFinalChecks = [
    { points: 2, pass: etalonFinal ? (etalonFinalComposition && etalonReflectionGate) : (claimState && claimButton && (reflectionUi || finalReflectionRemoved)) },
    { points: 2, pass: etalonFinal ? (gatedReveal && rankOverlay && /data-g4-role=["']title-card["']/.test(source)) : (gatedReveal && rankOverlay && persistentTitle) },
    { points: 2, pass: etalonFinal ? etalonReflectionGate : (claimBeforeFinish && (finalReflectionRemoved
      ? !reflectionUi && finalStateClaimGate
      : (reflectionGate || solvedReflectionAlias) && reflectionBeforeClaim)) },
    { points: 2, pass: revealDuration && persistentHappyReward },
    { points: 2, pass: reducedMotion && reducedRevealDuration },
  ];

  const technicalChecks = [
    { points: 2, pass: localizedTriples },
    { points: 2, pass: audioContract && previewContract },
    { points: 2, pass: componentProps },
    { points: 2, pass: payloadContract },
    { points: 2, pass: accessibility },
  ];

  const dars08Critical = lesson !== 8 ? [] : [
    ['Dars08 exact 15 direct screens',
      screenCount === 15
        && JSON.stringify(meta.map((screen) => screen.id)) === JSON.stringify(Array.from({ length: 15 }, (_, index) => `s${index}`))
        && meta.at(-1)?.type === 'summary'
        && /const\s+TOTAL_SCREENS\s*=\s*15\s*;/.test(source)
        && /const\s+SCREENS\s*=\s*\[\s*Screen0\s*,\s*Screen1\s*,\s*Screen2\s*,\s*Screen3\s*,\s*Screen4\s*,\s*Screen5\s*,\s*Screen6\s*,\s*Screen7\s*,\s*Screen8\s*,\s*Screen9\s*,\s*Screen10\s*,\s*Screen11\s*,\s*Screen12\s*,\s*Screen13\s*,\s*Screen14\s*\]/.test(source)
        && !/\b(?:SOURCE_ORDER|sourceScreen|stage-fit)\b|\bzoom\s*:/.test(source)],
    ['Dars08 s4 exact three sequential steps',
      dars08Content.s4?.steps?.length === 3
        && meta[4]?.subtype === 'step-by-step'
        && /const\s+Screen4\s*=\s*\(props\)\s*=>\s*<ExplanationScreen\b[^>]*screen=\{4\}[^>]*c=\{CONTENT\.s4\}/.test(source)
        && /data-qa-explanation-steps=\{c\.steps\.length\}/.test(source)
        && /if\s*\(index\s*>\s*visited\.size\s*&&\s*!visited\.has\(index\)\)\s*return/.test(source)],
    ['Dars08 s9 exact three sequential steps',
      dars08Content.s9?.states?.length === 3
        && ['uz', 'ru', 'en'].every((lang) => dars08Content.s9?.audio?.steps?.[lang]?.length === 3)
        && meta[9]?.subtype === 'three-step-zero-chain'
        && /const\s+Screen9\s*=\s*\(props\)\s*=>\s*<GuidedChoiceStepsScreen\b[^>]*screen=\{9\}[^>]*c=\{CONTENT\.s9\}/.test(source)
        && /if\s*\(!choiceSolved\s*\|\|\s*index\s*>\s*revealed\.size\s*\|\|\s*revealed\.has\(index\)\)\s*return/.test(source)
        && /data-qa-guided-step-count=\{steps\.length\}/.test(source)],
    ['Dars08 only s4 and s9 use three-step sequencing',
      JSON.stringify(meta
        .filter((screen) => ['step-by-step', 'three-step-zero-chain'].includes(screen.subtype))
        .map((screen) => screen.id)) === JSON.stringify(['s4', 's9'])
        && dars08Content.s1?.rounds === undefined
        && dars08Content.s3?.rounds === undefined
        && dars08Content.s6?.rounds?.length === 1
        && dars08Content.s11?.rounds?.length === 1
        && dars08Content.s13?.stages === undefined
        && /const\s+Screen1\s*=\s*\(props\)\s*=>\s*<ChoiceScreen\b[^>]*screen=\{1\}/.test(source)
        && /const\s+Screen3\s*=\s*\(props\)\s*=>\s*<ChoiceScreen\b[^>]*screen=\{3\}/.test(source)
        && /const\s+Screen6\s*=\s*\(props\)\s*=>\s*<ReasoningRoundsScreen\b[^>]*screen=\{6\}/.test(source)
        && /data-qa-round-count=\{c\.rounds\.length\}[^>]*data-qa-step-count=\{c\.rounds\.length\}/.test(source)],
    ['Dars08 slide 3 declarative placement map',
      meta[2]?.subtype === 'single-step-placement-map'
        && meta[2]?.template === 'PlacementMap'
        && /function\s+PlacementMapScreen\b/.test(source)
        && /data-qa-placement-map=["']true["']/.test(source)
        && /data-qa-step-count=["']1["']/.test(source)
        && /3 raqamini birlar xonasiga qo'yamiz\./.test(source)
        && /bottomRevealed=\{revealedColumns\}/.test(source)
        && /const\s+Screen2\s*=\s*\(props\)\s*=>\s*<PlacementMapScreen\b[^>]*screen=\{2\}[^>]*c=\{CONTENT\.s2\}/.test(source)],
    ['Dars08 slides 6, 11 and 12 remain one-step',
      meta[5]?.subtype === 'single-step-carry-choice'
        && meta[5]?.template === 'MCScreen'
        && meta[10]?.subtype === 'missing-digit'
        && meta[10]?.template === 'DigitGrid'
        && meta[11]?.subtype === 'single-numeric-check'
        && dars08Content.s11?.rounds?.length === 1
        && dars08Content.s5?.steps === undefined
        && dars08Content.s10?.steps === undefined
        && /const\s+Screen5\s*=\s*\(props\)\s*=>\s*<ChoiceScreen\b[^>]*screen=\{5\}[^>]*c=\{CONTENT\.s5\}/.test(source)
        && /const\s+Screen10\s*=\s*\(props\)\s*=>\s*<MissingDigitScreen\b[^>]*screen=\{10\}[^>]*c=\{CONTENT\.s10\}/.test(source)
        && /const\s+Screen11\s*=\s*\(props\)\s*=>\s*<RapidTestConsoleScreen\b[^>]*screen=\{11\}[^>]*c=\{CONTENT\.s11\}/.test(source)
        && /data-qa-rapid-console=["']true["'][^>]*data-qa-step-count=["']1["']/.test(source)],
    ['Dars08 slides 8 and 9 collapse to solution frame',
      dars08Content.s7?.solutionOnlyOnSolve === true
        && dars08Content.s8?.solutionOnlyOnSolve === true
        && /showSolutionOnly\s*=\s*solved\s*&&\s*c\.solutionOnlyOnSolve\s*===\s*true/.test(source)
        && /data-qa-solution-only-complete=["']true["']/.test(source)
        && /const\s+Screen7\s*=\s*\(props\)\s*=>\s*<ChoiceScreen\b[^>]*screen=\{7\}/.test(source)
        && /const\s+Screen8\s*=\s*\(props\)\s*=>\s*<ChoiceScreen\b[^>]*screen=\{8\}/.test(source)],
    ['Dars08 slide 10 bottom operand in light-blue frame',
      /const\s+Screen9\s*=\s*\(props\)[\s\S]{0,900}<div\s+className=["']zero-chain-column-frame["'][^>]*>[\s\S]{0,300}<ColumnAlgorithm\b[^>]*top=["']40005["'][^>]*bottom=["']17268["']/.test(source)
        && /\.zero-chain-column-frame\s*\{[\s\S]{0,300}?background:\$\{T\.cyanSoft\}/.test(source)],
    ['Dars08 slide 13 compact one-column estimate',
      meta[12]?.subtype === 'single-step-strategy-estimate-choice'
        && dars08Content.s12?.questionFrame === true
        && dars08Content.s12?.options?.length === 3
        && /const\s+Screen12\s*=\s*\(props\)\s*=>\s*<ChoiceScreen\b[^>]*screen=\{12\}[^>]*c=\{CONTENT\.s12\}/.test(source)
        && /\.choice-question-frame\s+\.options-grid\s*\{\s*grid-template-columns:\s*1fr\s*\}/.test(source)
        && /\.stage-screen-13\s+\.choice-question-frame\s+\.question-title\s*\{\s*font-size:\s*17px\s*\}/.test(source)],
    ['Dars08 finale proof 4 bridge 5 audio reveal',
      /function\s+useAudioSegmentReveal\s*\([^)]*audio\s*,\s*segments\s*,\s*count\s*\)/.test(source)
        && /localizedSegments\(c\.audio\.intro\s*,\s*lang\s*,\s*`s\$\{screen\}`\)/.test(source)
        && /useAudioSegmentReveal\(audio\s*,\s*segments\s*,\s*5\)/.test(source)
        && /const\s+visible\s*=\s*reveal\.visible/.test(source)
        && /const\s+complete\s*=\s*visible\s*>=\s*5/.test(source)
        && /revealSteps=\{\{\s*proof:\s*4\s*,\s*bridge:\s*5\s*\}\}/.test(source)
        && /\.stage-screen-15\s+\.g4-shared-finale\s+:is\(\.finale-proof,\.finale-bridge\)\{height:auto;min-height:0;align-self:start\}/.test(source)],
    ['Dars08 first-attempt Back persistence',
      /wrongByRound/.test(source)
        && /currentRound/.test(source)
        && /solved\s*=\s*false/.test(source)
        && /data-qa-rapid-first-try/.test(source)],
    ['Dars08 slide 14 single-step hook transfer',
      meta[13]?.subtype === 'single-step-life-transfer'
        && dars08Content.s13?.questionFrame === true
        && dars08Content.s13?.options?.length === 3
        && dars08Content.s13?.stages === undefined
        && /72 384 \+ 8 596 = 80 980/.test(source)
        && /80 980 − 8 596 = 72 384/.test(source)
        && /const\s+Screen13\s*=\s*\(props\)\s*=>\s*<ChoiceScreen\b[^>]*screen=\{13\}[^>]*c=\{CONTENT\.s13\}/.test(source)],
  ];
  const sixteenScreenCritical = ![18, 19].includes(lesson) ? [] : [
    [`Dars${lesson} remains 16 screens`, screenCount === 16
      && meta.at(-1)?.id === 's15'
      && meta.at(-1)?.type === 'summary'],
  ];
  const dars51ScoredIds = meta.filter((screen) => screen.scored === true).map((screen) => screen.id);
  const dars51Critical = lesson !== 51 ? [] : [
    ['Dars51 five scored screens', JSON.stringify(dars51ScoredIds) === JSON.stringify(['s8', 's9', 's10', 's12', 's13'])],
    ['Dars51 assessment payload', /assessment\s*:\s*true/.test(source)
      && /totalQuestions\s*:\s*(?:5|scored\.length)/.test(source)
      && /correctAnswers\s*:\s*firstTryCorrect/.test(source)
      && /finalScore\s*:\s*firstTryCorrect/.test(source)
      && /finalTotal\s*:\s*(?:5|scored\.length)/.test(source)
      && /firstTryStats\s*:\s*\{/.test(source)],
    ['Dars51 medal tiers', /(?:gold|oltin)/i.test(source)
      && /(?:silver|kumush)/i.test(source)
      && /(?:bronze|bronza)/i.test(source)],
  ];

  const categories = {
    methodology: award(methodologyChecks),
    interaction: award(interactionChecks),
    visual: award(visualChecks),
    finalMotion: award(motionFinalChecks),
    technical: award(technicalChecks),
  };
  const total = Object.values(categories).reduce((sum, value) => sum + value, 0);

  const critical = [
    ['13-17 + hook/summary', methodologyChecks[0].pass],
    ['SCREEN_META contract', metadataContract],
    ['70% meaningful activity', methodologyChecks[1].pass],
    ['max two passive screens', methodologyChecks[2].pass],
    ['methodical arc', methodologyChecks[4].pass],
    ['first-slide UX', interactionChecks[0].pass],
    ['Dars01 hook structure markers', canonicalHookMarkers],
    ['Dars01 hook frame tokens', canonicalHookFrame],
    ['Dars01 hook Bit geometry', canonicalHookBit],
    ['Dars01 typography roles', canonicalTypography],
    ['Dars01 feedback geometry', canonicalFeedbackVisual],
    ['visual-frame containment', visualFrameContainment],
    ['Dars01-only callout absent', noEtalonOnlyCallout],
    ['feedback Bit', interactionChecks[1].pass],
    ['yechim frame', interactionChecks[2].pass],
    ['four mechanics', interactionChecks[4].pass],
    ['activity-gated Continue', activityGate.pass],
    ['matching connector', interactionChecks[5].pass],
    ['click-gated rank boost', etalonFinal
      ? (etalonReflectionGate && gatedReveal && rankOverlay && /data-g4-role=["']title-card["']/.test(source))
      : motionFinalChecks.slice(0, 3).every((item) => item.pass)],
    [etalonFinal ? 'etalon final composition' : 'standard three-takeaway/proof/bridge final',
      etalonFinal ? etalonFinalComposition : (lesson > 10 || standardFinalComposition)],
    [etalonFinal ? 'etalon reflection unlock gate' : (finalReflectionRemoved ? 'explicit no-reflection final gate' : 'reflection-before-title dual gate'),
      etalonFinal ? etalonReflectionGate : (finalReflectionRemoved ? !reflectionUi && finalStateClaimGate : reflectionBeforeClaim)],
    [etalonFinal ? 'etalon reflection Back persistence' : (finalReflectionRemoved ? 'no-reflection final policy marker' : 'pre-claim reflection Back persistence'),
      etalonFinal ? etalonReflectionGate : (finalReflectionRemoved || preClaimReflectionPersistence)],
    ['finite/reduced motion', visualChecks[3].pass && motionFinalChecks.slice(3).every((item) => item.pass)],
    ['fixed viewport root', visualChecks[0].pass],
    ['no scroll', visualChecks[1].pass],
    ['936px responsive stage', visualChecks[2].pass],
    ['UZ/RU/EN content', technicalChecks[0].pass],
    ['audio contract', technicalChecks[1].pass],
    ['LMS payload', technicalChecks[3].pass],
    ...dars08Critical,
    ...sixteenScreenCritical,
    ...dars51Critical,
  ];
  const brokenCritical = critical.filter(([, pass]) => !pass).map(([name]) => name);

  rows.push({
    label,
    screens: screenCount,
    active: `${activeCount}/${screenCount}`,
    mechanics: mechanics.size,
    ...categories,
    total,
    critical: brokenCritical.length ? brokenCritical.join(', ') : 'PASS',
  });
  if (total < 90) failures.push(`${label}: ${total}/100 — minimum 90`);
  for (const name of brokenCritical) criticalFailures.push(`${label}: ${name}`);
}

console.table(rows);

if (failures.length || criticalFailures.length) {
  if (failures.length) {
    console.error('Score xatolari:');
    failures.forEach((failure) => console.error(`- ${failure}`));
  }
  if (criticalFailures.length) {
    console.error('Kritik kontrakt xatolari:');
    criticalFailures.forEach((failure) => console.error(`- ${failure}`));
  }
  process.exit(1);
}

console.log(`Grade 4 etalon scorecard o'tdi: ${rows.length} dars, har biri 90+ va kritik gate'lar PASS.`);
