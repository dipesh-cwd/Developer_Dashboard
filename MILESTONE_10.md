# Milestone 10 — Developer Activity Feed

## Goal
Turn the project and dashboard data into a useful timeline so the workspace shows what changed recently instead of only showing static totals and cards.

## Changes
- Added a reusable `ActivityFeed` component.
- Dashboard now shows a workspace activity timeline from project and task timestamps.
- Project workspace now combines task updates with GitHub commits, issues, and pull requests into one chronological activity feed.
- GitHub activity remains read-only and uses the existing Milestone 9 API data.
- Added relative timestamps such as `5m ago`, `2h ago`, and `3d ago`.
- Activity links open the relevant project or GitHub resource.
- No new database model or dependency was introduced.
- Existing project ownership and authentication flow remain unchanged.

## Validation
Run:

```bash
npm install
npm run lint
npm run build
```

Then:

1. Open `/dashboard` and confirm Activity feed appears.
2. Create or update a task and confirm it appears near the top after the query refreshes.
3. Open a project workspace.
4. Confirm Project activity combines task and GitHub activity when a public GitHub repository is connected.
5. Click a GitHub activity item and confirm it opens the correct GitHub page in a new tab.
6. Open a project without GitHub and confirm the activity feed still works using project tasks only.
