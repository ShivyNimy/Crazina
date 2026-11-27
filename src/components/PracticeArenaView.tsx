import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Code2,
  Globe,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { PRACTICE_CHALLENGES } from '../data/practiceChallenges';
import { InteractiveLab } from './InteractiveLab';
import type { Difficulty, PracticeChallenge, WebStarterFiles } from '../types';

interface PracticeArenaViewProps {
  completedChallenges: string[];
  savedCode: Record<string, string | WebStarterFiles>;
  onSaveDraft: (key: string, val: string | WebStarterFiles) => void;
  onCompleteChallenge: (id: string) => void;
}

const LEVELS: ('All' | Difficulty)[] = [
  'All',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Professional',
];

function badgeStyle(level: Difficulty): string {
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

export function PracticeArenaView({
  completedChallenges,
  savedCode,
  onSaveDraft,
  onCompleteChallenge,
}: PracticeArenaViewProps) {
  const [selected, setSelected] = useState<PracticeChallenge | null>(null);
  const [filter, setFilter] = useState<'All' | Difficulty>('All');

  if (selected) {
    const idx = PRACTICE_CHALLENGES.findIndex((c) => c.id === selected.id);
    const nextChallenge = PRACTICE_CHALLENGES[idx + 1];

    return (
      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-4 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-2.5 py-1.5 text-xs font-bold text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All Challenges
            </button>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeStyle(
                selected.difficulty
              )}`}
            >
              {selected.difficulty}
            </span>
            <span className="text-sm font-extrabold text-[var(--ink-primary)]">
              {selected.title}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" /> +{selected.xp} XP
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          {/* Challenge Specification */}
          <div className="space-y-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 lg:col-span-4 lg:max-h-[calc(100vh-148px)] lg:overflow-y-auto">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {selected.category}
              </span>
              <h1 className="mt-1 text-2xl font-extrabold text-[var(--ink-primary)]">
                {selected.title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-secondary)]">
                {selected.prompt}
              </p>
            </div>

            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[var(--ink-muted)]">
                Examples
              </h2>
              <div className="mt-2 space-y-2.5">
                {selected.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 p-3 font-mono text-xs"
                  >
                    <div>
                      <span className="font-bold text-[var(--ink-muted)]">In: </span>
                      <span className="text-[var(--ink-primary)]">{ex.input}</span>
                    </div>
                    <div className="mt-1">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        Out:{' '}
                      </span>
                      <span className="text-[var(--ink-primary)]">{ex.output}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[var(--ink-muted)]">
                Requirements
              </h2>
              <ul className="mt-2 space-y-1.5">
                {selected.requirements.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs leading-relaxed text-[var(--ink-secondary)]"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Solver */}
          <div className="lg:col-span-8 lg:h-[calc(100vh-148px)]">
            <InteractiveLab
              labKey={selected.id}
              mode={selected.mode}
              title={selected.title}
              prompt={selected.summary}
              requirements={selected.requirements}
              starterCode={selected.starterCode}
              solutionCode={selected.solutionCode}
              starterFiles={selected.starterFiles}
              solutionFiles={selected.solutionFiles}
              testScript={selected.testScript}
              hints={selected.hints}
              savedDraft={savedCode[selected.id]}
              isCompleted={completedChallenges.includes(selected.id)}
              xpReward={selected.xp}
              onDraftChange={(val) => onSaveDraft(selected.id, val)}
              onPassAllTests={() => onCompleteChallenge(selected.id)}
              nextActionLabel={nextChallenge ? 'Next Challenge →' : 'Back to Arena'}
              onNextAction={() => setSelected(nextChallenge || null)}
            />
          </div>
        </div>
      </div>
    );
  }

  const visible = PRACTICE_CHALLENGES.filter(
    (c) => filter === 'All' || c.difficulty === filter
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Trophy className="h-3.5 w-3.5" /> Hands-On Coding Drills
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--ink-primary)]">
            Practice Arena
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--ink-secondary)]">
            Reading tutorials builds intuition; solving problems without hand-holding builds true mastery. Test yourself from beginner warm-ups up to senior interview & systems drills.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-right">
          <div className="text-xs font-semibold text-[var(--ink-muted)]">Challenges Solved</div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {completedChallenges.length} / {PRACTICE_CHALLENGES.length}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mt-6 flex flex-wrap gap-1.5">
        {LEVELS.map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setFilter(lvl)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
              filter === lvl
                ? 'bg-emerald-600 text-white'
                : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Challenge Cards */}
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((ch) => {
          const solved = completedChallenges.includes(ch.id);
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => setSelected(ch)}
              className="group flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeStyle(
                      ch.difficulty
                    )}`}
                  >
                    {ch.difficulty}
                  </span>
                  {solved ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" /> Solved
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-[var(--ink-muted)]">
                      {ch.category}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-base font-extrabold text-[var(--ink-primary)] group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                  {ch.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-secondary)]">
                  {ch.summary}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3.5 text-xs">
                <div className="flex items-center gap-3 font-semibold text-[var(--ink-muted)]">
                  <span className="inline-flex items-center gap-1">
                    {ch.mode === 'web' ? (
                      <Globe className="h-3.5 w-3.5" />
                    ) : (
                      <Code2 className="h-3.5 w-3.5" />
                    )}
                    {ch.mode === 'web' ? 'Web' : 'JS'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {ch.estimatedMinutes}m
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400">+{ch.xp} XP</span>
                </div>
                <span className="inline-flex items-center gap-1 font-bold text-[var(--ink-primary)] group-hover:text-emerald-600">
                  Solve <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
