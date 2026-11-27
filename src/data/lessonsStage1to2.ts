import type { Lesson } from '../types';

export const LESSONS_STAGE_1_TO_2: Lesson[] = [
  // =========================================================================
  // STAGE 1: ABSOLUTE FOUNDATIONS
  // =========================================================================
  {
    id: 's1-variables-types',
    stageId: 1,
    order: 1,
    title: 'Variables, Values & Your First Code',
    subtitle: 'How programs remember information and talk back to you',
    difficulty: 'Beginner',
    durationMinutes: 8,
    xp: 50,
    mode: 'js',
    concepts: ['const & let', 'Strings & Numbers', 'Template Literals', 'console.log'],
    summary:
      'Every piece of software — from Instagram to spacecraft telemetry — starts with storing data in named boxes called variables.',
    sections: [
      {
        heading: 'What is a variable?',
        analogy:
          'Think of a variable like a labeled jar on a kitchen shelf. The label is the variable name (like score), and whatever you put inside is the value (like 100).',
        paragraphs: [
          'When you write code, you constantly need the computer to remember things: a user’s name, a shopping cart total, or whether dark mode is turned on.',
          'In modern JavaScript, we create variables using two keywords: const (for values that should never be reassigned) and let (for values that will change over time).',
        ],
        codeExample: {
          title: 'Declaring variables with const and let',
          language: 'js',
          code: `const appName = "Crazina";      // Text (String) — won't change
let currentScore = 0;           // Number — will change later
const isLoggedIn = true;        // Boolean — true or false

currentScore = currentScore + 25;
console.log(appName, currentScore); // Crazina 25`,
          explanation:
            'Default to const whenever a value doesn’t need to be reassigned. It prevents accidental bugs and tells other programmers your intent clearly.',
        },
      },
      {
        heading: 'Combining text cleanly with Template Literals',
        paragraphs: [
          'Instead of gluing strings together with messy + signs, modern engineers use backticks (`) and ${...} to embed variables directly inside text.',
        ],
        codeExample: {
          title: 'Template literals in action',
          language: 'js',
          code: `const learner = "Maya";
const xp = 120;
const message = \`Welcome, \${learner}! You have \${xp} XP.\`;
console.log(message);`,
        },
        tip: 'Notice the backticks ` ` (usually below the Esc key), not single quotes \' \'.',
      },
    ],
    pitfall: {
      title: 'Prefer const over var',
      badTitle: 'Outdated & bug-prone (var)',
      badCode: `var price = 20;
var message = "Total: $" + price;`,
      goodTitle: 'Modern & clean (const + template literal)',
      goodCode: `const price = 20;
const message = \`Total: $\${price}\`;`,
      why: 'var ignores block boundaries and causes hard-to-trace bugs. Professional JavaScript codebases exclusively use const and let.',
    },
    keyTakeaways: [
      'Use const by default; switch to let only when a variable must be reassigned.',
      'JavaScript’s three starter data types are Strings ("text"), Numbers (42, 3.14), and Booleans (true/false).',
      'Template literals (`Hello ${name}`) make building dynamic text effortless.',
    ],
    quiz: {
      question: 'Which variable declaration should you use for a user’s birthYear that will never change?',
      options: [
        'const birthYear = 2001;',
        'let birthYear = 2001;',
        'var birthYear = 2001;',
        'birthYear := 2001;',
      ],
      correctIndex: 0,
      explanation:
        'Use const for any binding that will not be reassigned. It communicates immutability and prevents accidental overwrites.',
    },
    lab: {
      title: 'Build a Learner Profile Card Generator',
      prompt:
        'Create three variables and a formatted summary string, then log it to the console so the runner can verify your first program.',
      requirements: [
        'Declare a const variable named learnerName set to any non-empty string (e.g. "Alex").',
        'Declare a let variable named lessonsCompleted starting at 1, then increase it by 2 (so its final value is 3).',
        'Declare a const variable named summary using a template literal formatted exactly as: "<learnerName> completed <lessonsCompleted> lessons!"',
        'Log summary using console.log(summary).',
      ],
      starterCode: `// 1. Create a const named learnerName
const learnerName = "";

// 2. Create a let named lessonsCompleted starting at 1, then add 2 to it
let lessonsCompleted = 1;

// 3. Build summary using a template literal
const summary = "";

// 4. Print summary to the console
`,
      solutionCode: `const learnerName = "Alex";

let lessonsCompleted = 1;
lessonsCompleted = lessonsCompleted + 2;

const summary = \`\${learnerName} completed \${lessonsCompleted} lessons!\`;

console.log(summary);`,
      testScript: `
test('learnerName is a non-empty string', () => {
  expect(typeof learnerName).toBe('string');
  expect(learnerName.trim().length).toBeGreaterThan(0);
});

test('lessonsCompleted was updated to 3', () => {
  expect(lessonsCompleted).toBe(3);
});

test('summary matches the exact template format', () => {
  expect(summary).toBe(\`\${learnerName} completed \${lessonsCompleted} lessons!\`);
});

test('console.log outputs the summary', () => {
  const logged = __logs.map((l) => l.message).join('\\n');
  expect(logged).toContain(summary);
});
`,
      hints: [
        'Set learnerName to a name inside quotes, like: const learnerName = "Alex";',
        'To increase lessonsCompleted by 2, write: lessonsCompleted = lessonsCompleted + 2; (or lessonsCompleted += 2;)',
        'Use backticks for summary: const summary = `${learnerName} completed ${lessonsCompleted} lessons!`; and then call console.log(summary);',
      ],
    },
  },

  {
    id: 's1-conditionals-logic',
    stageId: 1,
    order: 2,
    title: 'Making Decisions with Conditionals',
    subtitle: 'Teaching your program to branch based on real rules',
    difficulty: 'Beginner',
    durationMinutes: 10,
    xp: 60,
    mode: 'js',
    concepts: ['if / else if / else', 'Strict Equality (===)', 'Logical && and ||', 'Guard Clauses'],
    summary:
      'Smart software reacts to conditions: granting access if a password matches, applying a discount if a cart is over $50, or alerting when battery drops below 15%.',
    sections: [
      {
        heading: 'Comparisons and Strict Equality',
        paragraphs: [
          'Every decision begins with a question that evaluates to true or false (a Boolean). Always compare values with === (strict equality) rather than ==, because === checks both value AND type.',
        ],
        codeExample: {
          title: 'Strict comparisons & logical operators',
          language: 'js',
          code: `const age = 20;
const hasTicket = true;

// && means BOTH must be true
if (age >= 18 && hasTicket === true) {
  console.log("Welcome to the concert!");
} else {
  console.log("Entry denied.");
}`,
        },
      },
      {
        heading: 'Clean Branching with Guard Clauses',
        analogy:
          'Imagine an airport security check. Instead of nesting 5 rooms inside each other, a guard rejects invalid boarding passes right at the door and lets valid travelers walk straight through.',
        paragraphs: [
          'When you have multiple ranges (like grading scores), check from the highest or invalid edge cases first. Returning early keeps your logic flat and easy to read.',
        ],
        codeExample: {
          title: 'Early returns keep logic crystal clear',
          language: 'js',
          code: `function getShippingCost(orderTotal) {
  if (orderTotal <= 0) return 0;
  if (orderTotal >= 100) return 0; // Free shipping!
  return 9.99;
}`,
        },
      },
    ],
    pitfall: {
      title: 'Never use == (loose equality)',
      badTitle: 'Loose equality surprises',
      badCode: `if ("0" == false) {
  // Surprisingly runs! JS coerces types silently.
}`,
      goodTitle: 'Strict equality (===)',
      goodCode: `if (count === 0) {
  // Predictable: only true when count is the number 0.
}`,
      why: 'Loose equality performs invisible type conversions ("5" == 5 is true, "" == 0 is true) that cause subtle security and billing bugs.',
    },
    keyTakeaways: [
      'Always use === and !== for comparisons.',
      'Combine conditions with && (AND), || (OR), and ! (NOT).',
      'Handle invalid inputs first with early returns (guard clauses).',
    ],
    quiz: {
      question: 'What does (10 >= 10 && "10" === 10) evaluate to?',
      options: ['true', 'false', 'undefined', 'Throws a SyntaxError'],
      correctIndex: 1,
      explanation:
        '10 >= 10 is true, but "10" === 10 is false because one is a string and one is a number. true && false is false.',
    },
    lab: {
      title: 'Build a Smart Grade Evaluator',
      prompt:
        'Implement the function evaluateGrade(score) that validates the score and returns the right letter grade.',
      requirements: [
        'If score < 0 or score > 100 (or typeof score !== "number"), return "Invalid".',
        'Score 90 to 100 returns "A".',
        'Score 80 to 89 returns "B".',
        'Score 70 to 79 returns "C".',
        'Score 60 to 69 returns "D".',
        'Score below 60 returns "F".',
      ],
      starterCode: `function evaluateGrade(score) {
  // Handle invalid scores first, then check ranges from highest to lowest
  
}

console.log(evaluateGrade(95)); // Should log "A"
console.log(evaluateGrade(72)); // Should log "C"
`,
      solutionCode: `function evaluateGrade(score) {
  if (typeof score !== 'number' || Number.isNaN(score) || score < 0 || score > 100) {
    return 'Invalid';
  }
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

console.log(evaluateGrade(95));
console.log(evaluateGrade(72));`,
      testScript: `
test('rejects out-of-range and non-number inputs', () => {
  expect(evaluateGrade(-5)).toBe('Invalid');
  expect(evaluateGrade(101)).toBe('Invalid');
  expect(evaluateGrade('95')).toBe('Invalid');
});

test('assigns A, B, C, D, and F accurately including boundaries', () => {
  expect(evaluateGrade(100)).toBe('A');
  expect(evaluateGrade(90)).toBe('A');
  expect(evaluateGrade(89)).toBe('B');
  expect(evaluateGrade(80)).toBe('B');
  expect(evaluateGrade(75)).toBe('C');
  expect(evaluateGrade(60)).toBe('D');
  expect(evaluateGrade(59)).toBe('F');
  expect(evaluateGrade(0)).toBe('F');
});
`,
      hints: [
        'Start with a guard clause: if (typeof score !== "number" || score < 0 || score > 100) return "Invalid";',
        'Check highest thresholds first: if (score >= 90) return "A"; then >= 80, >= 70, >= 60.',
        'If none of the above returned, return "F" at the end.',
      ],
    },
  },

  {
    id: 's1-loops-iteration',
    stageId: 1,
    order: 3,
    title: 'Repeating Work with Loops',
    subtitle: 'Automating thousands of steps in three lines of code',
    difficulty: 'Beginner',
    durationMinutes: 10,
    xp: 65,
    mode: 'js',
    concepts: ['for loops', 'for...of loops', 'Accumulators', 'Infinite Loop Prevention'],
    summary:
      'Computers shine at repetition. Whether summing 10,000 invoices or scanning every pixel in a photo, loops let you write the instruction once and run it as many times as needed.',
    sections: [
      {
        heading: 'The Accumulator Pattern',
        analogy:
          'Imagine counting coins into a piggy bank. You start with total = 0, pick up each coin one by one, and add it to total until the pile is empty.',
        paragraphs: [
          'The accumulator pattern is one of the most fundamental patterns in all of programming: initialize a result variable BEFORE the loop, update it INSIDE the loop, and return it AFTER the loop.',
        ],
        codeExample: {
          title: 'Summing numbers with for...of',
          language: 'js',
          code: `const prices = [12, 8, 25, 5];
let total = 0; // 1. Initialize accumulator

for (const price of prices) {
  total += price; // 2. Update inside loop
}

console.log("Total:", total); // 50`,
        },
      },
      {
        heading: 'Classic Counting with for',
        paragraphs: [
          'When you need an index or want to count from 1 to N, use a classic for loop: for (let i = 1; i <= n; i++). Always ensure your counter moves toward the stopping condition so you never create an infinite loop.',
        ],
        codeExample: {
          title: 'Counting even numbers up to 10',
          language: 'js',
          code: `const evens = [];
for (let i = 2; i <= 10; i += 2) {
  evens.push(i);
}
console.log(evens); // [2, 4, 6, 8, 10]`,
        },
      },
    ],
    pitfall: {
      title: 'Watch out for Off-By-One errors',
      badTitle: 'Stops one item too early or reads past the end',
      badCode: `const items = ["a", "b", "c"];
for (let i = 0; i <= items.length; i++) {
  console.log(items[i]); // Last iteration is undefined!
}`,
      goodTitle: 'Use < items.length (or for...of)',
      goodCode: `const items = ["a", "b", "c"];
for (const item of items) {
  console.log(item); // Clean and impossible to go out of bounds!
}`,
      why: 'Arrays are 0-indexed, so valid indices are 0 through length - 1. Prefer for...of whenever you do not need the index.',
    },
    keyTakeaways: [
      'Use for...of to iterate safely over arrays without off-by-one bugs.',
      'Use the accumulator pattern (initialize → loop & update → return) to compute sums, counts, or new arrays.',
      'Always verify your loop condition eventually becomes false.',
    ],
    quiz: {
      question: 'How many times will `for (let i = 0; i < 5; i++)` run?',
      options: ['4 times (0, 1, 2, 3)', '5 times (0, 1, 2, 3, 4)', '6 times (0 through 5)', 'Infinite times'],
      correctIndex: 1,
      explanation: 'Starting at 0 and running while i < 5 visits 0, 1, 2, 3, and 4 — exactly 5 iterations.',
    },
    lab: {
      title: 'Sum Even Numbers & Find the Maximum',
      prompt:
        'Write two functions using loops: sumEvenUpTo(n) and findMax(numbers).',
      requirements: [
        'sumEvenUpTo(n) returns the sum of all even integers from 1 to n (inclusive). If n < 2, return 0.',
        'findMax(numbers) returns the largest number in a non-empty array of numbers (works with negative numbers too!). If the array is empty, return null.',
      ],
      starterCode: `function sumEvenUpTo(n) {
  // Add all even numbers from 1 to n
  
}

function findMax(numbers) {
  // Return null for empty arrays, otherwise find the largest number
  
}

console.log(sumEvenUpTo(10));        // 30 (2 + 4 + 6 + 8 + 10)
console.log(findMax([-10, -3, -7])); // -3
`,
      solutionCode: `function sumEvenUpTo(n) {
  let sum = 0;
  for (let i = 2; i <= n; i += 2) {
    sum += i;
  }
  return sum;
}

function findMax(numbers) {
  if (numbers.length === 0) return null;
  let max = numbers[0];
  for (const num of numbers) {
    if (num > max) {
      max = num;
    }
  }
  return max;
}`,
      testScript: `
test('sumEvenUpTo computes sums accurately', () => {
  expect(sumEvenUpTo(10)).toBe(30);
  expect(sumEvenUpTo(1)).toBe(0);
  expect(sumEvenUpTo(0)).toBe(0);
  expect(sumEvenUpTo(7)).toBe(12);
});

test('findMax works with positive and negative numbers', () => {
  expect(findMax([3, 19, 7, 2])).toBe(19);
  expect(findMax([-10, -3, -25])).toBe(-3);
  expect(findMax([42])).toBe(42);
});

test('findMax returns null for an empty array', () => {
  expect(findMax([])).toBe(null);
});
`,
      hints: [
        'In sumEvenUpTo(n), start let sum = 0 and loop for (let i = 2; i <= n; i += 2) { sum += i; }.',
        'In findMax(numbers), do NOT initialize max = 0! If all numbers are negative (like [-10, -3]), 0 would be wrongly returned. Start with let max = numbers[0] after checking numbers.length === 0.',
      ],
    },
  },

  {
    id: 's1-functions-modularity',
    stageId: 1,
    order: 4,
    title: 'Functions: Reusable Building Blocks',
    subtitle: 'Breaking big problems into small, testable, pure pieces',
    difficulty: 'Beginner',
    durationMinutes: 12,
    xp: 75,
    mode: 'js',
    concepts: ['Parameters & Return Values', 'Default Parameters', 'Arrow Functions', 'Pure Functions'],
    summary:
      'Professional software isn’t one giant 2,000-line script — it’s dozens of small, focused functions that each do ONE job brilliantly and compose together like LEGO bricks.',
    sections: [
      {
        heading: 'Inputs In, Outputs Out',
        analogy:
          'A function is like a coffee machine: you give it inputs (water + beans), it performs a repeatable process, and it returns a predictable output (espresso).',
        paragraphs: [
          'Notice the crucial difference between console.log() and return. console.log() only prints text for humans to read; return hands a value back to the rest of your program so other functions can use it.',
        ],
        codeExample: {
          title: 'Composing small pure functions',
          language: 'js',
          code: `// Arrow function with a default parameter
const calculateTax = (subtotal, rate = 0.08) => subtotal * rate;

function formatCurrency(amount) {
  return \`$\${amount.toFixed(2)}\`;
}

function buildReceiptTotal(subtotal, taxRate) {
  const total = subtotal + calculateTax(subtotal, taxRate);
  return formatCurrency(total);
}

console.log(buildReceiptTotal(50)); // "$54.00"`,
        },
      },
      {
        heading: 'Why Pure Functions Make You a Better Engineer',
        paragraphs: [
          'A pure function always returns the same output for the same inputs and never secretly mutates outside variables. Pure functions are dramatically easier to debug, test, and reuse.',
        ],
      },
    ],
    pitfall: {
      title: 'Confusing console.log with return',
      badTitle: 'Logs the answer but returns undefined',
      badCode: `function double(x) {
  console.log(x * 2);
}
const result = double(5); // result is undefined!`,
      goodTitle: 'Returns the computed value',
      goodCode: `function double(x) {
  return x * 2;
}
const result = double(5); // result is 10`,
      why: 'If a function doesn’t return its result, callers cannot store, test, or pass that result into another calculation.',
    },
    keyTakeaways: [
      'A function without a return statement implicitly returns undefined.',
      'Use default parameters (rate = 0.08) so callers can omit optional arguments.',
      'Decompose complex tasks into small pure helper functions.',
    ],
    quiz: {
      question: 'What makes a function "pure"?',
      options: [
        'It uses arrow syntax instead of the function keyword',
        'It takes zero parameters',
        'Same inputs always produce the same output with no side effects',
        'It calls console.log at least once',
      ],
      correctIndex: 2,
      explanation:
        'Pure functions are deterministic (same input → same output) and free of side effects (no mutating external state).',
    },
    lab: {
      title: 'Build a Composable Order Pricing Engine',
      prompt:
        'Build three small, composable functions to calculate an e-commerce checkout total with optional discount and tax.',
      requirements: [
        'applyDiscount(price, discountPercent = 0): returns price reduced by discountPercent% (e.g. applyDiscount(100, 20) -> 80).',
        'calculateTotal(items, discountPercent = 0, taxRate = 0.1): sums the array of item prices, applies the discount via applyDiscount, then adds taxRate (e.g. 0.1 = 10% tax), and rounds to 2 decimal places as a Number (Number(val.toFixed(2))).',
      ],
      starterCode: `function applyDiscount(price, discountPercent = 0) {
  // Return price after subtracting discountPercent%
  
}

function calculateTotal(items, discountPercent = 0, taxRate = 0.1) {
  // 1. Sum all prices in items
  // 2. Apply discountPercent using applyDiscount
  // 3. Apply taxRate and round to 2 decimals as a Number
  
}

console.log(applyDiscount(100, 15));          // 85
console.log(calculateTotal([40, 60], 10, 0.1)); // 99
`,
      solutionCode: `function applyDiscount(price, discountPercent = 0) {
  return price * (1 - discountPercent / 100);
}

function calculateTotal(items, discountPercent = 0, taxRate = 0.1) {
  let subtotal = 0;
  for (const item of items) {
    subtotal += item;
  }
  const discounted = applyDiscount(subtotal, discountPercent);
  const withTax = discounted * (1 + taxRate);
  return Number(withTax.toFixed(2));
}`,
      testScript: `
test('applyDiscount handles default and custom percentages', () => {
  expect(applyDiscount(100)).toBe(100);
  expect(applyDiscount(100, 20)).toBe(80);
  expect(applyDiscount(50, 10)).toBe(45);
});

test('calculateTotal composes subtotal, discount, and default tax', () => {
  expect(calculateTotal([40, 60])).toBe(110);
  expect(calculateTotal([40, 60], 10)).toBe(99);
});

test('calculateTotal handles custom tax and rounds cleanly to 2 decimals', () => {
  expect(calculateTotal([19.99, 5.5], 15, 0.0825)).toBe(23.45);
  expect(calculateTotal([], 20, 0.1)).toBe(0);
});
`,
      hints: [
        'For applyDiscount(price, discountPercent = 0), multiply price by (1 - discountPercent / 100).',
        'After summing items, call const discounted = applyDiscount(subtotal, discountPercent);',
        'Apply tax with discounted * (1 + taxRate) and round cleanly using Number(total.toFixed(2)).',
      ],
    },
  },

  // =========================================================================
  // STAGE 2: INTERACTIVE WEB ENGINEERING (HTML, CSS, DOM)
  // =========================================================================
  {
    id: 's2-semantic-html',
    stageId: 2,
    order: 5,
    title: 'Semantic HTML: Structuring Real Web Pages',
    subtitle: 'Building meaningful, accessible documents browsers & screen readers love',
    difficulty: 'Beginner',
    durationMinutes: 10,
    xp: 70,
    mode: 'web',
    concepts: ['Semantic Landmarks', 'Headings Hierarchy', 'Lists & Links', 'Accessibility'],
    summary:
      'HTML is the skeleton of every website. Instead of wrapping everything in generic <div> tags, professionals use semantic tags like <header>, <main>, <article>, and <footer> so pages are accessible and SEO-ready.',
    sections: [
      {
        heading: 'Why Semantic Tags Matter',
        analogy:
          'A newspaper isn’t one wall of plain text — it has a masthead, headlines, sections, articles, and captions. Semantic HTML gives your web page that exact structure.',
        paragraphs: [
          'Screen readers used by visually impaired users jump directly to <nav>, <main>, and <h1> landmarks. Search engines also rely on semantic structure to understand what matters most on your page.',
        ],
        codeExample: {
          title: 'Clean semantic page skeleton',
          language: 'html',
          code: `<header>
  <h1>Dev Portfolio</h1>
  <nav>
    <a href="#projects">Projects</a>
  </nav>
</header>
<main>
  <article class="card">
    <h2>Weather Dashboard</h2>
    <p>Real-time forecasts built with modern APIs.</p>
  </article>
</main>
<footer>Built with semantic HTML</footer>`,
        },
      },
    ],
    pitfall: {
      title: 'Avoid "div soup"',
      badTitle: 'Generic divs with no meaning',
      badCode: `<div class="top"><div class="big-text">My Blog</div></div>
<div class="btn">Subscribe</div>`,
      goodTitle: 'Semantic, keyboard-accessible tags',
      goodCode: `<header><h1>My Blog</h1></header>
<button type="button">Subscribe</button>`,
      why: 'A <button> automatically supports keyboard Tab focus, Enter/Space activation, and screen reader announcements — a <div> does none of that.',
    },
    keyTakeaways: [
      'Use one <h1> per page for the main title, followed by <h2> and <h3> in order.',
      'Use landmark tags: <header>, <nav>, <main>, <section>, <article>, and <footer>.',
      'Use real <button> elements for actions and <a href="..."> for navigation.',
    ],
    quiz: {
      question: 'Which HTML element should wrap the primary unique content of a web page?',
      options: ['<div id="content">', '<main>', '<section>', '<header>'],
      correctIndex: 1,
      explanation: '<main> semantically identifies the dominant content of the page for assistive technologies and browsers.',
    },
    lab: {
      title: 'Craft a Semantic Developer Profile Card',
      prompt:
        'Build an accessible developer profile layout in index.html using proper semantic HTML tags.',
      requirements: [
        'Include a <header> containing an <h1> with the developer’s name.',
        'Include a <main> containing an <article class="bio"> with a <p> bio paragraph.',
        'Inside <main>, include a <ul class="skills"> list with at least 3 <li> skill items.',
        'Include a real <button id="contact-btn">Contact Me</button> element.',
      ],
      starterFiles: {
        html: `<!-- Build your semantic profile here -->
<header>
  <h1></h1>
</header>

<main>
  
</main>
`,
        css: `body {
  background: #f8fafc;
  color: #0f172a;
  font-family: system-ui, sans-serif;
  max-width: 560px;
  margin: 0 auto;
  padding: 24px;
}
header {
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 12px;
  margin-bottom: 20px;
}
h1 { margin: 0; font-size: 1.75rem; color: #0f9d68; }
.bio {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}
.skills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
}
.skills li {
  background: #ecfdf5;
  color: #065f46;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
}
button {
  background: #0f172a;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}`,
        js: `// Preview helper — no JS required for this HTML lab`,
      },
      solutionFiles: {
        html: `<header>
  <h1>Maya Lin</h1>
</header>

<main>
  <article class="bio">
    <h2>Full-Stack Engineer</h2>
    <p>I build fast, accessible web applications and developer tools.</p>
  </article>

  <ul class="skills">
    <li>HTML &amp; CSS</li>
    <li>JavaScript</li>
    <li>System Design</li>
  </ul>

  <button id="contact-btn" type="button">Contact Me</button>
</main>`,
        css: `body {
  background: #f8fafc;
  color: #0f172a;
  font-family: system-ui, sans-serif;
  max-width: 560px;
  margin: 0 auto;
  padding: 24px;
}
header {
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 12px;
  margin-bottom: 20px;
}
h1 { margin: 0; font-size: 1.75rem; color: #0f9d68; }
.bio {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}
.skills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
}
.skills li {
  background: #ecfdf5;
  color: #065f46;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
}
button {
  background: #0f172a;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}`,
        js: ``,
      },
      testScript: `
test('header contains a non-empty h1', () => {
  const h1 = document.querySelector('header h1');
  expect(Boolean(h1)).toBe(true);
  expect(h1.textContent.trim().length).toBeGreaterThan(0);
});

test('main contains an article.bio with a paragraph', () => {
  const p = document.querySelector('main article.bio p');
  expect(Boolean(p)).toBe(true);
  expect(p.textContent.trim().length).toBeGreaterThan(5);
});

test('ul.skills inside main has at least 3 skill items', () => {
  const items = document.querySelectorAll('main ul.skills li');
  expect(items.length).toBeGreaterThan(2);
});

test('includes an accessible button#contact-btn', () => {
  const btn = document.querySelector('button#contact-btn');
  expect(Boolean(btn)).toBe(true);
  expect(btn.textContent.trim().length).toBeGreaterThan(0);
});
`,
      hints: [
        'Put a name inside <h1>Maya Lin</h1> inside the <header>.',
        'Inside <main>, add <article class="bio"><p>Your bio text here</p></article>.',
        'Add <ul class="skills"><li>HTML</li><li>CSS</li><li>JavaScript</li></ul> and <button id="contact-btn">Contact Me</button>.',
      ],
    },
  },

  {
    id: 's2-css-flexbox',
    stageId: 2,
    order: 6,
    title: 'Modern CSS Layouts: Box Model & Flexbox',
    subtitle: 'Aligning navigation bars, cards, and UI controls effortlessly',
    difficulty: 'Beginner',
    durationMinutes: 12,
    xp: 80,
    mode: 'web',
    concepts: ['Box Model', 'display: flex', 'justify-content', 'align-items & gap'],
    summary:
      'CSS used to feel unpredictable until Flexbox arrived. With just four Flexbox properties, you can align any row or column cleanly without fragile float or margin hacks.',
    sections: [
      {
        heading: 'The Two Axes of Flexbox',
        analogy:
          'Picture books on a shelf. justify-content slides them left, center, or spread apart along the shelf (Main Axis). align-items aligns their tops, middles, or bottoms vertically (Cross Axis).',
        paragraphs: [
          'Turn any container into a Flex container with display: flex. Use gap to create uniform spacing between children without adding ugly margins to the first or last item.',
        ],
        codeExample: {
          title: 'Classic SaaS Navbar in 4 lines of CSS',
          language: 'css',
          code: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}`,
        },
      },
    ],
    pitfall: {
      title: 'Using margin-right on every child instead of gap',
      badTitle: 'Leaves extra trailing margin on the last item',
      badCode: `.nav-links a { margin-right: 16px; }`,
      goodTitle: 'Clean, symmetrical spacing with gap',
      goodCode: `.nav-links {
  display: flex;
  gap: 16px;
}`,
      why: 'gap only adds space BETWEEN items — never before the first item or after the last item.',
    },
    keyTakeaways: [
      'display: flex lays out direct children in a row by default.',
      'justify-content aligns along the main axis (space-between, center, flex-end).',
      'align-items aligns along the cross axis (center, stretch).',
      'Use gap instead of manual margins between sibling flex items.',
    ],
    quiz: {
      question: 'In a horizontal flex container (`flex-direction: row`), which property pushes the first child to the far left and the last child to the far right?',
      options: [
        'align-items: space-between',
        'justify-content: space-between',
        'flex-wrap: space-between',
        'text-align: justify',
      ],
      correctIndex: 1,
      explanation: 'justify-content controls distribution along the main axis (horizontal in row mode).',
    },
    lab: {
      title: 'Style a Modern App Navigation Bar with Flexbox',
      prompt:
        'Open styles.css and use Flexbox to turn the stacked navigation markup into a crisp horizontal app header.',
      requirements: [
        'Give .navbar display: flex, justify-content: space-between, and align-items: center.',
        'Give .nav-links display: flex and a gap of at least 12px (e.g. 16px).',
        'Give .navbar padding of at least 12px (e.g. 16px 24px).',
      ],
      starterFiles: {
        html: `<nav class="navbar">
  <div class="brand">Crazina</div>
  <div class="nav-links">
    <a href="#learn">Learn</a>
    <a href="#practice">Practice</a>
    <a href="#pro">Pro Track</a>
  </div>
  <button class="cta">Get Started</button>
</nav>`,
        css: `.navbar {
  background: #14151a;
  color: #ffffff;
  border-radius: 12px;
  /* Add Flexbox alignment & padding here */
}

.brand {
  font-weight: 800;
  font-size: 1.15rem;
  color: #34d399;
}

.nav-links {
  /* Make links sit in a row with gap */
}

.nav-links a {
  color: #e2e8f0;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
}

.cta {
  background: #0f9d68;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
}`,
        js: ``,
      },
      solutionFiles: {
        html: `<nav class="navbar">
  <div class="brand">Crazina</div>
  <div class="nav-links">
    <a href="#learn">Learn</a>
    <a href="#practice">Practice</a>
    <a href="#pro">Pro Track</a>
  </div>
  <button class="cta">Get Started</button>
</nav>`,
        css: `.navbar {
  background: #14151a;
  color: #ffffff;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.brand {
  font-weight: 800;
  font-size: 1.15rem;
  color: #34d399;
}

.nav-links {
  display: flex;
  gap: 16px;
}

.nav-links a {
  color: #e2e8f0;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
}

.cta {
  background: #0f9d68;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
}`,
        js: ``,
      },
      testScript: `
test('.navbar uses Flexbox with space-between and vertical centering', () => {
  const nav = document.querySelector('.navbar');
  const style = getComputedStyle(nav);
  expect(style.display).toBe('flex');
  expect(style.justifyContent).toBe('space-between');
  expect(style.alignItems).toBe('center');
});

test('.navbar has comfortable padding (>= 12px)', () => {
  const nav = document.querySelector('.navbar');
  const style = getComputedStyle(nav);
  expect(parseFloat(style.paddingTop)).toBeGreaterThan(11);
  expect(parseFloat(style.paddingLeft)).toBeGreaterThan(11);
});

test('.nav-links is a flex row with gap >= 12px', () => {
  const links = document.querySelector('.nav-links');
  const style = getComputedStyle(links);
  expect(style.display).toBe('flex');
  expect(parseFloat(style.columnGap || style.gap)).toBeGreaterThan(11);
});
`,
      hints: [
        'Inside .navbar { ... }, add: display: flex; justify-content: space-between; align-items: center; padding: 16px 24px;',
        'Inside .nav-links { ... }, add: display: flex; gap: 16px;',
      ],
    },
  },

  {
    id: 's2-css-grid-responsive',
    stageId: 2,
    order: 7,
    title: 'Responsive Design & CSS Grid Systems',
    subtitle: 'Creating 2-dimensional dashboard layouts that adapt to any screen',
    difficulty: 'Beginner',
    durationMinutes: 12,
    xp: 85,
    mode: 'web',
    concepts: ['display: grid', 'grid-template-columns', 'fr units & repeat()', 'Responsive Auto-Fit'],
    summary:
      'While Flexbox masters 1D rows and columns, CSS Grid is built for 2D page layouts — dashboards, photo galleries, and pricing cards — with clean fractional tracks.',
    sections: [
      {
        heading: 'Fractional Tracks & repeat()',
        paragraphs: [
          'The fr unit means "fraction of available space". Writing grid-template-columns: repeat(3, 1fr) creates 3 perfectly equal columns that automatically account for your gap.',
        ],
        codeExample: {
          title: 'Zero-media-query responsive card grid',
          language: 'css',
          code: `.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}`,
          explanation:
            'auto-fit + minmax(220px, 1fr) automatically packs as many 220px+ columns as fit on desktop and smoothly stacks into 1 column on phones!',
        },
      },
    ],
    keyTakeaways: [
      'Use Flexbox for 1D alignment (navbars, button groups) and CSS Grid for 2D grids (cards, dashboards).',
      '1fr divides remaining space evenly without manual percentage math.',
      'grid-column: span 2 lets a featured card smoothly span across multiple columns.',
    ],
    quiz: {
      question: 'What does `grid-template-columns: repeat(3, 1fr)` create?',
      options: [
        '3 rows of 1 pixel each',
        '3 equal-width columns filling the container',
        '1 column repeated 3 times vertically',
        'A horizontal scrolling list',
      ],
      correctIndex: 1,
      explanation: 'repeat(3, 1fr) is shorthand for `1fr 1fr 1fr`, dividing available width into 3 equal columns.',
    },
    lab: {
      title: 'Build a 3-Column Metrics Dashboard with a Featured Card',
      prompt:
        'Transform the plain stacked stat cards into a crisp 3-column CSS Grid dashboard where the featured card spans 2 columns.',
      requirements: [
        'Set .grid to display: grid.',
        'Give .grid 3 equal columns using grid-template-columns: repeat(3, 1fr) and a gap of 16px.',
        'Make .card.featured span 2 columns (grid-column: span 2).',
      ],
      starterFiles: {
        html: `<section class="grid">
  <div class="card featured">
    <span class="label">Active Learners</span>
    <strong>14,820</strong>
  </div>
  <div class="card">
    <span class="label">Completion Rate</span>
    <strong>94%</strong>
  </div>
  <div class="card">
    <span class="label">Labs Run Today</span>
    <strong>38,410</strong>
  </div>
  <div class="card">
    <span class="label">Avg Streak</span>
    <strong>19 days</strong>
  </div>
  <div class="card">
    <span class="label">Pro Graduates</span>
    <strong>2,915</strong>
  </div>
</section>`,
        css: `.grid {
  /* Set display: grid, 3 equal columns, and 16px gap */
}

.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card.featured {
  background: #ecfdf5;
  border-color: #10b981;
  /* Make this card span 2 columns */
}

.label { font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; }
strong { font-size: 1.65rem; color: #0f172a; }`,
        js: ``,
      },
      solutionFiles: {
        html: `<section class="grid">
  <div class="card featured">
    <span class="label">Active Learners</span>
    <strong>14,820</strong>
  </div>
  <div class="card">
    <span class="label">Completion Rate</span>
    <strong>94%</strong>
  </div>
  <div class="card">
    <span class="label">Labs Run Today</span>
    <strong>38,410</strong>
  </div>
  <div class="card">
    <span class="label">Avg Streak</span>
    <strong>19 days</strong>
  </div>
  <div class="card">
    <span class="label">Pro Graduates</span>
    <strong>2,915</strong>
  </div>
</section>`,
        css: `.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card.featured {
  background: #ecfdf5;
  border-color: #10b981;
  grid-column: span 2;
}

.label { font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; }
strong { font-size: 1.65rem; color: #0f172a; }`,
        js: ``,
      },
      testScript: `
test('.grid uses display: grid with 3 columns and 16px gap', () => {
  const grid = document.querySelector('.grid');
  const style = getComputedStyle(grid);
  expect(style.display).toBe('grid');
  const cols = style.gridTemplateColumns.trim().split(/\\s+/);
  expect(cols.length).toBe(3);
  expect(parseFloat(style.columnGap || style.gap)).toBe(16);
});

test('.card.featured spans 2 columns (wider than a single card)', () => {
  const featured = document.querySelector('.card.featured');
  const normal = document.querySelector('.card:not(.featured)');
  const fWidth = featured.getBoundingClientRect().width;
  const nWidth = normal.getBoundingClientRect().width;
  expect(fWidth).toBeGreaterThan(nWidth * 1.8);
});
`,
      hints: [
        'In .grid, add: display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;',
        'In .card.featured, add: grid-column: span 2;',
      ],
    },
  },

  {
    id: 's2-dom-events',
    stageId: 2,
    order: 8,
    title: 'Interactive DOM & Event Listeners',
    subtitle: 'Connecting JavaScript to HTML so users can click, type, and interact',
    difficulty: 'Beginner',
    durationMinutes: 14,
    xp: 90,
    mode: 'web',
    concepts: ['querySelector', 'addEventListener', 'textContent', 'UI State Updates'],
    summary:
      'The Document Object Model (DOM) is how JavaScript sees and updates a live web page. Mastering DOM events unlocks real interactive applications.',
    sections: [
      {
        heading: 'The UI Loop: State → Render → Event',
        analogy:
          'Think of a digital scoreboard. Clicking "+1" doesn’t directly paint pixels — it updates the score variable (State), and then updates the display text (Render).',
        paragraphs: [
          'Every modern framework (React, Vue, Svelte) is built on this exact pattern: keep a single source of truth in JavaScript state, listen for user events with addEventListener, update state, and re-render the DOM.',
        ],
        codeExample: {
          title: 'Clean state-driven DOM updates',
          language: 'js',
          code: `let likes = 0;
const countEl = document.querySelector('#likes');
const btn = document.querySelector('#like-btn');

function render() {
  countEl.textContent = String(likes);
}

btn.addEventListener('click', () => {
  likes += 1;
  render();
});`,
        },
      },
    ],
    pitfall: {
      title: 'Use textContent instead of innerHTML for user text',
      badTitle: 'XSS vulnerability if input contains <script>',
      badCode: `greeting.innerHTML = "Hello " + userInput;`,
      goodTitle: 'Safe text rendering',
      goodCode: `greeting.textContent = \`Hello \${userInput}\`;`,
      why: 'innerHTML parses raw HTML tags and opens Cross-Site Scripting (XSS) security holes. textContent always treats content as plain text.',
    },
    keyTakeaways: [
      'Select elements with document.querySelector("#id") or ".class".',
      'Attach click/input behavior using element.addEventListener("click", handler).',
      'Always use textContent (not innerHTML) when inserting text.',
    ],
    quiz: {
      question: 'Why should you prefer `el.textContent` over `el.innerHTML` when displaying dynamic text?',
      options: [
        'innerHTML is deprecated in Chrome',
        'textContent prevents HTML injection (XSS) and is faster',
        'textContent automatically styles the text in bold',
        'innerHTML only works on <div> tags',
      ],
      correctIndex: 1,
      explanation: 'textContent safely inserts literal text without parsing HTML/scripts, preventing XSS attacks.',
    },
    lab: {
      title: 'Wire Up an Interactive Step Counter Widget',
      prompt:
        'Open script.js and connect the Increment, Decrement, and Reset buttons to update the counter display safely (never letting the count drop below 0).',
      requirements: [
        'Clicking #inc-btn increases the count by 1 and updates #count-value.',
        'Clicking #dec-btn decreases the count by 1, but NEVER below 0.',
        'Clicking #reset-btn resets the count back to 0.',
      ],
      starterFiles: {
        html: `<div class="counter-card">
  <h2>Pomodoro Sessions</h2>
  <div id="count-value" class="count">0</div>
  <div class="actions">
    <button id="dec-btn" type="button">-1</button>
    <button id="reset-btn" type="button">Reset</button>
    <button id="inc-btn" type="button">+1</button>
  </div>
</div>`,
        css: `.counter-card {
  max-width: 320px;
  margin: 12px auto;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  text-align: center;
  background: #ffffff;
}
.count {
  font-size: 3rem;
  font-weight: 800;
  color: #0f9d68;
  margin: 12px 0 20px;
}
.actions { display: flex; justify-content: center; gap: 10px; }
button {
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  font-weight: 700;
  cursor: pointer;
}
#inc-btn { background: #0f9d68; color: white; border-color: #0f9d68; }`,
        js: `let count = 0;

const countEl = document.querySelector('#count-value');
const incBtn = document.querySelector('#inc-btn');
const decBtn = document.querySelector('#dec-btn');
const resetBtn = document.querySelector('#reset-btn');

function render() {
  countEl.textContent = String(count);
}

// Wire up click listeners for incBtn, decBtn (min 0), and resetBtn
`,
      },
      solutionFiles: {
        html: `<div class="counter-card">
  <h2>Pomodoro Sessions</h2>
  <div id="count-value" class="count">0</div>
  <div class="actions">
    <button id="dec-btn" type="button">-1</button>
    <button id="reset-btn" type="button">Reset</button>
    <button id="inc-btn" type="button">+1</button>
  </div>
</div>`,
        css: `.counter-card {
  max-width: 320px;
  margin: 12px auto;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  text-align: center;
  background: #ffffff;
}
.count {
  font-size: 3rem;
  font-weight: 800;
  color: #0f9d68;
  margin: 12px 0 20px;
}
.actions { display: flex; justify-content: center; gap: 10px; }
button {
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  font-weight: 700;
  cursor: pointer;
}
#inc-btn { background: #0f9d68; color: white; border-color: #0f9d68; }`,
        js: `let count = 0;

const countEl = document.querySelector('#count-value');
const incBtn = document.querySelector('#inc-btn');
const decBtn = document.querySelector('#dec-btn');
const resetBtn = document.querySelector('#reset-btn');

function render() {
  countEl.textContent = String(count);
}

incBtn.addEventListener('click', () => {
  count += 1;
  render();
});

decBtn.addEventListener('click', () => {
  if (count > 0) {
    count -= 1;
    render();
  }
});

resetBtn.addEventListener('click', () => {
  count = 0;
  render();
});`,
      },
      testScript: `
test('clicking #inc-btn increments the displayed count', () => {
  const inc = document.querySelector('#inc-btn');
  const val = document.querySelector('#count-value');
  inc.click();
  inc.click();
  expect(val.textContent.trim()).toBe('2');
});

test('clicking #dec-btn decrements but never goes below 0', () => {
  const dec = document.querySelector('#dec-btn');
  const val = document.querySelector('#count-value');
  dec.click();
  expect(val.textContent.trim()).toBe('1');
  dec.click();
  dec.click();
  expect(val.textContent.trim()).toBe('0');
});

test('clicking #reset-btn resets count to 0', () => {
  const inc = document.querySelector('#inc-btn');
  const reset = document.querySelector('#reset-btn');
  const val = document.querySelector('#count-value');
  inc.click();
  inc.click();
  inc.click();
  reset.click();
  expect(val.textContent.trim()).toBe('0');
});
`,
      hints: [
        'Use incBtn.addEventListener("click", () => { count += 1; render(); });',
        'In decBtn listener, guard with if (count > 0) { count -= 1; render(); }.',
        'In resetBtn listener, set count = 0; render();',
      ],
    },
  },
];
