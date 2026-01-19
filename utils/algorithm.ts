
import { Subject, StudyTask, SubjectType } from '../types';

export const calculateDaysRemaining = (examDateStr: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = new Date(examDateStr);
  examDate.setHours(0, 0, 0, 0);
  const diffTime = examDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const generateSchedule = (
  subjects: Subject[],
  isPanicMode: boolean
): StudyTask[] => {
  const schedule: StudyTask[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  subjects.forEach((subject) => {
    const daysLeft = calculateDaysRemaining(subject.examDate);
    if (daysLeft <= 0) return;

    // Logic: 2 buffer days in normal mode, 0 in panic
    const bufferDays = isPanicMode ? 0 : 2;
    const studyDaysCount = Math.max(1, daysLeft - bufferDays);
    
    // Logic: 60% syllabus in panic mode
    const unitsToStudy = isPanicMode ? Math.ceil(subject.totalUnits * 0.6) : subject.totalUnits;
    const unitsPerDay = unitsToStudy / studyDaysCount;

    let unitsAssigned = 0;
    for (let i = 0; i < studyDaysCount; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      
      const unitsForThisDay = Math.min(
        Math.ceil(unitsPerDay),
        unitsToStudy - unitsAssigned
      );

      if (unitsForThisDay <= 0) break;

      for (let u = 0; u < unitsForThisDay; u++) {
        unitsAssigned++;
        schedule.push({
          id: `${subject.id}-unit-${unitsAssigned}-${i}`,
          subjectId: subject.id,
          subjectName: subject.name,
          unitNumber: unitsAssigned,
          date: currentDate.toISOString().split('T')[0],
          durationMinutes: getDurationByDifficulty(subject.difficulty, subject.subjectType),
          isPriority: isPanicMode,
          completed: false,
        });
        if (unitsAssigned >= unitsToStudy) break;
      }
      if (unitsAssigned >= unitsToStudy) break;
    }
  });

  return schedule;
};

const getDurationByDifficulty = (difficulty: number, type: SubjectType): number => {
  let base = 30 + (difficulty * 10);
  if (type === 'Engineering') base += 20; // Problem solving takes more time
  if (type === 'Medical') base += 15; // Memorization heavy
  return base;
};
