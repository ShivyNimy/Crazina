import type { Lesson } from '../types';

export const LESSONS_STAGE_3_TO_4: Lesson[] = [
  // =========================================================================
  // STAGE 3: CORE PROGRAMMING MASTERY (MODERN JAVASCRIPT)
  // =========================================================================
  {
    id: 's3-array-pipelines',
    stageId: 3,
    order: 9,
    title: 'Functional Array Pipelines: map, filter & reduce',
    subtitle: 'Transforming real datasets cleanly without messy manual loops',
    difficulty: 'Intermediate',
    durationMinutes: 14,
    xp: 100,
    mode: 'js',
    concepts: ['Array.filter', 'Array.map', 'Array.reduce', 'Method Chaining'],
    summary:
      'In modern software, 80% of business logic is transforming lists of records (orders, users, logs). Chaining filter, map, and reduce reads like plain English and avoids mutation bugs.',
    sections: [
      {
        heading: 'The Three Power Tools',
        analogy:
          'Think of a factory assembly line: filter removes defective items, map transforms each surviving item into a new shape, and reduce packs all items into one final summary value.',
        paragraphs: [
          'None of filter, map, or reduce mutate the original array — they produce fresh results, keeping your data predictable.',
        ],
        codeExample: {
          title: 'Chaining filter → map → reduce',
          language: 'js',
          code: `const orders = [
  { id: 1, total: 50, paid: true },
  { id: 2, total: 120, paid: false },
  { id: 3, total: 80, paid: true },
];

const paidRevenue = orders
  .filter((o) => o.paid)
  .map((o) => o.total)
  .reduce((sum, amount) => sum + amount, 0);

console.log(paidRevenue); // 130`,
        },
      },
    ],
    pitfall: {
      title: 'Forgetting the initial value in reduce()',
      badTitle: 'Crashes with TypeError on empty arrays',
      badCode: `const total = [].reduce((sum, x) => sum + x); // 💥 TypeError!`,
      goodTitle: 'Always pass an explicit initial value (0, [], {})',
      goodCode: `const total = [].reduce((sum, x) => sum + x, 0); // 0`,
      why: 'Passing an explicit initial accumulator guarantees safe behavior on empty arrays and makes the return type immediately clear.',
    },
    keyTakeaways: [
      'filter(fn) keeps items where fn returns true.',
      'map(fn) transforms every item 1-to-1 into a new array of the same length.',
      'reduce(fn, initialValue) folds an entire array into a single number, object, or grouped map.',
    ],
    quiz: {
      question: 'If an array has 5 items, how many items will `arr.map(x => x * 2)` ALWAYS return?',
      options: ['Between 0 and 5 items', 'Always 5 items', '1 item', '10 items'],
      correctIndex: 1,
      explanation: 'map() always produces a new array with the exact same length as the input array.',
    },
    lab: {
      title: 'Build a Sales Analytics Pipeline',
      prompt:
        'Implement summarizeSales(transactions) using array methods without mutating the input array.',
      requirements: [
        'Each transaction has { category: string, amount: number, refunded: boolean }.',
        'Ignore transactions where refunded === true.',
        'Return an object: { totalRevenue: number, count: number, byCategory: Record<string, number> }.',
        'totalRevenue is the sum of non-refunded amounts; count is the count of non-refunded transactions; byCategory maps each category to its non-refunded sum.',
      ],
      starterCode: `function summarizeSales(transactions) {
  // Filter out refunded transactions, then compute totalRevenue, count, and byCategory
  
}

const sample = [
  { category: 'books', amount: 20, refunded: false },
  { category: 'courses', amount: 100, refunded: false },
  { category: 'books', amount: 15, refunded: true },
  { category: 'books', amount: 30, refunded: false },
];
console.log(summarizeSales(sample));
`,
      solutionCode: `function summarizeSales(transactions) {
  const valid = transactions.filter((t) => !t.refunded);
  const byCategory = valid.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  const totalRevenue = valid.reduce((sum, t) => sum + t.amount, 0);
  return {
    totalRevenue,
    count: valid.length,
    byCategory,
  };
}`,
      testScript: `
test('summarizes valid transactions and excludes refunds', () => {
  const data = [
    { category: 'books', amount: 20, refunded: false },
    { category: 'courses', amount: 100, refunded: false },
    { category: 'books', amount: 15, refunded: true },
    { category: 'books', amount: 30, refunded: false },
  ];
  const res = summarizeSales(data);
  expect(res).toEqual({
    totalRevenue: 150,
    count: 3,
    byCategory: { books: 50, courses: 100 },
  });
});

test('handles empty or all-refunded arrays safely', () => {
  expect(summarizeSales([])).toEqual({ totalRevenue: 0, count: 0, byCategory: {} });
  expect(summarizeSales([{ category: 'a', amount: 50, refunded: true }])).toEqual({
    totalRevenue: 0,
    count: 0,
    byCategory: {},
  });
});
`,
      hints: [
        'First filter: const valid = transactions.filter((t) => !t.refunded);',
        'Use reduce with {} to group sums: acc[t.category] = (acc[t.category] || 0) + t.amount; return acc;',
        'Compute totalRevenue with valid.reduce((sum, t) => sum + t.amount, 0) and return { totalRevenue, count: valid.length, byCategory }.',
      ],
    },
  },

  {
    id: 's3-objects-immutability',
    stageId: 3,
    order: 10,
    title: 'Objects, Destructuring & Immutable Updates',
    subtitle: 'Updating nested data safely — the backbone of React & Redux',
    difficulty: 'Intermediate',
    durationMinutes: 14,
    xp: 105,
    mode: 'js',
    concepts: ['Destructuring', 'Spread Operator (...)', 'Immutable State Updates', 'Optional Chaining (?.)'],
    summary:
      'Mutating shared objects directly is the #1 source of spooky "action at a distance" bugs in frontend and backend apps. Immutability makes state changes transparent and trackable.',
    sections: [
      {
        heading: 'Cloning & Updating Without Mutation',
        paragraphs: [
          'The spread operator ({ ...obj, updatedKey: newValue }) creates a fresh shallow copy with only your changed properties overridden — leaving the original object untouched.',
          'When updating nested objects (like user.settings.theme), spread each level along the path so you never accidentally mutate nested references.',
        ],
        codeExample: {
          title: 'Safe nested immutable update',
          language: 'js',
          code: `const user = {
  name: "Sam",
  settings: { theme: "light", notifications: true },
};

const updatedUser = {
  ...user,
  settings: {
    ...user.settings,
    theme: "dark",
  },
};

console.log(user.settings.theme);        // "light" (untouched!)
console.log(updatedUser.settings.theme); // "dark"`,
        },
      },
    ],
    keyTakeaways: [
      'Destructuring (`const { name, role = "member" } = user`) extracts fields concisely with safe defaults.',
      'Optional chaining (`user?.profile?.avatar`) prevents "Cannot read properties of undefined" crashes.',
      'Always copy objects/arrays before modifying when writing state transitions.',
    ],
    quiz: {
      question: 'After `const b = { ...a, x: 2 }` where `a = { x: 1, nested: { y: 1 } }`, what happens if you run `b.nested.y = 99`?',
      options: [
        'a.nested.y stays 1 because spread performs a deep clone',
        'a.nested.y ALSO becomes 99 because spread is a shallow copy',
        'JavaScript throws a TypeError',
        'b.nested becomes undefined',
      ],
      correctIndex: 1,
      explanation: 'Object spread ({ ...a }) only copies top-level keys. Nested objects share references unless you spread them too (or use structuredClone).',
    },
    lab: {
      title: 'Immutable User Settings Updater',
      prompt:
        'Write updatePreferences(state, userId, patch) to immutably update a single user’s preferences inside an array of users.',
      requirements: [
        'Return a NEW array where only the user with id === userId has their preferences merged with patch.',
        'Do NOT mutate the original state array, any user object, or any preferences object!',
        'If userId is not found, return a shallow copy of the array with users unchanged.',
      ],
      starterCode: `function updatePreferences(users, userId, patch) {
  // Return a new array with the matching user's preferences immutably merged with patch
  
}

const users = [
  { id: 1, name: 'Ana', preferences: { theme: 'light', fontSize: 14 } },
  { id: 2, name: 'Ben', preferences: { theme: 'dark', fontSize: 16 } },
];
console.log(updatePreferences(users, 1, { theme: 'dark' }));
`,
      solutionCode: `function updatePreferences(users, userId, patch) {
  return users.map((user) => {
    if (user.id !== userId) return user;
    return {
      ...user,
      preferences: {
        ...user.preferences,
        ...patch,
      },
    };
  });
}`,
      testScript: `
test('updates the target user preferences accurately', () => {
  const users = [
    { id: 1, name: 'Ana', preferences: { theme: 'light', fontSize: 14 } },
    { id: 2, name: 'Ben', preferences: { theme: 'dark', fontSize: 16 } },
  ];
  const next = updatePreferences(users, 1, { theme: 'dark' });
  expect(next[0].preferences).toEqual({ theme: 'dark', fontSize: 14 });
  expect(next[1].preferences).toEqual({ theme: 'dark', fontSize: 16 });
});

test('does NOT mutate the original array, user, or preferences object', () => {
  const users = [
    { id: 1, name: 'Ana', preferences: { theme: 'light', fontSize: 14 } },
  ];
  const next = updatePreferences(users, 1, { fontSize: 18 });
  expect(next === users).toBe(false);
  expect(next[0] === users[0]).toBe(false);
  expect(next[0].preferences === users[0].preferences).toBe(false);
  expect(users[0].preferences.fontSize).toBe(14);
});
`,
      hints: [
        'Use users.map((user) => { ... }) so you automatically get a brand new array.',
        'When user.id === userId, return { ...user, preferences: { ...user.preferences, ...patch } }.',
      ],
    },
  },

  {
    id: 's3-closures-hof',
    stageId: 3,
    order: 11,
    title: 'Closures, Scope & Higher-Order Functions',
    subtitle: 'How functions carry private memory and create powerful utilities',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    xp: 115,
    mode: 'js',
    concepts: ['Lexical Scope', 'Closures', 'Encapsulation', 'Higher-Order Functions'],
    summary:
      'Closures are one of JavaScript’s superpowers. They allow a function to "remember" variables from the place it was born — powering private state, middleware, event handlers, and React hooks.',
    sections: [
      {
        heading: 'Functions With a Backpack',
        analogy:
          'When an inner function is returned from an outer function, it carries an invisible backpack containing every local variable it needed from its birthplace. Nobody outside can tamper with the backpack directly.',
        paragraphs: [
          'A Higher-Order Function (HOF) either takes a function as an argument (like map or filter) OR returns a new function (like createCounter or once).',
        ],
        codeExample: {
          title: 'Private state using a closure',
          language: 'js',
          code: `function createBankAccount(initialBalance) {
  let balance = initialBalance; // Truly private!

  return {
    deposit(amount) {
      if (amount > 0) balance += amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}

const acct = createBankAccount(100);
acct.deposit(50);
console.log(acct.getBalance()); // 150
console.log(acct.balance);      // undefined (encapsulated!)`,
        },
      },
    ],
    keyTakeaways: [
      'A closure is a function bundled together with references to its surrounding lexical scope.',
      'Closures enable true data privacy without exposing mutable variables globally.',
      'Higher-order wrappers like once(fn), memoize(fn), and debounce(fn) are everyday tools in pro codebases.',
    ],
    quiz: {
      question: 'What is a Higher-Order Function?',
      options: [
        'A function with more than 3 parameters',
        'A function that runs asynchronously',
        'A function that accepts another function as an argument or returns a function',
        'A function declared at the top of a file',
      ],
      correctIndex: 2,
      explanation: 'Functions are first-class values in JavaScript, so passing or returning them creates Higher-Order Functions.',
    },
    lab: {
      title: 'Implement `once(fn)` and `createRateCounter()`',
      prompt:
        'Build two classic closure utilities used across real libraries like Lodash and Express.',
      requirements: [
        'once(fn): returns a wrapped function that executes fn AT MOST ONCE (passing through any arguments), caches its return value, and returns that same cached value on every subsequent call without calling fn again.',
        'createCounter(start = 0, step = 1): returns an object with { next(), reset(), value() } where next() increments by step and returns the new value, reset() resets back to start, and value() returns the current count without mutating.',
      ],
      starterCode: `function once(fn) {
  // Track whether fn has been called and cache its result
  
}

function createCounter(start = 0, step = 1) {
  // Keep private count inside closure and return { next, reset, value }
  
}
`,
      solutionCode: `function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

function createCounter(start = 0, step = 1) {
  let count = start;
  return {
    next() {
      count += step;
      return count;
    },
    reset() {
      count = start;
      return count;
    },
    value() {
      return count;
    },
  };
}`,
      testScript: `
test('once(fn) calls fn only once and returns the cached result', () => {
  let calls = 0;
  const init = once((x, y) => {
    calls += 1;
    return x + y;
  });
  expect(init(3, 4)).toBe(7);
  expect(init(10, 20)).toBe(7);
  expect(init(1, 1)).toBe(7);
  expect(calls).toBe(1);
});

test('createCounter encapsulates private state with custom start and step', () => {
  const c = createCounter(10, 5);
  expect(c.value()).toBe(10);
  expect(c.next()).toBe(15);
  expect(c.next()).toBe(20);
  expect(c.value()).toBe(20);
  c.reset();
  expect(c.value()).toBe(10);
  expect(c.count).toBe(undefined);
});
`,
      hints: [
        'In once(fn), declare let called = false; let result; outside the returned (...args) => {} function.',
        'Be sure to check if (!called) rather than if (!result), in case fn legitimately returns 0, false, or undefined!',
        'In createCounter, keep let count = start inside the closure and expose methods next(), reset(), and value().',
      ],
    },
  },

  {
    id: 's3-async-promises',
    stageId: 3,
    order: 12,
    title: 'Asynchronous JS: Promises & async/await',
    subtitle: 'Fetching APIs concurrently without blocking the user interface',
    difficulty: 'Intermediate',
    durationMinutes: 16,
    xp: 120,
    mode: 'js',
    concepts: ['Promises', 'async / await', 'try / catch', 'Promise.all Concurrency'],
    summary:
      'Real apps wait on databases, network APIs, and files all the time. Async JavaScript lets your app stay smooth and responsive while multiple network requests run in parallel.',
    sections: [
      {
        heading: 'Sequential vs Parallel Awaits',
        analogy:
          'Making breakfast: if you wait for toast to finish BEFORE putting the kettle on, breakfast takes twice as long. Promise.all starts both at the same time and finishes when both are ready!',
        paragraphs: [
          'await pauses only the current async function — never the whole browser. Always wrap awaited operations in try / catch to handle network failures gracefully.',
        ],
        codeExample: {
          title: 'Fast parallel fetching with Promise.all',
          language: 'js',
          code: `async function loadDashboard(fetchUser, fetchPosts) {
  try {
    // Runs BOTH requests concurrently instead of one-by-one!
    const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
    return { user, posts };
  } catch (err) {
    return { error: err.message };
  }
}`,
        },
      },
    ],
    pitfall: {
      title: 'Accidental Sequential Waterfall',
      badTitle: 'Waits for A to finish before even starting B',
      badCode: `const user = await fetchUser();
const stats = await fetchStats(); // Slow waterfall!`,
      goodTitle: 'Start independent requests together with Promise.all',
      goodCode: `const [user, stats] = await Promise.all([
  fetchUser(),
  fetchStats(),
]);`,
      why: 'When two API calls don’t depend on each other, running them with Promise.all cuts total wait time in half.',
    },
    keyTakeaways: [
      'Every async function automatically returns a Promise.',
      'Use try/catch around await calls to handle rejected Promises gracefully.',
      'Use Promise.all for parallel independent tasks, and Promise.allSettled when partial failures are acceptable.',
    ],
    quiz: {
      question: 'If Task A takes 200ms and Task B takes 300ms independently, roughly how long does `await Promise.all([taskA(), taskB()])` take?',
      options: ['500ms', '~300ms', '~200ms', '0ms'],
      correctIndex: 1,
      explanation: 'Both tasks run concurrently, so Promise.all resolves once the slowest one (~300ms) completes.',
    },
    lab: {
      title: 'Build a Resilient Batch Loader',
      prompt:
        'Implement fetchUsersSafely(ids, fetcher) that fetches all user IDs concurrently and separates successes from failures without crashing the whole batch.',
      requirements: [
        'fetcher(id) is an async function that resolves to a user object or rejects with an Error.',
        'Start all fetcher(id) calls concurrently (use Promise.allSettled or catch per-promise with Promise.all).',
        'Return { users: [...fulfilledValues], failedIds: [...idsThatRejected] } preserving the original input order.',
      ],
      starterCode: `async function fetchUsersSafely(ids, fetcher) {
  // Fetch all ids concurrently without letting one rejection fail the batch
  
}
`,
      solutionCode: `async function fetchUsersSafely(ids, fetcher) {
  const settled = await Promise.allSettled(ids.map((id) => fetcher(id)));
  const users = [];
  const failedIds = [];

  settled.forEach((outcome, index) => {
    if (outcome.status === 'fulfilled') {
      users.push(outcome.value);
    } else {
      failedIds.push(ids[index]);
    }
  });

  return { users, failedIds };
}`,
      testScript: `
test('collects fulfilled users and failedIds concurrently in order', async () => {
  const mockFetcher = async (id) => {
    await new Promise((r) => setTimeout(r, 25));
    if (id === 2 || id === 4) throw new Error('Not found');
    return { id, name: 'User ' + id };
  };

  const t0 = Date.now();
  const res = await fetchUsersSafely([1, 2, 3, 4], mockFetcher);
  const elapsed = Date.now() - t0;

  expect(res.users).toEqual([
    { id: 1, name: 'User 1' },
    { id: 3, name: 'User 3' },
  ]);
  expect(res.failedIds).toEqual([2, 4]);
  expect(elapsed).toBeLessThan(85);
});

test('handles empty id list', async () => {
  const res = await fetchUsersSafely([], async () => ({}));
  expect(res).toEqual({ users: [], failedIds: [] });
});
`,
      hints: [
        'Pass ids.map((id) => fetcher(id)) to await Promise.allSettled(...).',
        'Each item in the settled array has outcome.status === "fulfilled" (with outcome.value) or "rejected".',
        'Match rejected indices back to ids[index] to push into failedIds.',
      ],
    },
  },

  // =========================================================================
  // STAGE 4: COMPUTER SCIENCE & PROBLEM SOLVING
  // =========================================================================
  {
    id: 's4-bigo-hashmaps',
    stageId: 4,
    order: 13,
    title: 'Big-O Complexity & Hash Maps for O(1) Lookups',
    subtitle: 'Turning sluggish O(n²) nested loops into blazing-fast O(n) solutions',
    difficulty: 'Intermediate',
    durationMinutes: 16,
    xp: 130,
    mode: 'js',
    concepts: ['Big-O Notation', 'Map & Set', 'Time-Space Tradeoff', 'Two Sum Pattern'],
    summary:
      'What’s the difference between code that works on 10 items and code that survives 1,000,000 users? Algorithmic complexity. Hash Maps (Map / Set) are the single highest-ROI optimization in software engineering.',
    sections: [
      {
        heading: 'Why O(n²) Fails at Scale',
        analogy:
          'Finding a matching sock: checking every sock against every other sock takes n × n comparisons. Putting socks into labeled color bins (a Hash Map) lets you find a match in a single pass!',
        paragraphs: [
          'For n = 100,000 items, an O(n²) nested loop performs 10,000,000,000 operations (freezing your server). An O(n) Map lookup performs just 100,000 operations (~2 milliseconds).',
        ],
        codeExample: {
          title: 'Frequency counting in O(n) with Map',
          language: 'js',
          code: `function countWords(words) {
  const freq = new Map();
  for (const w of words) {
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  return freq;
}`,
        },
      },
    ],
    keyTakeaways: [
      'O(1) = constant (Map/Set get/has), O(log n) = binary search, O(n) = single pass, O(n log n) = sorting, O(n²) = nested loops.',
      'Trade a tiny amount of O(n) memory (a Map or Set) to eliminate nested loops.',
      'JavaScript’s Map handles any key type cleanly and outperforms plain objects for frequent additions/deletions.',
    ],
    quiz: {
      question: 'What is the average time complexity of checking `seen.has(value)` on a JavaScript `Set`?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
      correctIndex: 2,
      explanation: 'Hash-based Sets and Maps provide average O(1) constant-time lookup regardless of collection size.',
    },
    lab: {
      title: 'Two Sum in O(n) Time',
      prompt:
        'Implement twoSum(nums, target) to return the indices [i, j] of two distinct numbers that add up to target — in a single O(n) pass using a Map.',
      requirements: [
        'Return [i, j] (with i < j) such that nums[i] + nums[j] === target.',
        'If no pair exists, return null.',
        'Must run in O(n) time — it will be tested on an array of 50,000 numbers!',
      ],
      starterCode: `function twoSum(nums, target) {
  // Use a Map to store value -> index as you scan once
  
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
`,
      solutionCode: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const needed = target - nums[i];
    if (seen.has(needed)) {
      return [seen.get(needed), i];
    }
    seen.set(nums[i], i);
  }
  return null;
}`,
      testScript: `
test('finds valid index pairs including duplicates and negatives', () => {
  expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
  expect(twoSum([3, 3], 6)).toEqual([0, 1]);
  expect(twoSum([-4, 1, 9, 12], 5)).toEqual([0, 2]);
});

test('returns null when no pair matches', () => {
  expect(twoSum([1, 2, 3], 10)).toBe(null);
});

test('handles 50,000 items fast in O(n) time', () => {
  const large = Array.from({ length: 50000 }, (_, i) => i * 2);
  const t0 = performance.now();
  const res = twoSum(large, 199994);
  const elapsed = performance.now() - t0;
  expect(res).toEqual([49998, 49999]);
  expect(elapsed).toBeLessThan(200);
});
`,
      hints: [
        'Create const seen = new Map(); before the loop.',
        'At index i, calculate const needed = target - nums[i]; and check if (seen.has(needed)) return [seen.get(needed), i];',
        'Otherwise store seen.set(nums[i], i); and keep scanning.',
      ],
    },
  },

  {
    id: 's4-two-pointers-window',
    stageId: 4,
    order: 14,
    title: 'Two Pointers & Sliding Window Patterns',
    subtitle: 'Solving subarray and string interview classics in linear O(n) time',
    difficulty: 'Intermediate',
    durationMinutes: 16,
    xp: 135,
    mode: 'js',
    concepts: ['Sliding Window', 'Two Pointers', 'Substrings & Subarrays', 'O(n) Space-Optimal'],
    summary:
      'Whenever a problem asks for the "longest substring", "maximum sum of k consecutive items", or "shortest subarray meeting a condition", Sliding Window is your golden pattern.',
    sections: [
      {
        heading: 'How a Sliding Window Moves',
        analogy:
          'Imagine looking at a long train through a small window frame. Instead of recounting every passenger from scratch as the train moves, you simply ADD the new car entering on the right and SUBTRACT the old car leaving on the left.',
        paragraphs: [
          'Dynamic sliding windows expand a `right` pointer to include elements, and shrink a `left` pointer whenever a constraint is violated (such as duplicate characters).',
        ],
        codeExample: {
          title: 'Fixed-size sliding window max sum',
          language: 'js',
          code: `function maxSubarraySum(nums, k) {
  let windowSum = 0;
  let best = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    windowSum += nums[i];
    if (i >= k - 1) {
      best = Math.max(best, windowSum);
      windowSum -= nums[i - (k - 1)];
    }
  }
  return best;
}`,
        },
      },
    ],
    keyTakeaways: [
      'Each pointer (left and right) moves forward at most n times → guaranteed O(n) total work.',
      'Combine Sliding Window with a Set or Map to track character uniqueness in O(1).',
    ],
    quiz: {
      question: 'Even though a dynamic sliding window has a `while` loop nested inside a `for` loop, why is its time complexity still O(n)?',
      options: [
        'Because JavaScript optimizes while loops automatically',
        'Because the `left` pointer only ever moves forward, at most n total times across the entire run',
        'It is actually O(n²)',
        'Because strings are always short',
      ],
      correctIndex: 1,
      explanation: 'Amortized analysis: right advances n times and left advances at most n times → at most 2n steps = O(n).',
    },
    lab: {
      title: 'Longest Substring Without Repeating Characters',
      prompt:
        'Implement lengthOfLongestUniqueSubstring(str) using a dynamic Sliding Window + Set/Map.',
      requirements: [
        'Return the length of the longest contiguous substring containing all unique characters.',
        'For "" return 0. For "abcabcbb" return 3 ("abc"). For "pwwkew" return 3 ("wke").',
        'Must run in O(n) linear time.',
      ],
      starterCode: `function lengthOfLongestUniqueSubstring(str) {
  // Expand right pointer, shrink left pointer whenever a duplicate appears
  
}

console.log(lengthOfLongestUniqueSubstring("abcabcbb")); // 3
console.log(lengthOfLongestUniqueSubstring("pwwkew"));   // 3
`,
      solutionCode: `function lengthOfLongestUniqueSubstring(str) {
  const seen = new Set();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < str.length; right++) {
    const ch = str[right];
    while (seen.has(ch)) {
      seen.delete(str[left]);
      left += 1;
    }
    seen.add(ch);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}`,
      testScript: `
test('finds longest unique substring on classic cases', () => {
  expect(lengthOfLongestUniqueSubstring('abcabcbb')).toBe(3);
  expect(lengthOfLongestUniqueSubstring('bbbbb')).toBe(1);
  expect(lengthOfLongestUniqueSubstring('pwwkew')).toBe(3);
  expect(lengthOfLongestUniqueSubstring('dvdf')).toBe(3);
});

test('handles empty and all-unique strings', () => {
  expect(lengthOfLongestUniqueSubstring('')).toBe(0);
  expect(lengthOfLongestUniqueSubstring('abcdef')).toBe(6);
});
`,
      hints: [
        'Keep a Set `seen`, `let left = 0`, and `let maxLen = 0`.',
        'For each character at `right`, while `seen.has(str[right])`, remove `str[left]` and increment `left`.',
        'Then add `str[right]` to `seen` and update `maxLen = Math.max(maxLen, right - left + 1)`.',
      ],
    },
  },

  {
    id: 's4-stacks-parsers',
    stageId: 4,
    order: 15,
    title: 'Stacks, Queues & Expression Parsing',
    subtitle: 'How compilers validate brackets, undo history works, and browsers navigate',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    xp: 135,
    mode: 'js',
    concepts: ['LIFO Stack', 'FIFO Queue', 'Syntax Validation', 'Bracket Matching'],
    summary:
      'A Stack is Last-In, First-Out (LIFO) — just like a stack of plates. Every code editor, JavaScript call stack, Undo button, and HTML parser relies on Stacks.',
    sections: [
      {
        heading: 'How Compilers Validate Nested Structures',
        paragraphs: [
          'When you encounter an opening symbol like (, [, or {, push it onto the stack. When you encounter a closing symbol, the TOP of the stack MUST be its exact matching opener — otherwise the nesting is broken!',
        ],
        codeExample: {
          title: 'Mapping closers to expected openers',
          language: 'js',
          code: `const PAIRS = {
  ')': '(',
  ']': '[',
  '}': '{',
};`,
        },
      },
    ],
    keyTakeaways: [
      'Stack operations push() and pop() at the end of a JS array are both O(1).',
      'At the end of validation, the stack must be completely empty (otherwise an opener was never closed!).',
    ],
    quiz: {
      question: 'Which data structure powers your editor’s "Undo" (Ctrl+Z) feature?',
      options: ['Queue (FIFO)', 'Stack (LIFO)', 'Hash Map', 'Binary Search Tree'],
      correctIndex: 1,
      explanation: 'Undo always reverses the MOST RECENT action first — that is Last-In, First-Out (Stack).',
    },
    lab: {
      title: 'Build a Code Bracket & Expression Validator',
      prompt:
        'Implement isBalancedSyntax(code) that checks whether all (), [], and {} brackets in a string are properly nested and balanced (ignoring all other characters like letters, spaces, and operators).',
      requirements: [
        'Return true if every opening bracket (, [, { is matched and closed in the exact reverse order.',
        'Ignore non-bracket characters (so "function f(a) { return [1, 2]; }" returns true).',
        'Return false for mismatches like "([)]", extra closers like "())", or unclosed openers like "({".',
      ],
      starterCode: `function isBalancedSyntax(code) {
  // Use a stack array to track open brackets
  
}

console.log(isBalancedSyntax("fn(a, [1, { x: 2 }])")); // true
console.log(isBalancedSyntax("([)]"));                 // false
`,
      solutionCode: `function isBalancedSyntax(code) {
  const stack = [];
  const openers = new Set(['(', '[', '{']);
  const matchForCloser = { ')': '(', ']': '[', '}': '{' };

  for (const ch of code) {
    if (openers.has(ch)) {
      stack.push(ch);
    } else if (ch in matchForCloser) {
      if (stack.length === 0 || stack.pop() !== matchForCloser[ch]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
      testScript: `
test('validates real code snippets with nested brackets', () => {
  expect(isBalancedSyntax('function f(x) { return [x * (x + 1)]; }')).toBe(true);
  expect(isBalancedSyntax('()[]{}')).toBe(true);
  expect(isBalancedSyntax('')).toBe(true);
});

test('rejects mismatched, unclosed, and extra closing brackets', () => {
  expect(isBalancedSyntax('([)]')).toBe(false);
  expect(isBalancedSyntax('(((')).toBe(false);
  expect(isBalancedSyntax('())')).toBe(false);
  expect(isBalancedSyntax('{[}]')).toBe(false);
});
`,
      hints: [
        'Push "(", "[", and "{" onto stack.',
        'When you see ")", "]", or "}", pop from stack and verify it equals the matching opener.',
        'Finally return stack.length === 0.',
      ],
    },
  },

  {
    id: 's4-trees-graphs-bfs',
    stageId: 4,
    order: 16,
    title: 'Trees, Recursion & Graph Traversal (BFS)',
    subtitle: 'Navigating folders, DOM trees, and shortest paths in networks',
    difficulty: 'Advanced',
    durationMinutes: 18,
    xp: 150,
    mode: 'js',
    concepts: ['Recursion & Base Case', 'Tree Traversal', 'Breadth-First Search (BFS)', 'Shortest Path'],
    summary:
      'File systems, organization charts, HTML DOMs, and social networks are all Trees and Graphs. Breadth-First Search (BFS) uses a Queue to explore level-by-level and guarantees the shortest path in unweighted graphs.',
    sections: [
      {
        heading: 'BFS Guarantees the Shortest Path',
        analogy:
          'Drop a pebble in a pond. Ripples expand outward ring by ring: distance 1, then distance 2, then distance 3. The VERY FIRST ripple that touches your target is guaranteed to be the shortest route!',
        paragraphs: [
          'Always keep a `visited` Set in graph traversals so cycles (A → B → A) never trap you in an infinite loop.',
        ],
        codeExample: {
          title: 'BFS Queue Pattern',
          language: 'js',
          code: `function bfsOrder(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}`,
        },
      },
    ],
    keyTakeaways: [
      'Use BFS (Queue) for shortest path in unweighted graphs and level-order traversal.',
      'Use DFS (Recursion or Stack) for exploring deep paths, file trees, and cycle detection.',
      'Always mark nodes as visited BEFORE pushing them into the queue to avoid duplicate work.',
    ],
    quiz: {
      question: 'Which traversal strategy guarantees finding the shortest number of hops between two nodes in an unweighted graph?',
      options: [
        'Depth-First Search (DFS)',
        'Breadth-First Search (BFS)',
        'Sorting the adjacency list',
        'Random walk',
      ],
      correctIndex: 1,
      explanation: 'BFS explores all nodes at distance d before any node at distance d + 1, guaranteeing the fewest hops.',
    },
    lab: {
      title: 'Find the Shortest Network Path (BFS)',
      prompt:
        'Implement shortestPath(graph, start, target) where graph is an adjacency list object (e.g. { A: ["B", "C"], B: ["D"], ... }).',
      requirements: [
        'Return the shortest path as an array of node names from start to target (e.g. ["A", "B", "D"]).',
        'If start === target, return [start].',
        'If target is unreachable, return null.',
        'Must handle cycles cleanly without infinite loops.',
      ],
      starterCode: `function shortestPath(graph, start, target) {
  // Use BFS with a queue storing paths (or parent pointers) + a visited Set
  
}

const net = {
  A: ['B', 'C'],
  B: ['A', 'D'],
  C: ['A', 'E'],
  D: ['B', 'F'],
  E: ['C', 'F'],
  F: ['D', 'E'],
};
console.log(shortestPath(net, 'A', 'F')); // ['A', 'B', 'D', 'F'] or ['A', 'C', 'E', 'F']
`,
      solutionCode: `function shortestPath(graph, start, target) {
  if (start === target) return [start];
  const visited = new Set([start]);
  const queue = [[start]];

  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];
    for (const neighbor of graph[node] || []) {
      if (neighbor === target) {
        return [...path, neighbor];
      }
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  return null;
}`,
      testScript: `
test('finds the shortest path in a cyclic graph', () => {
  const graph = {
    A: ['B', 'C'],
    B: ['A', 'D', 'E'],
    C: ['A', 'F'],
    D: ['B'],
    E: ['B', 'F'],
    F: ['C', 'E'],
  };
  const path = shortestPath(graph, 'A', 'F');
  expect(path).toEqual(['A', 'C', 'F']);
});

test('handles start === target and unreachable nodes', () => {
  const graph = { A: ['B'], B: ['A'], Z: [] };
  expect(shortestPath(graph, 'A', 'A')).toEqual(['A']);
  expect(shortestPath(graph, 'A', 'Z')).toBe(null);
});
`,
      hints: [
        'Store full candidate paths in the queue: const queue = [[start]];',
        'When dequeuing `path`, grab `const node = path[path.length - 1]`.',
        'For each unvisited neighbor of node, if neighbor === target return [...path, neighbor]; else mark visited and push [...path, neighbor].',
      ],
    },
  },
];
