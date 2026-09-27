# Milestone 6 — GitHub Repository Integration

## What changed

- Projects can store an optional public GitHub repository URL.
- Backend verifies that the project belongs to the authenticated user before reading GitHub data.
- Added `GET /api/projects/:id/github`.
- Backend fetches public repository metadata from GitHub's API using the server, not the browser.
- Project page shows repository name, default branch, stars, forks, open issues, language, and recent commits.
- GitHub data is cached client-side for 5 minutes and can be refreshed manually.
- Invalid/private/missing repositories show a clear error and Retry action.
- Existing projects without GitHub URLs continue to work normally.

## Test

1. Open Projects.
2. Edit or create a project.
3. Add a public GitHub repository URL such as `https://github.com/facebook/react`.
4. Save.
5. Confirm repository metadata appears.
6. Click the repository name and verify it opens GitHub in a new tab.
7. Click Refresh and confirm data reloads.
8. Try an invalid repository URL and confirm the error + Retry UI.
9. Logout/login with another account and verify the project is not visible.
10. Run `npm run lint` and `npm run build`.

## API

`GET /api/projects/:id/github`

Requires the normal Bearer access token. The endpoint only reads a project's GitHub URL after confirming ownership.
