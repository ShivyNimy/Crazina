export interface GuideCard {
  id: string;
  category: 'Algorithms' | 'Clean Code' | 'Backend & HTTP' | 'Security' | 'Git Workflow';
  title: string;
  summary: string;
  items: { label: string; detail: string; code?: string }[];
}

export const PRO_GUIDES: GuideCard[] = [
  {
    id: 'bigo-guide',
    category: 'Algorithms',
    title: 'Big-O Complexity Cheat Sheet',
    summary: 'Know at a glance whether your algorithm will scale to millions of users.',
    items: [
      { label: 'O(1) — Constant', detail: 'Array index access, Map/Set get/has/set, Stack push/pop.', code: 'map.get(key)' },
      { label: 'O(log n) — Logarithmic', detail: 'Binary search on sorted arrays, balanced BST lookup.', code: 'mid = (l + r) >> 1' },
      { label: 'O(n) — Linear', detail: 'Single loop, Sliding Window, Two Pointers, Hash Join.', code: 'for (const x of arr)' },
      { label: 'O(n log n) — Linearithmic', detail: 'Efficient sorting (Timsort, Merge Sort, Quicksort avg).', code: 'arr.sort((a,b) => a - b)' },
      { label: 'O(n²) — Quadratic (Danger at scale)', detail: 'Nested loops over the same array. Optimize with a Map or Set!' },
    ],
  },
  {
    id: 'clean-code-solid',
    category: 'Clean Code',
    title: 'SOLID & Clean Code Checklist',
    summary: 'What senior reviewers look for in every pull request.',
    items: [
      { label: 'Single Responsibility', detail: 'A function or module should have one clear job and one reason to change.' },
      { label: 'Open / Closed', detail: 'Extend behavior via pluggable strategies/callbacks instead of giant if/else chains.' },
      { label: 'Guard Clauses First', detail: 'Validate invalid inputs at the top of a function and return early to keep nesting flat.' },
      { label: 'Immutability by Default', detail: 'Avoid mutating input parameters; return fresh copies using spread/map/filter.' },
      { label: 'Descriptive Naming', detail: 'Name functions by intent (`calculateTax`, `isValidEmail`), never `doStuff` or `temp2`.' },
    ],
  },
  {
    id: 'http-rest',
    category: 'Backend & HTTP',
    title: 'REST API & HTTP Status Codes',
    summary: 'Design APIs other developers love to integrate with.',
    items: [
      { label: '200 OK / 201 Created', detail: '200 for successful reads/updates; 201 when POST creates a new record.' },
      { label: '400 Bad Request / 422', detail: 'Client sent invalid payload or failed schema validation. Return field-level errors.' },
      { label: '401 Unauthorized vs 403 Forbidden', detail: '401 = not logged in (no valid token). 403 = logged in, but lacks permission.' },
      { label: '404 Not Found / 429 Too Many Requests', detail: '404 = resource missing. 429 = rate limit exceeded (include Retry-After).' },
      { label: '500 / 503 Server Errors', detail: 'Unexpected server failure or upstream outage. Safe to retry 503 with exponential backoff.' },
    ],
  },
  {
    id: 'security-checklist',
    category: 'Security',
    title: 'Production Web Security Essentials',
    summary: 'Non-negotiable habits for protecting user accounts and data.',
    items: [
      { label: 'Block XSS', detail: 'Use textContent or framework escaping; never inject untrusted strings into innerHTML.' },
      { label: 'Allowlist URL Protocols', detail: 'Parse links with `new URL()` and permit only `https:` and `http:`.' },
      { label: 'Parameterized SQL Queries', detail: 'Never concatenate user input into SQL strings — always use bind parameters ($1, ?).' },
      { label: 'Rate Limiting & Auth Hygiene', detail: 'Rate limit login/API routes, hash passwords with Argon2/bcrypt, never commit secrets to Git.' },
    ],
  },
  {
    id: 'git-pro',
    category: 'Git Workflow',
    title: 'Professional Git & PR Workflow',
    summary: 'Collaborate smoothly on real engineering teams.',
    items: [
      { label: 'Small Atomic Commits', detail: 'Each commit should represent one logical change with a clear imperative subject.', code: 'git commit -m "feat(router): add :param route matching"' },
      { label: 'Feature Branches', detail: 'Never commit directly to main — branch per feature and open a reviewed Pull Request.', code: 'git checkout -b feat/rate-limiter' },
      { label: 'Clean Diff Inspection', detail: 'Always review `git diff` and run tests before pushing.', code: 'git status && git diff --stat' },
    ],
  },
];

export interface CareerMilestone {
  stageId: number;
  roleTitle: string;
  outcome: string;
  portfolioIdea: string;
}

export const CAREER_MILESTONES: CareerMilestone[] = [
  {
    stageId: 1,
    roleTitle: 'Coding Apprentice',
    outcome: 'Confidently read & write core programming logic without syntax fear.',
    portfolioIdea: 'CLI Budget & Expense Calculator',
  },
  {
    stageId: 2,
    roleTitle: 'Frontend Builder',
    outcome: 'Build responsive, accessible, interactive browser UIs from scratch.',
    portfolioIdea: 'Interactive Portfolio & Habit Tracker Web App',
  },
  {
    stageId: 3,
    roleTitle: 'JavaScript Developer',
    outcome: 'Master functional pipelines, immutable data, closures, and async APIs.',
    portfolioIdea: 'Real-Time Weather & GitHub Repo Dashboard',
  },
  {
    stageId: 4,
    roleTitle: 'Interview-Ready Engineer',
    outcome: 'Analyze Big-O complexity and solve classic data structure & algorithm problems.',
    portfolioIdea: 'Visual Pathfinding & Algorithm Visualizer',
  },
  {
    stageId: 5,
    roleTitle: 'Full-Stack Architect',
    outcome: 'Design state stores, REST APIs, relational queries, and hardened security boundaries.',
    portfolioIdea: 'Full-Stack SaaS Task Manager with Auth & REST API',
  },
  {
    stageId: 6,
    roleTitle: 'Professional Software Engineer',
    outcome: 'Ship clean SOLID code, TDD test suites, O(1) caches, and fault-tolerant systems.',
    portfolioIdea: 'Production API Gateway with Caching, Rate Limiting & Observability',
  },
];
