# RULES — AI Coding and Project Rules

## 1. Source of Truth
The approved SRS and these project documents are the source of truth. Do not invent requirements.

## 2. Scope Control
- Do not add features merely because they sound useful.
- Do not introduce payments, social features, biometric infrastructure or campaign features.
- Ask for/record an explicit decision before expanding MVP scope.

## 3. Architecture Rules
- Frontend: Angular/TypeScript.
- Backend: Java/Spring Boot/Spring Security.
- Persistence: JPA/Hibernate + MySQL.
- APIs: REST/JSON over HTTPS.
- Kafka is planned for selected asynchronous integration only.
- Votes remain authoritative in persistent transactional storage.

## 4. Security Rules
- Never trust frontend authorization.
- Enforce authorization on the backend.
- Never store plaintext passwords.
- Never commit secrets.
- Validate all externally supplied data.
- Prevent duplicate voting at application and database integrity levels.
- Do not expose sensitive diagnostics to users.
- Log security-sensitive actions without logging secret credentials.

## 5. Coding Rules
- Prefer small, focused classes and components.
- Use clear names.
- Avoid unnecessary abstractions.
- Reuse existing project patterns before creating new ones.
- Do not rewrite unrelated files.
- Preserve existing working behavior.
- Keep DTOs/API contracts explicit.
- Add tests for changed critical logic.

## 6. AI Rules
Before coding:
1. Read PRD.
2. Read ARCHITECTURE.
3. Read DESIGN.
4. Read RULES.
5. Read TASKS and MEMORY.
6. Check DECISIONS for prior choices.

For each task:
- Explain planned files/changes.
- Implement one vertical slice.
- Run relevant tests/build checks.
- Report changed files and verification results.
- Stop when the task is complete.

## 7. Git Rules
- Commit small logical changes.
- Do not mix unrelated features in one commit.
- Review diffs before committing.
- Use rollback/revert when AI changes break working behavior.

## 8. Documentation Rules
When an architecture or product decision changes:
- Update DECISIONS.md.
- Update MEMORY.md if the information is persistent.
- Update affected requirements/design/task documents.
