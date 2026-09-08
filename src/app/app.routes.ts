import { Routes } from '@angular/router';
import { TaskList } from './features/tasks/task-list/task-list';
import { TaskCreate } from './features/tasks/task-create/task-create';

export const routes: Routes = [
  { path: 'tasks/new', component: TaskCreate },
  { path: '', component: TaskList },
];
