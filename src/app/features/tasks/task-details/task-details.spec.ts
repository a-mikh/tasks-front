import { of } from 'rxjs';
import { Task } from '../../../models/task';
import { TaskApiService } from '../../../services/task-api-service';
import { TestBed } from '@angular/core/testing';
import { TaskDetails } from './task-details';
import { ActivatedRoute } from '@angular/router';

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

beforeEach(() => {
  vi.clearAllMocks();
  taskApiServiceMock.getTaskById.mockReturnValue(of(doneTask));

  TestBed.configureTestingModule({
    imports: [TaskDetails],
    providers: [
      { provide: TaskApiService, useValue: taskApiServiceMock },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '42' } } } },
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
});
