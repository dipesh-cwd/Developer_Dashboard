# Milestone 8 — Developer Analytics & Dashboard Intelligence

## Goal
Turn the dashboard into a useful workspace overview instead of a collection of CRUD screens.

## Changes
- Added an explicit **Open** button to project cards on `/projects`.
- Kept project task navigation as a separate **View project tasks** action.
- Added task completion percentage to the main dashboard.
- Added overdue-task count using `dueDate` and excluding completed tasks.
- Added per-project task progress based on completed tasks.
- Added a workload breakdown for todo, in-progress, and done tasks.
- Added a recent activity section based on task creation/update timestamps.
- Kept the existing account/project ownership model unchanged.
- No new backend analytics endpoint was added; milestone 8 derives analytics from existing project/task data.

## Validation
Run:

```bash
npm install
npm run lint
npm run build
```

Then start the backend and frontend normally and verify:

1. `/projects` shows **Open** on every project card.
2. Open navigates to `/projects/:id`.
3. View project tasks opens the filtered task view.
4. Dashboard shows project progress, completion rate, workload, overdue count, and recent activity.
