# E-Voting Pilot System — Complete Execution & Run Guide

This guide provides step-by-step instructions to initialize, execute, and verify the **E-Voting Pilot System** microservices platform on your local machine.

---

## 1. Prerequisites

Ensure the following tools and runtimes are installed on your workstation:

* **Java 21 (JDK 21 LTS)**: Verify with `java -version`
* **Node.js (v18+) & npm (v9+)**: Verify with `node -v` and `npm -v`
* **MySQL Server 8.x**: Local MySQL service running on port `3306` (or Docker)
* **Docker Desktop** *(Optional)*: Required only if running via container orchestration

---

## 2. Database Initialization

In this microservices architecture, each service operates its own isolated database schema. A centralized script is provided to initialize all 7 databases automatically:

1. Open **MySQL Command Line** or **MySQL Workbench**.
2. Run the initialization script:
   ```sql
   source d:/E-Voting Pilot System/Backend/init-databases.sql;
   ```
   Or execute directly from **PowerShell / Command Prompt**:
   ```powershell
   mysql -u root -p < "d:\E-Voting Pilot System\Backend\init-databases.sql"
   ```

This script provisions the following 7 isolated schemas:
- `evoting_auth_db`
- `evoting_voter_db`
- `evoting_election_db`
- `evoting_candidate_db`
- `evoting_voting_db`
- `evoting_result_db`
- `evoting_audit_db`

---

## 3. Execution Methods

You can run the platform using either of two methods:

---

### Method A: One-Click Docker Compose Run (Recommended for Full Stack)

If **Docker Desktop** is running on your machine:

1. Open PowerShell and navigate to the `Backend` directory:
   ```powershell
   cd "d:\E-Voting Pilot System\Backend"
   ```

2. Start the entire containerized stack:
   ```powershell
   docker-compose up --build
   ```
   *This command spins up MySQL 8, Eureka Service Registry, Spring Cloud API Gateway, and all 7 business microservices automatically.*

3. In a separate terminal, launch the Angular frontend:
   ```powershell
   cd "d:\E-Voting Pilot System\frontend"
   npm start
   ```

4. Access the application in your browser at: **`http://localhost:4200`**

---

### Method B: Local Step-by-Step Run (Best for Viva & Demonstration)

Running services individually in separate terminals allows you to show live console logs, service registration, and inter-service Feign calls during your academic project evaluation.

> **Important**: Always launch **Eureka Server** first so downstream services can register themselves dynamically.

#### Step 1: Start Eureka Discovery Registry (Terminal 1)
```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-21"
cd "d:\E-Voting Pilot System\Backend\eureka-server"
java -jar target\eureka-server-1.0.0-SNAPSHOT.jar
```
*Verification*: Open **`http://localhost:8761`** in your browser. The Eureka Dashboard will appear.

---

#### Step 2: Start Spring Cloud API Gateway (Terminal 2)
```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-21"
cd "d:\E-Voting Pilot System\Backend\api-gateway"
java -jar target\api-gateway-1.0.0-SNAPSHOT.jar
```
*Port*: `8080` (All client REST requests route through this entry point).

---

#### Step 3: Start Core Business Microservices (Terminals 3 to 9)

Open separate PowerShell windows/tabs and run each service:

* **Authentication Service** (Port `8086`):
  ```powershell
  $env:JAVA_HOME="C:\Program Files\Java\jdk-21"
  cd "d:\E-Voting Pilot System\Backend\auth-service"
  java -jar target\auth-service-1.0.0-SNAPSHOT.jar
  ```

* **Voter Service** (Port `8081`):
  ```powershell
  $env:JAVA_HOME="C:\Program Files\Java\jdk-21"
  cd "d:\E-Voting Pilot System\Backend\voter-service"
  java -jar target\voter-service-1.0.0-SNAPSHOT.jar
  ```

* **Election Service** (Port `8082`):
  ```powershell
  $env:JAVA_HOME="C:\Program Files\Java\jdk-21"
  cd "d:\E-Voting Pilot System\Backend\election-service"
  java -jar target\election-service-1.0.0-SNAPSHOT.jar
  ```

* **Candidate Service** (Port `8083`):
  ```powershell
  $env:JAVA_HOME="C:\Program Files\Java\jdk-21"
  cd "d:\E-Voting Pilot System\Backend\candidate-service"
  java -jar target\candidate-service-1.0.0-SNAPSHOT.jar
  ```

* **Voting Service** (Port `8084`):
  ```powershell
  $env:JAVA_HOME="C:\Program Files\Java\jdk-21"
  cd "d:\E-Voting Pilot System\Backend\voting-service"
  java -jar target\voting-service-1.0.0-SNAPSHOT.jar
  ```

* **Result Service** (Port `8085`):
  ```powershell
  $env:JAVA_HOME="C:\Program Files\Java\jdk-21"
  cd "d:\E-Voting Pilot System\Backend\result-service"
  java -jar target\result-service-1.0.0-SNAPSHOT.jar
  ```

* **Audit Service** (Port `8087`):
  ```powershell
  $env:JAVA_HOME="C:\Program Files\Java\jdk-21"
  cd "d:\E-Voting Pilot System\Backend\audit-service"
  java -jar target\audit-service-1.0.0-SNAPSHOT.jar
  ```

---

#### Step 4: Start Angular Frontend (Terminal 10)
```powershell
cd "d:\E-Voting Pilot System\frontend"
npm start
```
*Application URL*: **`http://localhost:4200`**

---

## 4. Port & Endpoint Matrix (Cheat-Sheet)

| Service Name | Port | Base URL / Gateway Route | Primary Function |
|:---|:---:|:---|:---|
| **Angular Frontend** | `4200` | `http://localhost:4200` | EVM Balloting and Admin UI Portal |
| **API Gateway** | `8080` | `http://localhost:8080` | Reverse Proxy, JWT Auth Filter, CORS |
| **Eureka Discovery** | `8761` | `http://localhost:8761` | Live Service Registration Dashboard |
| **Auth Service** | `8086` | `http://localhost:8080/api/auth` | User Registration, Login, JWT Issuance |
| **Voter Service** | `8081` | `http://localhost:8080/api/voters` | Voter Demographic Profile & Admin KYC |
| **Election Service** | `8082` | `http://localhost:8080/api/elections` | Election Scheduling & State Machine |
| **Candidate Service**| `8083` | `http://localhost:8080/api/candidates`| Candidate Nominations & Ballot Symbols |
| **Voting Service** | `8084` | `http://localhost:8080/api/votes` | Double-Vote Prevention & SHA-256 Balloting |
| **Result Service** | `8085` | `http://localhost:8080/api/results` | Tally Computation & Winner Certification |
| **Audit Service** | `8087` | `http://localhost:8080/api/audit` | Tamper-Evident System Audit Trail |

---

## 5. End-to-End Demonstration Workflow

Follow these 6 sequential steps to demonstrate the full application lifecycle:

1. **Voter Registration**:
   - Navigate to `http://localhost:4200`.
   - Register a new voter with username, email, password, and institutional/national EPIC number.
   - Status defaults to `PENDING_VERIFICATION`.
2. **Administrator Verification (KYC)**:
   - Log in with `ROLE_ADMIN` credentials.
   - Open the **Voter Verification** tab and inspect pending registrations.
   - Click **Approve** to transition voter status to `APPROVED`.
3. **Election Scheduling**:
   - In the Admin Portal, create a new election specifying title, description, start timestamp, and end timestamp.
   - State machine advances: `DRAFT` $\to$ `SCHEDULED` $\to$ `ACTIVE`.
4. **Candidate Nominations**:
   - Add candidates to the election with name, political party, symbol URL, and constituency.
5. **EVM-Inspired Balloting**:
   - Log in as the approved voter and open the **Voter Dashboard**.
   - Discover the active election and click **Vote Now**.
   - The dedicated **EVM Interface** renders candidates with symbols, status LEDs, and selection buttons.
   - Select a candidate, review the confirmation modal, and cast the ballot.
   - The backend atomically persists the vote, generates a SHA-256 receipt, and returns confirmation.
   - *Duplicate Vote Test*: Attempting to vote again in the same election triggers an immediate `DuplicateVoteException` / rejection message.
6. **Result Tabulation & Winner Declaration**:
   - Once poll hours conclude, the election transitions to `COMPLETED`.
   - Admin triggers **Compute Results** to calculate total votes, turnout percentage, candidate share, and declare the winner.

---

## 6. Troubleshooting Common Issues

* **Issue: "Port 8080 / 8761 is already in use"**
  - **Resolution**: Identify and terminate the occupying PID:
    ```powershell
    netstat -ano | findstr :8080
    taskkill /PID <PID_NUMBER> /F
    ```

* **Issue: "Access denied for user 'root'@'localhost'"**
  - **Resolution**: Ensure your local MySQL service is running with user `root` and password `Hira2006@` (which is configured as the default across all microservices). If your local password differs, you can override it in your PowerShell session:
    ```powershell
    $env:SPRING_DATASOURCE_PASSWORD="your_password"
    ```

* **Issue: "JDK version incompatibility / compiler error"**
  - **Resolution**: Set PowerShell session to use JDK 21:
    ```powershell
    $env:JAVA_HOME="C:\Program Files\Java\jdk-21"
    $env:Path="C:\Program Files\Java\jdk-21\bin;" + $env:Path
    ```
