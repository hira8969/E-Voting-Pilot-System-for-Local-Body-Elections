# System Requirements Specification (SRS) - E-Voting Pilot System

## 1. Introduction
The **E-Voting Pilot System** is an institutional/local-body electronic voting simulation platform designed with a microservices architecture. It provides an Electronic Voting Machine (EVM) style balloting interface while guaranteeing cryptographic integrity, voter secrecy, and zero duplicate voting.

## 2. Actors & Role-Based Access Control (RBAC)
- **VOTER**: Registers, completes verification, explores eligible elections, reviews candidates, casts a secure ballot on the EVM interface, and receives an immutable digital confirmation receipt.
- **ADMIN**: Manages election lifecycle, configures candidates/constituencies, verifies voter registrations, monitors participation metrics, publishes certified results, and inspects audit logs.
- **AUDITOR**: Inspects read-only audit ledgers, verification histories, and cryptographic seals.

## 3. Core Functional Requirements
1. **FR-01: Voter Registration & Onboarding**
   - User signs up with username, email, password, and institutional/national voter ID (EPIC number).
   - Initial state: `PENDING_VERIFICATION`. Only after Admin approval does status transition to `APPROVED`.
2. **FR-02: Election Lifecycle State Management**
   - States: `DRAFT` -> `SCHEDULED` -> `ACTIVE` -> `PAUSED` -> `COMPLETED` / `CANCELLED`.
   - Ballots can only be accepted if current server time is within `startDate` and `endDate`, and state is strictly `ACTIVE`.
3. **FR-03: Candidate Nomination & Ballot Mapping**
   - Candidates are nominated for specific elections and constituencies with name, party, symbol image, and manifesto.
   - Only approved candidates appear on the voter's ballot.
4. **FR-04: High-Integrity EVM Balloting**
   - The voter selects one candidate from their constituency ballot.
   - Dual confirmation workflow (Review -> Final Cast).
   - Atomic persistence: voter receipt + anonymized vote recorded in a single database transaction.
5. **FR-05: Strict One-Vote Enforcement**
   - Both application checks and a database compound unique constraint `(election_id, voter_id)` prohibit multiple votes.
6. **FR-06: Secret Ballot Preservation**
   - The vote entity stores candidate choice and SHA-256 seal without voter identification.
   - The receipt entity records voter participation without candidate selection.
7. **FR-07: Result Computation & Publication**
   - Direct tallying from persisted vote records.
   - Results remain sealed until election transition to `COMPLETED`.

## 4. Non-Functional Requirements
- **NFR-01: Reliability & Atomicity**: ACIDS transactions for balloting.
- **NFR-02: Scalability**: Microservices architecture with independent databases.
- **NFR-03: Security**: Spring Security 6, JWT HMAC-SHA256, BCrypt (strength 12), CORS protection.
