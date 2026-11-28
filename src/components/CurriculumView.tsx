import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Code2,
  Globe,
  Search,
  Sparkles,
  Target,
} from 'lucide-react';
import { ALL_LESSONS, STAGES, getLessonsForStage } from '../data/curriculum';
import type { Difficulty } from '../types';

interface CurriculumViewProps {
  completedLessons: string[];
  onStartLesson: (lessonId: string) => void;
}

const DIFFICULTIES: ('All' | Difficulty)[] = [
  'All',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Professional',
];

function difficultyBadge(level: Difficulty): string {
  switch (level) {
    case 'Beginner':
      return 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300';
    case 'Intermediate':
      return 'bg-amber-500/12 text-amber-700 dark:text-amber-300';
    case 'Advanced':
      return 'bg-indigo-500/12 text-indigo-700 dark:text-indigo-300';
    case 'Professional':
      return 'bg-rose-500/12 text-rose-700 dark:text-rose-300';
  }
}

export function CurriculumView({
  completedLessons,
  onStartLesson,
}: CurriculumViewProps) {
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | Difficulty>('All');
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Structured Academy Curriculum
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--ink-primary)]">
            From First Variable to Production Engineer
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--ink-secondary)]">
            Follow the 6 stages in order for the smoothest beginner-to-pro journey, or jump straight into any topic you want to master.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-right">
          <div className="text-xs font-semibold text-[var(--ink-muted)]">Overall Mastery</div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {completedLessons.length} / {ALL_LESSONS.length} Lessons
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {DIFFICULTIES.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setDifficultyFilter(lvl)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                difficultyFilter === lvl
                  ? 'bg-emerald-600 text-white'
                  : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics (e.g. Flexbox, Async, LRU)..."
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-2 pl-9 pr-3 text-xs text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Stages & Lesson Lists */}
      <div className="mt-8 space-y-8">
        {STAGES.map((stage) => {
          const allStageLessons = getLessonsForStage(stage.id);
          const filtered = allStageLessons.filter((lesson) => {
            const matchesDiff =
              difficultyFilter === 'All' || lesson.difficulty === difficultyFilter;
            const matchesSearch =
              !query ||
              lesson.title.toLowerCase().includes(query) ||
              lesson.subtitle.toLowerCase().includes(query) ||
              lesson.concepts.some((c) => c.toLowerCase().includes(query));
            return matchesDiff && matchesSearch;
          });

          if (filtered.length === 0) return null;

          const doneCount = allStageLessons.filter((l) =>
            completedLessons.includes(l.id)
          ).length;
          const pct = Math.round((doneCount / allStageLessons.length) * 100);

          return (
            <section
              key={stage.id}
              className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]"
            >
              {/* Stage Banner */}
              <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${difficultyBadge(
                          stage.level
                        )}`}
                      >
                        {stage.level}
                      </span>
                      <span className="text-xs font-semibold text-[var(--ink-muted)]">
                        {doneCount}/{allStageLessons.length} lessons completed ({pct}%)
                      </span>
                    </div>
                    <h2 className="mt-2 text-xl font-extrabold text-[var(--ink-primary)]">
                      {stage.title}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--ink-secondary)]">
                      {stage.description}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-3.5 py-2.5 text-xs max-w-xs">
                    <Target className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">
                        Stage Outcome:
                      </span>{' '}
                      <span className="text-[var(--ink-secondary)]">{stage.milestone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Lessons Grid */}
              <div className="divide-y divide-[var(--border-subtle)]">
                {filtered.map((lesson) => {
                  const completed = completedLessons.includes(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => onStartLesson(lesson.id)}
                      className="group flex w-full flex-col justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--bg-subtle)]/50 sm:flex-row sm:items-center sm:px-6"
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${
                            completed
                              ? 'bg-emerald-600 text-white'
                              : 'border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--ink-secondary)] group-hover:border-emerald-500 group-hover:text-emerald-600'
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            String(lesson.order).padStart(2, '0')
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-[var(--ink-primary)] group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                              {lesson.title}
                            </h3>
                            <span className="inline-flex items-center gap-1 rounded-md bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--ink-muted)]">
                              {lesson.mode === 'web' ? (
                                <>
                                  <Globe className="h-3 w-3" /> HTML/CSS/DOM
                                </>
                              ) : (
                                <>
                                  <Code2 className="h-3 w-3" /> JavaScript
                                </>
                              )}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-[var(--ink-secondary)]">
                            {lesson.subtitle}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {lesson.concepts.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md border border-[var(--border-subtle)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink-muted)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-4 pl-11 sm:pl-0">
                        <div className="flex items-center gap-3 text-xs font-semibold text-[var(--ink-muted)]">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {lesson.durationMinutes}m
                          </span>
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                            <Sparkles className="h-3.5 w-3.5" />+{lesson.xp} XP
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-bold text-[var(--ink-primary)] transition-colors group-hover:border-emerald-600 group-hover:bg-emerald-600 group-hover:text-white">
                          {completed ? 'Review' : 'Start'}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
