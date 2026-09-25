# E-Voting Frontend Baseline Report

Date: 2026-09-25
Scope: Angular frontend only. No backend files were inspected or modified.

## Toolchain

- Angular: 22.0.x (`@angular/core` `^22.0.0`, CLI/build `^22.0.6`)
- Node.js: v24.18.0
- npm: 12.0.2
- Package manager: npm
- TypeScript: ~6.0.2
- RxJS: ~7.8.0
- Architecture: standalone components with lazy-loaded route components
- Rendering: Angular SSR enabled through `@angular/ssr`

## Build Status

- `npm run build`: PASS
- Existing warnings: component CSS budgets exceed the 4 kB warning threshold in several legacy feature stylesheets. No build errors were reported.

## Test Status

- `npm test -- --watch=false --browsers=ChromeHeadless`: BLOCKED before test execution.
- Reason: the configured Angular Vitest runner requires a browser provider package (`@vitest/browser-playwright`, `@vitest/browser-webdriverio`, or `@vitest/browser-preview`), and none is installed.
- No test assertions were available from this run.

## Existing Routes

- Public: `/`, `/login`, `/register`, `/verify-otp`
- Voter: `/voter/dashboard`, `/voter/elections`, `/voter/elections/:id`, `/voter/candidates`, `/voter/vote/:electionId`, `/voter/vote-confirmation`, `/voter/vote-processing`, `/voter/vote-success`, `/voter/receipt`
- Party: `/party/dashboard`, `/party/candidates`, `/party/candidates/register`, `/party/manifesto`
- Officer: `/officer/dashboard`, `/officer/voters`, `/officer/candidates`, `/officer/booths`, `/officer/monitoring`
- Observer: `/observer/dashboard`, `/observer/turnout`, `/observer/results`, `/observer/audit`
- Super admin: `/admin/dashboard`, `/admin/users`, `/admin/elections`, `/admin/audit`, `/admin/reports`
- System admin: `/system/dashboard`, `/system/services`, `/system/kafka`, `/system/cassandra`
- Unknown paths redirect to `/`

Route guards currently applied:

- `authGuard`: voter, party, officer, and observer portal roots
- `adminGuard`: super-admin and system-admin portal roots

## Existing Core Services

- `AuthService`: identity state, login/registration/OTP demo flow, token and user persistence, logout, role switching
- `ElectionService`: election list/detail/status and admin CRUD operations
- `CandidateService`: candidate list/detail and admin/party operations
- `VotingService`: candidate selection, vote submission, read-only vote check, receipt cache/history
- `ResultService`: election results and winner retrieval
- `OfficerService`: officer mock data and booth/voter operations
- `AdminService`: admin mock users/audit operations
- `MonitoringService`: system monitoring mock data
- `ToastService`: user notifications

## API Contract Inventory

Base URL: `http://localhost:8080/api` in both environment files.

- `GET /voters/epic/{identifier}`: voter lookup used by `AuthService.login`; response is mapped to the frontend `User` model.
- `POST /voters/register`: voter registration payload contains `epicNumber`, `fullName`, `email`, `phone`, and `constituency`.
- `GET /elections`: list elections.
- `GET /elections/{id}`: retrieve one election.
- `GET /elections/status/{status}`: filter elections by status.
- `POST /elections`: create an election.
- `PUT /elections/{id}`: update an election.
- `PUT /elections/{id}/status?status={status}`: update election status.
- `DELETE /elections/{id}`: delete an election.
- `GET /candidates`: list candidates.
- `GET /candidates/election/{electionId}`: list candidates for an election.
- `GET /candidates/{id}`: retrieve one candidate.
- `POST /candidates`: create/register a candidate.
- `PUT /candidates/{id}`: update a candidate.
- `DELETE /candidates/{id}`: delete a candidate.
- `POST /votes/cast`: submit a vote. Backend errors are intentionally propagated; this contract is security-sensitive and must not be changed without approval.
- `GET /votes/check?electionId={id}&voterId={id}`: read-only vote status check.
- `GET /votes/election/{electionId}/count`: election vote count.
- `GET /results/election/{electionId}`: election result response.
- `GET /results/election/{electionId}/winner`: winner response.

## Authentication and Security-Sensitive Flow

- `AuthService` stores `evoting_token` and `evoting_user` in `localStorage`.
- `authInterceptor` attaches `Authorization: Bearer <token>` and logs out/navigates to login on HTTP 401.
- `authGuard` checks frontend authentication state for navigation.
- `adminGuard` checks frontend authentication state and admin role for navigation.
- Login, OTP, role switching, mock fallback identities, and token persistence are present in the current educational prototype.
- These behaviors are documented as existing behavior only. They are not being changed as part of the safe refactoring boundary.

## Voting Flow

1. `VotingScreenComponent` loads an election and candidates.
2. The UI checks election status and performs a read-only `hasVoted` check.
3. The voter selects a candidate and opens confirmation UI.
4. The frontend sends `POST /api/votes/cast` through `VotingService.castVote`.
5. Backend success returns a receipt; backend rejection is surfaced to the UI.
6. The frontend disables submission while pending, caches the returned receipt, and navigates to success/receipt UI.

The backend remains authoritative for eligibility, election state, duplicate voting, vote validation, recording, audit data, and result processing.

## Approval-Gated Findings

The following existing behaviors may warrant a later security/API review, but are not being modified by this baseline step:

- Demo role login and mock token generation exist in `AuthService`.
- OTP verification is implemented as a pilot/demo flow.
- Authentication and receipt data use browser storage.
- Several services use mock fallbacks when APIs fail.
- Some UI/demo data uses claims such as immutable ledgers or cryptographic verification that must not be presented as production guarantees without evidence.

Any change to these areas is `[APPROVAL REQUIRED]` under the project change-approval workflow.

## Worktree Note

Existing user changes, if any, are preserved. This baseline artifact does not alter application behavior.
