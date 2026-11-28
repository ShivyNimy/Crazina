import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
} from 'lucide-react';
import { ALL_LESSONS, STAGES, getLessonsForStage } from '../data/curriculum';
import { PRACTICE_CHALLENGES } from '../data/practiceChallenges';
import { runJavaScriptTests } from '../engine/runner';
import type { ViewRoute } from '../types';

interface HomeViewProps {
  completedLessons: string[];
  completedChallenges: string[];
  lastLessonId?: string;
  totalXp: number;
  onStartLesson: (lessonId: string) => void;
  onNavigate: (route: ViewRoute) => void;
}

const HERO_STARTER_CODE = `// Try editing this code and click "Run Live"!
function levelUp(learner, stage) {
  const titles = ['Novice', 'Web Crafter', 'JS Craftsman', 'Architect', 'Full-Stack', 'Pro Engineer'];
  return \`\${learner} → Stage \${stage}: \${titles[stage - 1]}\`;
}

for (let s = 1; s <= 6; s++) {
  console.log(levelUp('You', s));
}`;

export function HomeView({
  completedLessons,
  completedChallenges,
  lastLessonId,
  onStartLesson,
  onNavigate,
}: HomeViewProps) {
  const [heroCode, setHeroCode] = useState(HERO_STARTER_CODE);
  const [heroLogs, setHeroLogs] = useState<string[]>([
    'You → Stage 1: Novice',
    'You → Stage 2: Web Crafter',
    'You → Stage 3: JS Craftsman',
    'You → Stage 4: Architect',
    'You → Stage 5: Full-Stack',
    'You → Stage 6: Pro Engineer',
  ]);
  const [heroError, setHeroError] = useState<string | null>(null);
  const [heroRunning, setHeroRunning] = useState(false);

  const nextLesson =
    ALL_LESSONS.find((l) => l.id === lastLessonId && !completedLessons.includes(l.id)) ||
    ALL_LESSONS.find((l) => !completedLessons.includes(l.id)) ||
    ALL_LESSONS[0];

  const overallPercent = Math.round((completedLessons.length / ALL_LESSONS.length) * 100);

  const runHeroSnippet = async () => {
    setHeroRunning(true);
    setHeroError(null);
    const res = await runJavaScriptTests(heroCode, '');
    if (res.runtimeError) {
      setHeroError(res.runtimeError);
    } else {
      setHeroLogs(
        res.logs.length > 0
          ? res.logs.map((l) => l.message)
          : ['(No console.log output — try logging something!)']
      );
    }
    setHeroRunning(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:pt-12">
      {/* Hero Section */}
      <section className="grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>6 Stages · 24 Interactive Lessons · 10 Practice Drills</span>
          </div>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[var(--ink-primary)] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08]">
            Learn coding the clear way — all the way to{' '}
            <span className="text-emerald-600 dark:text-emerald-400">professional</span>.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-secondary)] sm:text-lg">
            Start with plain-English tutorials on variables and HTML, practice right inside your browser with instant automated tests, and graduate to Clean Code, Algorithms, REST Architecture, and Production Systems.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onStartLesson(nextLesson.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow-md"
            >
              {completedLessons.length > 0 ? 'Continue Learning' : 'Start Lesson 1 Free'}
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('curriculum')}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-3.5 text-sm font-bold text-[var(--ink-primary)] transition-colors hover:bg-[var(--bg-subtle)]"
            >
              <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Browse Full Roadmap
            </button>
          </div>

          {/* Learner Progress Strip */}
          <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div>
              <div className="text-xs font-semibold text-[var(--ink-muted)]">Lessons Mastered</div>
              <div className="mt-1 text-xl font-extrabold text-[var(--ink-primary)]">
                {completedLessons.length}
                <span className="text-sm font-semibold text-[var(--ink-muted)]">
                  /{ALL_LESSONS.length}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--ink-muted)]">Practice Solved</div>
              <div className="mt-1 text-xl font-extrabold text-[var(--ink-primary)]">
                {completedChallenges.length}
                <span className="text-sm font-semibold text-[var(--ink-muted)]">
                  /{PRACTICE_CHALLENGES.length}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--ink-muted)]">Pro Readiness</div>
              <div className="mt-1 text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {overallPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Hero Code Runner */}
        <div className="lg:col-span-6">
          <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[#11141b] shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0c0e13] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-2 font-mono text-xs text-slate-400">
                  try-crazina.js — Interactive Sandbox
                </span>
              </div>
              <button
                type="button"
                onClick={runHeroSnippet}
                disabled={heroRunning}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-emerald-500"
              >
                <Play className="h-3 w-3 fill-current" />
                {heroRunning ? 'Running...' : 'Run Live'}
              </button>
            </div>

            <textarea
              value={heroCode}
              onChange={(e) => setHeroCode(e.target.value)}
              spellCheck={false}
              aria-label="Interactive hero JavaScript editor"
              className="h-52 w-full resize-none bg-[#11141b] p-4 font-mono text-[13px] leading-relaxed text-slate-100 focus:outline-none"
            />

            <div className="border-t border-white/10 bg-[#0b0d12] px-4 py-3 font-mono text-xs">
              <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                Live Console Output
              </div>
              {heroError ? (
                <div className="text-rose-400">{heroError}</div>
              ) : (
                <div className="space-y-0.5 text-emerald-300">
                  {heroLogs.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Crazina Works */}
      <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: BookOpen,
            title: 'Zero-Jargon Tutorials',
            desc: 'Real-world analogies, Pitfall vs. Pro comparisons, and quick concept checks before you code.',
          },
          {
            icon: Code2,
            title: 'Instant Automated Labs',
            desc: 'Every lesson pairs with a live CodeMirror IDE, sandboxed test runner, and multi-step hints.',
          },
          {
            icon: Layers,
            title: 'Live HTML/CSS/DOM Studio',
            desc: 'Build visual web interfaces with real-time iframe preview and automated DOM & layout assertions.',
          },
          {
            icon: ShieldCheck,
            title: 'True Pro Standards',
            desc: 'Don’t stop at syntax — master Big-O, Security, SOLID, TDD, LRU Caching, and Rate Limiters.',
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition-colors hover:border-emerald-500/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-700 dark:text-emerald-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-[var(--ink-primary)]">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-secondary)]">
                {item.desc}
              </p>
            </div>
          );
        })}
      </section>

      {/* 6-Stage Career Path Roadmap */}
      <section className="mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Complete Zero-to-Pro Roadmap
            </span>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--ink-primary)] sm:text-3xl">
              Six structured stages to software mastery
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('curriculum')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-600 dark:text-emerald-400"
          >
            View all 24 lessons <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((stage) => {
            const lessons = getLessonsForStage(stage.id);
            const done = lessons.filter((l) => completedLessons.includes(l.id)).length;
            const pct = Math.round((done / lessons.length) * 100);
            const firstUnfinished =
              lessons.find((l) => !completedLessons.includes(l.id)) || lessons[0];

            return (
              <div
                key={stage.id}
                className="group flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition-all hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-subtle)] px-2.5 py-1 text-xs font-bold text-[var(--ink-secondary)]">
                      Stage {stage.id} · {stage.level}
                    </span>
                    {done === lessons.length ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" /> Mastered
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-[var(--ink-muted)]">
                        {done}/{lessons.length} lessons
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3.5 text-lg font-extrabold text-[var(--ink-primary)]">
                    {stage.title.replace(/^Stage \d+:\s*/, '')}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {stage.subtitle}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--ink-secondary)]">
                    {stage.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[var(--border-subtle)]">
                  <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onStartLesson(firstUnfinished.id)}
                    className="inline-flex w-full items-center justify-between rounded-xl bg-[var(--bg-subtle)] px-3.5 py-2.5 text-xs font-bold text-[var(--ink-primary)] transition-colors group-hover:bg-emerald-600 group-hover:text-white"
                  >
                    <span>{done > 0 && done < lessons.length ? 'Resume Stage' : done === lessons.length ? 'Review Stage' : 'Start Stage'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Strip: Practice Arena + Playground */}
      <section className="mt-16 grid gap-5 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-amber-500/12 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
              <Trophy className="h-3.5 w-3.5" /> Practice Arena
            </div>
            <h3 className="mt-3 text-xl font-extrabold text-[var(--ink-primary)]">
              Sharpen your skills with standalone coding drills
            </h3>
            <p className="mt-2 text-sm text-[var(--ink-secondary)]">
              From FizzBuzz and Palindromes to Debounce, EventEmitter, Deep Clone, and Async Concurrency Pools — every drill has instant unit tests.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--ink-primary)] px-4 py-2.5 text-xs font-bold text-[var(--bg-canvas)] transition-opacity hover:opacity-90"
          >
            Enter Practice Arena <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-sky-500/12 px-3 py-1 text-xs font-bold text-sky-700 dark:text-sky-300">
              <Cpu className="h-3.5 w-3.5" /> Open Playground & Pro Guide
            </div>
            <h3 className="mt-3 text-xl font-extrabold text-[var(--ink-primary)]">
              Experiment freely & use the Senior Cheat Sheets
            </h3>
            <p className="mt-2 text-sm text-[var(--ink-secondary)]">
              Prototype HTML/CSS/JS widgets or test algorithms freely in the Sandbox Playground, and bookmark the Big-O, SOLID, Security, and Git reference guides.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('playground')}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500"
            >
              <Rocket className="h-3.5 w-3.5" /> Open Playground
            </button>
            <button
              type="button"
              onClick={() => onNavigate('guide')}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] px-4 py-2.5 text-xs font-bold text-[var(--ink-primary)] hover:bg-[var(--bg-subtle)]"
            >
              Pro Guide & Career Map
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
