import type { Lesson } from '../types';

export const LESSONS_STAGE_5_TO_6: Lesson[] = [
  // =========================================================================
  // STAGE 5: FULL-STACK & APPLICATION ARCHITECTURE
  // =========================================================================
  {
    id: 's5-reactive-state-store',
    stageId: 5,
    order: 17,
    title: 'Component Architecture & Reactive State Stores',
    subtitle: 'Understand Redux, Zustand & React state by building your own mini store',
    difficulty: 'Advanced',
    durationMinutes: 18,
    xp: 160,
    mode: 'js',
    concepts: ['Unidirectional Data Flow', 'Reducers', 'Observer / Pub-Sub', 'Unsubscribe Cleanup'],
    summary:
      'Instead of treating frontend frameworks like magic, professionals understand the core pattern underneath them: a predictable State Store where actions flow through a pure reducer and notify subscribers.',
    sections: [
      {
        heading: 'Unidirectional Data Flow',
        analogy:
          'Think of a bank ledger. You never erase your balance directly — you submit an official transaction (Action), a strict accountant (Reducer) computes the next balance, and your banking app (Subscriber) receives a notification.',
        paragraphs: [
          'Always return an `unsubscribe()` function when registering listeners. Forgetting to clean up subscriptions causes memory leaks in long-running Single Page Applications.',
        ],
        codeExample: {
          title: 'A pure reducer transforms (state, action) → nextState',
          language: 'js',
          code: `function counterReducer(state, action) {
  switch (action.type) {
    case 'INC': return { ...state, count: state.count + 1 };
    case 'ADD': return { ...state, count: state.count + action.payload };
    default: return state;
  }
}`,
        },
      },
    ],
    keyTakeaways: [
      'A store holds private state and exposes getState(), dispatch(action), and subscribe(listener).',
      'Only notify subscribers when state actually changes (prevState !== nextState).',
      'Returning an unsubscribe function prevents memory leaks when components unmount.',
    ],
    quiz: {
      question: 'Why must a store’s `subscribe(fn)` method return an `unsubscribe` function?',
      options: [
        'To make the reducer run faster',
        'So unmounted UI components can detach listeners and avoid memory leaks',
        'Because JavaScript arrays cannot hold more than 5 functions',
        'To encrypt the state',
      ],
      correctIndex: 1,
      explanation: 'Detaching listeners on cleanup prevents dead components from retaining memory and firing stale callbacks.',
    },
    lab: {
      title: 'Build a Production-Style `createStore(reducer, initialState)`',
      prompt:
        'Implement a lightweight Redux-like reactive state store with getState, dispatch, and subscribe/unsubscribe.',
      requirements: [
        'getState() returns the current state.',
        'dispatch(action) passes (currentState, action) to reducer. If nextState !== currentState, update state and invoke every active subscriber with nextState.',
        'subscribe(listener) registers listener and returns an unsubscribe() function that removes it.',
      ],
      starterCode: `function createStore(reducer, initialState) {
  // Implement getState, dispatch, and subscribe (returning unsubscribe)
  
}
`,
      solutionCode: `function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();

  return {
    getState() {
      return state;
    },
    dispatch(action) {
      const nextState = reducer(state, action);
      if (!Object.is(nextState, state)) {
        state = nextState;
        for (const listener of listeners) {
          listener(state);
        }
      }
      return action;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}`,
      testScript: `
test('updates state via reducer and notifies subscribers', () => {
  const reducer = (s, a) => {
    if (a.type === 'ADD') return { count: s.count + a.amount };
    return s;
  };
  const store = createStore(reducer, { count: 0 });
  const history = [];
  const unsub = store.subscribe((s) => history.push(s.count));

  store.dispatch({ type: 'ADD', amount: 3 });
  store.dispatch({ type: 'UNKNOWN' }); // same state reference -> should NOT notify
  store.dispatch({ type: 'ADD', amount: 7 });

  expect(store.getState()).toEqual({ count: 10 });
  expect(history).toEqual([3, 10]);

  unsub();
  store.dispatch({ type: 'ADD', amount: 5 });
  expect(store.getState()).toEqual({ count: 15 });
  expect(history).toEqual([3, 10]);
});
`,
      hints: [
        'Store listeners in a Set (`const listeners = new Set()`) so adding and deleting in unsubscribe is O(1).',
        'In dispatch(action), compare `if (nextState !== state)` before updating state and looping over listeners.',
      ],
    },
  },

  {
    id: 's5-rest-api-routing',
    stageId: 5,
    order: 18,
    title: 'Backend & REST API Design: Routing & Validation',
    subtitle: 'Designing clean HTTP endpoints, path params, validation, and status codes',
    difficulty: 'Advanced',
    durationMinutes: 18,
    xp: 165,
    mode: 'js',
    concepts: ['HTTP Methods & Status Codes', 'Path Parameters (:id)', 'Input Validation', 'REST Conventions'],
    summary:
      'Great backend engineers design predictable APIs: clear resource URLs, strict schema validation at the boundary, and accurate HTTP status codes (200, 201, 400, 404).',
    sections: [
      {
        heading: 'How Backend Routers Match URLs',
        paragraphs: [
          'Frameworks like Express, Fastify, and Hono match incoming requests by combining HTTP method (GET, POST, DELETE) with a URL pattern like `/users/:id`, extracting dynamic segments into `req.params`.',
          'Never trust incoming request payloads! Validate required fields before touching your database and return 400 Bad Request with clear error messages.',
        ],
        codeExample: {
          title: 'HTTP Status Code Quick Rule',
          language: 'js',
          code: `// 200 OK         -> Successful GET / PUT
// 201 Created    -> Successful POST creating a new resource
// 400 Bad Request -> Client sent invalid input
// 404 Not Found  -> Resource or route does not exist`,
        },
      },
    ],
    keyTakeaways: [
      'REST URLs represent nouns (/projects, /projects/:id); HTTP methods represent verbs (GET, POST, PATCH, DELETE).',
      'Always return 404 for unknown routes/IDs and 400 for invalid payloads.',
    ],
    quiz: {
      question: 'Which HTTP status code should a REST API return when a `POST /orders` request succeeds and creates a new order?',
      options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
      correctIndex: 1,
      explanation: '201 Created explicitly signals that a new resource was created on the server.',
    },
    lab: {
      title: 'Build a Mini REST Router with Path Parameters',
      prompt:
        'Implement createRouter() supporting dynamic :param URL matching (like "/users/:id") and returning 404 when no route matches.',
      requirements: [
        'router.register(method, pattern, handler): registers a handler for HTTP method (case-insensitive) and path pattern (e.g. "/users/:id/posts/:postId").',
        'router.handle(method, path, body): finds the first matching route, extracts params object (e.g. { id: "42", postId: "9" }), and returns handler({ params, body }).',
        'If no route matches, return { status: 404, body: { error: "Not Found" } }.',
      ],
      starterCode: `function createRouter() {
  // Store routes and match segments including :param placeholders
  
}
`,
      solutionCode: `function createRouter() {
  const routes = [];

  function splitPath(p) {
    return p.split('/').filter(Boolean);
  }

  return {
    register(method, pattern, handler) {
      routes.push({
        method: method.toUpperCase(),
        segments: splitPath(pattern),
        handler,
      });
    },
    handle(method, path, body = undefined) {
      const upper = method.toUpperCase();
      const target = splitPath(path);

      for (const route of routes) {
        if (route.method !== upper) continue;
        if (route.segments.length !== target.length) continue;

        const params = {};
        let matched = true;
        for (let i = 0; i < route.segments.length; i++) {
          const seg = route.segments[i];
          if (seg.startsWith(':')) {
            params[seg.slice(1)] = target[i];
          } else if (seg !== target[i]) {
            matched = false;
            break;
          }
        }

        if (matched) {
          return route.handler({ params, body });
        }
      }

      return { status: 404, body: { error: 'Not Found' } };
    },
  };
}`,
      testScript: `
test('matches static and dynamic :param routes accurately', () => {
  const router = createRouter();
  router.register('GET', '/users/:id', ({ params }) => ({
    status: 200,
    body: { userId: params.id },
  }));
  router.register('POST', '/users/:id/notes', ({ params, body }) => ({
    status: 201,
    body: { userId: params.id, text: body.text },
  }));

  expect(router.handle('get', '/users/42')).toEqual({ status: 200, body: { userId: '42' } });
  expect(router.handle('POST', '/users/7/notes', { text: 'Ship it' })).toEqual({
    status: 201,
    body: { userId: '7', text: 'Ship it' },
  });
});

test('returns 404 for unmatched paths or wrong HTTP methods', () => {
  const router = createRouter();
  router.register('GET', '/health', () => ({ status: 200, body: { ok: true } }));
  expect(router.handle('DELETE', '/health')).toEqual({ status: 404, body: { error: 'Not Found' } });
  expect(router.handle('GET', '/missing/path')).toEqual({ status: 404, body: { error: 'Not Found' } });
});
`,
      hints: [
        'Split both pattern and incoming path by "/" and remove empty strings: p.split("/").filter(Boolean).',
        'Two paths can only match if their HTTP methods match AND their segment lengths are equal.',
        'If a route segment starts with ":", capture `params[seg.slice(1)] = targetSeg`; otherwise require exact equality.',
      ],
    },
  },

  {
    id: 's5-relational-data-queries',
    stageId: 5,
    order: 19,
    title: 'Relational Data Modeling & Query Pipelines',
    subtitle: 'Understanding SQL JOINs, indexing, and aggregations by building a query engine',
    difficulty: 'Advanced',
    durationMinutes: 18,
    xp: 170,
    mode: 'js',
    concepts: ['Primary & Foreign Keys', 'Hash Join (O(n + m))', 'Normalization', 'Aggregations'],
    summary:
      'Databases power nearly every real product. Understanding how relational databases execute a Hash Join and GROUP BY aggregation makes you write dramatically faster SQL and API queries.',
    sections: [
      {
        heading: 'How Databases Execute Fast JOINs',
        analogy:
          'Imagine joining 10,000 orders with 2,000 customers. A naive Nested Loop checks 20,000,000 pairs. A Hash Join indexes customers into a Map by `customer.id` first, then attaches each order in a single O(1) lookup!',
        paragraphs: [
          'This is why indexing foreign keys in PostgreSQL or MySQL speeds up slow queries from 12 seconds down to 4 milliseconds.',
        ],
      },
    ],
    keyTakeaways: [
      'Normalize entities into separate tables linked by foreign keys (e.g. order.userId → user.id).',
      'Always use an index / Map for joining two datasets — O(n + m) instead of O(n × m).',
    ],
    quiz: {
      question: 'What is the time complexity of joining `N` orders with `M` users using a Hash Join (Map keyed by user.id)?',
      options: ['O(N × M)', 'O(N + M)', 'O(N²)', 'O(log N)'],
      correctIndex: 1,
      explanation: 'Building the Map takes O(M) and looking up each order takes O(1) × N = O(N), giving O(N + M) total.',
    },
    lab: {
      title: 'Implement a Hash Join & Spend Leaderboard Query',
      prompt:
        'Implement buildCustomerSpendReport(users, orders) that joins users and completed orders in O(n + m) time and returns customers ranked by total spend.',
      requirements: [
        'users: [{ id, name }], orders: [{ id, userId, amount, status }].',
        'Include only orders with status === "completed".',
        'Return an array of { userId, name, orderCount, totalSpent } for ALL users (users with 0 completed orders have orderCount: 0, totalSpent: 0).',
        'Sort descending by totalSpent; break ties alphabetically by name (a.name.localeCompare(b.name)).',
      ],
      starterCode: `function buildCustomerSpendReport(users, orders) {
  // Aggregate completed orders by userId in a Map, then map over users and sort
  
}
`,
      solutionCode: `function buildCustomerSpendReport(users, orders) {
  const stats = new Map();

  for (const order of orders) {
    if (order.status !== 'completed') continue;
    const prev = stats.get(order.userId) || { orderCount: 0, totalSpent: 0 };
    stats.set(order.userId, {
      orderCount: prev.orderCount + 1,
      totalSpent: prev.totalSpent + order.amount,
    });
  }

  return users
    .map((user) => {
      const s = stats.get(user.id) || { orderCount: 0, totalSpent: 0 };
      return {
        userId: user.id,
        name: user.name,
        orderCount: s.orderCount,
        totalSpent: s.totalSpent,
      };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent || a.name.localeCompare(b.name));
}`,
      testScript: `
test('joins users with completed orders and ranks descending by spend', () => {
  const users = [
    { id: 1, name: 'Zoe' },
    { id: 2, name: 'Liam' },
    { id: 3, name: 'Aria' },
  ];
  const orders = [
    { id: 10, userId: 1, amount: 50, status: 'completed' },
    { id: 11, userId: 2, amount: 120, status: 'completed' },
    { id: 12, userId: 1, amount: 70, status: 'completed' },
    { id: 13, userId: 3, amount: 500, status: 'cancelled' },
  ];

  expect(buildCustomerSpendReport(users, orders)).toEqual([
    { userId: 2, name: 'Liam', orderCount: 1, totalSpent: 120 },
    { userId: 1, name: 'Zoe', orderCount: 2, totalSpent: 120 },
    { userId: 3, name: 'Aria', orderCount: 0, totalSpent: 0 },
  ]);
});
`,
      hints: [
        'Loop through orders once, skipping any where order.status !== "completed", accumulating { orderCount, totalSpent } in a Map keyed by order.userId.',
        'Map over users to attach stats (defaulting to { orderCount: 0, totalSpent: 0 }), then sort with `(a, b) => b.totalSpent - a.totalSpent || a.name.localeCompare(b.name)`.',
      ],
    },
  },

  {
    id: 's5-security-sanitization',
    stageId: 5,
    order: 20,
    title: 'Security Fundamentals: XSS Defense & Input Validation',
    subtitle: 'Protecting real users from injection attacks and unsafe URLs',
    difficulty: 'Advanced',
    durationMinutes: 16,
    xp: 170,
    mode: 'js',
    concepts: ['XSS Prevention', 'HTML Escaping', 'URL Protocol Allowlisting', 'Defense in Depth'],
    summary:
      'Professional engineers assume all external input is untrusted. Two simple, rock-solid defenses — HTML entity escaping and strict URL protocol allowlisting — block the most common web vulnerabilities.',
    sections: [
      {
        heading: 'Never Allowlist by Blocklist',
        paragraphs: [
          'Attackers bypass naive blocklists easily (for example, `JaVaScRiPt:alert(1)` or `data:text/html,...`). Always use an explicit ALLOWLIST — such as permitting ONLY `https:` and `http:` protocols.',
        ],
        codeExample: {
          title: 'Five essential HTML characters to escape',
          language: 'js',
          code: `// & -> &amp;
// < -> &lt;
// > -> &gt;
// " -> &quot;
// ' -> &#39;`,
        },
      },
    ],
    keyTakeaways: [
      'Always escape &, <, >, ", and \' before interpolating untrusted text into HTML.',
      'Validate URLs with the native `new URL(input)` parser and allowlist strictly `http:` and `https:`.',
    ],
    quiz: {
      question: 'Why is `url.startsWith("javascript:")` an insufficient security check for user-submitted links?',
      options: [
        'Because `startsWith` is slow',
        'Attackers can bypass it with mixed case ("JaVaScRiPt:"), leading whitespace, or dangerous schemes like `data:`',
        'Because browsers ignore `javascript:` URLs',
        'Because `startsWith` only works on arrays',
      ],
      correctIndex: 1,
      explanation: 'Always parse with `new URL(...)` and check an explicit allowlist of safe protocols like `["http:", "https:"]`.',
    },
    lab: {
      title: 'Build Security Sanitization Utilities',
      prompt:
        'Implement escapeHtml(input) and sanitizeUrl(url) to harden a web app against XSS and malicious link injection.',
      requirements: [
        'escapeHtml(str): escapes &, <, >, ", and \' into &amp;, &lt;, &gt;, &quot;, and &#39;.',
        'sanitizeUrl(url): trims whitespace, parses with new URL(trimmed), and returns the normalized URL string ONLY if protocol is "http:" or "https:". Otherwise return null.',
      ],
      starterCode: `function escapeHtml(str) {
  // Replace &, <, >, ", and ' with safe HTML entities
  
}

function sanitizeUrl(url) {
  // Allow only valid http: and https: URLs; otherwise return null
  
}
`,
      solutionCode: `function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(str).replace(/[&<>"']/g, (ch) => map[ch]);
}

function sanitizeUrl(url) {
  if (typeof url !== 'string') return null;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}`,
      testScript: `
test('escapeHtml neutralizes script tags and attribute breakouts', () => {
  expect(escapeHtml('<script>alert("xss")</script>')).toBe(
    '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
  );
  expect(escapeHtml("Tom & Jerry's")).toBe('Tom &amp; Jerry&#39;s');
});

test('sanitizeUrl permits http/https and blocks javascript/data/invalid URLs', () => {
  expect(sanitizeUrl('  https://crazina.dev/learn  ')).toBe('https://crazina.dev/learn');
  expect(sanitizeUrl('http://example.com')).toBe('http://example.com/');
  expect(sanitizeUrl('javascript:alert(1)')).toBe(null);
  expect(sanitizeUrl('  JaVaScRiPt:alert(1)')).toBe(null);
  expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe(null);
  expect(sanitizeUrl('not a url')).toBe(null);
});
`,
      hints: [
        'Use a regex `.replace(/[&<>"\']/g, (ch) => map[ch])` in escapeHtml.',
        'In sanitizeUrl, wrap `new URL(url.trim())` in try/catch and verify `parsed.protocol === "http:" || parsed.protocol === "https:"`.',
      ],
    },
  },

  // =========================================================================
  // STAGE 6: PROFESSIONAL SOFTWARE ENGINEERING
  // =========================================================================
  {
    id: 's6-clean-code-solid',
    stageId: 6,
    order: 21,
    title: 'Clean Code, SOLID & Strategy Pattern Refactoring',
    subtitle: 'Replacing brittle 200-line if/else chains with extensible architecture',
    difficulty: 'Professional',
    durationMinutes: 18,
    xp: 185,
    mode: 'js',
    concepts: ['Open/Closed Principle', 'Strategy Pattern', 'Single Responsibility', 'Refactoring'],
    summary:
      'Junior engineers make code work once; senior engineers make code effortless to extend next quarter without breaking existing behavior. The Open/Closed Principle (SOLID’s "O") achieves this via the Strategy Pattern.',
    sections: [
      {
        heading: 'Open for Extension, Closed for Modification',
        analogy:
          'A power strip doesn’t need rewiring every time you buy a new appliance — anything matching the standard plug interface works immediately.',
        paragraphs: [
          'Instead of hardcoding `if (type === "vip") ... else if (type === "student") ...` inside your checkout engine, accept pluggable pricing strategies so new rules can be added with zero changes to the core engine.',
        ],
        codeExample: {
          title: 'Pluggable Strategy Registry',
          language: 'js',
          code: `const strategies = new Map();
strategies.set('flat10', (amount) => Math.max(0, amount - 10));
strategies.set('halfOff', (amount) => amount * 0.5);`,
        },
      },
    ],
    keyTakeaways: [
      'Separate policy/rules (strategies) from orchestration (the engine).',
      'Validate unknown strategies explicitly with informative Error messages.',
    ],
    quiz: {
      question: 'What does the "O" (Open/Closed Principle) in SOLID mean?',
      options: [
        'Files must be closed after reading',
        'Software entities should be open for extension, but closed for modification',
        'Every class must be open-source',
        'Objects should never have private properties',
      ],
      correctIndex: 1,
      explanation: 'You should be able to add new behaviors (like new payment or discount strategies) without rewriting core tested code.',
    },
    lab: {
      title: 'Refactor Checkout to an Extensible Strategy Engine',
      prompt:
        'Implement createPricingEngine() so new discount strategies can be registered dynamically and stacked cleanly.',
      requirements: [
        'registerStrategy(name, fn): registers a strategy function `(price) => newPrice`.',
        'calculate(basePrice, strategyNames = []): applies each strategy in order to basePrice, never letting the price drop below 0, and rounds to 2 decimals.',
        'If an unregistered strategy name is requested, throw an Error containing the unknown strategy name.',
      ],
      starterCode: `function createPricingEngine() {
  // Use a Map of strategyName -> fn(price)
  
}
`,
      solutionCode: `function createPricingEngine() {
  const strategies = new Map();

  return {
    registerStrategy(name, fn) {
      if (typeof fn !== 'function') {
        throw new Error('Strategy must be a function');
      }
      strategies.set(name, fn);
    },
    calculate(basePrice, strategyNames = []) {
      let price = basePrice;
      for (const name of strategyNames) {
        if (!strategies.has(name)) {
          throw new Error(\`Unknown pricing strategy: \${name}\`);
        }
        price = Math.max(0, strategies.get(name)(price));
      }
      return Number(price.toFixed(2));
    },
  };
}`,
      testScript: `
test('applies registered strategies in sequence and clamps at 0', () => {
  const engine = createPricingEngine();
  engine.registerStrategy('percent20', (p) => p * 0.8);
  engine.registerStrategy('coupon15', (p) => p - 15);
  engine.registerStrategy('hugeCoupon', (p) => p - 999);

  expect(engine.calculate(100, ['percent20', 'coupon15'])).toBe(65);
  expect(engine.calculate(50, ['hugeCoupon'])).toBe(0);
  expect(engine.calculate(42.5)).toBe(42.5);
});

test('throws clear error when an unknown strategy is requested', () => {
  const engine = createPricingEngine();
  expect(() => engine.calculate(100, ['nonexistent'])).toThrow('nonexistent');
});
`,
      hints: [
        'Maintain `const strategies = new Map();`.',
        'Loop through `strategyNames`, verify `strategies.has(name)`, update `price = Math.max(0, strategies.get(name)(price))`, and finish with `Number(price.toFixed(2))`.',
      ],
    },
  },

  {
    id: 's6-testing-tdd',
    stageId: 6,
    order: 22,
    title: 'Automated Testing, Edge Cases & TDD',
    subtitle: 'Shipping with confidence by thinking about failure modes first',
    difficulty: 'Professional',
    durationMinutes: 16,
    xp: 185,
    mode: 'js',
    concepts: ['Red-Green-Refactor', 'Boundary Conditions', 'Defensive Validation', 'Test Suites'],
    summary:
      'Production bugs rarely hide in the "happy path" — they hide at boundaries: empty strings, leap years, negative quantities, unicode, and malformed inputs. Professionals build functions that handle every edge case gracefully.',
    sections: [
      {
        heading: 'The Red → Green → Refactor Cycle',
        paragraphs: [
          'In Test-Driven Development (TDD), you define expected behavior AND edge cases first (Red), write the simplest clean code to pass every test (Green), and then polish structure without changing behavior (Refactor).',
        ],
      },
    ],
    keyTakeaways: [
      'Always test boundary inputs: 0, negative numbers, empty strings, whitespace-only strings, and max limits.',
      'Return structured validation results (`{ valid, errors }`) instead of mysterious booleans so UIs can show actionable feedback.',
    ],
    quiz: {
      question: 'What is the correct sequence of Test-Driven Development (TDD)?',
      options: [
        'Deploy → Test → Fix',
        'Red (failing test) → Green (make it pass) → Refactor (clean up)',
        'Refactor → Write code → Delete tests',
        'Write 100% of app → Write tests at the end of the year',
      ],
      correctIndex: 1,
      explanation: 'Red → Green → Refactor keeps requirements crystal clear and guarantees every new line is covered by tests.',
    },
    lab: {
      title: 'TDD Challenge: Production Password Policy Validator',
      prompt:
        'Implement validatePassword(password) so it passes every single security and boundary test case.',
      requirements: [
        'Must be a string of at least 8 characters (else error code "MIN_LENGTH").',
        'Must contain at least one uppercase letter A-Z (else "UPPERCASE").',
        'Must contain at least one lowercase letter a-z (else "LOWERCASE").',
        'Must contain at least one digit 0-9 (else "NUMBER").',
        'Must NOT contain any whitespace characters (else "NO_WHITESPACE").',
        'Return { valid: errors.length === 0, errors } listing every failing rule code.',
      ],
      starterCode: `function validatePassword(password) {
  // Check all 5 rules and return { valid: boolean, errors: string[] }
  
}
`,
      solutionCode: `function validatePassword(password) {
  const value = typeof password === 'string' ? password : '';
  const errors = [];

  if (value.length < 8) errors.push('MIN_LENGTH');
  if (!/[A-Z]/.test(value)) errors.push('UPPERCASE');
  if (!/[a-z]/.test(value)) errors.push('LOWERCASE');
  if (!/[0-9]/.test(value)) errors.push('NUMBER');
  if (/\\s/.test(value)) errors.push('NO_WHITESPACE');

  return {
    valid: errors.length === 0,
    errors,
  };
}`,
      testScript: `
test('accepts strong passwords with zero errors', () => {
  expect(validatePassword('Crazina2026!')).toEqual({ valid: true, errors: [] });
  expect(validatePassword('Abcdefg1')).toEqual({ valid: true, errors: [] });
});

test('reports all violated rules accurately', () => {
  const weak = validatePassword('abc');
  expect(weak.valid).toBe(false);
  expect(weak.errors).toContain('MIN_LENGTH');
  expect(weak.errors).toContain('UPPERCASE');
  expect(weak.errors).toContain('NUMBER');

  const spaced = validatePassword('Good Pass1');
  expect(spaced.valid).toBe(false);
  expect(spaced.errors).toEqual(['NO_WHITESPACE']);
});

test('handles non-string edge inputs defensively', () => {
  const res = validatePassword(null);
  expect(res.valid).toBe(false);
  expect(res.errors.length).toBeGreaterThan(2);
});
`,
      hints: [
        'Coerce non-strings safely: `const value = typeof password === "string" ? password : "";`',
        'Use regex checks: `/[A-Z]/`, `/[a-z]/`, `/[0-9]/`, and `/\\s/` to collect failing error codes.',
      ],
    },
  },

  {
    id: 's6-lru-cache-performance',
    stageId: 6,
    order: 23,
    title: 'Performance Engineering: O(1) LRU Cache',
    subtitle: 'Building the caching engine used inside Redis, browsers, and CDNs',
    difficulty: 'Professional',
    durationMinutes: 20,
    xp: 200,
    mode: 'js',
    concepts: ['LRU Eviction Policy', 'O(1) Get & Put', 'Map Insertion Order', 'Memory Bounds'],
    summary:
      'Caching is how high-traffic systems serve millions of requests per second. A Least Recently Used (LRU) Cache keeps hot data in memory with a strict capacity cap, automatically evicting the stalest item in O(1) time.',
    sections: [
      {
        heading: 'JavaScript Map’s Secret Superpower',
        paragraphs: [
          'In JavaScript, `Map` preserves exact insertion order! That means deleting a key and re-inserting it moves it to the "most recently used" end in O(1) time, and `map.keys().next().value` gives you the "least recently used" oldest key in O(1) time!',
        ],
        codeExample: {
          title: 'Refreshing recency in O(1)',
          language: 'js',
          code: `// Move existing key to most-recently-used position:
const val = cache.get(key);
cache.delete(key);
cache.set(key, val);`,
        },
      },
    ],
    keyTakeaways: [
      'Always bound caches with a max capacity — unbounded caches are memory leaks in disguise.',
      'Both get(key) AND put(key, value) refresh a key’s recency.',
    ],
    quiz: {
      question: 'In an LRU Cache of capacity 2, after `put("a", 1)`, `put("b", 2)`, `get("a")`, and `put("c", 3)`, which key gets evicted?',
      options: ['"a"', '"b"', '"c"', 'None'],
      correctIndex: 1,
      explanation: 'Calling get("a") refreshed "a" as most recently used, making "b" the least recently used key to evict.',
    },
    lab: {
      title: 'Implement an O(1) `LRUCache` Class',
      prompt:
        'Build a production-grade LRUCache class with capacity bounds, O(1) get(key), and O(1) put(key, value).',
      requirements: [
        'constructor(capacity): initializes cache with positive integer capacity.',
        'get(key): returns value if present (and marks key as most recently used), otherwise returns -1.',
        'put(key, value): inserts or updates key as most recently used. If size exceeds capacity, evicts the least recently used key.',
      ],
      starterCode: `class LRUCache {
  constructor(capacity) {
    // Initialize capacity and underlying Map
  }

  get(key) {
    // Return -1 if missing; otherwise refresh recency and return value
  }

  put(key, value) {
    // Insert/refresh key; evict oldest entry if over capacity
  }
}
`,
      solutionCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }
}`,
      testScript: `
test('evicts least recently used items accurately on get and put', () => {
  const lru = new LRUCache(2);
  lru.put('a', 1);
  lru.put('b', 2);
  expect(lru.get('a')).toBe(1); // 'a' refreshed, 'b' is now oldest
  lru.put('c', 3);              // evicts 'b'
  expect(lru.get('b')).toBe(-1);
  expect(lru.get('a')).toBe(1);
  expect(lru.get('c')).toBe(3);
});

test('updates existing key without exceeding capacity', () => {
  const lru = new LRUCache(2);
  lru.put('x', 10);
  lru.put('y', 20);
  lru.put('x', 99);
  lru.put('z', 30); // evicts 'y'
  expect(lru.get('x')).toBe(99);
  expect(lru.get('y')).toBe(-1);
  expect(lru.get('z')).toBe(30);
});
`,
      hints: [
        'In `get(key)`, if `!this.cache.has(key)` return `-1`. Otherwise read value, `delete(key)`, `set(key, value)`, and return value.',
        'In `put(key, value)`, if `this.cache.has(key)` delete it first, then `set(key, value)`. If `this.cache.size > this.capacity`, evict `this.cache.keys().next().value`.',
      ],
    },
  },

  {
    id: 's6-production-resilience',
    stageId: 6,
    order: 24,
    title: 'Production Resilience: Rate Limiters & Retries',
    subtitle: 'Capstone: protecting services from abuse and surviving flaky networks',
    difficulty: 'Professional',
    durationMinutes: 20,
    xp: 250,
    mode: 'js',
    concepts: ['Sliding Window Rate Limiter', 'Exponential Backoff Retry', 'Fault Tolerance', 'Dependency Injection (Clock)'],
    summary:
      'Welcome to your Professional Capstone! Real production systems face traffic spikes and transient network blips every day. You will build two battle-tested resilience primitives: a Sliding-Window Rate Limiter and an Async Retry wrapper.',
    sections: [
      {
        heading: 'Designing Testable Time-Based Systems',
        paragraphs: [
          'Pro secret: never hardcode `Date.now()` deep inside a rate limiter if you want fast, deterministic tests! Accepting an injectable clock (`now = () => Date.now()`) lets unit tests jump forward 60 seconds in 0 milliseconds.',
        ],
        codeExample: {
          title: 'Injectable clock pattern',
          language: 'js',
          code: `function createRateLimiter({ limit, windowMs, now = () => Date.now() }) {
  // Using now() works in production AND runs instantly in tests!
}`,
        },
      },
    ],
    keyTakeaways: [
      'Rate limiters protect APIs and databases from runaway loops and abuse.',
      'Async retry logic recovers gracefully from transient 503/network glitches.',
      'Injecting time (`now`) makes complex distributed primitives 100% unit-testable.',
    ],
    quiz: {
      question: 'Why do senior engineers pass an optional `now = () => Date.now()` parameter into rate limiters and schedulers?',
      options: [
        'Date.now() is unavailable in Node.js',
        'It allows tests to simulate elapsed time deterministically without slow sleeps',
        'It reduces CPU usage by 90%',
        'It automatically synchronizes server clocks',
      ],
      correctIndex: 1,
      explanation: 'Dependency injection of the clock lets tests verify 1-minute or 1-hour windows instantaneously and reliably.',
    },
    lab: {
      title: 'Capstone: Build a Rate Limiter + Async Retry Utility',
      prompt:
        'Implement BOTH createRateLimiter({ limit, windowMs, now }) and retryAsync(fn, maxAttempts) to earn your Crazina Production Pro mastery!',
      requirements: [
        'createRateLimiter({ limit, windowMs, now = () => Date.now() }): returns `{ allow(clientId) }`. For a given clientId, prune timestamps <= currentTime - windowMs. If remaining count < limit, record currentTime and return true; otherwise return false.',
        'retryAsync(fn, maxAttempts = 3): calls async fn(). If it succeeds, return its result immediately. If it throws, retry up to maxAttempts total tries; if all attempts fail, rethrow the last error.',
      ],
      starterCode: `function createRateLimiter({ limit, windowMs, now = () => Date.now() }) {
  // Track per-client request timestamps in a Map
  
}

async function retryAsync(fn, maxAttempts = 3) {
  // Retry fn up to maxAttempts total times, rethrowing the last error if all fail
  
}
`,
      solutionCode: `function createRateLimiter({ limit, windowMs, now = () => Date.now() }) {
  const hits = new Map();

  return {
    allow(clientId) {
      const current = now();
      const windowStart = current - windowMs;
      const recent = (hits.get(clientId) || []).filter((ts) => ts > windowStart);

      if (recent.length >= limit) {
        hits.set(clientId, recent);
        return false;
      }

      recent.push(current);
      hits.set(clientId, recent);
      return true;
    },
  };
}

async function retryAsync(fn, maxAttempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}`,
      testScript: `
test('createRateLimiter enforces sliding window per client and resets after windowMs', () => {
  let fakeTime = 1000;
  const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => fakeTime });

  expect(limiter.allow('user-1')).toBe(true);
  fakeTime = 1200;
  expect(limiter.allow('user-1')).toBe(true);
  fakeTime = 1500;
  expect(limiter.allow('user-1')).toBe(false); // 2 hits already inside [500, 1500]
  expect(limiter.allow('user-2')).toBe(true);  // independent client bucket

  fakeTime = 2001; // first hit at 1000 has now expired!
  expect(limiter.allow('user-1')).toBe(true);
});

test('retryAsync recovers after transient failures', async () => {
  let tries = 0;
  const result = await retryAsync(async () => {
    tries += 1;
    if (tries < 3) throw new Error('503 Service Unavailable');
    return 'recovered';
  }, 3);

  expect(result).toBe('recovered');
  expect(tries).toBe(3);
});

test('retryAsync throws final error when all attempts are exhausted', async () => {
  let tries = 0;
  let caught = null;
  try {
    await retryAsync(async () => {
      tries += 1;
      throw new Error('Permanent failure #' + tries);
    }, 2);
  } catch (e) {
    caught = e.message;
  }
  expect(tries).toBe(2);
  expect(caught).toBe('Permanent failure #2');
});
`,
      hints: [
        'In createRateLimiter, keep `const hits = new Map()` mapping clientId -> number[]. Filter out timestamps `<= now() - windowMs`.',
        'If `recent.length >= limit`, return false. Otherwise push `current`, save back to Map, and return true.',
        'In retryAsync, loop `for (let i = 1; i <= maxAttempts; i++)` with try { return await fn(); } catch (err) { lastError = err; } and `throw lastError` after the loop.',
      ],
    },
  },
];
