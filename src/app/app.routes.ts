import { Routes } from '@angular/router';
import { TaskList } from './features/tasks/task-list/task-list';
import { TaskCreate } from './features/tasks/task-create/task-create';
import { TaskDetails } from './features/tasks/task-details/task-details';

export const routes: Routes = [
  { path: 'tasks/new', component: TaskCreate },
  { path: 'tasks/:taskId', component: TaskDetails },
  { path: '', component: TaskList },
];
