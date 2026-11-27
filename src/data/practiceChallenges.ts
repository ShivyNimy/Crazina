import type { PracticeChallenge } from '../types';

export const PRACTICE_CHALLENGES: PracticeChallenge[] = [
  {
    id: 'p-fizzbuzz-pro',
    title: 'Smart FizzBuzz Generator',
    difficulty: 'Beginner',
    category: 'Logic & Loops',
    xp: 50,
    estimatedMinutes: 6,
    mode: 'js',
    summary: 'The timeless warm-up drill — generate a clean FizzBuzz sequence from 1 to n.',
    prompt:
      'Implement fizzBuzz(n) returning an array of length n where multiples of 3 are "Fizz", multiples of 5 are "Buzz", multiples of both 3 and 5 are "FizzBuzz", and all other numbers remain numbers.',
    examples: [
      { input: 'fizzBuzz(5)', output: '[1, 2, "Fizz", 4, "Buzz"]' },
      { input: 'fizzBuzz(15)[14]', output: '"FizzBuzz"' },
    ],
    requirements: [
      'Return an empty array if n <= 0.',
      'Check divisibility by 15 (both 3 and 5) before checking 3 or 5 individually.',
    ],
    starterCode: `function fizzBuzz(n) {
  // Return an array from 1 to n replacing multiples of 3, 5, and 15
  
}

console.log(fizzBuzz(6));
`,
    solutionCode: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push('FizzBuzz');
    else if (i % 3 === 0) result.push('Fizz');
    else if (i % 5 === 0) result.push('Buzz');
    else result.push(i);
  }
  return result;
}`,
    testScript: `
test('generates classic FizzBuzz array', () => {
  expect(fizzBuzz(5)).toEqual([1, 2, 'Fizz', 4, 'Buzz']);
  expect(fizzBuzz(15)[14]).toBe('FizzBuzz');
  expect(fizzBuzz(0)).toEqual([]);
});
`,
    hints: [
      'Use modulo `%`: `i % 15 === 0` checks divisibility by both 3 and 5.',
    ],
  },
  {
    id: 'p-palindrome-clean',
    title: 'Sentence Palindrome Checker',
    difficulty: 'Beginner',
    category: 'Strings',
    xp: 60,
    estimatedMinutes: 8,
    mode: 'js',
    summary: 'Ignore spaces, casing, and punctuation to detect true palindromes.',
    prompt:
      'Implement isPalindrome(text) that returns true if text reads the same forwards and backwards after removing all non-alphanumeric characters and lowercasing.',
    examples: [
      { input: 'isPalindrome("A man, a plan, a canal: Panama")', output: 'true' },
      { input: 'isPalindrome("race a car")', output: 'false' },
    ],
    requirements: [
      'Ignore spaces, punctuation, and letter casing.',
      'Handle empty strings as true.',
    ],
    starterCode: `function isPalindrome(text) {
  // Normalize text to lowercase alphanumeric characters and check symmetry
  
}
`,
    solutionCode: `function isPalindrome(text) {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = cleaned.length - 1;
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
    testScript: `
test('detects classic multi-word palindromes', () => {
  expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true);
  expect(isPalindrome('No lemon, no melon!')).toBe(true);
  expect(isPalindrome('')).toBe(true);
});

test('rejects non-palindromes', () => {
  expect(isPalindrome('race a car')).toBe(false);
  expect(isPalindrome('Crazina')).toBe(false);
});
`,
    hints: [
      'Strip non-alphanumeric chars with `text.toLowerCase().replace(/[^a-z0-9]/g, "")`.',
      'Compare pointers from both ends moving inward, or compare `cleaned === [...cleaned].reverse().join("")`.',
    ],
  },
  {
    id: 'p-chunk-array',
    title: 'Array Pagination Chunker',
    difficulty: 'Beginner',
    category: 'Arrays',
    xp: 65,
    estimatedMinutes: 8,
    mode: 'js',
    summary: 'Split any list into clean fixed-size pages for pagination and batch APIs.',
    prompt:
      'Implement chunk(array, size) that splits array into sub-arrays each of length at most size.',
    examples: [
      { input: 'chunk([1, 2, 3, 4, 5], 2)', output: '[[1, 2], [3, 4], [5]]' },
      { input: 'chunk([1, 2, 3], 5)', output: '[[1, 2, 3]]' },
    ],
    requirements: [
      'Do not mutate the input array.',
      'Throw an Error if size <= 0.',
    ],
    starterCode: `function chunk(array, size) {
  // Slice array into chunks of length 'size'
  
}
`,
    solutionCode: `function chunk(array, size) {
  if (size <= 0) throw new Error('Chunk size must be positive');
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}`,
    testScript: `
test('splits arrays into equal chunks plus remainder', () => {
  expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
  expect(chunk([], 3)).toEqual([]);
});

test('validates size > 0', () => {
  expect(() => chunk([1, 2], 0)).toThrow();
});
`,
    hints: [
      'Loop `for (let i = 0; i < array.length; i += size)` and push `array.slice(i, i + size)`.',
    ],
  },
  {
    id: 'p-group-anagrams',
    title: 'Group Anagrams in O(n · k log k)',
    difficulty: 'Intermediate',
    category: 'Algorithms',
    xp: 110,
    estimatedMinutes: 12,
    mode: 'js',
    summary: 'A top technical interview classic using canonical Map keys.',
    prompt:
      'Implement groupAnagrams(words) that groups words sharing the exact same letters together.',
    examples: [
      { input: 'groupAnagrams(["eat","tea","tan","ate","nat","bat"])', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]' },
    ],
    requirements: [
      'Group case-insensitively or lowercased strings with identical sorted characters.',
      'Return an array of word groups (order of groups does not matter).',
    ],
    starterCode: `function groupAnagrams(words) {
  // Map canonical sorted key -> array of matching words
  
}
`,
    solutionCode: `function groupAnagrams(words) {
  const groups = new Map();
  for (const word of words) {
    const key = word.toLowerCase().split('').sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return Array.from(groups.values());
}`,
    testScript: `
test('groups anagrams accurately', () => {
  const res = groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);
  const normalized = res.map((g) => [...g].sort()).sort((a, b) => a[0].localeCompare(b[0]));
  expect(normalized).toEqual([['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]);
});

test('handles empty input', () => {
  expect(groupAnagrams([])).toEqual([]);
});
`,
    hints: [
      'Two words are anagrams if and only if sorting their letters produces the exact same string key.',
    ],
  },
  {
    id: 'p-flatten-deep',
    title: 'Recursive Deep Array Flatten',
    difficulty: 'Intermediate',
    category: 'Recursion',
    xp: 110,
    estimatedMinutes: 10,
    mode: 'js',
    summary: 'Master recursion by flattening arbitrarily nested arrays without built-in `.flat()`.',
    prompt:
      'Implement flattenDeep(input) that flattens nested arrays of any depth into a single flat array (do not call Array.prototype.flat).',
    examples: [
      { input: 'flattenDeep([1, [2, [3, [4]], 5]])', output: '[1, 2, 3, 4, 5]' },
    ],
    requirements: [
      'Handle arbitrarily deep nesting and empty nested arrays.',
      'Preserve non-array values (numbers, strings, null, objects) in order.',
    ],
    starterCode: `function flattenDeep(input) {
  // Recursively flatten nested arrays
  
}
`,
    solutionCode: `function flattenDeep(input) {
  const out = [];
  for (const item of input) {
    if (Array.isArray(item)) {
      out.push(...flattenDeep(item));
    } else {
      out.push(item);
    }
  }
  return out;
}`,
    testScript: `
test('flattens arbitrary nesting depths', () => {
  expect(flattenDeep([1, [2, [3, [4]], 5]])).toEqual([1, 2, 3, 4, 5]);
  expect(flattenDeep([[], [[]], [1, ['a']]])).toEqual([1, 'a']);
  expect(flattenDeep([])).toEqual([]);
});
`,
    hints: [
      'Check `Array.isArray(item)`. If true, recursively flatten it and push its elements into your output array.',
    ],
  },
  {
    id: 'p-debounce-fn',
    title: 'Build a Production `debounce(fn, delayMs)`',
    difficulty: 'Intermediate',
    category: 'Async & UI',
    xp: 130,
    estimatedMinutes: 12,
    mode: 'js',
    summary: 'Prevent search bars from firing 20 redundant API calls while a user types.',
    prompt:
      'Implement debounce(fn, delayMs) returning a wrapped function that delays invoking fn until delayMs milliseconds have elapsed since the last call, forwarding the latest arguments.',
    examples: [
      { input: 'Call debounced("a"), then 10ms later debounced("ab") with delay 40ms', output: 'fn is called ONCE with "ab" after 40ms of quiet' },
    ],
    requirements: [
      'Clear any pending timer whenever the debounced function is called again.',
      'Pass all arguments from the final call through to fn.',
    ],
    starterCode: `function debounce(fn, delayMs) {
  // Hold a timer id in a closure and reset it on every invocation
  
}
`,
    solutionCode: `function debounce(fn, delayMs) {
  let timerId = null;
  return function (...args) {
    if (timerId !== null) clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      fn(...args);
    }, delayMs);
  };
}`,
    testScript: `
test('collapses rapid calls and forwards the latest arguments', async () => {
  const calls = [];
  const debounced = debounce((val) => calls.push(val), 40);

  debounced('c');
  debounced('cr');
  debounced('cra');
  expect(calls).toEqual([]);

  await new Promise((r) => setTimeout(r, 75));
  expect(calls).toEqual(['cra']);
});
`,
    hints: [
      'Store `let timerId = null;` outside the returned function. Call `clearTimeout(timerId)` before calling `setTimeout(...)`.',
    ],
  },
  {
    id: 'p-event-emitter',
    title: 'Typed EventEmitter Architecture',
    difficulty: 'Advanced',
    category: 'Architecture',
    xp: 150,
    estimatedMinutes: 15,
    mode: 'js',
    summary: 'Implement Node.js’s foundational Pub/Sub EventEmitter pattern from scratch.',
    prompt:
      'Implement createEventEmitter() supporting on(event, fn), off(event, fn), once(event, fn), and emit(event, ...args).',
    examples: [
      { input: 'emitter.on("save", fn); emitter.emit("save", 42)', output: 'Invokes fn(42)' },
    ],
    requirements: [
      'on(event, fn) registers listener.',
      'off(event, fn) removes listener.',
      'once(event, fn) invokes listener at most once, then auto-removes it.',
      'emit(event, ...args) invokes all registered listeners in registration order.',
    ],
    starterCode: `function createEventEmitter() {
  // Maintain a Map of eventName -> Set of listeners
  
}
`,
    solutionCode: `function createEventEmitter() {
  const events = new Map();

  function on(event, fn) {
    if (!events.has(event)) events.set(event, new Set());
    events.get(event).add(fn);
  }

  function off(event, fn) {
    const set = events.get(event);
    if (set) set.delete(fn);
  }

  function once(event, fn) {
    const wrapper = (...args) => {
      off(event, wrapper);
      fn(...args);
    };
    on(event, wrapper);
  }

  function emit(event, ...args) {
    const set = events.get(event);
    if (!set) return;
    for (const fn of [...set]) {
      fn(...args);
    }
  }

  return { on, off, once, emit };
}`,
    testScript: `
test('supports on, off, once, and emit with multiple args', () => {
  const bus = createEventEmitter();
  const seen = [];
  const handler = (a, b) => seen.push(a + b);

  bus.on('math', handler);
  bus.once('math', (a) => seen.push('once:' + a));
  bus.emit('math', 2, 3);
  bus.emit('math', 10, 5);
  bus.off('math', handler);
  bus.emit('math', 100, 1);

  expect(seen).toEqual([5, 'once:2', 15]);
});
`,
    hints: [
      'Iterate over a copy `[...set]` inside `emit` so a `once` listener deleting itself during iteration never skips the next listener!',
    ],
  },
  {
    id: 'p-promise-pool',
    title: 'Async Concurrency Pool (`runWithLimit`)',
    difficulty: 'Professional',
    category: 'Production Systems',
    xp: 220,
    estimatedMinutes: 18,
    mode: 'js',
    summary: 'Control concurrency in production crawlers and batch uploaders without overwhelming servers.',
    prompt:
      'Implement runWithLimit(tasks, limit) where tasks is an array of zero-arg async functions `() => Promise<T>`. Run AT MOST `limit` tasks concurrently, returning all results in the original input order.',
    examples: [
      { input: 'runWithLimit([t1, t2, t3, t4], 2)', output: 'Resolves [r1, r2, r3, r4] while never running >2 at once' },
    ],
    requirements: [
      'Never have more than `limit` promises actively in flight simultaneously.',
      'Preserve the original task ordering in the returned results array.',
      'Handle empty tasks array gracefully.',
    ],
    starterCode: `async function runWithLimit(tasks, limit) {
  // Spawn up to 'limit' worker loops pulling the next task index
  
}
`,
    solutionCode: `async function runWithLimit(tasks, limit) {
  if (tasks.length === 0) return [];
  const results = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const current = nextIndex;
      nextIndex += 1;
      results[current] = await tasks[current]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}`,
    testScript: `
test('respects max concurrency limit and preserves result ordering', async () => {
  let active = 0;
  let maxObserved = 0;
  const delays = [50, 20, 40, 10, 30];

  const tasks = delays.map((ms, idx) => async () => {
    active += 1;
    maxObserved = Math.max(maxObserved, active);
    await new Promise((r) => setTimeout(r, ms));
    active -= 1;
    return 'task-' + idx;
  });

  const out = await runWithLimit(tasks, 2);
  expect(out).toEqual(['task-0', 'task-1', 'task-2', 'task-3', 'task-4']);
  expect(maxObserved).toBe(2);
});
`,
    hints: [
      'Think in terms of `Math.min(limit, tasks.length)` async workers sharing a `let nextIndex = 0` cursor.',
      'Each worker loops `while (nextIndex < tasks.length)`, claims `const i = nextIndex++`, awaits `tasks[i]()`, and saves to `results[i]`.',
    ],
  },
  {
    id: 'p-interactive-todo-web',
    title: 'Interactive Task Filter UI (DOM)',
    difficulty: 'Intermediate',
    category: 'Web & DOM',
    xp: 120,
    estimatedMinutes: 14,
    mode: 'web',
    summary: 'Build a real interactive HTML/CSS/JS task adder with live item count.',
    prompt:
      'Wire up script.js so submitting the form #task-form adds a new <li> item to #task-list, clears #task-input, and updates #task-count.',
    examples: [
      { input: 'Type "Learn CSS Grid" and submit #task-form', output: 'Appends <li>Learn CSS Grid</li> and sets #task-count to "1"' },
    ],
    requirements: [
      'Prevent default form submission with e.preventDefault().',
      'Ignore empty/whitespace-only inputs.',
      'Append a new <li> using textContent, clear the input, and update #task-count.',
    ],
    starterFiles: {
      html: `<div class="app">
  <div class="top">
    <h2>Quick Tasks</h2>
    <span class="pill"><span id="task-count">0</span> items</span>
  </div>
  <form id="task-form">
    <input id="task-input" type="text" placeholder="Add a coding goal..." />
    <button type="submit">Add</button>
  </form>
  <ul id="task-list"></ul>
</div>`,
      css: `.app { max-width: 400px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
h2 { margin: 0; font-size: 1.15rem; }
.pill { background: #ecfdf5; color: #065f46; padding: 4px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 700; }
form { display: flex; gap: 8px; margin-bottom: 14px; }
input { flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; }
button { background: #0f9d68; color: white; border: none; padding: 8px 14px; border-radius: 8px; font-weight: 600; cursor: pointer; }
ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
li { background: #f8fafc; padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; }`,
      js: `const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const countEl = document.querySelector('#task-count');

// Listen for 'submit' on form
`,
    },
    solutionFiles: {
      html: `<div class="app">
  <div class="top">
    <h2>Quick Tasks</h2>
    <span class="pill"><span id="task-count">0</span> items</span>
  </div>
  <form id="task-form">
    <input id="task-input" type="text" placeholder="Add a coding goal..." />
    <button type="submit">Add</button>
  </form>
  <ul id="task-list"></ul>
</div>`,
      css: `.app { max-width: 400px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
h2 { margin: 0; font-size: 1.15rem; }
.pill { background: #ecfdf5; color: #065f46; padding: 4px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 700; }
form { display: flex; gap: 8px; margin-bottom: 14px; }
input { flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; }
button { background: #0f9d68; color: white; border: none; padding: 8px 14px; border-radius: 8px; font-weight: 600; cursor: pointer; }
ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
li { background: #f8fafc; padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; }`,
      js: `const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const countEl = document.querySelector('#task-count');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const li = document.createElement('li');
  li.textContent = text;
  list.appendChild(li);
  input.value = '';
  countEl.textContent = String(list.children.length);
});`,
    },
    testScript: `
test('adds non-empty tasks, clears input, and updates counter', () => {
  const form = document.querySelector('#task-form');
  const input = document.querySelector('#task-input');
  const list = document.querySelector('#task-list');
  const count = document.querySelector('#task-count');

  input.value = '   ';
  form.dispatchEvent(new Event('submit', { cancelable: true }));
  expect(list.children.length).toBe(0);

  input.value = 'Master Async JS';
  form.dispatchEvent(new Event('submit', { cancelable: true }));
  expect(list.children.length).toBe(1);
  expect(list.children[0].textContent).toBe('Master Async JS');
  expect(input.value).toBe('');
  expect(count.textContent.trim()).toBe('1');
});
`,
    hints: [
      'Use `form.addEventListener("submit", (e) => { e.preventDefault(); ... })`.',
      'Create a new item with `const li = document.createElement("li"); li.textContent = text; list.appendChild(li);`.',
    ],
  },
  {
    id: 'p-deep-clone',
    title: 'Deep Clone Engine (Arrays, Objects, Dates)',
    difficulty: 'Professional',
    category: 'Core JS Internals',
    xp: 190,
    estimatedMinutes: 16,
    mode: 'js',
    summary: 'Deeply clone nested structures safely — including handling circular references!',
    prompt:
      'Implement deepClone(value) that returns a completely independent deep copy of primitives, Dates, Arrays, and plain Objects, without throwing on circular references.',
    examples: [
      { input: 'const copy = deepClone({ a: [1, { b: 2 }] })', output: 'Mutating copy.a[1].b never affects original' },
    ],
    requirements: [
      'Primitives (number, string, boolean, null, undefined) return directly.',
      'Date instances return a new Date with the same timestamp.',
      'Arrays and plain objects are cloned recursively with zero shared references.',
      'Use a WeakMap to safely handle circular references (`obj.self = obj`).',
    ],
    starterCode: `function deepClone(value, seen = new WeakMap()) {
  // Handle primitives, Date, circular refs via WeakMap, Arrays, and Objects
  
}
`,
    solutionCode: `function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value.getTime());
  if (seen.has(value)) return seen.get(value);

  const clone = Array.isArray(value) ? [] : {};
  seen.set(value, clone);

  for (const key of Object.keys(value)) {
    clone[key] = deepClone(value[key], seen);
  }
  return clone;
}`,
    testScript: `
test('deeply clones nested objects, arrays, and Dates without shared refs', () => {
  const orig = {
    name: 'Crazina',
    created: new Date('2026-01-01T00:00:00Z'),
    nested: { tags: ['js', 'pro'] },
  };
  const copy = deepClone(orig);
  copy.nested.tags.push('modified');
  copy.created.setFullYear(2030);

  expect(orig.nested.tags).toEqual(['js', 'pro']);
  expect(orig.created.getUTCFullYear()).toBe(2026);
});

test('handles circular references safely without stack overflow', () => {
  const node = { id: 1 };
  node.self = node;
  const copy = deepClone(node);
  expect(copy !== node).toBe(true);
  expect(copy.id).toBe(1);
  expect(copy.self === copy).toBe(true);
});
`,
    hints: [
      'Store `seen.set(value, clone)` BEFORE recursing into `Object.keys(value)` so circular references immediately resolve to `clone`.',
    ],
  },
];
