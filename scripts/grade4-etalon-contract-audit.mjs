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
  let ast;

  try {
    ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  } catch (error) {
    failures.push(`${label}: JSX parse xatosi — ${error.message}`);
    criticalFailures.push(`${label}: JSX parse`);
    continue;
  }

  const meta = extractScreenMeta(ast);
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

  const booleanClaimState = /\[titleClaimed,\s*setTitleClaimed\]\s*=\s*useState\((?:false|storedAnswer\?\.titleClaimed\s*===\s*true)\)/.test(source);
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
  const claimButton = /className=["'{][^\n>]*g4-title-claim/.test(source)
    && /Claim title/.test(source)
    && /\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0437\u0432\u0430\u043d\u0438\u0435/ui.test(source)
    && /Unvonni olish/.test(source);
  const contextReflectionState = /\{\s*reflectionChoice,\s*titleState\s*\}\s*=\s*finalRewardState/.test(source)
    && /const\s+setReflectionChoice\s*=\s*useCallback\(\s*\(value\)\s*=>\s*setFinalRewardState\(/.test(source);
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
  const gatedReveal = /<(?:G4)?TitleReveal\s+active=\{titleClaimed\}/.test(source)
    || (/<(?:G4)?TitleReveal\s+active=\{revealRequested\}/.test(source)
      && /setRevealRequested\(true\)/.test(source))
    || (/<(?:G4)?TitleReveal\s+active=\{titleState\s*===\s*["']revealing["']\}/.test(source)
      && /setTitleState\([\s\S]{0,260}["']revealing["']/.test(source))
    || (/<(?:G4)?TitleReveal\s+active=\{revealing\}/.test(source)
      && /const\s+revealing\s*=\s*titleState\s*===\s*["']revealing["']/.test(source)
      && /setTitleState\([\s\S]{0,260}["']revealing["']/.test(source));
  const persistentTitle = /data-g4-role=["'{][^\n>]*title-card/.test(source)
    && (/titleClaimed\s*&&/.test(source)
      || /titleState\s*===\s*["']claimed["']\s*&&/.test(source)
      || /titleState\s*!==\s*["']claimed["']\s*\?[\s\S]{0,900}:\s*<(?:G4)?TitleCard\b/.test(source)
      || (/const\s+claimed\s*=\s*titleState\s*===\s*["']claimed["']/.test(source)
        && /claimed\s*&&\s*</.test(source)));
  const claimBeforeFinish = /titleClaimed\s*\?\s*finishLesson/.test(source)
    || /disabled=\{!titleClaimed/.test(source)
    || /canFinish=\{titleState\s*===\s*["']claimed["']\}/.test(source)
    || (/const\s+claimed\s*=\s*titleState\s*===\s*["']claimed["']/.test(source)
      && /(?:NavNext|button)[^>]*disabled=\{!claimed\}/.test(source));
  const solvedReflectionAlias = /\[reflectionSolved,\s*setReflectionSolved\]\s*=\s*useState\(/.test(source)
    && /setReflectionSolved\(true\)/.test(source)
    && /(?:disabled=\{[^}]*!reflectionSolved|if\s*\([^)]*!reflectionSolved[^)]*\)\s*return)/.test(source);
  const titleRevealBlock = source.match(
    /(?:function\s+(?:G4)?TitleReveal|const\s+(?:G4)?TitleReveal\s*=)[\s\S]*?(?=(?:function\s+(?:G4)?TitleCard|const\s+(?:G4)?TitleCard\s*=))/,
  )?.[0] ?? '';
  const revealDuration = /setTimeout\([\s\S]*?3200/.test(titleRevealBlock);
  const reducedRevealDuration = /matchMedia\?\.\(['"]\(prefers-reduced-motion:\s*reduce\)['"]\)[\s\S]*?\?\s*(?:0|80|120)\s*:\s*3200/.test(titleRevealBlock);
  const literalHappyCount = count(source, /<BitSVG\b[^>]*\bstate=["']happy["']/g);
  const noPermanentHappy = !/(?:PersistentHappyBit|PrimaryHappyBit|StageHappyBit)/.test(source)
    && literalHappyCount <= 4;

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
    { points: 2, pass: claimState && claimButton && reflectionUi },
    { points: 2, pass: gatedReveal && persistentTitle },
    { points: 2, pass: claimBeforeFinish && (reflectionGate || solvedReflectionAlias) && reflectionBeforeClaim },
    { points: 2, pass: revealDuration && noPermanentHappy },
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
    ['Dars08 exact 16 direct screens',
      /const\s+SCREENS\s*=\s*\[\s*Screen0\s*,\s*Screen1\s*,\s*Screen2\s*,\s*Screen3\s*,\s*Screen4\s*,\s*Screen5\s*,\s*Screen6\s*,\s*Screen7\s*,\s*Screen8\s*,\s*Screen9\s*,\s*Screen10\s*,\s*Screen11\s*,\s*Screen12\s*,\s*Screen13\s*,\s*Screen14\s*,\s*Screen15\s*\]/.test(source)
        && !/\b(?:SOURCE_ORDER|sourceScreen|stage-fit)\b|\bzoom\s*:/.test(source)],
    ['Dars08 progressive result reveal',
      /function\s+ColumnAlgorithm\([^)]*revealed/.test(source)
        && /digit-hidden/.test(source)
        && /revealed=\{revealedDigits\}/.test(source)
        && /isRevealed\s*\?\s*digit\s*:\s*['"]\\u00a0['"]/.test(source)],
    ['Dars08 progressive zero chain',
      /function|const\s+ZeroChainModel/.test(source)
        && /state\s*=\s*null/.test(source)
        && /state=\{activeStep\s*>=\s*0\s*\?\s*CONTENT\.s9\.states\[activeStep\]/.test(source)],
    ['Dars08 first-attempt Back persistence',
      /wrongByRound/.test(source)
        && /currentRound/.test(source)
        && /solved\s*=\s*false/.test(source)
        && /data-qa-rapid-first-try/.test(source)],
    ['Dars08 matching persistence and textual relation',
      /matchingStartedValue/.test(source)
        && /pairsValue/.test(source)
        && /function|const\s+pairLabel/.test(source)
        && /aria-label=\{pairs\[item\.id\]\s*\?\s*pairLabel/.test(source)],
    ['Dars08 case answer gate',
      /visual=\{\(\{\s*stageIndex\s*,\s*stageSolved/.test(source)
        && /stageSolved\s*\?\s*['"]72 000 − 19 000 ≈ 53 000['"]/.test(source)],
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
    ['feedback Bit', interactionChecks[1].pass],
    ['yechim frame', interactionChecks[2].pass],
    ['four mechanics', interactionChecks[4].pass],
    ['activity-gated Continue', activityGate.pass],
    ['matching connector', interactionChecks[5].pass],
    ['click-gated title reveal', motionFinalChecks.slice(0, 3).every((item) => item.pass)],
    ['reflection-before-title dual gate', reflectionBeforeClaim],
    ['pre-claim reflection Back persistence', preClaimReflectionPersistence],
    ['finite/reduced motion', visualChecks[3].pass && motionFinalChecks.slice(3).every((item) => item.pass)],
    ['fixed viewport root', visualChecks[0].pass],
    ['no scroll', visualChecks[1].pass],
    ['936px responsive stage', visualChecks[2].pass],
    ['UZ/RU/EN content', technicalChecks[0].pass],
    ['audio contract', technicalChecks[1].pass],
    ['LMS payload', technicalChecks[3].pass],
    ...dars08Critical,
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
