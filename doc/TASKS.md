# TASKS — Implementation Roadmap

## Phase 0 — Requirements and Planning
- [ ] Freeze SRS baseline for implementation.
- [ ] Confirm MVP and scope boundary.
- [ ] Create approved use-case model.
- [ ] Confirm architecture.
- [ ] Confirm ER/data model.
- [ ] Confirm API baseline.
- [ ] Confirm security baseline.

## Phase 1 — Repository and Environment
- [ ] Create Git repository.
- [ ] Create Angular project.
- [ ] Create Spring Boot project.
- [ ] Configure MySQL.
- [ ] Configure environment variables.
- [ ] Configure formatting/lint/build checks.
- [ ] Create test structure.
- [ ] Add project documentation.

## Phase 2 — Backend Foundation
- [ ] Spring Security foundation.
- [ ] User/role model.
- [ ] Password hashing.
- [ ] Authentication APIs.
- [ ] Global exception handling.
- [ ] Validation.
- [ ] Standard API response/error model.
- [ ] Audit foundation.
- [ ] Database migrations/schema process.

## Phase 3 — Angular Foundation
- [ ] App shell.
- [ ] Routing.
- [ ] Authentication screens.
- [ ] Route guards.
- [ ] API service layer.
- [ ] Role-aware navigation.
- [ ] Shared UI components.
- [ ] Responsive layout.

## Phase 4 — Registration and Approval
- [ ] Voter registration.
- [ ] Candidate registration.
- [ ] Approval states.
- [ ] Admin approval screens.
- [ ] Tests.

## Phase 5 — Election Management
- [ ] Create election.
- [ ] Update/configure election.
- [ ] Election schedule/status.
- [ ] Candidate association.
- [ ] Eligible voter rules.
- [ ] Admin UI.
- [ ] Tests.

## Phase 6 — Voting Vertical Slice
- [ ] Eligible-election API.
- [ ] Ballot API.
- [ ] Ballot UI.
- [ ] Vote validation.
- [ ] One-vote-per-election enforcement.
- [ ] Atomic persistence.
- [ ] Confirmation UI.
- [ ] Duplicate-vote tests.
- [ ] Closed-election tests.
- [ ] Unauthorized-vote tests.

## Phase 7 — Results
- [ ] Result aggregation.
- [ ] Controlled publication.
- [ ] Result API.
- [ ] Result UI.
- [ ] Reproducibility tests.

## Phase 8 — Audit and Event Integration
- [ ] Audit event model.
- [ ] Read-only audit UI.
- [ ] Kafka integration boundary.
- [ ] Event contracts.
- [ ] Failure/retry behavior.
- [ ] Verify Kafka never becomes vote authority.

## Phase 9 — Testing and Security
- [ ] Unit tests.
- [ ] Integration tests.
- [ ] API/Postman tests.
- [ ] End-to-end tests.
- [ ] Authorization tests.
- [ ] Duplicate voting tests.
- [ ] Validation tests.
- [ ] Security review.
- [ ] Performance baseline.
- [ ] UAT scenarios.

## Phase 10 — Deployment and QA
- [ ] Build backend.
- [ ] Build frontend.
- [ ] Configure deployment environments.
- [ ] Configure secrets.
- [ ] Preview/staging deployment.
- [ ] Full QA.
- [ ] Production/deployment readiness review.
- [ ] Monitoring/logging.
- [ ] Final documentation.

## Vertical Slice Rule
Do not build the entire backend first and frontend later for all features. Complete a small end-to-end feature slice, verify it, then continue.
