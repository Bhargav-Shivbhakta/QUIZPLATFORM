// Turns question Markdown (with $math$ and code) into HTML.
import { marked } from '../vendor/marked.esm.js';

marked.setOptions({ gfm: true, breaks: false });

const cache = new Map();

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderMath(tex, display) {
  if (window.katex) {
    try { return window.katex.renderToString(tex, { displayMode: display, throwOnError: false, output: 'html' }); } catch {}
  }
  return `<code>${esc(tex)}</code>`;
}

// Pull math out before Markdown runs so underscores/asterisks inside formulas survive.
function protectMath(src) {
  const store = [];
  const keep = (html) => { store.push(html); return `@@MATH${store.length - 1}@@`; };
  let out = '';
  // leave code spans and fenced blocks alone
  const parts = src.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]+`)/g);
  for (const part of parts) {
    if (/^(```|~~~|`)/.test(part)) { out += part; continue; }
    let p = part.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => keep(renderMath(t.trim(), true)));
    p = p.replace(/\\\[([\s\S]+?)\\\]/g, (_, t) => keep(renderMath(t.trim(), true)));
    p = p.replace(/\\\(([\s\S]+?)\\\)/g, (_, t) => keep(renderMath(t.trim(), false)));
    // $...$ inline: no space just inside the dollars and no digit right after the closing one,
    // so prices like "$5 and $10" are left alone
    p = p.replace(/(^|[^\\$])\$(?=\S)((?:\\\$|[^$\n])+?)(?<=\S)\$(?!\d)/g, (_, pre, t) => pre + keep(renderMath(t, false)));
    out += p.replace(/\\\$/g, '$');
  }
  return { text: out, store };
}

export function md(src, { inline = false } = {}) {
  const key = (inline ? 'i:' : 'b:') + src;
  if (cache.has(key)) return cache.get(key);
  const { text, store } = protectMath(String(src ?? ''));
  let html = inline ? marked.parseInline(text) : marked.parse(text);
  html = html.replace(/@@MATH(\d+)@@/g, (_, i) => store[Number(i)]);
  html = html.replace(/<img /g, '<img loading="lazy" ');
  // code blocks can scroll sideways, so make them reachable with the keyboard
  html = html.replace(/<pre>/g, '<pre tabindex="0">');
  html = html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>');
  if (cache.size > 2000) cache.clear();
  cache.set(key, html);
  return html;
}

export function highlight(root) {
  if (!window.hljs) return;
  root.querySelectorAll('pre code:not([data-hl])').forEach((el) => {
    el.setAttribute('data-hl', '1');
    try { window.hljs.highlightElement(el); } catch {}
  });
}

// Plain-text preview of a question (for lists)
export function snippet(src, n = 120) {
  const t = String(src ?? '')
    .replace(/```[^\n]*\n([\s\S]*?)```/g, (_, code) => { const first = code.split('\n').map((l) => l.trim()).find(Boolean) || ''; return first ? ` \`${first.replace(/`/g, '')}${code.trim().includes('\n') ? ' …' : ''}\` ` : ' '; })
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' [image] ')
    .replace(/^\s*\|.*$/gm, ' ')
    .replace(/\$\$([^$]+)\$\$/g, '$$$1$$')
    .replace(/[*`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (t.length <= n) return t;
  let cut = t.slice(0, n - 1);
  // don't cut a $math$ span in half
  if ((cut.match(/(?<!\\)\$/g) || []).length % 2) cut = cut.slice(0, cut.lastIndexOf('$'));
  return cut.trimEnd() + '…';
}
