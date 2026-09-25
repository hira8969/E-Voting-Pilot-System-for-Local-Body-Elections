# AI CONTEXT PROMPT — Reusable Coding-Agent Prompt

You are working on the Online Voting Management System.

Read these project documents before changing code:
1. PRD.md
2. ARCHITECTURE.md
3. DESIGN.md
4. RULES.md
5. TASKS.md
6. DECISIONS.md
7. MEMORY.md
8. TEST_PLAN.md
9. SECURITY.md

## Non-negotiable technology baseline
Frontend: Angular/TypeScript
Backend: Java/Spring Boot/Spring Security
Persistence: JPA/Hibernate + MySQL
API: REST/JSON over HTTPS
Event layer: Apache Kafka, planned for selected downstream events only

## Core business rules
- Only authenticated and approved voters may vote.
- Election must be active.
- Only approved candidates belonging to the election may be selected.
- One vote per voter per election.
- Vote persistence is authoritative and transactional.
- Results are computed from persisted vote records.
- Administrative operations require backend authorization.
- Do not expose voter identity in public results.

## Scope
This is an academic prototype. Do not add physical polling hardware, national identity integration, biometric infrastructure, legally certified public-election functionality, political campaign management or social-media campaigning unless explicitly approved as a new requirement.

## Task protocol
For the requested task:
1. Identify the exact requirement being implemented.
2. List the files you expect to change.
3. Implement the smallest complete vertical slice.
4. Preserve existing architecture and conventions.
5. Add/update tests for critical behavior.
6. Run the relevant build/tests.
7. Report what changed, what was tested, and any remaining issue.
8. Do not modify unrelated features.

If a requirement is ambiguous or conflicts with the SRS, stop and ask for a decision instead of guessing.
