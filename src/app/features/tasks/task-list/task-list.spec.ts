import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TaskApiService } from '../../../services/task-api.service';
import { TaskList } from './task-list.component';
import { of, Subject } from 'rxjs';
import { PageResponse } from '../../../models/page-response';
import { Task } from '../../../models/task';

const taskApiServiceMock = {
  getTasks: vi.fn(),
};

const emptyPage: PageResponse<Task> = {
  content: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};

const todoPage: PageResponse<Task> = {
  content: [
    {
      id: 1,
      title: 'Old TODO result',
      description: null,
      status: 'TODO',
      assignee: null,
    },
  ],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
  first: true,
  last: true,
};

const donePage: PageResponse<Task> = {
  content: [
    {
      id: 2,
      title: 'Latest DONE result',
      description: null,
      status: 'DONE',
      assignee: null,
    },
  ],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
  first: true,
  last: true,
};

const firstPage: PageResponse<Task> = {
  content: [
    {
      id: 1,
      title: 'First page task',
      description: null,
      status: 'TODO',
      assignee: null,
    },
  ],
  page: 0,
  size: 1,
  totalElements: 2,
  totalPages: 2,
  first: true,
  last: false,
};

const secondPage: PageResponse<Task> = {
  content: [
    {
      id: 2,
      title: 'Second page task',
      description: null,
      status: 'TODO',
      assignee: null,
    },
  ],
  page: 1,
  size: 1,
  totalElements: 2,
  totalPages: 2,
  first: false,
  last: true,
};

beforeEach(() => {
  vi.clearAllMocks();
  TestBed.configureTestingModule({
    imports: [TaskList],
    providers: [provideRouter([]), { provide: TaskApiService, useValue: taskApiServiceMock }],
  });
});

describe('TaskList', () => {
  it('should ignore a stale response after filter changes', () => {
    const todoRequest$ = new Subject<PageResponse<Task>>();
    const doneRequest$ = new Subject<PageResponse<Task>>();

    taskApiServiceMock.getTasks
      .mockReturnValueOnce(of(emptyPage))
      .mockReturnValueOnce(todoRequest$)
      .mockReturnValueOnce(doneRequest$);

    const fixture = TestBed.createComponent(TaskList);
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    const statusSelect = nativeElement.querySelector('#status-filter') as HTMLSelectElement;

    statusSelect.value = 'TODO';
    statusSelect.dispatchEvent(new Event('change'));

    statusSelect.value = 'DONE';
    statusSelect.dispatchEvent(new Event('change'));

    doneRequest$.next(donePage);
    doneRequest$.complete();
    fixture.detectChanges();

    expect(nativeElement.textContent).toContain('Latest DONE result');

    todoRequest$.next(todoPage);
    todoRequest$.complete();
    fixture.detectChanges();

    expect(nativeElement.textContent).toContain('Latest DONE result');
    expect(nativeElement.textContent).not.toContain('Old TODO result');
  });

  it('should move to the next and previous page', () => {
    taskApiServiceMock.getTasks
      .mockReturnValueOnce(of(firstPage))
      .mockReturnValueOnce(of(secondPage))
      .mockReturnValueOnce(of(firstPage));

    const fixture = TestBed.createComponent(TaskList);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const nextButton = nativeElement.querySelector('#pagination_next_button') as HTMLButtonElement;
    const previousButton = nativeElement.querySelector(
      '#pagination_previous_button',
    ) as HTMLButtonElement;

    nextButton.click();
    fixture.detectChanges();
    expect(taskApiServiceMock.getTasks).toHaveBeenLastCalledWith(undefined, 1, 10);
    expect(nativeElement.textContent).toContain('Second page task');
    expect(nativeElement.textContent).toContain('Page 2 of 2');
    expect(previousButton.disabled).toBe(false);
    const updatedNextButton = nativeElement.querySelector(
      '#pagination_next_button',
    ) as HTMLButtonElement;
    expect(updatedNextButton.disabled).toBe(true);

    previousButton.click();
    fixture.detectChanges();
    expect(taskApiServiceMock.getTasks).toHaveBeenLastCalledWith(undefined, 0, 10);
    expect(nativeElement.textContent).toContain('First page task');
    expect(nativeElement.textContent).toContain('Page 1 of 2');
    expect(nextButton.disabled).toBe(false);
    const updatedPreviousButton = nativeElement.querySelector(
      '#pagination_previous_button',
    ) as HTMLButtonElement;
    expect(updatedPreviousButton.disabled).toBe(true);
  });
});
