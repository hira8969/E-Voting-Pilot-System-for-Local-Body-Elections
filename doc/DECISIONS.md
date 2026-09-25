# DECISIONS — Architecture Decision Record

## ADR-001: Angular Frontend
**Status:** Accepted  
**Decision:** Use Angular/TypeScript for the web client.  
**Reason:** Matches the approved SRS baseline.

## ADR-002: Spring Boot Backend
**Status:** Accepted  
**Decision:** Use Java/Spring Boot REST services with Spring Security.  
**Reason:** Matches the approved SRS and provides the backend security/application boundary.

## ADR-003: MySQL Persistence
**Status:** Accepted  
**Decision:** Use MySQL with JPA/Hibernate.  
**Reason:** Matches the relational persistence baseline.

## ADR-004: REST/JSON API
**Status:** Accepted  
**Decision:** Angular communicates with Spring Boot using REST/JSON over HTTPS.  
**Reason:** Explicit SRS interface baseline.

## ADR-005: Kafka as Planned Integration Layer
**Status:** Planned/Controlled  
**Decision:** Kafka may publish selected downstream events.  
**Constraint:** Kafka is not the authoritative store for votes.  
**Reason:** Explicit SRS architecture boundary.

## ADR-006: Backend Authorization Is Authoritative
**Status:** Accepted  
**Decision:** Frontend guards improve UX, but backend authorization is mandatory.  
**Reason:** Sensitive voting and administrative operations must not depend on client-side enforcement.

## ADR-007: One Vote Per Election
**Status:** Accepted  
**Decision:** Enforce one vote per voter/election using application validation plus database integrity/transaction controls.  
**Reason:** Core business rule and critical security requirement.

## ADR-008: Academic Scope
**Status:** Accepted  
**Decision:** Treat the system as an academic software prototype.  
**Reason:** The SRS explicitly excludes legally certified public-election infrastructure.
