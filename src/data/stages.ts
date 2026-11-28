import type { Stage } from '../types';

export const STAGES: Stage[] = [
  {
    id: 1,
    slug: 'foundations',
    title: 'Stage 1: Absolute Foundations',
    subtitle: 'Zero to First Programs',
    level: 'Beginner',
    description:
      'Start from scratch with zero prior coding experience. Learn how computers store data, make decisions, repeat tasks, and organize logic into reusable functions.',
    milestone: 'Write clean, bug-free programs using variables, conditionals, loops, and functions.',
    accentColor: 'emerald',
    badgeText: 'Foundation Builder',
  },
  {
    id: 2,
    slug: 'web-foundations',
    title: 'Stage 2: Interactive Web Engineering',
    subtitle: 'HTML, Modern CSS & The DOM',
    level: 'Beginner',
    description:
      'Build real visual web interfaces that respond to user clicks and adapt to any screen. Master semantic HTML, Flexbox, CSS Grid, and live DOM interactivity.',
    milestone: 'Design responsive, accessible web pages and wire up interactive browser UI.',
    accentColor: 'sky',
    badgeText: 'Web Crafter',
  },
  {
    id: 3,
    slug: 'modern-javascript',
    title: 'Stage 3: Core Programming Mastery',
    subtitle: 'Functional Data, Closures & Async',
    level: 'Intermediate',
    description:
      'Level up from basic syntax to expressive, modern engineering patterns: array pipelines, immutable object transforms, closures, Promises, and async/await.',
    milestone: 'Transform complex datasets cleanly and orchestrate asynchronous API workflows.',
    accentColor: 'amber',
    badgeText: 'JS Craftsman',
  },
  {
    id: 4,
    slug: 'cs-algorithms',
    title: 'Stage 4: Computer Science & Problem Solving',
    subtitle: 'Big-O, Data Structures & Algorithms',
    level: 'Intermediate',
    description:
      'Think like a computer scientist and ace technical interviews. Master time complexity, Hash Maps, Two Pointers, Stacks, Recursion, and Graph BFS traversal.',
    milestone: 'Solve real algorithmic problems in optimal time and space complexity.',
    accentColor: 'orange',
    badgeText: 'Algorithm Architect',
  },
  {
    id: 5,
    slug: 'fullstack-architecture',
    title: 'Stage 5: Full-Stack & Application Architecture',
    subtitle: 'State Stores, REST APIs, Data & Security',
    level: 'Advanced',
    description:
      'Learn how real production applications are architected under the hood: reactive state management, REST routing & validation, relational queries, and security defense.',
    milestone: 'Architect full-stack modules with clean boundaries, data integrity, and security.',
    accentColor: 'indigo',
    badgeText: 'Systems Builder',
  },
  {
    id: 6,
    slug: 'production-engineering',
    title: 'Stage 6: Professional Software Engineering',
    subtitle: 'Clean Code, TDD, Caching & Resilience',
    level: 'Professional',
    description:
      'Bridge the final gap to senior professional engineer. Refactor messy code with SOLID design, practice TDD, build an O(1) LRU Cache, and implement production rate limiters & retries.',
    milestone: 'Ship maintainable, tested, high-performance, fault-tolerant production systems.',
    accentColor: 'rose',
    badgeText: 'Production Pro',
  },
];
