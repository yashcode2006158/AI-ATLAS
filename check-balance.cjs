const fs = require('fs');
const content = fs.readFileSync('src/views/HomeView.tsx', 'utf8');
const braceStack = [];
const parenStack = [];
const bracketStack = [];
let inTemplate = false;
let inSingleLineComment = false;
let inMultiLineComment = false;
let inString = false;
let stringChar = null;

for (let i = 0; i < content.length; i++) {
  const c = content[i];
  const next = content[i + 1] || '';
  const line = content.substring(0, i).split('\n').length;
  const col = i - content.lastIndexOf('\n', i - 1);

  if (inSingleLineComment) { if (c === '\n') inSingleLineComment = false; continue; }
  if (inMultiLineComment) { if (c === '*' && next === '/') { inMultiLineComment = false; i++; } continue; }
  if (inString) { if (c === '\\') { i++; continue; } if (c === stringChar) inString = false; continue; }
  if (inTemplate) { if (c === '\\') { i++; continue; } if (c === '`') inTemplate = false; continue; }
  if (c === '/' && next === '/') { inSingleLineComment = true; i++; continue; }
  if (c === '/' && next === '*') { inMultiLineComment = true; i++; continue; }
  if (c === '"' || c === "'" || c === '`') { inString = true; stringChar = c; if (c === '`') inTemplate = true; continue; }

  if (c === '{') braceStack.push({line, col});
  if (c === '}') { if (braceStack.length === 0) console.log('Extra } at', line+':'+col); else braceStack.pop(); }
  if (c === '(') parenStack.push({line, col});
  if (c === ')') { if (parenStack.length === 0) console.log('Extra ) at', line+':'+col); else parenStack.pop(); }
  if (c === '[') bracketStack.push({line, col});
  if (c === ']') { if (bracketStack.length === 0) console.log('Extra ] at', line+':'+col); else bracketStack.pop(); }
}
console.log('Unclosed {:', braceStack);
console.log('Unclosed (:', parenStack);
console.log('Unclosed [:', bracketStack);
