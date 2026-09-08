import { TaskStatus } from './task-status';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignee: string | null;
}
