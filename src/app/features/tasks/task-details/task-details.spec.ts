import { of, throwError } from 'rxjs';
import { Task } from '../../../models/task';
import { TaskApiService } from '../../../services/task-api-service';
import { TestBed } from '@angular/core/testing';
import { TaskDetails } from './task-details';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

const doneTask: Task = {
  id: 42,
  title: 'Finished task',
  description: 'Already completed',
  status: 'DONE',
  assignee: null,
};

const taskApiServiceMock = {
  getTaskById: vi.fn(),
  moveToNextStatus: vi.fn(),
};

let routeTaskId: string | null;

beforeEach(() => {
  vi.clearAllMocks();
  taskApiServiceMock.getTaskById.mockReturnValue(of(doneTask));
  routeTaskId = '42';

  TestBed.configureTestingModule({
    imports: [TaskDetails],
    providers: [
      { provide: TaskApiService, useValue: taskApiServiceMock },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: () => routeTaskId,
            },
          },
        },
      },
    ],
  });
});

describe('TaskDetails', () => {
  it('should create the component', () => {
    const fixture = TestBed.createComponent(TaskDetails);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should hide next status action for a completed task', () => {
    const fixture = TestBed.createComponent(TaskDetails);
    fixture.detectChanges();

    expect(taskApiServiceMock.getTaskById).toHaveBeenCalledWith(42);

    const nativeElement = fixture.nativeElement as HTMLElement;
    expect(nativeElement.textContent).toContain('Finished task');
    expect(nativeElement.textContent).toContain('DONE');
    expect(nativeElement.textContent).not.toContain('Next Status');
  });

  it('should show an error message when status update fails', () => {
    const todoTask: Task = {
      ...doneTask,
      status: 'TODO',
    };

    taskApiServiceMock.getTaskById.mockReturnValue(of(todoTask));
    taskApiServiceMock.moveToNextStatus.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 0,
            statusText: 'Network error',
          }),
      ),
    );

    const fixture = TestBed.createComponent(TaskDetails);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const nextStatusButton = nativeElement.querySelector(
      '.task-details-card__action',
    ) as HTMLButtonElement;

    nextStatusButton.click();
    fixture.detectChanges();

    expect(taskApiServiceMock.moveToNextStatus).toHaveBeenCalledWith(42);
    expect(nativeElement.textContent).toContain('Failed to update task status.');
  });

  it('should not request a task when route id is invalid', () => {
    routeTaskId = 'abc';

    const fixture = TestBed.createComponent(TaskDetails);
    fixture.detectChanges();

    expect(taskApiServiceMock.getTaskById).not.toHaveBeenCalled();

    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.textContent).toContain('Invalid task id.');
  });
});
