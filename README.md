# Developer Dashboard

A full-stack developer workspace built with React, Tailwind CSS, React Query, Express, MongoDB, and JWT authentication.

## Current modules

- Authentication with access/refresh tokens
- Protected application routes
- Dashboard overview
- Projects CRUD with per-user ownership
- Tasks CRUD with status, priority, and due dates
- React Query server-state management
- Responsive dashboard layout

## Development

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
cd server
npm install
npm run dev
```

Create `server/.env` from `server/.env.example` before starting the backend.

## Architecture direction

The app is being built feature-by-feature. Each major feature should have its own backend API, service layer, React Query integration, page, and reusable UI components.
