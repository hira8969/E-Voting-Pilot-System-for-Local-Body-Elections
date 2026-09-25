# Online Voting Management System — Vibe Coding Documentation Pack

This documentation pack adapts the supplied Vibe Coding guide to the supplied Online Voting Management System SRS.

## Source baseline
- Product: Online Voting Management System
- Frontend: Angular /javascript component based 
- Backend: Java / Spring Boot / Spring Security
- Persistence: JPA / Hibernate
- Database: MySQL
- API: REST / JSON over HTTPS
- Event layer: Apache Kafka — planned integration layer
- Testing: JUnit, Mockito, Postman, integration testing and UAT

The SRS defines this as an academic software prototype, not a legally certified public-election system.

## Documents
1. PRD.md — product requirements and MVP
2. ARCHITECTURE.md — technical architecture and request/event flows
3. DESIGN.md — UI/UX and screen design baseline
4. RULES.md — AI/project coding rules
5. TASKS.md — phased implementation task breakdown
6. DECISIONS.md — architecture and implementation decisions
7. MEMORY.md — persistent project context for AI coding sessions
8. TEST_PLAN.md — testing strategy and release gates
9. SECURITY.md — security requirements and threat controls
10. AI_CONTEXT_PROMPT.md — reusable context prompt for coding agents
11. .env.example — environment-variable template

## Recommended workflow
Idea/SRS → PRD → Architecture → Design → Rules → Tasks → Setup → Feature-by-feature development → Testing → Security review → Code review → Preview deployment → QA → Production/deployment → Monitoring → Documentation updates.

Do not jump directly from SRS to unrestricted AI code generation.
