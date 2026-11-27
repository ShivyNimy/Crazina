import { STAGES } from './stages';
import { LESSONS_STAGE_1_TO_2 } from './lessonsStage1to2';
import { LESSONS_STAGE_3_TO_4 } from './lessonsStage3to4';
import { LESSONS_STAGE_5_TO_6 } from './lessonsStage5to6';
import type { Lesson, Stage } from '../types';

export { STAGES };

export const ALL_LESSONS: Lesson[] = [
  ...LESSONS_STAGE_1_TO_2,
  ...LESSONS_STAGE_3_TO_4,
  ...LESSONS_STAGE_5_TO_6,
].sort((a, b) => a.order - b.order);

export function getLessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getStageById(stageId: number): Stage | undefined {
  return STAGES.find((s) => s.id === stageId);
}

export function getLessonsForStage(stageId: number): Lesson[] {
  return ALL_LESSONS.filter((l) => l.stageId === stageId);
}

export function getAdjacentLessons(lessonId: string): { prev?: Lesson; next?: Lesson } {
  const index = ALL_LESSONS.findIndex((l) => l.id === lessonId);
  if (index === -1) return {};
  return {
    prev: index > 0 ? ALL_LESSONS[index - 1] : undefined,
    next: index < ALL_LESSONS.length - 1 ? ALL_LESSONS[index + 1] : undefined,
  };
}
