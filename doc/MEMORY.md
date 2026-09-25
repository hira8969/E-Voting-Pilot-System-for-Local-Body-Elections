# MEMORY — Project Context for AI Coding Agents

## Product
Online Voting Management System.

## Purpose
Controlled web-based election lifecycle for an academic/organizational voting scenario.

## Roles
Voter, Candidate, Administrator, Auditor.

## Technology
- Angular / TypeScript
- Java / Spring Boot
- Spring Security
- JPA / Hibernate
- MySQL
- REST / JSON over HTTPS
- Apache Kafka — planned integration layer
- JUnit / Mockito / Postman / integration testing / UAT

## Critical Rules
- Approved voter required.
- Election must be active.
- Candidate must be approved and associated with the election.
- One vote per voter per election.
- Vote persistence must be atomic.
- Results come from persisted authoritative vote records.
- Administrative actions require authorization.
- Public results must not expose voter identity.

## Scope Boundary
This is an academic prototype. It does not include physical polling hardware, hardware voting machines, national identity integration, biometric infrastructure by default, legally certified public-election infrastructure, political campaign management or public social-media campaigning.

## Current Development Principle
Build one feature at a time using vertical slices. Test every slice before moving to the next.

## AI Behavior
Do not guess missing requirements. Ask for an explicit decision or mark an item TBD. Never silently change architecture or security-sensitive voting logic.
