import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '..', 'lib', 'translations.ts');
const src = fs.readFileSync(filePath, 'utf8');

const langRegex = /^ {4}([a-z]{2,}|[a-z]{2,}-[A-Z]{2,}|us):\s*\{/gm;
const topLevelKeyRegex = /^ {8}([A-Za-z0-9_]+)\s*:/gm;

const results = {};
let m;
while ((m = langRegex.exec(src)) !== null) {
  const lang = m[1];
  const start = m.index + m[0].length - 1; // position of '{'
  // find matching closing brace
  let depth = 0;
  let i = start;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  const block = src.slice(start + 1, i);
  // remove string literals to avoid false colons
  const noStrings = block.replace(/(['"`])(?:(?=(\\?))\\2.)*?\1/g, "");
  const counts = {};
  const keysFound = [];
  let k;
  while ((k = topLevelKeyRegex.exec(noStrings)) !== null) {
    const key = k[1];
    keysFound.push(key);
    counts[key] = (counts[key] || 0) + 1;
  }
  results[lang] = { keys: keysFound, counts };
}

const duplicatesByLang = Object.fromEntries(Object.entries(results).map(([lang,data])=>[lang, Object.entries(data.counts).filter(([,v])=>v>1)]).filter(([,arr])=>arr.length>0));

if (Object.keys(duplicatesByLang).length === 0) {
  console.log('No top-level duplicate keys found in any language.');
  process.exit(0);
}

console.log('Top-level duplicate keys per language with context:');
for (const [lang, arr] of Object.entries(duplicatesByLang)) {
  console.log(`- ${lang}:`);
  for (const [k,v] of arr) console.log(`  - ${k}: ${v}`);
  console.log('  keys found (top-level):', results[lang].keys.join(', '));
}
// Additional exact check for `processing:` occurrences (exact top-level pattern)
console.log('\nExact counts for "        processing:" per language:');
for (const [langStart, data] of Object.entries(results)) {
  // find the language block by locating the first occurrence of `${lang}: {` in the file
  const search = `    ${langStart}: {`;
  const idx = src.indexOf(search);
  if (idx === -1) continue;
  // find end of block (next top-level language or end)
  const nextLangMatch = src.slice(idx + 1).match(/^ {4}[a-z]{2,}: /m);
  let endIdx = src.length;
  if (nextLangMatch) {
    const nextPos = src.indexOf(nextLangMatch[0], idx + 1);
    if (nextPos !== -1) endIdx = nextPos;
  }
  const block = src.slice(idx, endIdx);
  const exact = (block.match(/\n {8}processing:/g) || []).length;
  if (exact > 1) console.log(`- ${langStart}: ${exact}`);
}
process.exit(0);
