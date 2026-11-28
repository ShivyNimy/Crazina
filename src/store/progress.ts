import { useState, useEffect, useCallback, useMemo } from 'react';
import { ALL_LESSONS } from '../data/curriculum';
import { PRACTICE_CHALLENGES } from '../data/practiceChallenges';
import type { UserProgress, WebStarterFiles } from '../types';

const STORAGE_KEY = 'crazina_progress_v1';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: [],
  completedChallenges: [],
  completedQuizzes: [],
  savedCode: {},
  lastLessonId: undefined,
  streakDays: 1,
  lastActiveDate: todayKey(),
  theme: 'light',
};

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    const today = todayKey();
    let streakDays = parsed.streakDays ?? 1;
    if (parsed.lastActiveDate && parsed.lastActiveDate !== today) {
      const prev = new Date(parsed.lastActiveDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) streakDays += 1;
      else if (diffDays > 1) streakDays = 1;
    }
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      streakDays,
      lastActiveDate: today,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export interface RankInfo {
  title: string;
  minXp: number;
  nextXp: number | null;
  progressPercent: number;
}

const RANKS: { title: string; minXp: number }[] = [
  { title: 'Code Novice', minXp: 0 },
  { title: 'Apprentice Builder', minXp: 200 },
  { title: 'Web Developer', minXp: 600 },
  { title: 'Software Engineer', minXp: 1200 },
  { title: 'Senior Engineer', minXp: 2100 },
  { title: 'Principal Pro', minXp: 3200 },
];

export function computeRank(xp: number): RankInfo {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].minXp) idx = i;
  }
  const current = RANKS[idx];
  const next = RANKS[idx + 1] ?? null;
  const progressPercent = next
    ? Math.min(100, Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100))
    : 100;
  return {
    title: current.title,
    minXp: current.minXp,
    nextXp: next ? next.minXp : null,
    progressPercent,
  };
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore storage quota issues
    }
  }, [progress]);

  useEffect(() => {
    const root = document.documentElement;
    if (progress.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [progress.theme]);

  const markLessonComplete = useCallback((lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        lastLessonId: lessonId,
      };
    });
  }, []);

  const markChallengeComplete = useCallback((challengeId: string) => {
    setProgress((prev) => {
      if (prev.completedChallenges.includes(challengeId)) return prev;
      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId],
      };
    });
  }, []);

  const markQuizComplete = useCallback((lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedQuizzes.includes(lessonId)) return prev;
      return {
        ...prev,
        completedQuizzes: [...prev.completedQuizzes, lessonId],
      };
    });
  }, []);

  const setLastLesson = useCallback((lessonId: string) => {
    setProgress((prev) =>
      prev.lastLessonId === lessonId ? prev : { ...prev, lastLessonId: lessonId }
    );
  }, []);

  const saveDraft = useCallback((key: string, value: string | WebStarterFiles) => {
    setProgress((prev) => ({
      ...prev,
      savedCode: {
        ...prev.savedCode,
        [key]: value,
      },
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress((prev) => ({
      ...DEFAULT_PROGRESS,
      theme: prev.theme,
      lastActiveDate: todayKey(),
    }));
  }, []);

  const totalXp = useMemo(() => {
    const lessonXp = ALL_LESSONS.filter((l) => progress.completedLessons.includes(l.id)).reduce(
      (sum, l) => sum + l.xp,
      0
    );
    const challengeXp = PRACTICE_CHALLENGES.filter((c) =>
      progress.completedChallenges.includes(c.id)
    ).reduce((sum, c) => sum + c.xp, 0);
    const quizXp = progress.completedQuizzes.length * 15;
    return lessonXp + challengeXp + quizXp;
  }, [progress.completedLessons, progress.completedChallenges, progress.completedQuizzes]);

  const rank = useMemo(() => computeRank(totalXp), [totalXp]);

  return {
    progress,
    totalXp,
    rank,
    markLessonComplete,
    markChallengeComplete,
    markQuizComplete,
    setLastLesson,
    saveDraft,
    toggleTheme,
    resetProgress,
  };
}
