import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  HelpCircle,
  Lightbulb,
  Sparkles,
  ThumbsUp,
} from 'lucide-react';
import {
  ALL_LESSONS,
  getAdjacentLessons,
  getStageById,
} from '../data/curriculum';
import { InteractiveLab } from './InteractiveLab';
import type { Lesson, WebStarterFiles } from '../types';

interface LessonWorkspaceProps {
  lesson: Lesson;
  isCompleted: boolean;
  isQuizCompleted: boolean;
  savedDraft?: string | WebStarterFiles;
  onDraftChange: (value: string | WebStarterFiles) => void;
  onCompleteLesson: (lessonId: string) => void;
  onCompleteQuiz: (lessonId: string) => void;
  onSelectLesson: (lessonId: string) => void;
  onBackToCurriculum: () => void;
}

export function LessonWorkspace({
  lesson,
  isCompleted,
  isQuizCompleted,
  savedDraft,
  onDraftChange,
  onCompleteLesson,
  onCompleteQuiz,
  onSelectLesson,
  onBackToCurriculum,
}: LessonWorkspaceProps) {
  const stage = getStageById(lesson.stageId);
  const { prev, next } = getAdjacentLessons(lesson.id);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    setSelectedOption(isQuizCompleted ? lesson.quiz.correctIndex : null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lesson.id, isQuizCompleted, lesson.quiz.correctIndex]);

  const handleAnswerQuiz = (idx: number) => {
    setSelectedOption(idx);
    if (idx === lesson.quiz.correctIndex) {
      onCompleteQuiz(lesson.id);
    }
  };

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard?.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1600);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-4 sm:px-6">
      {/* Top Lesson Navigation Strip */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onBackToCurriculum}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-2.5 py-1.5 text-xs font-bold text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--ink-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Curriculum
          </button>

          {stage && (
            <span className="hidden rounded-full bg-emerald-500/12 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 sm:inline-block">
              Stage {stage.id}: {stage.subtitle}
            </span>
          )}

          <span className="text-xs font-semibold text-[var(--ink-muted)]">
            Lesson {lesson.order} of {ALL_LESSONS.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!prev}
            onClick={() => prev && onSelectLesson(prev.id)}
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-bold text-[var(--ink-secondary)] transition-colors hover:bg-[var(--bg-subtle)] disabled:opacity-40"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Prev
          </button>
          <button
            type="button"
            disabled={!next}
            onClick={() => next && onSelectLesson(next.id)}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-500 disabled:opacity-40"
          >
            Next <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Split-Screen Tutorial + Interactive Lab */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* LEFT: Tutorial Pane */}
        <article className="space-y-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-7 lg:col-span-5 lg:max-h-[calc(100vh-148px)] lg:overflow-y-auto">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--ink-muted)]">
              <span className="inline-flex items-center gap-1 rounded-md bg-[var(--bg-subtle)] px-2 py-0.5 font-bold text-[var(--ink-primary)]">
                {lesson.difficulty}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {lesson.durationMinutes} min
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" /> +{lesson.xp} XP
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--ink-primary)]">
              {lesson.title}
            </h1>
            <p className="mt-1.5 text-sm font-medium text-[var(--ink-secondary)]">
              {lesson.subtitle}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {lesson.concepts.map((c) => (
                <span
                  key={c}
                  className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/70 px-2 py-0.5 text-[11px] font-semibold text-[var(--ink-secondary)]"
                >
                  {c}
                </span>
              ))}
            </div>

            <p className="mt-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-500/8 px-4 py-3 text-sm leading-relaxed text-[var(--ink-primary)]">
              {lesson.summary}
            </p>
          </div>

          {/* Tutorial Sections */}
          <div className="space-y-6">
            {lesson.sections.map((sec, idx) => (
              <section key={idx} className="space-y-3">
                <h2 className="flex items-center gap-2 text-base font-extrabold text-[var(--ink-primary)]">
                  <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  {sec.heading}
                </h2>

                {sec.analogy && (
                  <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3 text-xs leading-relaxed text-[var(--ink-primary)]">
                    <span className="font-bold text-amber-800 dark:text-amber-300">
                      Mental Model:{' '}
                    </span>
                    {sec.analogy}
                  </div>
                )}

                {sec.paragraphs.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-sm leading-relaxed text-[var(--ink-secondary)]"
                  >
                    {p}
                  </p>
                ))}

                {sec.codeExample && (
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-[#11141b]">
                    <div className="flex items-center justify-between border-b border-white/10 bg-[#0c0e13] px-3.5 py-2 text-xs">
                      <span className="font-semibold text-slate-300">
                        {sec.codeExample.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(sec.codeExample!.code, idx)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] text-slate-400 hover:bg-white/10 hover:text-white"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="overflow-x-auto p-3.5 font-mono text-xs leading-relaxed text-emerald-100">
                      <code>{sec.codeExample.code}</code>
                    </pre>
                    {sec.codeExample.explanation && (
                      <div className="border-t border-white/10 bg-white/5 px-3.5 py-2 text-xs text-slate-300">
                        {sec.codeExample.explanation}
                      </div>
                    )}
                  </div>
                )}

                {sec.tip && (
                  <div className="flex items-start gap-2 rounded-xl border border-sky-500/25 bg-sky-500/8 px-3.5 py-2.5 text-xs text-[var(--ink-primary)]">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
                    <span>{sec.tip}</span>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Pitfall vs Pro Pattern */}
          {lesson.pitfall && (
            <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50 p-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4" />
                Pro Engineering Standard: {lesson.pitfall.title}
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="overflow-hidden rounded-xl border border-rose-500/30 bg-[#151218]">
                  <div className="bg-rose-500/20 px-3 py-1.5 text-[11px] font-bold text-rose-300">
                    Avoid: {lesson.pitfall.badTitle}
                  </div>
                  <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed text-rose-100">
                    <code>{lesson.pitfall.badCode}</code>
                  </pre>
                </div>
                <div className="overflow-hidden rounded-xl border border-emerald-500/30 bg-[#101816]">
                  <div className="bg-emerald-500/20 px-3 py-1.5 text-[11px] font-bold text-emerald-300">
                    Pro: {lesson.pitfall.goodTitle}
                  </div>
                  <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed text-emerald-100">
                    <code>{lesson.pitfall.goodCode}</code>
                  </pre>
                </div>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-[var(--ink-secondary)]">
                <strong className="text-[var(--ink-primary)]">Why: </strong>
                {lesson.pitfall.why}
              </p>
            </section>
          )}

          {/* Key Takeaways */}
          <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 p-4">
            <h3 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--ink-primary)]">
              <ThumbsUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Key Takeaways
            </h3>
            <ul className="mt-2.5 space-y-1.5">
              {lesson.keyTakeaways.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs leading-relaxed text-[var(--ink-secondary)]"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Interactive Knowledge Check Quiz */}
          <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <HelpCircle className="h-4 w-4" />
                Quick Knowledge Check (+15 XP)
              </h3>
              {isQuizCompleted && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Answered
                </span>
              )}
            </div>

            <p className="mt-2.5 text-sm font-bold text-[var(--ink-primary)]">
              {lesson.quiz.question}
            </p>

            <div className="mt-3 space-y-2">
              {lesson.quiz.options.map((opt, idx) => {
                const picked = selectedOption === idx;
                const isCorrect = idx === lesson.quiz.correctIndex;
                let style =
                  'border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50 hover:border-emerald-500/50 text-[var(--ink-primary)]';
                if (selectedOption !== null) {
                  if (picked && isCorrect) {
                    style =
                      'border-emerald-500 bg-emerald-500/15 text-emerald-900 dark:text-emerald-200';
                  } else if (picked && !isCorrect) {
                    style =
                      'border-rose-500 bg-rose-500/12 text-rose-900 dark:text-rose-200';
                  }
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAnswerQuiz(idx)}
                    className={`flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition-colors ${style}`}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-current/25 font-mono text-[10px]">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div
                className={`mt-3 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  selectedOption === lesson.quiz.correctIndex
                    ? 'bg-emerald-500/12 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-500/10 text-rose-900 dark:text-rose-200'
                }`}
              >
                <strong>
                  {selectedOption === lesson.quiz.correctIndex
                    ? 'Spot on! '
                    : 'Not quite — try again: '}
                </strong>
                {lesson.quiz.explanation}
              </div>
            )}
          </section>
        </article>

        {/* RIGHT: Interactive Coding Lab */}
        <div className="lg:col-span-7 lg:h-[calc(100vh-148px)]">
          <InteractiveLab
            labKey={lesson.id}
            mode={lesson.mode}
            title={lesson.lab.title}
            prompt={lesson.lab.prompt}
            requirements={lesson.lab.requirements}
            starterCode={lesson.lab.starterCode}
            solutionCode={lesson.lab.solutionCode}
            starterFiles={lesson.lab.starterFiles}
            solutionFiles={lesson.lab.solutionFiles}
            testScript={lesson.lab.testScript}
            hints={lesson.lab.hints}
            savedDraft={savedDraft}
            isCompleted={isCompleted}
            xpReward={lesson.xp}
            onDraftChange={onDraftChange}
            onPassAllTests={() => onCompleteLesson(lesson.id)}
            nextActionLabel={next ? `Next: ${next.title.slice(0, 26)} →` : 'View Pro Guide →'}
            onNextAction={() => {
              if (next) onSelectLesson(next.id);
              else onBackToCurriculum();
            }}
          />
        </div>
      </div>
    </div>
  );
}
