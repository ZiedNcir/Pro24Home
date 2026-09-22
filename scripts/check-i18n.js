#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));
const inventory = args.has('--inventory');
const all = args.has('--all');
const nativeOnly = args.has('--native');
const frPath = path.join(root, 'src/translations/fr.json');
const enPath = path.join(root, 'src/translations/en.json');
const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const errors = [];
const candidates = [];

const flatten = (value, prefix = '') => Object.entries(value).flatMap(([key, item]) => {
  const name = prefix ? `${prefix}.${key}` : key;
  return item && typeof item === 'object' && !Array.isArray(item)
    ? flatten(item, name)
    : [[name, item]];
});
const frEntries = new Map(flatten(fr));
const enEntries = new Map(flatten(en));
for (const key of new Set([...frEntries.keys(), ...enEntries.keys()])) {
  if (!frEntries.has(key) || !enEntries.has(key)) {
    errors.push(`locale parity: ${key} is missing from ${frEntries.has(key) ? 'en' : 'fr'}.json`);
    continue;
  }
  const placeholders = (value) => [...String(value).matchAll(/{{\s*([^}]+?)\s*}}/g)].map((match) => match[1]).sort().join('|');
  if (placeholders(frEntries.get(key)) !== placeholders(enEntries.get(key))) {
    errors.push(`locale placeholders: ${key} differs between fr.json and en.json`);
  }
}

const keyExists = (key) => frEntries.has(key) && enEntries.has(key);
const knownProps = new Set([
  'placeholder', 'title', 'label', 'accessibilityLabel', 'accessibilityHint',
  'accessibilityRole', 'message', 'description', 'helperText', 'emptyText',
  'errorText', 'confirmText', 'cancelText', 'headerTitle', 'subtitle', 'caption',
]);
const meaningful = (value) => /[\p{L}]{2}/u.test(value) && !/^[\w./:@#-]+$/u.test(value);
const isLiteral = (node) => ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node);
const textOf = (node) => isLiteral(node) ? node.text : undefined;

function sourceCandidate(sf, node, reason) {
  const value = ts.isJsxText(node) ? node.getText(sf).trim() : textOf(node);
  if (!value || !meaningful(value)) return;
  candidates.push({ file: path.relative(root, sf.fileName), line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1, reason, value });
}

function scanFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = (node) => {
    if (ts.isJsxText(node)) {
      sourceCandidate(sf, node, 'JSX text');
    } else if (ts.isJsxAttribute(node) && node.initializer) {
      const prop = node.name.getText(sf);
      if (knownProps.has(prop)) {
        const inspectInitializer = (child) => {
          if (isLiteral(child)) sourceCandidate(sf, child, `JSX prop ${prop}`);
          ts.forEachChild(child, inspectInitializer);
        };
        inspectInitializer(node.initializer);
      }
    } else if (ts.isPropertyAssignment(node) && knownProps.has(node.name.getText(sf))) {
      const prop = node.name.getText(sf);
      const inspectValue = (child) => {
        if (isLiteral(child)) sourceCandidate(sf, child, `property ${prop}`);
        ts.forEachChild(child, inspectValue);
      };
      inspectValue(node.initializer);
    } else if (ts.isJsxExpression(node) && node.expression && isLiteral(node.expression) && ts.isJsxAttribute(node.parent)) {
      const prop = node.parent.name.getText(sf);
      if (knownProps.has(prop)) sourceCandidate(sf, node.expression, `JSX prop ${prop}`);
    } else if (ts.isCallExpression(node)) {
      const callee = node.expression.getText(sf);
      const name = callee.split('.').pop();
      const isAlert = /(^|\.)Alert\.alert$/.test(callee);
      const isToast = /(^|\.)(Toast|showMessage|displayNotification|localNotification|scheduleNotification)$/.test(callee) || /Notification.*\.create$/.test(callee);
      if ((isAlert || isToast) && node.arguments.length) {
        node.arguments.slice(0, isAlert ? 3 : 2).forEach((arg) => {
          if (isLiteral(arg)) sourceCandidate(sf, arg, `${isAlert ? 'Alert.alert' : name} argument`);
          if (ts.isObjectLiteralExpression(arg)) {
            for (const property of arg.properties) {
              if (ts.isPropertyAssignment(property) && knownProps.has(property.name.getText(sf)) && isLiteral(property.initializer)) {
                sourceCandidate(sf, property.initializer, `${name}.${property.name.getText(sf)}`);
              }
            }
          }
        });
      }
      if (ts.isIdentifier(node.expression) && ['t'].includes(node.expression.text) && node.arguments[0] && isLiteral(node.arguments[0])) {
        const key = node.arguments[0].text;
        if (!keyExists(key)) errors.push(`${path.relative(root, file)}:${sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1}: missing translation key ${key}`);
      }
      if (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 't' && node.arguments[0] && isLiteral(node.arguments[0])) {
        const key = node.arguments[0].text;
        if (!keyExists(key)) errors.push(`${path.relative(root, file)}:${sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1}: missing translation key ${key}`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'ios/Pods', 'android/.gradle'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, out);
    else if (/\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) out.push(file);
  }
  return out;
}

const scope = JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n-scope.json'), 'utf8'));
const sourceFiles = all || inventory ? walk(path.join(root, 'src')) : (scope.sourceFiles || []).map((file) => path.join(root, file));
if (!nativeOnly) sourceFiles.forEach(scanFile);

if (all || nativeOnly) {
  const androidRoot = path.join(root, 'android/app/src/main/res');
  const androidDirs = ['values', 'values-fr', 'values-en'];
  const androidMaps = androidDirs.map((dir) => {
    const file = path.join(androidRoot, dir, 'strings.xml');
    if (!fs.existsSync(file)) return new Map();
    return new Map([...fs.readFileSync(file, 'utf8').matchAll(/<string\s+name="([^"]+)"[^>]*>([\s\S]*?)<\/string>/g)].map((match) => [match[1], match[2]]));
  });
  if (androidMaps.some((map) => map.size)) {
    const baseKeys = [...androidMaps[0].keys()].sort().join('|');
    androidMaps.slice(1).forEach((map, i) => {
      if ([...map.keys()].sort().join('|') !== baseKeys) errors.push(`Android resources: values and ${androidDirs[i + 1]} strings.xml keys differ`);
    });
  }
  const iosDir = path.join(root, 'ios/Pro24Home');
  const iosKeys = ['fr.lproj/InfoPlist.strings', 'en.lproj/InfoPlist.strings'].map((relative) => {
    const file = path.join(iosDir, relative);
    return fs.existsSync(file) ? [...fs.readFileSync(file, 'utf8').matchAll(/^\s*"([^"]+)"\s*=/gm)].map((match) => match[1]).sort().join('|') : '';
  });
  if (iosKeys.some(Boolean) && iosKeys[0] !== iosKeys[1]) errors.push('iOS InfoPlist.strings keys differ between fr and en');
}

if (inventory) {
  for (const candidate of candidates) console.log(`${candidate.file}:${candidate.line} [${candidate.reason}] ${JSON.stringify(candidate.value)}`);
  console.log(`Inventory: ${candidates.length} candidate strings`);
} else {
  for (const candidate of candidates) {
    const exempt = (scope.exceptions || []).some((item) => item.file === candidate.file && item.value === candidate.value && item.reason);
    if (!exempt) errors.push(`${candidate.file}:${candidate.line}: ${candidate.reason} contains hard-coded copy: ${JSON.stringify(candidate.value)}`);
  }
}

if (errors.length) {
  errors.forEach((error) => console.error(error));
  process.exitCode = 1;
} else if (!inventory) {
  console.log(`i18n check passed (${sourceFiles.length} source files).`);
}
