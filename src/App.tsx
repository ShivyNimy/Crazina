import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { CurriculumView } from './components/CurriculumView';
import { LessonWorkspace } from './components/LessonWorkspace';
import { PracticeArenaView } from './components/PracticeArenaView';
import { PlaygroundView } from './components/PlaygroundView';
import { ProGuideView } from './components/ProGuideView';
import { ALL_LESSONS, getLessonById } from './data/curriculum';
import { useProgress } from './store/progress';
import type { ViewRoute } from './types';

export function App() {
  const {
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
  } = useProgress();

  const [route, setRoute] = useState<ViewRoute>('home');
  const [activeLessonId, setActiveLessonId] = useState<string>(
    progress.lastLessonId || ALL_LESSONS[0].id
  );

  const openLesson = useCallback(
    (lessonId: string) => {
      setActiveLessonId(lessonId);
      setLastLesson(lessonId);
      setRoute('lesson');
    },
    [setLastLesson]
  );

  const handleNavigate = useCallback((nextRoute: ViewRoute) => {
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const activeLesson = getLessonById(activeLessonId) || ALL_LESSONS[0];

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--ink-primary)] transition-colors duration-200">
      <Header
        route={route}
        onNavigate={handleNavigate}
        totalXp={totalXp}
        rank={rank}
        streakDays={progress.streakDays}
        theme={progress.theme}
        onToggleTheme={toggleTheme}
        completedCount={progress.completedLessons.length}
        totalLessons={ALL_LESSONS.length}
      />

      <main>
        {route === 'home' && (
          <HomeView
            completedLessons={progress.completedLessons}
            completedChallenges={progress.completedChallenges}
            lastLessonId={progress.lastLessonId}
            totalXp={totalXp}
            onStartLesson={openLesson}
            onNavigate={handleNavigate}
          />
        )}

        {route === 'curriculum' && (
          <CurriculumView
            completedLessons={progress.completedLessons}
            onStartLesson={openLesson}
          />
        )}

        {route === 'lesson' && (
          <LessonWorkspace
            lesson={activeLesson}
            isCompleted={progress.completedLessons.includes(activeLesson.id)}
            isQuizCompleted={progress.completedQuizzes.includes(activeLesson.id)}
            savedDraft={progress.savedCode[activeLesson.id]}
            onDraftChange={(val) => saveDraft(activeLesson.id, val)}
            onCompleteLesson={markLessonComplete}
            onCompleteQuiz={markQuizComplete}
            onSelectLesson={openLesson}
            onBackToCurriculum={() => handleNavigate('curriculum')}
          />
        )}

        {route === 'practice' && (
          <PracticeArenaView
            completedChallenges={progress.completedChallenges}
            savedCode={progress.savedCode}
            onSaveDraft={saveDraft}
            onCompleteChallenge={markChallengeComplete}
          />
        )}

        {route === 'playground' && <PlaygroundView />}

        {route === 'guide' && (
          <ProGuideView
            completedLessons={progress.completedLessons}
            completedChallenges={progress.completedChallenges}
            totalXp={totalXp}
            rank={rank}
            onStartLesson={openLesson}
            onResetProgress={resetProgress}
          />
        )}
      </main>
    </div>
  );
}

export default App;
