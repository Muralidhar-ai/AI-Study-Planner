
export type SubjectType = 'Engineering' | 'Arts' | 'Medical' | 'General';

export interface Subject {
  id: string;
  name: string;
  totalUnits: number;
  examDate: string;
  subjectType: SubjectType;
  difficulty: number;
  completedUnits: number;
}

export interface StudyTask {
  id: string;
  subjectId: string;
  subjectName: string;
  unitNumber: number;
  date: string;
  durationMinutes: number;
  isPriority: boolean;
  completed: boolean;
}

export type ViewType = 'dashboard' | 'calendar' | 'wizard' | 'settings';

export interface PlannerState {
  subjects: Subject[];
  isPanicMode: boolean;
  isDarkMode: boolean;
}
