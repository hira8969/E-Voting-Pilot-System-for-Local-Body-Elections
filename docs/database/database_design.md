# Database Design & Database-per-Service Architecture

## 1. Principles
- **Database-per-Service Pattern**: Each service owns its dedicated schema. No service may query another service's tables directly.
- **Relational Integrity**: MySQL 8.x is used as the authoritative storage engine with InnoDB for ACID guarantees.
- **Zero Cross-Service Foreign Keys**: Entities across services communicate via foreign identifier references (`voterId`, `electionId`, `candidateId`), not database constraints.

## 2. Service Schemas & DDL Specifications

### 2.1 `evoting_auth_db` (Auth Service)
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2.2 `evoting_voter_db` (Voter Service)
```sql
CREATE TABLE voter_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    epic_number VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    constituency VARCHAR(100) NOT NULL,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    has_voted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2.3 `evoting_election_db` (Election Service)
```sql
CREATE TABLE elections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SCHEDULED, ACTIVE, PAUSED, COMPLETED, CANCELLED
    election_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2.4 `evoting_candidate_db` (Candidate Service)
```sql
CREATE TABLE candidates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    election_id BIGINT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    party_name VARCHAR(100) NOT NULL,
    symbol_url VARCHAR(255),
    constituency VARCHAR(100) NOT NULL,
    bio TEXT,
    manifesto TEXT,
    approval_status VARCHAR(30) NOT NULL DEFAULT 'APPROVED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_candidate_election (election_id),
    INDEX idx_candidate_constituency (election_id, constituency)
);
```

### 2.5 `evoting_voting_db` (Voting Service - Secret Ballot Model)
```sql
-- Receipt table: Enforces one-vote-per-voter per election with compound unique constraint
CREATE TABLE voter_ballot_receipts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    election_id BIGINT NOT NULL,
    voter_id BIGINT NOT NULL,
    receipt_hash VARCHAR(64) NOT NULL UNIQUE,
    cast_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_election_voter UNIQUE (election_id, voter_id)
);

-- Anonymized ballot table: Stores candidate selection completely decoupled from voter identity
CREATE TABLE ballot_votes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    election_id BIGINT NOT NULL,
    candidate_id BIGINT NOT NULL,
    constituency VARCHAR(100) NOT NULL,
    ballot_hash VARCHAR(64) NOT NULL,
    cast_at TIMESTAMP NOT NULL,
    INDEX idx_ballot_election_candidate (election_id, candidate_id)
);
```

### 2.6 `evoting_result_db` (Result Service)
```sql
CREATE TABLE election_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    election_id BIGINT NOT NULL UNIQUE,
    total_votes BIGINT NOT NULL DEFAULT 0,
    winning_candidate_id BIGINT,
    certified BOOLEAN NOT NULL DEFAULT FALSE,
    computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidate_tallies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    result_id BIGINT NOT NULL,
    candidate_id BIGINT NOT NULL,
    vote_count BIGINT NOT NULL DEFAULT 0,
    percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (result_id) REFERENCES election_results(id) ON DELETE CASCADE,
    UNIQUE KEY uk_result_candidate (result_id, candidate_id)
);
```

### 2.7 `evoting_audit_db` (Audit Service)
```sql
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    actor_id BIGINT,
    actor_username VARCHAR(50),
    actor_role VARCHAR(50),
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50),
    ip_address VARCHAR(45),
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
