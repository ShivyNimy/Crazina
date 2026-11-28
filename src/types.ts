export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';

export type LessonMode = 'js' | 'web';

export type ViewRoute = 'home' | 'curriculum' | 'lesson' | 'practice' | 'playground' | 'guide';

export interface Stage {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  level: Difficulty;
  description: string;
  milestone: string;
  accentColor: string;
  badgeText: string;
}

export interface TutorialSection {
  heading: string;
  paragraphs: string[];
  codeExample?: {
    title: string;
    language: 'js' | 'html' | 'css';
    code: string;
    explanation?: string;
  };
  tip?: string;
  analogy?: string;
}

export interface PitfallComparison {
  title: string;
  badTitle: string;
  badCode: string;
  goodTitle: string;
  goodCode: string;
  why: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface WebStarterFiles {
  html: string;
  css: string;
  js: string;
}

export interface LessonLab {
  title: string;
  prompt: string;
  requirements: string[];
  starterCode?: string;
  solutionCode?: string;
  starterFiles?: WebStarterFiles;
  solutionFiles?: WebStarterFiles;
  testScript: string;
  hints: string[];
}

export interface Lesson {
  id: string;
  stageId: number;
  order: number;
  title: string;
  subtitle: string;
  difficulty: Difficulty;
  durationMinutes: number;
  xp: number;
  mode: LessonMode;
  concepts: string[];
  summary: string;
  sections: TutorialSection[];
  pitfall?: PitfallComparison;
  keyTakeaways: string[];
  quiz: QuizQuestion;
  lab: LessonLab;
}

export interface PracticeChallenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  xp: number;
  estimatedMinutes: number;
  mode: LessonMode;
  summary: string;
  prompt: string;
  examples: { input: string; output: string; explanation?: string }[];
  requirements: string[];
  starterCode?: string;
  solutionCode?: string;
  starterFiles?: WebStarterFiles;
  solutionFiles?: WebStarterFiles;
  testScript: string;
  hints: string[];
}

export interface TestCaseResult {
  name: string;
  passed: boolean;
  expected?: string;
  actual?: string;
  error?: string;
}

export interface ConsoleEntry {
  level: 'log' | 'warn' | 'error' | 'info';
  message: string;
}

export interface ExecutionResult {
  success: boolean;
  tests: TestCaseResult[];
  logs: ConsoleEntry[];
  runtimeError?: string;
  durationMs: number;
}

export interface UserProgress {
  completedLessons: string[];
  completedChallenges: string[];
  completedQuizzes: string[];
  savedCode: Record<string, string | WebStarterFiles>;
  lastLessonId?: string;
  streakDays: number;
  lastActiveDate: string;
  theme: 'light' | 'dark';
}
