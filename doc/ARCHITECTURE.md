# ARCHITECTURE — Online Voting Management System

## 1. Architectural Style
Layered web architecture:
Angular client → Spring Boot REST API → service/business layer → JPA/Hibernate → MySQL.

Spring Security/RBAC forms the authorization boundary. Kafka is a planned asynchronous integration layer and is not the authoritative vote store.

## 2. Logical Layers
### Angular
- Routing
- Standalone UI components
- Forms and validation
- Authentication state
- Role-aware navigation
- Voter ballot UI
- Candidate/election/admin screens
- Result visualization
- API communication

### REST/API Layer
- Request validation
- Authentication/authorization enforcement
- DTO/request-response models
- HTTP status handling
- Correlation/diagnostic information

### Service Layer
- Election lifecycle rules
- Eligibility checks
- Candidate approval rules
- One-vote-per-election enforcement
- Vote transaction orchestration
- Result computation
- Audit/event orchestration

### Persistence
- JPA/Hibernate entities and repositories
- MySQL relational persistence
- Transaction boundaries
- Integrity constraints

### Event Layer
Kafka is optional/planned for selected downstream events. It must not replace the authoritative persisted vote data.

## 3. Core Modules
1. Authentication
2. Voter
3. Candidate
4. Election
5. Voting
6. Result
7. Administration
8. Audit
9. Event Integration

## 4. Core Vote Request Flow
1. Voter authenticates.
2. Backend verifies role, approval and eligibility.
3. Backend verifies election status/time.
4. Backend loads approved ballot candidates.
5. Voter selects a candidate.
6. Backend validates the candidate belongs to the election and is approved.
7. Backend checks whether the voter has already voted in that election.
8. Vote is persisted in an atomic transaction.
9. Audit/security event is recorded as required.
10. Confirmation is returned to Angular.
11. Optional downstream Kafka event is published only after the authoritative persistence boundary is satisfied.

## 5. Result Flow
Persisted vote records → aggregation → validation → result dataset → controlled publication/display.

## 6. Security Boundary
Angular is not trusted for authorization decisions. Every sensitive operation must be revalidated by the Spring Boot backend.

## 7. Database Principles
- Use foreign keys for relationships.
- Enforce uniqueness for one-vote-per-election at the database/application boundary.
- Use transactions for vote recording.
- Do not use Kafka as the source of truth.
- Keep audit information separate from business data where appropriate.

## 8. Environment Separation
Development → Test/QA → Preview/Staging → Production.

Secrets must never be committed to Git. Use environment variables/secrets management.

## 9. Failure Handling
- Return consistent API errors.
- Use correlation/request identifiers for diagnostics.
- Do not expose stack traces or sensitive internal information to clients.
- Failed vote transactions must not leave a partial vote state.
