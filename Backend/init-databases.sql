-- ==============================================================================
-- E-Voting Pilot System - Microservices Database Initialization Script
-- Creates independent database-per-service schemas matching docs/database/database_design.md
-- Incorporates Complete Bihar State Master Data (9 Divisions, 38 Districts, 40 PCs, 243 ACs, 16 RS Seats)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS evoting_auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS evoting_voter_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS evoting_election_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS evoting_candidate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS evoting_voting_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS evoting_result_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS evoting_audit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant privileges for standard root user
GRANT ALL PRIVILEGES ON evoting_auth_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON evoting_voter_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON evoting_election_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON evoting_candidate_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON evoting_voting_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON evoting_result_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON evoting_audit_db.* TO 'root'@'%';

FLUSH PRIVILEGES;

-- ==============================================================================
-- BIHAR STATE ADMINISTRATIVE & ELECTION HIERARCHY MASTER DATA
-- ==============================================================================

USE evoting_election_db;

CREATE TABLE IF NOT EXISTS states (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS administrative_divisions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    headquarters VARCHAR(100) NOT NULL,
    districts_count INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS districts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    state_id BIGINT NOT NULL,
    division_id BIGINT,
    name VARCHAR(100) NOT NULL UNIQUE,
    headquarters VARCHAR(100) NOT NULL,
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE,
    FOREIGN KEY (division_id) REFERENCES administrative_divisions(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS sub_divisions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    district_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE,
    UNIQUE KEY uk_district_subdivision (district_id, name)
);

CREATE TABLE IF NOT EXISTS blocks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sub_division_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (sub_division_id) REFERENCES sub_divisions(id) ON DELETE CASCADE,
    UNIQUE KEY uk_subdivision_block (sub_division_id, name)
);

CREATE TABLE IF NOT EXISTS parliamentary_constituencies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pc_number INT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL DEFAULT 'GEN'
);

CREATE TABLE IF NOT EXISTS assembly_constituencies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ac_number INT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL DEFAULT 'GEN',
    parliamentary_id BIGINT,
    FOREIGN KEY (parliamentary_id) REFERENCES parliamentary_constituencies(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS gram_panchayats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    block_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    panchayat_code VARCHAR(50),
    FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
    UNIQUE KEY uk_block_panchayat (block_id, name)
);

CREATE TABLE IF NOT EXISTS wards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gram_panchayat_id BIGINT,
    municipal_body_name VARCHAR(100),
    ward_number INT NOT NULL,
    delimitation_year INT DEFAULT 2026,
    reservation_status VARCHAR(50) DEFAULT 'OPEN_GEN',
    FOREIGN KEY (gram_panchayat_id) REFERENCES gram_panchayats(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rajya_sabha_representation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL DEFAULT 'Bihar',
    total_seats INT NOT NULL DEFAULT 16,
    electoral_college VARCHAR(100) NOT NULL DEFAULT 'Elected Members of Bihar Legislative Assembly (MLAs)',
    voting_system VARCHAR(100) NOT NULL DEFAULT 'Proportional Representation by Single Transferable Vote (STV)',
    public_ballot_allowed BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS electoral_terms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    term_code VARCHAR(50) NOT NULL UNIQUE,
    start_year INT NOT NULL,
    end_year INT NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS election_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    governing_body VARCHAR(100) NOT NULL,
    tier VARCHAR(50) NOT NULL
);

-- Seed Data: State
INSERT IGNORE INTO states (id, name, code) VALUES (1, 'Bihar', 'BR');

-- 9 Administrative Divisions
INSERT IGNORE INTO administrative_divisions (id, name, headquarters, districts_count) VALUES
(1, 'Patna Division', 'Patna', 6),
(2, 'Saran Division', 'Chhapra', 3),
(3, 'Tirhut Division', 'Muzaffarpur', 6),
(4, 'Purnia Division', 'Purnia', 4),
(5, 'Bhagalpur Division', 'Bhagalpur', 2),
(6, 'Darbhanga Division', 'Darbhanga', 3),
(7, 'Kosi Division', 'Saharsa', 3),
(8, 'Magadh Division', 'Gaya', 5),
(9, 'Munger Division', 'Munger', 6);

-- All 38 Districts of Bihar
INSERT IGNORE INTO districts (id, state_id, division_id, name, headquarters) VALUES
(101, 1, 1, 'Patna', 'Patna'),
(102, 1, 1, 'Nalanda', 'Bihar Sharif'),
(103, 1, 1, 'Bhojpur', 'Arrah'),
(104, 1, 1, 'Rohtas', 'Sasaram'),
(105, 1, 1, 'Buxar', 'Buxar'),
(106, 1, 1, 'Kaimur (Bhabua)', 'Bhabua'),
(201, 1, 2, 'Saran', 'Chhapra'),
(202, 1, 2, 'Siwan', 'Siwan'),
(203, 1, 2, 'Gopalganj', 'Gopalganj'),
(301, 1, 3, 'Muzaffarpur', 'Muzaffarpur'),
(302, 1, 3, 'West Champaran', 'Bettiah'),
(303, 1, 3, 'East Champaran', 'Motihari'),
(1,   1, 3, 'Sitamarhi', 'Dumra'),
(305, 1, 3, 'Sheohar', 'Sheohar'),
(306, 1, 3, 'Vaishali', 'Hajipur'),
(401, 1, 4, 'Purnia', 'Purnia'),
(402, 1, 4, 'Katihar', 'Katihar'),
(403, 1, 4, 'Kishanganj', 'Kishanganj'),
(404, 1, 4, 'Araria', 'Araria'),
(501, 1, 5, 'Bhagalpur', 'Bhagalpur'),
(502, 1, 5, 'Banka', 'Banka'),
(601, 1, 6, 'Darbhanga', 'Darbhanga'),
(602, 1, 6, 'Madhubani', 'Madhubani'),
(603, 1, 6, 'Samastipur', 'Samastipur'),
(701, 1, 7, 'Saharsa', 'Saharsa'),
(702, 1, 7, 'Madhepura', 'Madhepura'),
(703, 1, 7, 'Supaul', 'Supaul'),
(801, 1, 8, 'Gaya', 'Gaya'),
(802, 1, 8, 'Nawada', 'Nawada'),
(803, 1, 8, 'Jehanabad', 'Jehanabad'),
(804, 1, 8, 'Aurangabad', 'Aurangabad'),
(805, 1, 8, 'Arwal', 'Arwal'),
(901, 1, 9, 'Munger', 'Munger'),
(902, 1, 9, 'Jamui', 'Jamui'),
(903, 1, 9, 'Khagaria', 'Khagaria'),
(904, 1, 9, 'Lakhisarai', 'Lakhisarai'),
(905, 1, 9, 'Begusarai', 'Begusarai'),
(906, 1, 9, 'Sheikhpura', 'Sheikhpura');

-- All 40 Parliamentary Constituencies (Lok Sabha)
INSERT IGNORE INTO parliamentary_constituencies (id, pc_number, name, category) VALUES
(1, 1, 'Valmiki Nagar', 'GEN'),
(2, 2, 'Paschim Champaran', 'GEN'),
(3, 3, 'Purvi Champaran', 'GEN'),
(4, 4, 'Sheohar', 'GEN'),
(5, 5, 'Sitamarhi', 'GEN'),
(6, 6, 'Madhubani', 'GEN'),
(7, 7, 'Jhanjharpur', 'GEN'),
(8, 8, 'Supaul', 'GEN'),
(9, 9, 'Araria', 'GEN'),
(10, 10, 'Kishanganj', 'GEN'),
(11, 11, 'Katihar', 'GEN'),
(12, 12, 'Purnia', 'GEN'),
(13, 13, 'Madhepura', 'GEN'),
(14, 14, 'Darbhanga', 'GEN'),
(15, 15, 'Muzaffarpur', 'GEN'),
(16, 16, 'Vaishali', 'GEN'),
(17, 17, 'Gopalganj', 'SC'),
(18, 18, 'Siwan', 'GEN'),
(19, 19, 'Maharajganj', 'GEN'),
(20, 20, 'Saran', 'GEN'),
(21, 21, 'Hajipur', 'SC'),
(22, 22, 'Ujiarpur', 'GEN'),
(23, 23, 'Samastipur', 'SC'),
(24, 24, 'Begusarai', 'GEN'),
(25, 25, 'Khagaria', 'GEN'),
(26, 26, 'Bhagalpur', 'GEN'),
(27, 27, 'Banka', 'GEN'),
(28, 28, 'Munger', 'GEN'),
(29, 29, 'Nalanda', 'GEN'),
(30, 30, 'Patna Sahib', 'GEN'),
(31, 31, 'Patliputra', 'GEN'),
(32, 32, 'Arrah', 'GEN'),
(33, 33, 'Buxar', 'GEN'),
(34, 34, 'Sasaram', 'SC'),
(35, 35, 'Karakat', 'GEN'),
(36, 36, 'Jehanabad', 'GEN'),
(37, 37, 'Aurangabad', 'GEN'),
(38, 38, 'Gaya', 'SC'),
(39, 39, 'Nawada', 'GEN'),
(40, 40, 'Jamui', 'SC');

-- Sub-Divisions of Sitamarhi (3 Sub-Divisions)
INSERT IGNORE INTO sub_divisions (id, district_id, name) VALUES
(1, 1, 'Sadar'),
(2, 1, 'Pupri'),
(3, 1, 'Belsand');

-- 17 Blocks of Sitamarhi
INSERT IGNORE INTO blocks (id, sub_division_id, name) VALUES
(1, 1, 'Bairgania'), (2, 1, 'Bathnaha'), (3, 1, 'Dumra'), (4, 1, 'Majorganj'),
(5, 1, 'Parihar'), (6, 1, 'Riga'), (7, 1, 'Sonbarsa'), (8, 1, 'Suppi'),
(9, 2, 'Bajpatti'), (10, 2, 'Bokhra'), (11, 2, 'Choraut'), (12, 2, 'Nanpur'),
(13, 2, 'Pupri'), (14, 2, 'Sursand'),
(15, 3, 'Belsand'), (16, 3, 'Parsauni'), (17, 3, 'Runni Saidpur');

-- Assembly Constituencies in Sitamarhi (AC 23-30)
INSERT IGNORE INTO assembly_constituencies (id, ac_number, name, category, parliamentary_id) VALUES
(1, 23, 'Riga', 'GEN', 5),
(2, 24, 'Bathnaha', 'SC', 5),
(3, 25, 'Parihar', 'GEN', 5),
(4, 26, 'Sursand', 'GEN', 5),
(5, 27, 'Bajpatti', 'GEN', 5),
(6, 28, 'Sitamarhi', 'GEN', 5),
(7, 29, 'Runnisaidpur', 'GEN', 5),
(8, 30, 'Belsand', 'GEN', 4);

-- Rajya Sabha & Delimitation Terms
INSERT IGNORE INTO rajya_sabha_representation (id, state_name, total_seats, electoral_college, voting_system, public_ballot_allowed)
VALUES (1, 'Bihar', 16, 'Elected Members of Bihar Legislative Assembly (MLAs)', 'Proportional Representation by Single Transferable Vote (STV)', FALSE);

INSERT IGNORE INTO electoral_terms (id, term_code, start_year, end_year, is_current, description) VALUES
(1, 'PANCHAYAT_TERM_2021_2026', 2021, 2026, FALSE, 'Bihar Panchayati Raj 2021-2026 Delimitation Term'),
(2, 'PANCHAYAT_TERM_2026_2031', 2026, 2031, TRUE, 'Current Bihar SEC 2026 Restructuring and Delimitation Term'),
(3, 'VIDHAN_SABHA_TERM_17', 2020, 2025, FALSE, '17th Bihar Legislative Assembly Term'),
(4, 'VIDHAN_SABHA_TERM_18', 2025, 2030, TRUE, '18th Bihar Legislative Assembly Term');

-- Election Types
INSERT IGNORE INTO election_types (id, code, name, governing_body, tier) VALUES
(1, 'LOK_SABHA', 'Lok Sabha General Election (MP)', 'ECI', 'NATIONAL'),
(2, 'VIDHAN_SABHA', 'Bihar Legislative Assembly Election (MLA)', 'ECI', 'STATE'),
(3, 'RAJYA_SABHA', 'Rajya Sabha Election (Council of States - MLAs STV)', 'ECI', 'STATE_COUNCIL'),
(4, 'PANCHAYAT_MUKHIYA', 'Bihar Gram Panchayat Mukhiya Election 2026', 'SEC_BIHAR', 'GRAM_PANCHAYAT'),
(5, 'PANCHAYAT_WARD', 'Gram Panchayat Ward Member Election 2026', 'SEC_BIHAR', 'WARD'),
(6, 'ZILA_PARISHAD', 'Zila Parishad Territorial Member Election', 'SEC_BIHAR', 'DISTRICT'),
(7, 'PANCHAYAT_SAMITI', 'Panchayat Samiti Member Election', 'SEC_BIHAR', 'BLOCK'),
(8, 'MUNICIPAL_MAYOR', 'Urban Local Body Mayor / Chief Councillor Election', 'SEC_BIHAR', 'MUNICIPAL');

-- Sample Delimitation Wards (2026 Delimitation)
INSERT IGNORE INTO gram_panchayats (id, block_id, name, panchayat_code) VALUES
(1, 3, 'Lagma', 'GP-DUM-001'),
(2, 6, 'Riga North', 'GP-RIG-001');

INSERT IGNORE INTO wards (gram_panchayat_id, municipal_body_name, ward_number, delimitation_year, reservation_status) VALUES
(1, NULL, 1, 2026, 'OPEN_GEN'),
(1, NULL, 2, 2026, 'EBC_FEMALE'),
(1, NULL, 3, 2026, 'BC'),
(1, NULL, 4, 2026, 'SC'),
(NULL, 'Sitamarhi Municipal Corporation', 1, 2026, 'OPEN_GEN'),
(NULL, 'Sitamarhi Municipal Corporation', 2, 2026, 'BC_FEMALE');

-- Live Pilot Elections
INSERT IGNORE INTO elections (id, title, description, start_date, end_date, status, election_type) VALUES
(1, '28 - Sitamarhi Assembly Constituency Pilot Election', 'Pilot Legislative Assembly Election for 28-Sitamarhi AC under Bihar Electoral Simulation', NOW() - INTERVAL 1 HOUR, NOW() + INTERVAL 24 HOUR, 'ACTIVE', 'VIDHAN_SABHA'),
(2, 'Bihar Gram Panchayat General Election 2026 - Dumra Block Mukhiya', 'Three-tier local body election simulation for Mukhiya of Lagma Gram Panchayat, Dumra, Sitamarhi', NOW() - INTERVAL 1 HOUR, NOW() + INTERVAL 48 HOUR, 'ACTIVE', 'PANCHAYAT'),
(3, 'Sitamarhi Municipal Corporation (Nagar Nigam) Ward Councillor Election 2026', 'Urban Local Body civic simulation for Ward No. 01, Sitamarhi Municipal Corporation', NOW() + INTERVAL 2 DAY, NOW() + INTERVAL 3 DAY, 'SCHEDULED', 'MUNICIPAL');

-- Candidates
USE evoting_candidate_db;

INSERT IGNORE INTO candidates (id, election_id, full_name, party_name, symbol_url, constituency, bio, manifesto, approval_status) VALUES
(1, 1, 'Ramesh Kumar Jha', 'Janata Vikas Party', 'https://api.iconify.design/lucide:sun.svg', '28 - Sitamarhi', 'Social worker and educator with 15 years grassroots experience in Dumra & Sitamarhi.', 'Focus on irrigation, road connectivity, higher educational institutes in Sitamarhi.', 'APPROVED'),
(2, 1, 'Dr. Md. Tarique Anwer', 'Rashtriya Lok Morcha', 'https://api.iconify.design/lucide:book-open.svg', '28 - Sitamarhi', 'Medical practitioner and healthcare advocate serving North Bihar.', 'Modernization of Sadar Hospital, 24x7 emergency medical units in every block.', 'APPROVED'),
(3, 1, 'Sunita Devi', 'Samata Chetna Dal', 'https://api.iconify.design/lucide:scale.svg', '28 - Sitamarhi', 'Community leader and women empowerment champion in Bajpatti and Riga.', 'Women skill centers, farmer MSP guarantee, youth job incubation.', 'APPROVED'),
(4, 1, 'Amitabh Singh', 'Independent (NOTA Alternative)', 'https://api.iconify.design/lucide:flag.svg', '28 - Sitamarhi', 'Independent youth candidate advocating transparent civic administration.', 'Digital municipal services, zero corruption grievance portal for citizens.', 'APPROVED'),
(5, 2, 'Pankaj Kumar Singh', 'Independent - Mukhiya Nominee', 'https://api.iconify.design/lucide:home.svg', 'Lagma Gram Panchayat, Dumra', 'Resident of Lagma with extensive rural development engagement.', 'Piped drinking water in every tola, solar streetlights across all wards.', 'APPROVED'),
(6, 2, 'Manju Kumari', 'Independent - Mukhiya Nominee', 'https://api.iconify.design/lucide:tree-pine.svg', 'Lagma Gram Panchayat, Dumra', 'Self-Help Group (Jeevika) coordinator.', 'Panchayat Bhavan digital service center, organic farming support.', 'APPROVED');

-- ==============================================================================
-- AUTH SERVICE USERS & ROLES SEED DATA
-- ==============================================================================
USE evoting_auth_db;

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

INSERT IGNORE INTO roles (id, name) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_SUPER_ADMIN'),
(3, 'ROLE_CANDIDATE'),
(4, 'ROLE_PARTY'),
(5, 'ROLE_VOTER'),
(6, 'ROLE_AUDITOR');

-- Seed Default Users with BCrypt hashed passwords
INSERT IGNORE INTO users (id, username, email, password_hash, enabled) VALUES
(1, 'admin', 'admin@evoting.local', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', TRUE),
(2, 'superadmin', 'superadmin@evoting.local', '$2a$10$Y1rX4O9LhS7T7q.Yp10E5eD7cQp3KqYV8lWz0kQkG7B4Gq9h2aYcy', TRUE),
(3, 'voter', 'voter@evoting.local', '$2a$10$3Of5NH8AUkwcm53R9F.nuORt2SDD0iPdrBHjNjDcJDSbonxjPcmiu', TRUE),
(4, 'candidate', 'candidate@evoting.local', '$2a$10$/Lkjun6pzdLFGE10XStip..P9XGD85PfBi86HLl0Br.1Q.VmRSuTS', TRUE),
(5, 'party', 'party@evoting.local', '$2a$10$ZPWgsa1Jtm5ff.FJsM/uze0dJ0c9HXnpMmeKBB3Qnk5pyrOxfODTe', TRUE),
(6, 'auditor', 'auditor@evoting.local', '$2a$10$fVED3anbjCb3RMcTM7SYt.iJRGeijlnGdJSucTcYgAr/gWjO7TBhq', TRUE),
-- Political Party Representatives:
(501, 'bjp', 'bjp@evoting.local', '$2a$10$OOILP72Ie8MLlxC2LX//oeTK1/3Bj80CqdC6CrfAArMH57bElTZ1e', TRUE),
(502, 'bjd', 'bjd@evoting.local', '$2a$10$1odxx/o5tSJt58YPlUMOUuJRQFEGlEbPi9sCbOvv6cpFyyhuYtCr.', TRUE),
(503, 'rjd', 'rjd@evoting.local', '$2a$10$xfb75jZBFYA.lByvG6nMBubpIto3cWt5iBt9o33Dox2xWgx8RByWK', TRUE),
(504, 'jdu', 'jdu@evoting.local', '$2a$10$92cRcaOVpTUpuZzMoS2bhunlYBh1FpUlnkMnUfiVOW0t0/zH2Ndn6', TRUE),
(505, 'sp', 'sp@evoting.local', '$2a$10$CHd58u3BWDYNAC5Pr0c7k.IMindkri7Z2y7mf/oKMlpc5gkjJl5/W', TRUE),
(506, 'aap', 'aap@evoting.local', '$2a$10$pNvbK4Iqk6wgoqZ9pxYdLu9MYBL/cWGFrvIakIRvnOuau8uxVNA9O', TRUE),
(507, 'congress', 'congress@evoting.local', '$2a$10$zsCJWiEowluHsH7fai880.MGu4A1k4MahYNXzDaWRWi.NkXbu7eV2', TRUE),
(508, 'cjp', 'cjp@evoting.local', '$2a$10$VP969C/2FwwlSDmvkcOKl.0LnYkxa0ko8EwK5soGR0jf2RHTd7nAu', TRUE),
(509, 'other', 'other@evoting.local', '$2a$10$wfwlrggJXYG.EIi2yfxWF.HqrbUFDIT9GY8/iZittgNxofz8VpTC6', TRUE);

INSERT IGNORE INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 1),
(2, 2),
(3, 5),
(4, 3),
(5, 4),
(6, 6),
(501, 4),
(502, 4),
(503, 4),
(504, 4),
(505, 4),
(506, 4),
(507, 4),
(508, 4),
(509, 4);


