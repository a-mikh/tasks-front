import { TestBed } from '@angular/core/testing';
import { TaskApiService } from './task-api.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PageResponse } from '../models/page-response';
import { Task } from '../models/task';

describe('TaskApiService', () => {
  let service: TaskApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TaskApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request tasks filtered by status', () => {
    const page: PageResponse<Task> = {
      content: [
        {
          id: 1,
          title: 'Test Task',
          description: 'This is a test task',
          status: 'TODO',
          assignee: 'John Doe',
        },
      ],
      page: 0,
      size: 10,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
    };

    service.getTasks('TODO').subscribe((response) => {
      expect(response).toEqual(page);
    });

    const request = httpTestingController.expectOne((request) => request.url === '/tasks');

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('status')).toBe('TODO');

    request.flush(page);
  });

  it('should request tasks without status parameter when status is not provided', () => {
    const page: PageResponse<Task> = {
      content: [
        {
          id: 1,
          title: 'Test Task',
          description: 'This is a test task',
          status: 'TODO',
          assignee: 'John Doe',
        },
        {
          id: 2,
          title: 'Test Task 2',
          description: 'This is another test task',
          status: 'IN_PROGRESS',
          assignee: 'Jane Smith',
        },
        {
          id: 3,
          title: 'Test Task 3',
          description: 'This is a third test task',
          status: 'DONE',
          assignee: 'Bob Johnson',
        },
      ],
      page: 0,
      size: 10,
      totalElements: 3,
      totalPages: 1,
      first: true,
      last: true,
    };

    service.getTasks().subscribe((response) => {
      expect(response).toEqual(page);
    });

    const request = httpTestingController.expectOne((request) => request.url === '/tasks');

    expect(request.request.method).toBe('GET');
    expect(request.request.params.has('status')).toBe(false);

    request.flush(page);
  });
});
