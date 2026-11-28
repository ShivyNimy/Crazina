import type { WebStarterFiles } from '../types';

export interface PlaygroundTemplate {
  id: string;
  name: string;
  mode: 'web' | 'js';
  description: string;
  jsCode?: string;
  webFiles?: WebStarterFiles;
}

export const PLAYGROUND_TEMPLATES: PlaygroundTemplate[] = [
  {
    id: 'web-interactive-card',
    name: 'Interactive Theme Card',
    mode: 'web',
    description: 'Experiment with Flexbox, CSS variables, and DOM click events live.',
    webFiles: {
      html: `<div class="card" id="card">
  <span class="badge">Crazina Sandbox</span>
  <h1>Build &amp; Experiment Live</h1>
  <p>Edit HTML, CSS, or JavaScript on the left and watch your creation update right here.</p>
  <button id="toggle-btn" type="button">Switch Accent Color</button>
</div>`,
      css: `body {
  display: grid;
  place-items: center;
  min-height: 85vh;
  background: #f8fafc;
}
.card {
  max-width: 380px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  transition: transform 0.2s ease;
}
.badge {
  display: inline-block;
  background: #ecfdf5;
  color: #047857;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
}
h1 { font-size: 1.45rem; margin: 12px 0 8px; }
p { color: #475569; line-height: 1.55; margin-bottom: 20px; }
button {
  background: #0f9d68;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}`,
      js: `const colors = ['#0f9d68', '#2563eb', '#e05a2b', '#7c3aed'];
let idx = 0;

const btn = document.querySelector('#toggle-btn');
btn.addEventListener('click', () => {
  idx = (idx + 1) % colors.length;
  btn.style.background = colors[idx];
  console.log('Switched accent color to:', colors[idx]);
});`,
    },
  },
  {
    id: 'web-grid-pricing',
    name: 'Responsive CSS Grid',
    mode: 'web',
    description: 'Auto-fitting CSS Grid layout with hover elevation.',
    webFiles: {
      html: `<section class="grid">
  <article class="tile"><h3>Stage 1–2</h3><p>Foundations, HTML, CSS &amp; DOM</p></article>
  <article class="tile highlight"><h3>Stage 3–4</h3><p>Modern JS &amp; Algorithms</p></article>
  <article class="tile"><h3>Stage 5–6</h3><p>Architecture &amp; Production Systems</p></article>
</section>`,
      css: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 14px;
}
.tile {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px;
}
.tile.highlight {
  background: #0f172a;
  color: #f8fafc;
  border-color: #0f172a;
}
h3 { margin: 0 0 6px; font-size: 1.05rem; }
p { margin: 0; font-size: 0.88rem; opacity: 0.8; }`,
      js: `console.log('Grid ready! Try adding another <article class="tile"> in HTML.');`,
    },
  },
  {
    id: 'js-algorithms',
    name: 'JavaScript Algorithm Lab',
    mode: 'js',
    description: 'Run pure JavaScript with console output and execution timing.',
    jsCode: `// Try editing and pressing Ctrl+Enter (or Cmd+Enter) to run!
function fibonacci(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const val = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  memo.set(n, val);
  return val;
}

for (let i = 1; i <= 12; i++) {
  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);
}
console.log('fib(45) with memoization =', fibonacci(45));
`,
  },
  {
    id: 'js-async-demo',
    name: 'Async Pipeline Sandbox',
    mode: 'js',
    description: 'Experiment with Promises, async/await, and parallel fetches.',
    jsCode: `const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function runPipeline() {
  console.log('Starting parallel requests...');
  const [profile, metrics] = await Promise.all([
    delay(80, { user: 'Maya', level: 'Pro' }),
    delay(60, { streak: 14, xp: 1420 }),
  ]);
  console.log('Loaded concurrently:', { profile, metrics });
}

await runPipeline();
`,
  },
];
