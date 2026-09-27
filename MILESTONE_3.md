# Milestone 3 — Account Settings

## Added
- Profile update endpoint: `PUT /api/auth/me`
- Password change endpoint: `PUT /api/auth/password`
- Settings page with profile editing
- Settings page with current/new/confirm password flow
- Server-side validation and duplicate-email protection
- Global user state updates immediately after profile save

## Test
1. Start backend and frontend.
2. Sign in.
3. Open `/settings`.
4. Change your name and save. The sidebar should update immediately.
5. Change your email to the same email and save; it should succeed.
6. Try another account's email; it should return `Email already registered`.
7. Change password using the correct current password.
8. Sign out and sign back in using the new password.
