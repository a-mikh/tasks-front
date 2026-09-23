import { Routes } from '@angular/router';
import { TaskList } from './features/tasks/task-list/task-list.component';
import { TaskCreateComponent } from './features/tasks/task-create/task-create.component';
import { TaskDetailsComponent } from './features/tasks/task-details/task-details.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasks/new', component: TaskCreateComponent, canActivate: [authGuard] },
  { path: 'tasks/:taskId', component: TaskDetailsComponent, canActivate: [authGuard] },
  { path: '', component: TaskList, canActivate: [authGuard] },
];
