# Milestone 4 — Task Workflow

## What changed

- Added task summary cards: Total, Todo, In progress, Done, Overdue.
- Added task search across title and description.
- Added status filter.
- Added priority filter.
- Added overdue highlighting for unfinished tasks.
- Added one-click task workflow buttons:
  - Todo -> Start -> In progress
  - In progress -> Complete -> Done
  - Done -> Reopen -> Todo
- Quick status changes use the existing authenticated PATCH `/api/tasks/:id` endpoint.
- Kept create, edit, and delete behavior intact.

## Test checklist

1. Login and open `/tasks`.
2. Create tasks with different priorities and due dates.
3. Search by task title or description.
4. Filter by status.
5. Filter by priority.
6. Create an unfinished task with a past due date and verify it is marked Overdue.
7. Click Start on a Todo task; verify it becomes In progress.
8. Click Complete; verify it becomes Done.
9. Click Reopen; verify it becomes Todo.
10. Refresh the page and verify the task state remains correct.
11. Delete a task and verify the list refreshes.
12. Open `/dashboard` and verify task statistics still load.

## Validation note

The source was checked and backend JavaScript files pass Node syntax checks. A full frontend dependency installation/build could not be completed in the packaging environment because the npm installation timed out. Run `npm install`, `npm run build`, and `npm run lint` locally before committing.
