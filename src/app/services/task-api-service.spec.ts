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
      page: 2,
      size: 6,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
    };
    const requestedPage = 2;
    const requestedSize = 6;

    service.getTasks('TODO', requestedPage, requestedSize).subscribe((response) => {
      expect(response).toEqual(page);
      expect(response.page).toEqual(requestedPage);
      expect(response.size).toEqual(requestedSize);
    });

    const request = httpTestingController.expectOne((request) => request.url === '/tasks');

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('status')).toBe('TODO');
    expect(request.request.params.get('page')).toBe(String(requestedPage));
    expect(request.request.params.get('size')).toBe(String(requestedSize));

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
      size: 20,
      totalElements: 3,
      totalPages: 1,
      first: true,
      last: true,
    };
    const defaultPage = 0;
    const defaultSize = 20;

    service.getTasks().subscribe((response) => {
      expect(response).toEqual(page);
      expect(response.page).toEqual(defaultPage);
      expect(response.size).toEqual(defaultSize);
    });

    const request = httpTestingController.expectOne((request) => request.url === '/tasks');

    expect(request.request.method).toBe('GET');
    expect(request.request.params.has('status')).toBe(false);
    expect(request.request.params.get('page')).toBe(String(defaultPage));
    expect(request.request.params.get('size')).toBe(String(defaultSize));

    request.flush(page);
  });
});
