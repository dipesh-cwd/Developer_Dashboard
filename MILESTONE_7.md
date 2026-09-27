# Milestone 7 — Project Workspace + Mongoose Warning Fix

## What changed

- Replaced deprecated Mongoose `new: true` options with `returnDocument: 'after'` in project, task, and profile update operations.
- Added `GET /api/projects/:id` with authenticated owner checks.
- Added a dedicated project details page at `/projects/:id`.
- Project details show task counts, completion progress, recent project tasks, and GitHub repository information.
- Added an `Open` action to project cards.
- Existing project/task/GitHub functionality remains available.

## Test

1. Run the backend and frontend.
2. Edit a project and confirm the backend no longer prints the Mongoose `new` deprecation warning.
3. Open Projects and click `Open`.
4. Confirm `/projects/<id>` loads only the logged-in user's project.
5. Confirm task counts and progress match the project's tasks.
6. If GitHub is connected, confirm repository data and recent commits appear.
7. Try a project ID belonging to another account; the API should return `404 Project not found`.

## Validation

Run locally:

```bash
npm install
npm run lint
npm run build
```

For the backend:

```bash
cd server
npm install
```
