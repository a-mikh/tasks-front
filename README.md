# Task Manager Frontend

[![Frontend CI](https://github.com/a-mikh/tasks-front/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/a-mikh/tasks-front/actions/workflows/frontend-ci.yml)

## Overview

Task Manager Frontend is an Angular client for the [Tasks API](https://github.com/a-mikh/tasks). It provides registration and login, an authenticated shared task board, task creation and workflow updates, server-side filtering, and pagination.

The project focuses on practical client-server concerns: typed API contracts, guarded routes, functional HTTP interceptors, reactive forms, Signals, RxJS request handling, accessible responsive styling, and automated tests.

## Features

- Register a new user and display backend validation errors
- Sign in with username and password
- Store the JWT access token for the current browser-tab session
- Protect task routes with a functional route guard
- Add the bearer token to task requests through a functional HTTP interceptor
- Clear authentication state and redirect to login after an unauthorized response
- Log out manually from the application header
- View a shared, server-paginated task list
- Filter tasks by status on the server
- Create tasks with client-side and backend validation
- View task details and advance status through `TODO -> IN_PROGRESS -> DONE`
- Display loading, empty, success, validation, and error states
- Retry failed task-list requests
- Use the application with keyboard navigation and responsive layouts

## Tech Stack

- Angular 22 with standalone components
- TypeScript 6
- Angular Router
- Angular `HttpClient`
- Reactive Forms
- Signals and computed signals
- RxJS 7
- SCSS
- Vitest and Angular testing utilities
- GitHub Actions

## Architecture

The application uses a feature-oriented structure without a global state-management library.

```text
src/app/
├── features/
│   ├── auth/          registration and login pages
│   └── tasks/         task list, creation, and details pages
├── guards/            route-access decisions
├── interceptors/      bearer-token injection and 401 handling
├── models/            typed backend contracts
├── services/          API access and authentication state
├── app.config.ts      application providers
└── app.routes.ts      public and protected routes
```

Responsibilities are separated as follows:

- Components render UI state and handle user interaction.
- `AuthApiService` and `TaskApiService` encapsulate HTTP communication.
- `AuthStateService` keeps the access token synchronized with `sessionStorage` and exposes reactive authentication state.
- `authGuard` redirects unauthenticated navigation to the login page.
- `authInterceptor` adds the bearer token to `/tasks` requests and handles `401 Unauthorized` responses.
- TypeScript interfaces represent the backend request and response contracts.
- Signals store local UI state; RxJS coordinates HTTP requests, cancellation, errors, and finalization.
- Reactive Forms manage form state and validation.

## Authentication Flow

1. A user registers through `POST /auth/register`.
2. The user signs in through `POST /auth/login`.
3. The frontend stores the returned access token in `sessionStorage`.
4. The interceptor adds `Authorization: Bearer <access-token>` to task requests.
5. The backend validates the token for every protected request.
6. On logout, the frontend removes the token and navigates to login.
7. If the backend returns `401`, the frontend clears the token and redirects with a session-expired message.

The route guard checks whether a token exists locally. The backend remains the authority that validates its signature and expiration. The frontend does not currently decode the token or refresh it proactively.

Using `sessionStorage` keeps the token scoped to the browser tab and preserves it across page reloads in that tab. A production system with different security requirements could use a server-managed `HttpOnly` cookie instead.

## Routes

| Access        | Route            | Page                |
| ------------- | ---------------- | ------------------- |
| Public        | `/register`      | User registration   |
| Public        | `/login`         | User login          |
| Authenticated | `/`              | Paginated task list |
| Authenticated | `/tasks/new`     | Task creation       |
| Authenticated | `/tasks/:taskId` | Task details        |

## API Endpoints Used

| Method  | Endpoint                  | Purpose                              |
| ------- | ------------------------- | ------------------------------------ |
| `POST`  | `/auth/register`          | Register a user                      |
| `POST`  | `/auth/login`             | Receive a JWT access token           |
| `GET`   | `/tasks`                  | Retrieve, filter, and paginate tasks |
| `GET`   | `/tasks/{id}`             | Retrieve one task                    |
| `POST`  | `/tasks`                  | Create a task                        |
| `PATCH` | `/tasks/{id}/status/next` | Advance to the next task status      |

During local development, Angular forwards `/auth` and `/tasks` requests to `http://localhost:8080` through `proxy.conf.json`. This setup avoids separate CORS configuration for local development.

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
openssl rand -base64 32
```

Add database credentials and the generated JWT secret to `.env`:

```env
DB_USERNAME=tasks
DB_PASSWORD=change-me
JWT_SECRET_BASE64=generated-base64-value
```

Then start the backend:

```bash
docker compose up --build -d
```

The REST API is available at `http://localhost:8080`.

### 2. Start the frontend

In a separate terminal:

```bash
git clone https://github.com/a-mikh/tasks-front.git
cd tasks-front
npm ci
npm start
```

Open `http://localhost:4200`, register a user, and sign in.

To stop the backend containers, run this command from the backend repository:

```bash
docker compose down
```

## Tests

Run tests in watch mode during development:

```bash
npm test
```

Run the complete suite once:

```bash
npm test -- --watch=false
```

Tests cover API request contracts, authentication state, the route guard, bearer-token interception, logout and expired-session behavior, request cancellation, filtering, and pagination. HTTP service tests use `HttpTestingController`; component dependencies use controlled mocks.

## Production Build

```bash
npm run build
```

Production artifacts are written to the `dist/` directory.

## Continuous Integration

The `Frontend CI` GitHub Actions workflow runs for every pull request targeting `main`. It installs the locked dependency tree, runs the test suite once, and creates a production build.

## Current Scope

- The application is a shared board: authenticated users see the same tasks.
- The access token is stored in `sessionStorage` and removed on logout or a `401` response.
- Token expiration is handled reactively after the backend rejects a request.
- Refresh tokens, roles, and per-user task ownership are not implemented.
- Task assignment exists in the backend API but does not yet have a dedicated frontend control.

## Future Improvements

- Add task assignment controls and user selection
- Add per-user task views when the backend supports ownership
- Handle access-token expiration proactively and add refresh-token support if required by the backend
- Evaluate `HttpOnly` cookies and a Content Security Policy for a production deployment
- Add end-to-end tests for registration, login, expiration, and task workflows
- Add page-number navigation and configurable page size
