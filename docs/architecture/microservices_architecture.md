# Microservices Architecture & Topology

## 1. High-Level System Architecture

```
                                      +------------------------------------+
                                      |        Angular 22 Frontend         |
                                      |       (http://localhost:4200)      |
                                      +-----------------+------------------+
                                                        |
                                                        v
                                      +------------------------------------+
                                      |        Spring Cloud Gateway        |
                                      |            (Port 8080)             |
                                      +-----------------+------------------+
                                                        |
    +---------------------------------------------------+---------------------------------------------------+
    |                   |                     |                     |                     |                 |
    v                   v                     v                     v                     v                 v
+-----------+   +---------------+     +---------------+     +---------------+     +---------------+   +------------+
|   Auth    |   |  User/Voter   |     |   Election    |     |   Candidate   |     |    Voting     |   |   Result   |
|  Service  |   |    Service    |     |    Service    |     |    Service    |     |    Service    |   |  Service   |
| (Pt 8086) |   |   (Pt 8081)   |     |   (Pt 8082)   |     |   (Pt 8083)   |     |   (Pt 8084)   |   | (Pt 8085)  |
+-----+-----+   +-------+-------+     +-------+-------+     +-------+-------+     +-------+-------+   +-----+------+
      |                 |                     |                     |                     |                 |
      +-----------------+---------------------+---------------------+---------------------+-----------------+
                                                        | (Heartbeat / Lookup)
                                                        v
                                      +------------------------------------+
                                      |     Eureka Service Discovery       |
                                      |            (Port 8761)             |
                                      +------------------------------------+
```

## 2. Microservice Directory & Port Matrix

| Service | Port | Database | Primary Responsibility |
|:---|:---:|:---|:---|
| **`eureka-server`** | `8761` | None | Service registry and dynamic endpoint discovery |
| **`api-gateway`** | `8080` | None | Single entry point, JWT validation filter, CORS, and routing |
| **`auth-service`** | `8086` | `evoting_auth_db` | User credentials, BCrypt password hashing, JWT token issuance |
| **`voter-service`** | `8081` | `evoting_voter_db` | Voter demographic profiles, EPIC number lookup, verification KYC |
| **`election-service`**| `8082` | `evoting_election_db` | Election scheduling, rules, and lifecycle state management |
| **`candidate-service`**| `8083` | `evoting_candidate_db`| Candidate nominations, party details, symbols, manifestos |
| **`voting-service`** | `8084` | `evoting_voting_db` | EVM vote transaction execution, double-vote prevention, SHA-256 seal |
| **`result-service`** | `8085` | `evoting_result_db` | Authoritative vote tallying, turnouts, winner calculations |
| **`audit-service`** | `8087` | `evoting_audit_db` | Tamper-evident administrative & security audit ledger |

## 3. Communication Patterns
- **Synchronous Remote Invocations**: Spring Cloud OpenFeign with Resilience4j circuit breakers for low-latency validation during vote transactions (e.g., Voting Service calling Voter Service and Election Service).
- **Client to Backend**: RESTful JSON over HTTPS via API Gateway on port `8080`.
