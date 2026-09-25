# Angular Refactoring Plan

Status: Planning complete; implementation is approval-gated by change level.

## Boundary

The objective is to improve maintainability while preserving current behavior and API contracts. No backend business rules, authentication behavior, authorization behavior, election rules, vote processing, result calculation, audit handling, or token handling will be changed without explicit approval.

## Phases

### Phase 1: Shared UI and layout review `[SAFE]`

- Inventory existing shared components and duplicate presentation patterns.
- Extract only clearly reusable, presentational UI with unchanged inputs, outputs, selectors, routes, and service calls.
- Add or strengthen focused component tests.
- Verify with the narrowest available test/build command after each slice.

### Phase 2: Feature presentation review `[SAFE]` / `[REVIEW REQUIRED]`

- Refine one feature at a time: public pages, voter presentation, election presentation, candidate presentation, results presentation, and administrative presentation.
- Preserve existing services and route paths.
- Any change to forms, shared components, or state ownership is `[REVIEW REQUIRED]` before implementation.

### Phase 3: API/service boundaries `[REVIEW REQUIRED]`

- Document service responsibilities and existing contracts.
- Refactor only internal duplication when HTTP methods, URLs, payloads, response mapping, fallback behavior, and error propagation remain unchanged.
- Any service responsibility change requires a proposal and rollback plan.

### Phase 4: Security and voting paths `[APPROVAL REQUIRED]`

- Do not modify `AuthService`, `auth.guard.ts`, `auth.interceptor.ts`, login/OTP/token handling, election-state checks, `VotingService`, vote confirmation/submission, result calculation, or audit behavior without explicit approval.
- If a change is later approved, capture current behavior, define rollback, make the smallest edit, compile, run relevant tests, and verify protected routes and duplicate-submission handling.

### Phase 5: Documentation and validation

- Generate viva documentation from the actual implementation only.
- Do not claim production-election security, anonymity, tamper-proofing, blockchain, or cryptographic guarantees that are not independently implemented and validated.
- Re-run build and available tests, then produce a final change audit.

## First Implementation Proposal

Change: review and, if needed, extract one presentational shared UI slice with behavior-preserving inputs/outputs.

Reason: reduce duplicate template/CSS responsibility while demonstrating the intended component architecture.

Files affected: one selected feature component plus a new shared presentational component and focused test, after a local code review identifies the smallest safe slice.

Current behavior: existing route, service calls, API contracts, state transitions, and security-sensitive paths remain unchanged.

Proposed behavior: identical rendered behavior and user interactions, with presentation moved behind explicit component inputs/outputs.

Expected benefit: smaller feature component and a reusable UI boundary.

Possible risks: template binding or styling regression; no API or security risk if the boundary remains presentational.

Backend impact: none.

Rollback approach: remove the extracted component usage and restore the original template block; rerun the build and focused test.

Approval: `[SAFE]` for a strictly presentational extraction. `[REVIEW REQUIRED]` if the selected slice changes a shared component contract, form, route, service responsibility, or state management.
