export type Priority = 'low' | 'mid' | 'high';

export interface Habit {
  id: string;
  title: string;
  priority: Priority;
  createdAt: string;
  lastDoneAt: string | null;
  streak: number;
}