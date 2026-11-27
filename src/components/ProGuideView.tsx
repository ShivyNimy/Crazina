import { useState } from 'react';
import {
  Award,
  BookMarked,
  CheckCircle2,
  Circle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ALL_LESSONS, STAGES, getLessonsForStage } from '../data/curriculum';
import { CAREER_MILESTONES, PRO_GUIDES, type GuideCard } from '../data/proGuides';
import { PRACTICE_CHALLENGES } from '../data/practiceChallenges';
import type { RankInfo } from '../store/progress';

interface ProGuideViewProps {
  completedLessons: string[];
  completedChallenges: string[];
  totalXp: number;
  rank: RankInfo;
  onStartLesson: (lessonId: string) => void;
  onResetProgress: () => void;
}

const CATEGORIES: ('All' | GuideCard['category'])[] = [
  'All',
  'Algorithms',
  'Clean Code',
  'Backend & HTTP',
  'Security',
  'Git Workflow',
];

export function ProGuideView({
  completedLessons,
  completedChallenges,
  totalXp,
  rank,
  onStartLesson,
  onResetProgress,
}: ProGuideViewProps) {
  const [cat, setCat] = useState<'All' | GuideCard['category']>('All');
  const [confirmReset, setConfirmReset] = useState(false);

  const visibleGuides = PRO_GUIDES.filter(
    (g) => cat === 'All' || g.category === cat
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
      {/* Pro Readiness Banner */}
      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Award className="h-4 w-4" /> Career Progression & Pro Handbook
            </span>
            <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-[var(--ink-primary)]">
              Current Rank: {rank.title}
            </h1>
            <p className="mt-1.5 text-sm text-[var(--ink-secondary)]">
              You have earned <strong>{totalXp} XP</strong> across{' '}
              <strong>
                {completedLessons.length}/{ALL_LESSONS.length}
              </strong>{' '}
              lessons and{' '}
              <strong>
                {completedChallenges.length}/{PRACTICE_CHALLENGES.length}
              </strong>{' '}
              practice challenges.
            </p>
          </div>

          <div className="w-full max-w-xs">
            <div className="flex justify-between text-xs font-bold text-[var(--ink-secondary)]">
              <span>{rank.title}</span>
              <span>
                {rank.nextXp ? `${totalXp} / ${rank.nextXp} XP` : 'Max Rank Achieved!'}
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)]">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${rank.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Career Readiness Matrix */}
        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CAREER_MILESTONES.map((m) => {
            const stage = STAGES.find((s) => s.id === m.stageId)!;
            const lessons = getLessonsForStage(m.stageId);
            const done = lessons.filter((l) => completedLessons.includes(l.id)).length;
            const complete = done === lessons.length;
            const nextInStage =
              lessons.find((l) => !completedLessons.includes(l.id)) || lessons[0];

            return (
              <div
                key={m.stageId}
                className={`rounded-xl border p-4 ${
                  complete
                    ? 'border-emerald-500/40 bg-emerald-500/8'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--ink-muted)]">
                    Stage {m.stageId}
                  </span>
                  {complete ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" /> Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--ink-muted)]">
                      <Circle className="h-3.5 w-3.5" /> {done}/{lessons.length}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-base font-extrabold text-[var(--ink-primary)]">
                  {m.roleTitle}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--ink-secondary)]">
                  {m.outcome}
                </p>
                <div className="mt-3 rounded-lg bg-[var(--bg-surface)] px-3 py-2 text-[11px] text-[var(--ink-secondary)]">
                  <strong className="text-[var(--ink-primary)]">Portfolio Build: </strong>
                  {m.portfolioIdea}
                </div>
                {!complete && (
                  <button
                    type="button"
                    onClick={() => onStartLesson(nextInStage.id)}
                    className="mt-3 text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    Continue {stage.subtitle} →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Senior Reference Cheat Sheets */}
      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <BookMarked className="h-3.5 w-3.5" /> On-The-Job Reference
            </span>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--ink-primary)]">
              Professional Engineering Cheat Sheets
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  cat === c
                    ? 'bg-emerald-600 text-white'
                    : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {visibleGuides.map((guide) => (
            <div
              key={guide.id}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" /> {guide.category}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-extrabold text-[var(--ink-primary)]">
                {guide.title}
              </h3>
              <p className="mt-1 text-xs text-[var(--ink-secondary)]">{guide.summary}</p>

              <div className="mt-4 space-y-2.5">
                {guide.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/45 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[var(--ink-primary)]">
                        {item.label}
                      </span>
                      {item.code && (
                        <code className="rounded bg-[#11141b] px-2 py-0.5 font-mono text-[11px] text-emerald-300">
                          {item.code}
                        </code>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--ink-secondary)]">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Progress Management Footer */}
      <section className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-4">
        <div className="flex items-center gap-2 text-xs text-[var(--ink-secondary)]">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          Your progress, XP, and code drafts are saved automatically in your browser.
        </div>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--ink-muted)] hover:border-rose-500/50 hover:text-rose-600"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Progress
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              Clear all XP &amp; drafts?
            </span>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="rounded-md px-2.5 py-1 font-semibold text-[var(--ink-muted)] hover:bg-[var(--bg-subtle)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onResetProgress();
                setConfirmReset(false);
              }}
              className="rounded-md bg-rose-600 px-2.5 py-1 font-bold text-white hover:bg-rose-500"
            >
              Confirm Reset
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
