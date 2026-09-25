# E-Voting Pilot System: Full Stack Master Technical & Viva Guide

**Project Classification:** Distributed Microservices Architecture (Spring Boot 3.4.2 / Java 21 LTS + Angular 22 Standalone + MySQL 8.x + Eureka + Spring Cloud Gateway)  
**Target:** In-Depth Full Stack Software Engineering Architecture, Viva Defense, and Technical Interview Preparation.

---

## Table of Contents
1. [Spring Boot & Cloud Topics Covered](#1-spring-boot--cloud-topics-covered)
2. [Angular Frontend Topics Covered](#2-angular-frontend-topics-covered)
3. [MySQL Database Topics Covered](#3-mysql-database-topics-covered)
4. [System Architecture & Flow Diagrams](#4-system-architecture--flow-diagrams)
5. [Standard Viva Questions & Answers](#5-standard-viva-questions--answers)
6. [Tricky & Trap Questions for Senior Full Stack Viva](#6-tricky--trap-questions-for-senior-full-stack-viva)

---

## 1. Spring Boot & Cloud Topics Covered

| Spring Boot / Cloud Topic | How & Where It Is Implemented | Architectural Rationale |
|:---|:---|:---|
| **Spring Cloud Netflix Eureka (`8761`)** | `eureka-server` with `@EnableEurekaServer`; microservices annotate `@EnableDiscoveryClient`. | Eliminates hardcoded URLs; enables dynamic location transparency and client-side load balancing. |
| **Spring Cloud API Gateway (`8080`)** | Reactive gateway using Spring WebFlux; route predicates (e.g. `/api/votes/**` &rarr; `lb://VOTING-SERVICE`), CORS engine, and `JwtAuthenticationFilter`. | Single edge entry point; centralized authentication perimeter and protocol management. |
| **Spring Security 6 & JJWT (`8086`)** | `auth-service` using `SecurityFilterChain`, stateless sessions (`SessionCreationPolicy.STATELESS`), BCrypt (strength 12), and JJWT 0.12.6. | Zero session stickiness on backend; cryptographic token claims carry user identity and roles. |
| **Spring Data JPA & Hibernate 6** | Implemented across all 7 business services with entities, composite constraints, and Spring Data repositories. | High-level ORM abstraction with type-safe derived and JPQL queries. |
| **OpenFeign Declarative Clients** | `voting-service` utilizes `VoterClient` interface annotating `@FeignClient(name = "voter-service")`. | Declarative inter-service communication; replaces boilerplate `RestTemplate` with automatic load balancing. |
| **Resilience4j Circuit Breakers** | Configured in `voting-service` with sliding window (size 10), 50% failure rate threshold, and 10s open state. | Prevents cascading failures and thread starvation when downstream services experience latency. |
| **Transaction Management (`@Transactional`)** | Applied to `VotingService.castVote()` and `AuditServiceImpl.recordAuditLog()`. | Guarantees ACID atomicity across vote persistence, hash generation, and receipt generation. |
| **Global Exception Handling** | `@RestControllerAdvice` and `@ExceptionHandler` producing consistent `ErrorResponse` DTOs. | Masks raw stack traces and returns clean HTTP error codes (400, 401, 404, 409). |
| **Bean Validation (Jakarta)** | `@NotBlank`, `@Size`, `@NotNull`, and `@Valid` on incoming request DTOs. | Early rejection of malformed payloads before business logic execution. |
| **Project Lombok** | `@Getter`, `@Setter`, `@Builder`, `@RequiredArgsConstructor` across DTOs and entities. | Drastically reduces boilerplate while preserving clean readability. |

---

## 2. Angular Frontend Topics Covered

| Angular Topic | How & Where It Is Implemented | Developer Benefit |
|:---|:---|:---|
| **Standalone Components (Angular 22)** | All components use `standalone: true` with direct `imports: [...]`. | Eliminates `NgModule` ceremony; enables superior tree-shaking and compilation performance. |
| **Functional Route Guards (`CanActivateFn`)** | `auth.guard.ts` and `role.guard.ts` checking token validity and role claims. | Restricts administrative management and voter balloting to authorized roles. |
| **HTTP Interceptors (`HttpInterceptorFn`)** | `auth.interceptor.ts` and `error.interceptor.ts` via `provideHttpClient(withInterceptors([...]))`. | Automatically attaches `Bearer <token>` to requests and catches 401/403 errors globally. |
| **Reactive Forms & Validators** | `FormBuilder`, `FormGroup`, and custom regex validators in login, registration, and nomination screens. | Type-safe form controls with dynamic validation state tracking. |
| **EVM-Inspired Simulation UI** | Dedicated `evm-voting` component simulating physical EVM buttons, candidate symbols, LED status, and audio beep confirmation. | Engaging civic-tech user experience replicating real balloting hardware. |
| **RxJS & Observables** | `BehaviorSubject` session management, `pipe()`, `map()`, `catchError()` in Angular services. | Asynchronous state management and reactive propagation of authentication changes. |
| **Cascading Hierarchy Selector** | Consumes `bihar_master_hierarchy.json` to render Division &rarr; District &rarr; Block &rarr; Ward selectors. | Eliminates human data-entry error by enforcing valid administrative boundaries. |

---

## 3. MySQL Database Topics Covered

| MySQL Concept | Implementation in E-Voting Project | Data Integrity Guarantee |
|:---|:---|:---|
| **Database-per-Service** | 7 isolated schemas (`evoting_auth_db`, `evoting_voter_db`, `evoting_election_db`, `evoting_candidate_db`, `evoting_voting_db`, `evoting_result_db`, `evoting_audit_db`). | Absolute domain autonomy; zero cross-schema foreign keys. |
| **Composite Unique Constraint** | `CONSTRAINT uk_election_voter UNIQUE (election_id, voter_id)` in `voter_ballot_receipts`. | Database-enforced impossibility of duplicate voting even under concurrent race conditions. |
| **Secret Ballot Decoupling** | Split between `voter_ballot_receipts` (voter metadata, NO candidate) and `ballot_votes` (candidate choice, NO voter metadata). | True privacy: even a database admin with root access cannot deduce voter choice. |
| **Cryptographic Audit Seal** | SHA-256 seal `SHA256(voterId:electionId:candidateId:timestamp:UUID)` stored with each vote. | Mathematical proof of ballot immutability and tamper detection. |
| **InnoDB ACID Compliance** | Row-level locking and write-ahead redo logs. | Protects database state against concurrent read/write anomalies. |
| **Delimitation Architecture** | 9 Divisions, 38 Districts, 17 Blocks of Sitamarhi, 40 Lok Sabha seats, 243 Assembly seats, dynamic wards. | Adheres to official 2026 Bihar delimitation standards (~500 population per ward). |

---

## 4. System Architecture & Flow Diagrams

### Diagram 1: Distributed Microservices Topology
```
                             +------------------------------------------+
                             |           Angular 22 Frontend            |
                             |          (http://localhost:4200)         |
                             +--------------------+---------------------+
                                                  |
                                                  | (REST / HTTPS)
                                                  v
                             +------------------------------------------+
                             |           Spring Cloud Gateway           |
                             |               (Port 8080)                |
                             |   [JWT Validation Filter | CORS Engine]  |
                             +--------------------+---------------------+
                                                  |
        +-----------------------------------------+-----------------------------------------+
        |                    |                    |                    |                    |
        v                    v                    v                    v                    v
+---------------+    +---------------+    +---------------+    +---------------+    +---------------+
| Auth Service  |    | Voter Service |    |ElectionService|    |CandidateServ. |    | Voting Service|
|  (Port 8086)  |    |  (Port 8081)  |    |  (Port 8082)  |    |  (Port 8083)  |    |  (Port 8084)  |
+-------+-------+    +-------+-------+    +-------+-------+    +-------+-------+    +-------+-------+
        |                    |                    |                    |                    |
        |                    +--------------------+--------------------+--------------------+
        |                                         |
        v                                         v (Dynamic Registration & Discovery)
+---------------+                   +------------------------------------------+
| Audit Service |                   |         Eureka Discovery Server          |
|  (Port 8087)  |                   |               (Port 8761)                |
+---------------+                   +------------------------------------------+
```

### Diagram 2: High-Integrity EVM Vote Transaction Flow
```
[Voter on EVM UI] ──(1. Click Candidate B & Confirm)──> [API Gateway :8080]
                                                                │
                                              (2. Verify JWT & Route)
                                                                ▼
                                                      [Voting Service :8084]
                                                                │
                            ┌───────────────────────────────────┼──────────────────────────────────┐
                            │ (3. Feign Call)                   │ (4. Memory Check)                │ (5. Feign Call)
                            ▼                                   ▼                                  ▼
                   [Voter Service :8081]              [existsByElectionId]                [Election Service :8082]
                   - Verify KYC APPROVED              - Rejects if already voted          - Verify Status == ACTIVE
                   - Check Eligibility                                                    - Verify Current Timestamp
                            │                                   │                                  │
                            └───────────────────────────────────┼──────────────────────────────────┘
                                                                ▼
                                                [Database Transaction @Transactional]
                                                                │
                                            ┌───────────────────┴───────────────────┐
                                            ▼                                       ▼
                               [voter_ballot_receipts]                        [ballot_votes]
                               - voter_id + election_id                       - candidate_id + election_id
                               - UK: uk_election_voter                        - Anonymized ballot
                               - SHA-256 Receipt Hash                         - SHA-256 Ballot Seal
                                            │                                       │
                                            └───────────────────┬───────────────────┘
                                                                ▼
                                              (6. Return Digital Receipt to Angular)
```

---

## 5. Standard Viva Questions & Answers

### Q1: What is the Database-per-Service pattern and why use it?
* **Short Answer:** It isolates each service's schema to ensure domain autonomy, independent scalability, and loose coupling.
* **Deep Answer:** If all services share one schema, changing a column in `elections` could break queries in `candidate-service` or `auth-service`. Database-per-service enforces strict isolation: no service can run direct joins against another's tables. Communication occurs strictly over REST APIs or asynchronous event buses.

### Q2: What is the role of Spring Cloud Eureka?
* **Short Answer:** Dynamic service registration and discovery.
* **Deep Answer:** When microservices start up, they register their dynamic host and port with Eureka (`8761`). When `voting-service` calls `voter-service`, OpenFeign resolves `lb://VOTER-SERVICE` through Eureka without requiring hardcoded IP addresses or ports.

### Q3: How do you technically enforce "One-Vote-Per-Voter"?
* **Short Answer:** Dual defense: application-level check plus database compound unique constraint.
* **Deep Answer:** First, `VotingService` checks `voteRepository.existsByElectionIdAndVoterId(...)`. Second, `voter_ballot_receipts` enforces `CONSTRAINT uk_election_voter UNIQUE (election_id, voter_id)`. If two simultaneous requests pass the application check concurrently, the database aborts the second insert, guaranteeing zero duplicate votes.

### Q4: How does Spring Cloud Gateway validate JWT tokens?
* **Short Answer:** Through a reactive Global Gateway Filter that intercepts incoming HTTP headers.
* **Deep Answer:** `JwtAuthenticationFilter` intercepts requests to `/api/**`, verifies the HMAC-SHA256 signature and expiration timestamp using the secret key, extracts user claims and roles, and rejects unauthorized traffic with HTTP 401 before it can reach internal microservices.

### Q5: Why use Angular Standalone Components over NgModules?
* **Short Answer:** Standalone components simplify the mental model, enable better tree-shaking, and remove NgModule configuration overhead.
* **Deep Answer:** Each standalone component directly imports only the dependencies it requires (`imports: [CommonModule, ReactiveFormsModule]`), eliminating bloated shared modules and improving build and reload speeds.

---

## 6. Tricky & Trap Questions for Senior Full Stack Viva

### TRICKY Q1: "If Voting Service saves the vote in MySQL, but the subsequent Feign call to update Voter Service's 'hasVoted' status fails due to a network glitch, how does the system avoid an inconsistent state?"
* **Answer:** The vote remains 100% valid because `voting-service` is the **authoritative source of truth**.
* **Detailed Explanation:** In a distributed system, attempting a 2-Phase Commit (2PC) creates blocking and poor performance. In our architecture, `voter_ballot_receipts` in `voting-service` is the single source of truth for who voted. If the voter attempts to vote again, `voting-service` checks its own database and rejects the duplicate immediately, ensuring complete integrity regardless of the sync call status.

### TRICKY Q2: "Can a Database Administrator (DBA) with root access to MySQL find out who I voted for?"
* **Answer:** No, because voter identity and candidate choices are physically decoupled into separate tables.
* **Detailed Explanation:** 
  - `voter_ballot_receipts` records `(voter_id, election_id, receipt_hash)` with NO candidate reference.
  - `ballot_votes` records `(candidate_id, election_id, ballot_hash)` with NO voter reference.
  - Both records use randomized independent SHA-256 hashes under the same transaction. Even with full database access, there is no join key linking voter identity to candidate selection.

### TRICKY Q3: "Why can't we use a JPA `@ManyToOne` annotation between Vote entity and Candidate entity?"
* **Answer:** Because JPA relationships cannot cross physical microservice and database boundaries.
* **Detailed Explanation:** `@ManyToOne` requires both entities to be managed within the same Hibernate `EntityManager` and database schema. `Vote` lives in `evoting_voting_db`, while `Candidate` lives in `evoting_candidate_db`. Cross-service joins violate microservice autonomy. Instead, we store a scalar `candidateId` and query details via OpenFeign REST API.

### TRICKY Q4: "What happens if Eureka Server goes down while an election is actively running?"
* **Answer:** The system continues operating smoothly due to Eureka client-side in-memory registry caching.
* **Detailed Explanation:** Microservices do not query Eureka for every HTTP call. They cache the endpoint table in local memory and refresh it every 30 seconds. If Eureka crashes, microservices continue communicating via OpenFeign using their cached table, avoiding downtime.

### TRICKY Q5: "Why should Rajya Sabha election NOT be displayed on an ordinary citizen's voter dashboard?"
* **Answer:** According to the Constitution of India, Rajya Sabha is an indirect election where only elected MLAs vote.
* **Detailed Explanation:** Unlike Lok Sabha or Vidhan Sabha, Rajya Sabha (16 seats in Bihar) members are elected by an **Electoral College of Elected Members of the State Legislative Assembly (MLAs)** using Proportional Representation by Single Transferable Vote (STV). General public voters cannot vote in Rajya Sabha elections. Our system models this in `rajya_sabha_representation` with `public_ballot_allowed = FALSE`.

### TRICKY Q6: "Why is Resilience4j configured on Feign clients instead of just letting requests fail?"
* **Answer:** To prevent thread pool exhaustion and cascading system outages.
* **Detailed Explanation:** If `voter-service` slows down, every incoming call from `voting-service` holds a Tomcat worker thread waiting for a timeout. Under high voter traffic, all worker threads become exhausted within seconds, crashing the entire voting platform. Resilience4j trips the Circuit Breaker to **OPEN** state after 50% failures, immediately executing a fallback without holding threads.
