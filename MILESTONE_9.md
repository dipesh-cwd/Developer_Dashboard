# Milestone 9 — GitHub Issues & Pull Requests

## Goal
Make the project workspace useful for real development by connecting GitHub work items to each project.

## Changes
- Extended the GitHub repository service to fetch recent open issues and pull requests.
- Kept repository, commit, star, fork, and open-item data in the existing project workspace flow.
- Fetches repository, commits, issues, and pull requests in parallel to reduce waiting time.
- Added an Open Issues section to the project workspace.
- Added an Open Pull Requests section to the project workspace.
- Kept all GitHub data read-only and public-repository based; no GitHub write actions were introduced.
- Preserved project ownership checks before GitHub data can be requested.

## Validation
Run:

```bash
npm install
npm run lint
npm run build
```

Then:

1. Start the backend and frontend.
2. Open a project that has a public GitHub URL.
3. Confirm repository statistics and recent commits still load.
4. Confirm Open Issues and Open Pull Requests appear when the repository has them.
5. Click an issue or pull request and verify it opens GitHub in a new tab.
6. Open a project without a GitHub URL and confirm the GitHub sections do not appear.
