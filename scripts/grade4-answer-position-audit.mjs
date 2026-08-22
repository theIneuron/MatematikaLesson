#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { runInNewContext } from 'node:vm';
import babelParser from '@babel/parser';

const { parse } = babelParser;
const ROOT = process.cwd();
const GRADE4_DIR = path.join(ROOT, 'src', 'components', 'grade4');
import { withTheoryShellSource } from './lib/grade4-theory-shell-source.mjs';
const BROWSER_SMOKE_PATH = path.join(ROOT, 'scripts', 'grade4-browser-smoke.mjs');
const THEORY_FILES = Array.from(
  { length: 50 },
  (_, index) => `Dars${String(index + 2).padStart(2, '0')}.jsx`,
);
const failures = [];

const fail = (file, message) => failures.push(`${file}: ${message}`);

function walkAst(node, visitor, ancestors = []) {
  if (!node || typeof node !== 'object' || typeof node.type !== 'string') return;
  if (visitor(node, ancestors) === false) return;
  const nextAncestors = [...ancestors, node];
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      value.forEach((child) => walkAst(child, visitor, nextAncestors));
    } else if (value && typeof value === 'object' && typeof value.type === 'string') {
      walkAst(value, visitor, nextAncestors);
    }
  }
}

function declarationFor(program, name) {
  return program.body.find((node) => {
    if (node.type === 'FunctionDeclaration') return node.id?.name === name;
    if (node.type !== 'VariableDeclaration') return false;
    return node.declarations.some((declaration) => declaration.id?.type === 'Identifier' && declaration.id.name === name);
  });
}

function declaratorFor(program, name) {
  const declaration = declarationFor(program, name);
  if (declaration?.type !== 'VariableDeclaration') return null;
  return declaration.declarations.find((item) => item.id?.type === 'Identifier' && item.id.name === name) ?? null;
}

function jsxName(node) {
  return node?.type === 'JSXIdentifier' ? node.name : null;
}

function jsxAttribute(openingElement, name) {
  return openingElement.attributes.find((attribute) => (
    attribute.type === 'JSXAttribute' && jsxName(attribute.name) === name
  )) ?? null;
}

function jsxAttributeExpression(attribute) {
  if (!attribute) return null;
  if (attribute.value?.type === 'JSXExpressionContainer') return attribute.value.expression;
  return attribute.value ?? null;
}

function referencesIdentifier(node, name) {
  let found = false;
  walkAst(node, (child) => {
    if (child.type === 'Identifier' && child.name === name) found = true;
  });
  return found;
}

function hasSourceCorrectPredicate(node, sourceParameter) {
  let found = false;
  walkAst(node, (child) => {
    if (child.type !== 'BinaryExpression' || (child.operator !== '===' && child.operator !== '==')) return;
    const sourceOnLeft = referencesIdentifier(child.left, sourceParameter);
    const sourceOnRight = referencesIdentifier(child.right, sourceParameter);
    if (sourceOnLeft === sourceOnRight) return;
    const correctSide = sourceOnLeft ? child.right : child.left;
    const fixedCorrectIndex = staticNumber(correctSide) !== null;
    let namedCorrectIndex = false;
    walkAst(correctSide, (part) => {
      if (part.type === 'Identifier' && /correct/i.test(part.name)) namedCorrectIndex = true;
      if (/correct/i.test(memberPropertyName(part) ?? '')) namedCorrectIndex = true;
    });
    if (fixedCorrectIndex || namedCorrectIndex) found = true;
  });
  return found;
}

function hasSourceIndexedLookup(node, sourceParameter) {
  let found = false;
  walkAst(node, (child) => {
    if (
      (child.type === 'MemberExpression' || child.type === 'OptionalMemberExpression')
      && child.computed
      && referencesIdentifier(child.property, sourceParameter)
    ) found = true;
  });
  return found;
}

function memberPropertyName(node) {
  if (node?.type !== 'MemberExpression' && node?.type !== 'OptionalMemberExpression') return null;
  if (!node.computed && node.property?.type === 'Identifier') return node.property.name;
  if (node.property?.type === 'StringLiteral' || node.property?.type === 'NumericLiteral') {
    return String(node.property.value);
  }
  return null;
}

function unwrapStatic(node) {
  if (
    node?.type === 'CallExpression'
    && node.callee?.type === 'MemberExpression'
    && node.callee.object?.type === 'Identifier'
    && node.callee.object.name === 'Object'
    && memberPropertyName(node.callee) === 'freeze'
  ) {
    return unwrapStatic(node.arguments[0]);
  }
  return node;
}

function objectProperty(node, name) {
  const object = unwrapStatic(node);
  if (object?.type !== 'ObjectExpression') return null;
  const property = object.properties.find((item) => {
    if (item.type !== 'ObjectProperty' && item.type !== 'Property') return false;
    if (!item.computed && item.key?.type === 'Identifier') return item.key.name === name;
    if (item.key?.type === 'StringLiteral' || item.key?.type === 'NumericLiteral') {
      return String(item.key.value) === String(name);
    }
    return false;
  });
  return property?.value ?? null;
}

function staticString(node) {
  const value = unwrapStatic(node);
  return value?.type === 'StringLiteral' ? value.value : null;
}

function staticNumber(node) {
  const value = unwrapStatic(node);
  return value?.type === 'NumericLiteral' && Number.isInteger(value.value) ? value.value : null;
}

function staticBoolean(node) {
  const value = unwrapStatic(node);
  return value?.type === 'BooleanLiteral' ? value.value : null;
}

function createAstIndex(program) {
  const functionNameByNode = new WeakMap();
  const functionNodeByName = new Map();
  const topLevelDeclarators = new Map();
  const declaratorsByName = new Map();
  const jsxUsagesByName = new Map();
  const jsxInfoByNode = new WeakMap();
  const buildCalls = [];

  walkAst(program, (node, ancestors) => {
    let name = null;
    if (node.type === 'FunctionDeclaration' && node.id?.name) name = node.id.name;
    const parent = ancestors.at(-1);
    if (
      (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression')
      && parent?.type === 'VariableDeclarator'
      && parent.id?.type === 'Identifier'
    ) {
      name = parent.id.name;
    }
    if (name) {
      functionNameByNode.set(node, name);
      functionNodeByName.set(name, node);
    }
  });

  const enclosingFunction = (ancestors) => {
    for (let index = ancestors.length - 1; index >= 0; index -= 1) {
      const name = functionNameByNode.get(ancestors[index]);
      if (name) return { name, node: ancestors[index] };
    }
    return { name: null, node: null };
  };

  walkAst(program, (node, ancestors) => {
    const owner = enclosingFunction(ancestors);
    if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier') {
      const info = { node, componentName: owner.name, componentNode: owner.node };
      const entries = declaratorsByName.get(node.id.name) ?? [];
      entries.push(info);
      declaratorsByName.set(node.id.name, entries);
      if (!owner.name) topLevelDeclarators.set(node.id.name, node);
    }
    if (node.type === 'JSXOpeningElement') {
      const name = jsxName(node.name);
      if (name) {
        const info = { node, componentName: owner.name, componentNode: owner.node };
        const entries = jsxUsagesByName.get(name) ?? [];
        entries.push(info);
        jsxUsagesByName.set(name, entries);
        jsxInfoByNode.set(node, info);
      }
    }
    if (node.type === 'CallExpression' && node.callee?.type === 'Identifier' && node.callee.name === 'buildOptionOrder') {
      const variable = [...ancestors].reverse().find((ancestor) => ancestor.type === 'VariableDeclarator');
      buildCalls.push({
        node,
        ancestors,
        componentName: owner.name,
        componentNode: owner.node,
        binding: variable?.id?.type === 'Identifier' ? variable.id.name : null,
      });
    }
  });

  return {
    functionNameByNode,
    functionNodeByName,
    topLevelDeclarators,
    declaratorsByName,
    jsxUsagesByName,
    jsxInfoByNode,
    buildCalls,
  };
}

function findVisibleDeclarator(index, name, useNode, componentName) {
  const entries = (index.declaratorsByName.get(name) ?? []).filter((entry) => (
    entry.node.start < useNode.start
    && (entry.componentName === componentName || entry.componentName === null)
  ));
  entries.sort((left, right) => {
    const leftLocal = left.componentName === componentName ? 1 : 0;
    const rightLocal = right.componentName === componentName ? 1 : 0;
    return rightLocal - leftLocal || right.node.start - left.node.start;
  });
  return entries[0]?.node ?? null;
}

function resolveStatic(node, index, seen = new Set()) {
  const value = unwrapStatic(node);
  if (!value) return null;
  if (value.type === 'Identifier') {
    if (seen.has(value.name)) return null;
    const declaration = index.topLevelDeclarators.get(value.name);
    if (!declaration?.init) return null;
    return resolveStatic(declaration.init, index, new Set([...seen, value.name]));
  }
  if (value.type === 'MemberExpression' || value.type === 'OptionalMemberExpression') {
    const object = resolveStatic(value.object, index, seen);
    const property = memberPropertyName(value);
    return property === null ? null : resolveStatic(objectProperty(object, property), index, seen);
  }
  return value;
}

function functionParameterNames(functionNode) {
  const names = new Set();
  const collect = (node) => {
    if (!node) return;
    if (node.type === 'Identifier') names.add(node.name);
    else if (node.type === 'AssignmentPattern') collect(node.left);
    else if (node.type === 'ObjectPattern') node.properties.forEach((property) => collect(property.value));
    else if (node.type === 'RestElement') collect(node.argument);
  };
  functionNode?.params?.forEach(collect);
  return names;
}

function expandExpression(node, index, useNode, componentName, visitor, seen = new Set()) {
  if (!node || typeof node !== 'object' || typeof node.type !== 'string') return;
  if (visitor(node) === false) return;
  if (node.type === 'Identifier' && !seen.has(node.name)) {
    const declaration = findVisibleDeclarator(index, node.name, useNode, componentName);
    if (declaration?.init) {
      expandExpression(
        declaration.init,
        index,
        declaration,
        componentName,
        visitor,
        new Set([...seen, node.name]),
      );
      return;
    }
  }
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      value.forEach((child) => expandExpression(child, index, useNode, componentName, visitor, seen));
    } else if (value && typeof value === 'object' && typeof value.type === 'string') {
      expandExpression(value, index, useNode, componentName, visitor, seen);
    }
  }
}

function collectMarkerContracts(file, program, index) {
  const contracts = [];
  walkAst(program, (node, ancestors) => {
    if (
      node.type !== 'CallExpression'
      || node.callee?.type !== 'MemberExpression'
      || memberPropertyName(node.callee) !== 'map'
    ) return;
    const callback = node.arguments[0];
    if (callback?.type !== 'ArrowFunctionExpression' && callback?.type !== 'FunctionExpression') return;

    const markerOpenings = [];
    walkAst(callback.body, (child) => {
      if (
        child !== callback.body
        && (child.type === 'ArrowFunctionExpression' || child.type === 'FunctionExpression' || child.type === 'FunctionDeclaration')
      ) return false;
      if (child.type === 'JSXOpeningElement' && jsxAttribute(child, 'data-g4-source-index')) markerOpenings.push(child);
      return undefined;
    });
    if (!markerOpenings.length) return;

    const sourceParameter = callback.params[0]?.type === 'Identifier' ? callback.params[0].name : null;
    const displayParameter = callback.params[1]?.type === 'Identifier' ? callback.params[1].name : null;
    const owner = [...ancestors].reverse().find((ancestor) => index.functionNameByNode.has(ancestor));
    const componentName = owner ? index.functionNameByNode.get(owner) : null;
    if (!sourceParameter) {
      fail(file, `marker renderer ${componentName ?? 'anonymous'} source parametrsiz`);
      return;
    }

    if (!hasSourceIndexedLookup(callback.body, sourceParameter)) {
      fail(file, `${componentName ?? 'anonymous'}: option yoki vizual bundle source indeks orqali olinmagan`);
    }

    for (const opening of markerOpenings) {
      const sourceMarker = jsxAttributeExpression(jsxAttribute(opening, 'data-g4-source-index'));
      const correctMarker = jsxAttributeExpression(jsxAttribute(opening, 'data-g4-correct'));
      const clickHandler = jsxAttributeExpression(jsxAttribute(opening, 'onClick'));
      if (!referencesIdentifier(sourceMarker, sourceParameter)) {
        fail(file, `${componentName ?? 'anonymous'}: data-g4-source-index map source parametridan olinmagan`);
      }
      if (!correctMarker || !referencesIdentifier(correctMarker, sourceParameter)) {
        fail(file, `${componentName ?? 'anonymous'}: data-g4-correct source indeksga bog'lanmagan`);
      } else if (!hasSourceCorrectPredicate(correctMarker, sourceParameter)) {
        fail(file, `${componentName ?? 'anonymous'}: data-g4-correct source indeksni correct indeks bilan solishtirmaydi`);
      }
      if (!clickHandler || !referencesIdentifier(clickHandler, sourceParameter)) {
        fail(file, `${componentName ?? 'anonymous'}: answer handler source indeksni uzatmaydi`);
      }
    }

    const alphabeticLabels = [];
    walkAst(callback.body, (child) => {
      if (
        child !== callback.body
        && (child.type === 'ArrowFunctionExpression' || child.type === 'FunctionExpression' || child.type === 'FunctionDeclaration')
      ) return false;
      if (
        child.type === 'CallExpression'
        && child.callee?.type === 'MemberExpression'
        && child.callee.object?.type === 'Identifier'
        && child.callee.object.name === 'String'
        && memberPropertyName(child.callee) === 'fromCharCode'
      ) alphabeticLabels.push(child);
      return undefined;
    });
    if (alphabeticLabels.length && (!displayParameter || alphabeticLabels.some((label) => !referencesIdentifier(label, displayParameter)))) {
      fail(file, `${componentName ?? 'anonymous'}: A/B/C label display indeksdan olinmagan`);
    }

    contracts.push({
      node,
      receiver: node.callee.object,
      componentName,
      componentNode: owner ?? null,
      sourceParameter,
      displayParameter,
      markerCount: markerOpenings.length,
    });
  });
  return contracts;
}

function expressionDependsOn(node, target, index, componentName, useNode, seen = new Set()) {
  let depends = false;
  expandExpression(node, index, useNode, componentName, (child) => {
    if (child.type === 'Identifier' && child.name === target) {
      depends = true;
      return false;
    }
    if (child.type === 'Identifier' && seen.has(child.name)) return false;
    return undefined;
  }, seen);
  return depends;
}

function callIsMarkerWired(call, markerContracts, index) {
  if (!call.binding || !call.componentNode || !call.componentName) return false;
  const direct = markerContracts.some((contract) => (
    contract.componentName === call.componentName
    && expressionDependsOn(contract.receiver, call.binding, index, call.componentName, contract.node)
  ));
  if (direct) return true;

  const markerComponents = new Set(markerContracts.map((contract) => contract.componentName).filter(Boolean));
  let wired = false;
  walkAst(call.componentNode.body ?? call.componentNode, (node) => {
    if (node.type !== 'JSXOpeningElement' || !markerComponents.has(jsxName(node.name))) return;
    const passesOrder = node.attributes.some((attribute) => (
      attribute.type === 'JSXAttribute'
      && expressionDependsOn(
        jsxAttributeExpression(attribute),
        call.binding,
        index,
        call.componentName,
        attribute,
      )
    ));
    if (passesOrder) wired = true;
  });
  return wired;
}

function expandedComponentUsages(componentName, index, seen = new Set()) {
  if (!componentName || seen.has(componentName)) return [];
  const nextSeen = new Set([...seen, componentName]);
  const expanded = [];
  for (const info of index.jsxUsagesByName.get(componentName) ?? []) {
    const forwardsProps = info.node.attributes.some((attribute) => (
      attribute.type === 'JSXSpreadAttribute' && attribute.argument?.type === 'Identifier' && attribute.argument.name === 'props'
    ));
    if (forwardsProps && info.componentName) {
      const wrapperUsages = expandedComponentUsages(info.componentName, index, nextSeen);
      if (wrapperUsages.length) {
        expanded.push(...wrapperUsages);
        continue;
      }
    }
    expanded.push(info);
  }
  return expanded;
}

function dynamicChoiceGroupCount(expression, index, useNode, componentName) {
  const candidates = [];
  const inspect = (node, position, owner) => {
    if (!node) return;
    if (node.type === 'Identifier') {
      const declaration = findVisibleDeclarator(index, node.name, position, owner);
      if (declaration?.init) inspect(declaration.init, declaration, owner);
      const staticValue = resolveStatic(node, index);
      const array = unwrapStatic(staticValue);
      if (array?.type === 'ArrayExpression') candidates.push(array);
      return;
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach((child) => inspect(child, position, owner));
      else if (value && typeof value === 'object' && typeof value.type === 'string') inspect(value, position, owner);
    }
  };
  inspect(expression, useNode, componentName);
  const counts = candidates.map((array) => array.elements.filter((element) => {
    const item = unwrapStatic(element);
    const kind = staticString(objectProperty(item, 'kind'));
    const options = unwrapStatic(objectProperty(item, 'options'));
    return (kind === 'choice' || kind === 'hook')
      && options?.type === 'ArrayExpression'
      && options.elements.length >= 2
      && options.elements.length <= 4;
  }).length);
  return counts.length ? Math.max(...counts) : null;
}

function componentParameterCoverage(call, parameterName, index) {
  const usages = expandedComponentUsages(call.componentName, index);
  if (!usages.length) return null;
  let count = 0;
  for (const usage of usages) {
    // Раньше экран с shuffleOptions={false} просто не считался, и опт-аут был
    // невидим: в уроке 11 правильный ответ выбора стратегии всегда стоял на
    // месте A, а аудит показывал PASS. Отказ от перемешивания — это нарушение,
    // а не исключение из подсчёта.
    const shuffleOptions = jsxAttributeExpression(jsxAttribute(usage.node, 'shuffleOptions'));
    if (staticBoolean(shuffleOptions) === false) {
      fail(call.file ?? 'grade4', `${usage.componentName ?? call.componentName} shuffleOptions={false} bilan chaqirilgan: javob pozitsiyasi qotib qoladi`);
      continue;
    }
    const attribute = jsxAttribute(usage.node, parameterName);
    const expression = jsxAttributeExpression(attribute);
    if (expression) {
      const ordinalMapCount = answerOrdinalMapCoverage(expression, {
        ...call,
        node: usage.node,
        componentName: usage.componentName,
      }, index);
      if (Number.isInteger(ordinalMapCount) && ordinalMapCount > 0) {
        count += ordinalMapCount;
        continue;
      }
      const dynamicCount = dynamicChoiceGroupCount(expression, index, usage.node, usage.componentName);
      count += dynamicCount && dynamicCount > 1 ? dynamicCount : 1;
    } else {
      count += 1;
    }
  }
  return count;
}

function staticObjectKey(property) {
  if (property?.type !== 'ObjectProperty' && property?.type !== 'Property') return null;
  const key = unwrapStatic(property.key);
  if (!property.computed && key?.type === 'Identifier') return key.name;
  if (key?.type === 'StringLiteral' || key?.type === 'NumericLiteral') return String(key.value);
  return null;
}

function hasStaticOrdinalPrefix(call, index, start) {
  if (start === 0) return true;
  const precedingOrdinals = new Set(index.buildCalls
    .filter((candidate) => candidate.node !== call.node && candidate.node.start < call.node.start)
    .map((candidate) => staticNumber(candidate.node.arguments[3]))
    .filter(Number.isInteger));
  return Array.from({ length: start }, (_, ordinal) => ordinal)
    .every((ordinal) => precedingOrdinals.has(ordinal));
}

function answerOrdinalMapCoverage(expression, call, index) {
  let coverage = null;
  expandExpression(expression, index, call.node, call.componentName, (node) => {
    if (coverage !== null || (node.type !== 'MemberExpression' && node.type !== 'OptionalMemberExpression')) return;
    if (node.object?.type !== 'Identifier' || !/ORDINAL/.test(node.object.name)) return;
    const object = resolveStatic(node.object, index);
    const value = unwrapStatic(object);
    if (value?.type !== 'ObjectExpression') return;
    const keys = value.properties.map(staticObjectKey);
    if (keys.some((key) => key === null)) {
      fail(call.file, 'ANSWER_ORDINAL_BY_SCREEN map keylari statik emas');
    } else if (new Set(keys).size !== keys.length) {
      fail(call.file, `ANSWER_ORDINAL_BY_SCREEN map keylari takrorlangan (${keys.join(',')})`);
    }
    const ordinals = value.properties.map((property) => staticNumber(property.value)).filter(Number.isInteger);
    if (ordinals.length !== value.properties.length) return;
    const sorted = [...ordinals].sort((left, right) => left - right);
    const start = sorted[0];
    if (
      !Number.isInteger(start)
      || start < 0
      || new Set(sorted).size !== sorted.length
      || sorted.some((ordinal, position) => ordinal !== start + position)
    ) {
      fail(call.file, `ANSWER_ORDINAL_BY_SCREEN ketma-ket emas (${sorted.join(',')})`);
    } else if (!hasStaticOrdinalPrefix(call, index, start)) {
      fail(call.file, `ANSWER_ORDINAL_BY_SCREEN 0 dan boshlanmaydi va statik prefix yo'q (${sorted.join(',')})`);
    }
    coverage = ordinals.length;
    return false;
  });
  return coverage;
}

function indexOfCoverage(expression, call, index) {
  let coverage = null;
  expandExpression(expression, index, call.node, call.componentName, (node) => {
    if (
      coverage === null
      && node.type === 'CallExpression'
      && node.callee?.type === 'MemberExpression'
      && memberPropertyName(node.callee) === 'indexOf'
    ) {
      const values = resolveStatic(node.callee.object, index);
      const array = unwrapStatic(values);
      if (array?.type === 'ArrayExpression') coverage = array.elements.length;
    }
    return coverage === null ? undefined : false;
  });
  return coverage;
}

function collectionNameForOrdinal(expression, call, index) {
  let collection = null;
  expandExpression(expression, index, call.node, call.componentName, (node) => {
    if (node.type === 'MemberExpression' || node.type === 'OptionalMemberExpression') {
      const name = memberPropertyName(node);
      if (name === 'rounds' || name === 'stages') collection = name;
    }
    if (node.type === 'Identifier' && node.name === 'round') collection = 'rounds';
    if (node.type === 'Identifier' && node.name === 'stageIndex') collection = 'stages';
  });
  return collection;
}

function collectionCoverage(call, expression, collectionName, index) {
  const usages = expandedComponentUsages(call.componentName, index);
  if (!usages.length) return null;
  let choiceOnly = false;
  expandExpression(expression, index, call.node, call.componentName, (node) => {
    if (
      node.type === 'BinaryExpression'
      && node.operator === '==='
      && staticString(node.right) === 'choice'
    ) choiceOnly = true;
  });
  let total = 0;
  for (const usage of usages) {
    const contentExpression = jsxAttributeExpression(jsxAttribute(usage.node, 'c'));
    const content = resolveStatic(contentExpression, index);
    const collection = unwrapStatic(objectProperty(content, collectionName));
    if (collection?.type !== 'ArrayExpression') return null;
    total += collection.elements.filter((element) => (
      !choiceOnly || staticString(objectProperty(unwrapStatic(element), 'kind')) === 'choice'
    )).length;
  }
  return total;
}

function ordinalCoverage(call, index) {
  const ordinal = call.node.arguments[3];
  if (!ordinal) return null;
  if (staticNumber(ordinal) !== null) return 1;

  const mapCoverage = answerOrdinalMapCoverage(ordinal, call, index);
  if (mapCoverage !== null) return mapCoverage;
  const arrayCoverage = indexOfCoverage(ordinal, call, index);
  if (arrayCoverage !== null) return arrayCoverage;

  const collectionName = collectionNameForOrdinal(ordinal, call, index);
  if (collectionName) return collectionCoverage(call, ordinal, collectionName, index);

  if (ordinal.type === 'Identifier' && functionParameterNames(call.componentNode).has(ordinal.name)) {
    return componentParameterCoverage(call, ordinal.name, index);
  }
  return null;
}

async function loadExpectedAnswerGroups() {
  const source = await readFile(BROWSER_SMOKE_PATH, 'utf8');
  let ast;
  try {
    ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  } catch (error) {
    fail(path.basename(BROWSER_SMOKE_PATH), `expected group AST parse xatosi: ${error.message}`);
    return new Map();
  }
  const declaration = declaratorFor(ast.program, 'EXPECTED_ANSWER_ORDER_GROUPS');
  if (!declaration?.init) {
    fail(path.basename(BROWSER_SMOKE_PATH), 'EXPECTED_ANSWER_ORDER_GROUPS topilmadi');
    return new Map();
  }
  const sandbox = {};
  try {
    const expression = source.slice(declaration.init.start, declaration.init.end);
    runInNewContext(`globalThis.__groups = Object.fromEntries(${expression});`, sandbox, { timeout: 1_000 });
    return new Map(Object.entries(sandbox.__groups).map(([file, count]) => [file, Number(count)]));
  } catch (error) {
    fail(path.basename(BROWSER_SMOKE_PATH), `expected group xaritasi bajarilmadi: ${error.message}`);
    return new Map();
  }
}

function lessonIdFrom(source) {
  return source.match(/["']?lessonId["']?\s*:\s*["']([^"']+)["']/)?.[1] ?? null;
}

function evaluateHelpers(file, source, program) {
  const offsetDeclaration = declarationFor(program, 'stableChoiceOffset');
  const orderDeclaration = declarationFor(program, 'buildOptionOrder');
  if (!offsetDeclaration) fail(file, 'stableChoiceOffset helper topilmadi');
  if (!orderDeclaration) fail(file, 'buildOptionOrder helper topilmadi');
  if (!offsetDeclaration || !orderDeclaration) return null;

  const declarations = [...new Set([offsetDeclaration, orderDeclaration])]
    .sort((left, right) => left.start - right.start)
    .map((node) => source.slice(node.start, node.end))
    .join('\n');
  const sandbox = {};
  try {
    runInNewContext(
      `${declarations}\n;globalThis.__choiceHelpers = { stableChoiceOffset, buildOptionOrder };`,
      sandbox,
      { timeout: 1_000 },
    );
    return sandbox.__choiceHelpers;
  } catch (error) {
    fail(file, `helperlar mustaqil bajarilmadi: ${error.message}`);
    return null;
  }
}

function auditOrderHelper(file, lessonId, helper) {
  for (const length of [2, 3, 4]) {
    const positions = [];
    for (let ordinal = 0; ordinal < length * 3; ordinal += 1) {
      let ordinalPosition = null;
      for (let correctIndex = 0; correctIndex < length; correctIndex += 1) {
        const natural = Array.from({ length }, (_, index) => index);
        const first = helper(length, correctIndex, lessonId, ordinal);
        const second = helper(length, correctIndex, lessonId, ordinal);
        if (!Array.isArray(first) || first.length !== length) {
          fail(file, `${length} variant / ordinal ${ordinal}: order uzunligi noto'g'ri`);
          continue;
        }
        const deterministicOrder = JSON.stringify(second);
        if (JSON.stringify(first) !== deterministicOrder) {
          fail(file, `${length} variant / ordinal ${ordinal}: order deterministik emas`);
        }
        const sorted = [...first].sort((left, right) => left - right);
        if (JSON.stringify(sorted) !== JSON.stringify(natural)) {
          fail(file, `${length} variant / ordinal ${ordinal}: order permutation emas (${first.join(',')})`);
        }
        const position = first.indexOf(correctIndex);
        if (position < 0) fail(file, `${length} variant / ordinal ${ordinal}: to'g'ri source indeks yo'q`);
        if (ordinalPosition === null) ordinalPosition = position;
        else if (ordinalPosition !== position) {
          fail(file, `${length} variant / ordinal ${ordinal}: target correctIndexga bog'lanib qolgan`);
        }
        first[0] = -999;
        if (JSON.stringify(helper(length, correctIndex, lessonId, ordinal)) !== deterministicOrder) {
          fail(file, `${length} variant / ordinal ${ordinal}: helper yangi order massivi qaytarmadi`);
        }
      }
      positions.push(ordinalPosition);
    }

    for (let start = 0; start < positions.length; start += length) {
      const block = positions.slice(start, start + length);
      if (new Set(block).size !== length) {
        fail(file, `${length} variant: ${start / length + 1}-blok pozitsiyalari balanssiz (${block.join(',')})`);
      }
    }

    const natural = Array.from({ length }, (_, index) => index);
    for (const invalid of [-1, length, null]) {
      const actual = helper(length, invalid, lessonId, 0);
      if (JSON.stringify(actual) !== JSON.stringify(natural)) {
        fail(file, `${length} variant: invalid correctIndex natural orderga qaytmadi`);
      }
    }
  }
}

const expectedAnswerGroups = await loadExpectedAnswerGroups();
let markerRenderSites = 0;
let ordinalGroupsCovered = 0;

for (const file of THEORY_FILES) {
  const source = await withTheoryShellSource(await readFile(path.join(GRADE4_DIR, file), 'utf8'), GRADE4_DIR);
  const lessonId = lessonIdFrom(source);
  if (!lessonId) fail(file, 'LESSON_META.lessonId topilmadi');
  if (/Math\.random\s*\(/.test(source)) fail(file, 'doimiy tartibda Math.random ishlatilgan');
  if (/seed\s*\*\s*3\s*\+\s*1/.test(source)) fail(file, 'eski doim-B modulo formulasi qolgan');
  if (!source.includes('data-g4-source-index')) fail(file, 'source-index DOM markeri yo\'q');
  if (!source.includes('data-g4-correct')) fail(file, 'correct DOM markeri yo\'q');
  if (!/buildOptionOrder\s*\(/.test(source)) fail(file, 'variant order helper chaqiruvi yo\'q');
  if (!/\bsourceIndex\b/.test(source) || !/\bdisplayIndex\b/.test(source)) {
    fail(file, 'sourceIndex/displayIndex render koordinatalari topilmadi');
  }

  let ast;
  try {
    ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  } catch (error) {
    fail(file, `JSX parse xatosi: ${error.message}`);
    continue;
  }
  const helpers = evaluateHelpers(file, source, ast.program);
  if (helpers && lessonId) auditOrderHelper(file, lessonId, helpers.buildOptionOrder);

  const expectedGroups = expectedAnswerGroups.get(file);
  if (!Number.isInteger(expectedGroups) || expectedGroups <= 0) {
    fail(file, 'browser-smoke expected answer group soni topilmadi');
    continue;
  }

  const index = createAstIndex(ast.program);
  const markerContracts = collectMarkerContracts(file, ast.program, index);
  markerRenderSites += markerContracts.length;
  if (!markerContracts.length) {
    fail(file, 'eligible source-index marker rendereri topilmadi');
    continue;
  }
  if (!index.buildCalls.length) {
    fail(file, 'actual buildOptionOrder call topilmadi');
    continue;
  }

  let actualOrdinalCoverage = 0;
  let markerBackedCoverage = 0;
  for (const call of index.buildCalls) {
    call.file = file;
    if (call.node.arguments.length < 4) {
      fail(file, `buildOptionOrder call ${call.node.loc?.start.line ?? '?'}-qatorda explicit ordinal olmagan`);
      continue;
    }
    const lessonArgument = call.node.arguments[2];
    if (!referencesIdentifier(lessonArgument, 'LESSON_META') && !referencesIdentifier(lessonArgument, 'lessonId')) {
      fail(file, `buildOptionOrder call ${call.node.loc?.start.line ?? '?'}-qatorda lessonIdga bog'lanmagan`);
    }
    const coverage = ordinalCoverage(call, index);
    if (!Number.isInteger(coverage) || coverage <= 0) {
      fail(file, `buildOptionOrder call ${call.node.loc?.start.line ?? '?'}-qatorda ordinal coverage statik aniqlanmadi`);
      continue;
    }
    actualOrdinalCoverage += coverage;
    if (!callIsMarkerWired(call, markerContracts, index)) {
      fail(file, `buildOptionOrder call ${call.node.loc?.start.line ?? '?'}-qatorda markerli rendererga ulanmagan`);
      continue;
    }
    markerBackedCoverage += coverage;
  }

  ordinalGroupsCovered += markerBackedCoverage;
  if (actualOrdinalCoverage !== expectedGroups) {
    fail(file, `ordinal coverage ${actualOrdinalCoverage}, browser-smoke expected ${expectedGroups}`);
  }
  if (markerBackedCoverage !== expectedGroups) {
    fail(file, `markerli renderer coverage ${markerBackedCoverage}, expected ${expectedGroups}`);
  }
}

if (failures.length) {
  console.error(`Grade 4 answer-position audit: ${failures.length} ta buzilish.`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `Grade 4 answer-position audit o'tdi: ${THEORY_FILES.length} ta nazariy dars, `
  + `${ordinalGroupsCovered} ta eligible group, ${markerRenderSites} ta marker renderer; `
  + 'actual call/ordinal/source-index semantikasi va 2/3/4 variantli deterministik balans tekshirildi.',
);
