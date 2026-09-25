# TEST PLAN — Online Voting Management System

## 1. Testing Levels
### Unit
- Services
- Validators
- Election-state rules
- Eligibility rules
- Result aggregation
- Security helpers

### Integration
- Controller → service → repository
- Database transactions
- Authentication/authorization
- Vote persistence
- Result calculation

### API
Use Postman or equivalent to verify REST contracts, status codes, validation and authorization.

### End-to-End
Test critical user journeys through Angular and backend.

### UAT
Demonstrate complete election lifecycle with representative roles.

## 2. Critical Scenarios
1. Voter registers successfully.
2. Voter cannot vote before approval.
3. Approved voter can authenticate.
4. Inactive/closed election rejects voting.
5. Approved candidate appears on valid ballot.
6. Unapproved candidate cannot be selected through a crafted request.
7. First vote succeeds.
8. Second vote for the same voter/election is rejected.
9. Vote is atomic and no partial state remains after failure.
10. Unauthorized user cannot access admin operations.
11. Results are hidden/controlled before publication rules permit them.
12. Results are reproducible from persisted vote records.
13. Audit records exist for critical administrative/security operations.
14. Invalid input is rejected safely.
15. API errors do not expose stack traces/secrets.

## 3. Performance Baseline
The supplied SRS specifies a project requirement of up to 10,000 simultaneous voters. Performance testing must document the actual test environment, workload, observed response times, errors and resource utilization.

## 4. Security Testing
- Authentication bypass attempts
- RBAC bypass attempts
- Duplicate vote race conditions
- Input validation
- Injection-oriented tests
- Session/token handling
- Sensitive-data exposure
- Error-message leakage
- Secret/configuration leakage

## 5. Release Gates
A release is not ready until:
- Build passes.
- Relevant automated tests pass.
- Critical voting tests pass.
- Authorization tests pass.
- Duplicate-vote tests pass.
- Security review is completed.
- Preview/staging QA passes.
- Known critical defects are resolved or explicitly accepted.
