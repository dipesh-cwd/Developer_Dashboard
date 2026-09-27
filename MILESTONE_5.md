# Milestone 5 — Project ↔ Task Workspaces

## What changed

- Tasks can now belong to a project.
- Existing tasks remain valid and can stay unassigned.
- Task queries support `?projectId=<id>`.
- The backend verifies that the selected project belongs to the authenticated user.
- Projects page shows the number of connected tasks.
- Each project has an `Open workspace →` action.
- Project workspace is available at `/tasks?projectId=<projectId>`.
- Creating a task inside a project workspace automatically selects that project.
- Task cards show the connected project when available.
- Deleting a project automatically unassigns its tasks instead of leaving dangling project references.

## Important API changes

### GET `/api/tasks`

Returns all tasks for the authenticated user.

### GET `/api/tasks?projectId=<projectId>`

Returns only tasks belonging to the authenticated user's project.

### POST `/api/tasks`

The optional `project` field can contain a project ID. The backend verifies ownership.

### PATCH `/api/tasks/:id`

The optional `project` field can change the task's project, with the same ownership check.

## Test checklist

1. Login.
2. Open Projects.
3. Create or select a project.
4. Click `Open workspace →`.
5. Confirm only that project's tasks are shown.
6. Create a task there and confirm the project is automatically selected.
7. Return to Projects and confirm the task count increased.
8. Open Tasks without a project filter and confirm the task is still present.
9. Edit the task and move it to another project.
10. Open both project workspaces and verify the task moved.
11. Delete a project and verify its tasks remain but become unassigned.
12. Login as a different user and confirm their projects/tasks remain isolated.

## Existing data

No database migration is required. The new `project` field is optional, so existing task documents continue to work.
