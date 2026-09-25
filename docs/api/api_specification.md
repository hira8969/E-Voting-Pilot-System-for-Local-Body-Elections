# REST API Specification (OpenAPI Matrix)

All client requests enter through the API Gateway at `http://localhost:8080`.

## 1. Authentication Service (`/api/auth`)
- `POST /api/auth/register`: Register new user (`username`, `email`, `password`, `role`).
- `POST /api/auth/login`: Authenticate user and return JWT access token + refresh token.
- `POST /api/auth/refresh`: Issue fresh access token using valid refresh token.
- `GET /api/auth/validate`: Internal validation of token claims.

## 2. Voter Service (`/api/voters`)
- `POST /api/voters/register`: Register voter profile with EPIC number, phone, and constituency.
- `GET /api/voters`: List all voters (Admin only).
- `GET /api/voters/{id}`: Fetch voter profile by voter ID.
- `GET /api/voters/user/{userId}`: Fetch voter profile by Auth User ID.
- `GET /api/voters/epic/{epicNumber}`: Lookup voter profile by EPIC number.
- `PUT /api/voters/{id}/verify`: Admin approval/rejection (`status: APPROVED | REJECTED`).
- `GET /api/voters/{id}/eligibility`: Feign-accessible check for active voter status.

## 3. Election Service (`/api/elections`)
- `POST /api/elections`: Create new election (`title`, `description`, `startDate`, `endDate`, `electionType`).
- `GET /api/elections`: List all elections.
- `GET /api/elections/{id}`: Get election details.
- `GET /api/elections/status/{status}`: Filter elections (`ACTIVE`, `SCHEDULED`, `COMPLETED`).
- `PUT /api/elections/{id}/status`: Transition election status (`status=ACTIVE | COMPLETED | etc.`).
- `PUT /api/elections/{id}`: Update election configuration.

## 4. Candidate Service (`/api/candidates`)
- `POST /api/candidates`: Nominate candidate (`electionId`, `fullName`, `partyName`, `symbolUrl`, `constituency`).
- `GET /api/candidates`: List all candidates.
- `GET /api/candidates/{id}`: Get candidate by ID.
- `GET /api/candidates/election/{electionId}`: Candidates participating in a given election.
- `GET /api/candidates/election/{electionId}/constituency/{constituency}`: Constituency-specific ballot candidates.
- `PUT /api/candidates/{id}`: Update candidate details.
- `DELETE /api/candidates/{id}`: Remove candidate nomination.

## 5. Voting Service (`/api/votes`)
- `POST /api/votes/cast`: Cast secure vote (`electionId`, `voterId`, `candidateId`, `constituency`).
- `GET /api/votes/check?electionId={electionId}&voterId={voterId}`: Check if voter has already voted.
- `GET /api/votes/receipt/{receiptHash}`: Verify vote submission receipt.
- `GET /api/votes/election/{electionId}/tallies`: Retrieve aggregated tallies (for Result Service).

## 6. Result Service (`/api/results`)
- `GET /api/results/election/{electionId}`: Get computed election results and candidate percentages.
- `GET /api/results/election/{electionId}/winner`: Get declared winner for election.
- `POST /api/results/election/{electionId}/compute`: Trigger authoritative result tabulation and certification.

## 7. Audit Service (`/api/audit`)
- `GET /api/audit/logs`: Paginated search of system audit events.
- `POST /api/audit/log`: Record an audit entry.
