# E-Voting Pilot System - Backend Microservices

A resilient, scalable microservices architecture built with **Java 21+**, **Spring Boot 3.4**, and **Spring Cloud Gateway** to power the E-Voting Pilot System.

---

## 🏛️ Architecture Overview

```
                          ┌───────────────────────────┐
                          │   Angular Frontend UI     │
                          │   (http://localhost:4200) │
                          └─────────────┬─────────────┘
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │    API Gateway (8080)     │
                          │   (Spring Cloud Gateway)  │
                          └─────────────┬─────────────┘
         ┌──────────────┬───────────────┼───────────────┬──────────────┐
         │              │               │               │              │
         ▼              ▼               ▼               ▼              ▼
  ┌────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ ┌────────────┐
  │   Voter    │ │  Election   │ │  Candidate  │ │   Voting   │ │   Result   │
  │  Service   │ │   Service   │ │   Service   │ │  Service   │ │  Service   │
  │   (8081)   │ │   (8082)    │ │   (8083)    │ │   (8084)   │ │   (8085)   │
  └────────────┘ └─────────────┘ └─────────────┘ └────────────┘ └────────────┘
```

---

## 📦 Microservices Directory Structure

```
Backend/
├── pom.xml                     # Maven Multi-Module Root POM
├── docker-compose.yml          # Container Orchestration
├── README.md                   # Backend Documentation
│
├── api-gateway/                # Port 8080: Gateway routing & CORS
├── voter-service/              # Port 8081: Voter registration & verification
├── election-service/           # Port 8082: Election lifecycle management
├── candidate-service/          # Port 8083: Candidate nominations & profiles
├── voting-service/             # Port 8084: Balloting & double-vote prevention
└── result-service/             # Port 8085: Real-time vote tallies & analytics
```

---

## 🔌 Service Port Map & Routing

| Service Name | Port | Base Path | Description |
| :--- | :---: | :--- | :--- |
| **API Gateway** | `8080` | `/` | Single entry point & CORS handler |
| **Voter Service** | `8081` | `/api/voters` | Voter identity & registration |
| **Election Service** | `8082` | `/api/elections` | Election schedule & state |
| **Candidate Service**| `8083` | `/api/candidates` | Candidate profiles & party data |
| **Voting Service** | `8084` | `/api/votes` | Ballots & SHA-256 digital seals |
| **Result Service** | `8085` | `/api/results` | Standings, percentages & winners |

---

## 🚀 API Endpoint Reference

### 1. Voter Service (`/api/voters`)
* `POST /api/voters/register` - Register a new voter (`epicNumber`, `fullName`, `email`, `phone`, `constituency`)
* `GET /api/voters` - List all registered voters
* `GET /api/voters/{id}` - Fetch voter by ID
* `GET /api/voters/epic/{epicNumber}` - Lookup voter by EPIC / Voter Card Number
* `PUT /api/voters/{id}/verify` - Admin verification for voter eligibility
* `PUT /api/voters/{id}/vote-status?hasVoted=true` - Update voting status

### 2. Election Service (`/api/elections`)
* `POST /api/elections` - Create a new election (`title`, `description`, `startDate`, `endDate`, `status`, `electionType`)
* `GET /api/elections` - List all elections
* `GET /api/elections/{id}` - Get election by ID
* `GET /api/elections/status/{status}` - Filter elections (e.g. `UPCOMING`, `ONGOING`, `COMPLETED`)
* `PUT /api/elections/{id}/status?status=ONGOING` - Update election status
* `PUT /api/elections/{id}` - Update election details

### 3. Candidate Service (`/api/candidates`)
* `POST /api/candidates` - Nominate candidate (`electionId`, `fullName`, `partyName`, `symbolUrl`, `constituency`, `bio`, `manifesto`)
* `GET /api/candidates` - List all candidates
* `GET /api/candidates/{id}` - Get candidate details
* `GET /api/candidates/election/{electionId}` - Get candidates participating in an election
* `GET /api/candidates/election/{electionId}/constituency/{constituency}` - Candidates by election and constituency
* `PUT /api/candidates/{id}` - Update candidate profile
* `DELETE /api/candidates/{id}` - Delete candidate nomination

### 4. Voting Service (`/api/votes`)
* `POST /api/votes/cast` - Cast ballot (`electionId`, `voterId`, `candidateId`, `constituency`)
* `GET /api/votes/check?electionId={electionId}&voterId={voterId}` - Check if voter has already voted
* `GET /api/votes/election/{electionId}/count` - Total votes cast in an election
* `GET /api/votes/election/{electionId}/candidate/{candidateId}/count` - Total votes for a candidate
* `GET /api/votes/election/{electionId}/tallies` - Live tally count grouped by candidate ID

### 5. Result Service (`/api/results`)
* `GET /api/results/election/{electionId}` - Real-time aggregated results, standings, percentage calculations
* `GET /api/results/election/{electionId}/winner` - Declared election winner / leading candidate

---

## 🛠️ Getting Started & Running

### Prerequisites
* **Java 21+** (e.g., OpenJDK / Oracle JDK 21 or 24)
* **Maven 3.9+**
* *(Optional)* **Docker & Docker Compose**

### Build the entire Backend
From the `Backend` directory:
```powershell
mvn clean package -DskipTests
```

### Running Microservices Locally (Development)
You can run each service individually in separate terminals:

```powershell
# 1. API Gateway
cd api-gateway
mvn spring-boot:run

# 2. Voter Service
cd voter-service
mvn spring-boot:run

# 3. Election Service
cd election-service
mvn spring-boot:run

# 4. Candidate Service
cd candidate-service
mvn spring-boot:run

# 5. Voting Service
cd voting-service
mvn spring-boot:run

# 6. Result Service
cd result-service
mvn spring-boot:run
```

### Running with Docker Compose
To spin up all services together in Docker:
```powershell
# 1. Package JARs
mvn clean package -DskipTests

# 2. Launch all microservices
docker compose up --build -d

# 3. Stop containers
docker compose down
```

---

## 🌐 Angular Frontend Integration

All frontend requests from Angular should route through the **API Gateway** on port `8080`:

```typescript
// Angular environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```
