# Task Manager Frontend

[![Frontend CI](https://github.com/a-mikh/tasks-front/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/a-mikh/tasks-front/actions/workflows/frontend-ci.yml)

An Angular frontend for a task management application backed by a separate Spring Boot REST API.

The project focuses on practical frontend concerns for a client-server application: typed API contracts, routing, reactive forms, local UI state, HTTP error handling, responsive styling and automated tests.

Backend repository: [a-mikh/tasks](https://github.com/a-mikh/tasks)

## Features

- View tasks returned by the backend's paginated endpoint
- Filter tasks by status on the server
- Create tasks with client-side and backend validation
- View task details
- Advance a task through `TODO -> IN_PROGRESS -> DONE`
- Display loading, empty and error states
- Retry failed requests
- Responsive and keyboard-accessible interface

## Tech Stack

- Angular 22 with standalone components
- TypeScript 6
- Angular Router
- Angular `HttpClient`
- Reactive Forms
- Signals and computed signals
- RxJS
- SCSS
- Vitest and Angular testing utilities
- GitHub Actions

## Architecture

The application uses a small feature-oriented structure without a global state-management library.

```text
src/app/
├── features/tasks/   task list, creation and details pages
├── models/           typed API request and response models
├── services/         communication with the REST API
├── app.config.ts     application providers
└── app.routes.ts     route configuration
```

Responsibilities are separated as follows:

- Components render UI state and handle user interaction.
- `TaskApiService` encapsulates HTTP communication.
- TypeScript interfaces and types represent the backend contract.
- Signals store local component state such as tasks, loading and errors.
- RxJS handles asynchronous HTTP responses and request finalization.
- Reactive Forms manage form state and validation.

## API Endpoints Used

| Method  | Endpoint                  | Purpose                         |
| ------- | ------------------------- | ------------------------------- |
| `GET`   | `/tasks`                  | Retrieve and filter tasks       |
| `GET`   | `/tasks/{id}`             | Retrieve one task               |
| `POST`  | `/tasks`                  | Create a task                   |
| `PATCH` | `/tasks/{id}/status/next` | Advance to the next task status |

During local development, Angular forwards `/tasks` and `/users` requests to `http://localhost:8080` through the development proxy configured in `proxy.conf.json`. This avoids requiring CORS configuration for the local setup.

## Running the Full Application

### Prerequisites

- Node.js 24
- npm 11
- Docker with Docker Compose
- Git

### 1. Start the backend

```bash
git clone https://github.com/a-mikh/tasks.git
cd tasks
cp .env.example .env
docker compose up --build -d
```

The REST API will be available at `http://localhost:8080`.

### 2. Start the frontend

In a separate terminal:

```bash
git clone https://github.com/a-mikh/tasks-front.git
cd tasks-front
npm ci
npm start
```

Open `http://localhost:4200` in a browser.

To stop the backend containers:

```bash
docker compose down
```

Run this command from the backend repository directory.

## Tests

Run tests in watch mode during development:

```bash
npm test
```

Run the complete test suite once:

```bash
npm test -- --watch=false
```

The tests cover HTTP request contracts and important component behavior. HTTP service tests use `HttpTestingController`; component dependencies are replaced with controlled mocks.

## Production Build

```bash
npm run build
```

The production artifacts are written to the `dist/` directory.

## Continuous Integration

The `Frontend CI` GitHub Actions workflow runs for every pull request targeting `main`. It:

1. installs the locked dependency tree with `npm ci`;
2. runs the test suite once;
3. creates a production build.

## Current Scope

Authentication is not used because it is not part of the backend application. The backend also supports user creation, task assignment and pagination parameters; corresponding assignment and pagination controls are outside the current frontend scope.
