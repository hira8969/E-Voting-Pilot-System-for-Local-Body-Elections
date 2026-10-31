-- ==============================================================================
-- E-Voting Pilot System: Bihar & Sitamarhi District Administrative & Election Master Data
-- Implements 2026 Delimitation-ready Administrative Hierarchy & Election Types
-- ==============================================================================

USE evoting_election_db;

-- 1. State 
CREATE TABLE IF NOT EXISTS states (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE
);

-- 2. District 
CREATE TABLE IF NOT EXISTS districts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    state_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    headquarters VARCHAR(100) NOT NULL,
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
);

-- 3. Sub-Division (Anumandal) 
CREATE TABLE IF NOT EXISTS sub_divisions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    district_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE,
    UNIQUE KEY uk_district_subdivision (district_id, name)
);

-- 4. Block (Prakhand) Master (17 Blocks of Sitamarhi)
CREATE TABLE IF NOT EXISTS blocks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sub_division_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (sub_division_id) REFERENCES sub_divisions(id) ON DELETE CASCADE,
    UNIQUE KEY uk_subdivision_block (sub_division_id, name)
);

-- 5. Parliamentary Constituencies (Lok Sabha)
CREATE TABLE IF NOT EXISTS parliamentary_constituencies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pc_number INT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL DEFAULT 'GEN'
);

-- 6. Assembly Constituencies (Vidhan Sabha - 8 in Sitamarhi)
CREATE TABLE IF NOT EXISTS assembly_constituencies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ac_number INT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL DEFAULT 'GEN',
    parliamentary_id BIGINT,
    FOREIGN KEY (parliamentary_id) REFERENCES parliamentary_constituencies(id) ON DELETE SET NULL
);

-- 7. Gram Panchayats Master
CREATE TABLE IF NOT EXISTS gram_panchayats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    block_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    panchayat_code VARCHAR(50),
    FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
    UNIQUE KEY uk_block_panchayat (block_id, name)
);

-- 8. Wards Master (Delimitation-driven ~500 population per ward)
CREATE TABLE IF NOT EXISTS wards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gram_panchayat_id BIGINT,
    municipal_body_name VARCHAR(100),
    ward_number INT NOT NULL,
    delimitation_year INT DEFAULT 2026,
    reservation_status VARCHAR(50) DEFAULT 'OPEN_GEN', -- OPEN_GEN, EBC_FEMALE, SC, BC_FEMALE, etc.
    FOREIGN KEY (gram_panchayat_id) REFERENCES gram_panchayats(id) ON DELETE CASCADE
);

-- 9. Election Type Master
CREATE TABLE IF NOT EXISTS election_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    governing_body VARCHAR(100) NOT NULL, -- ECI or SEC_BIHAR
    tier VARCHAR(50) NOT NULL
);

-- ==============================================================================
-- SEED DATA INSERTION
-- ==============================================================================

-- State: Bihar
INSERT IGNORE INTO states (id, name, code) VALUES (1, 'Bihar', 'BR');

-- District: Sitamarhi
INSERT IGNORE INTO districts (id, state_id, name, headquarters) 
VALUES (1, 1, 'Sitamarhi', 'Dumra');

-- Sub-Divisions of Sitamarhi (3 Sub-Divisions)
INSERT IGNORE INTO sub_divisions (id, district_id, name) VALUES
(1, 1, 'Sadar'),
(2, 1, 'Pupri'),
(3, 1, 'Belsand');

-- 17 Blocks of Sitamarhi mapped to Sub-Divisions
INSERT IGNORE INTO blocks (id, sub_division_id, name) VALUES
-- Sadar Sub-Division Blocks (9 Blocks)
(1, 1, 'Bairgania'),
(2, 1, 'Bathnaha'),
(3, 1, 'Dumra'),
(4, 1, 'Majorganj'),
(5, 1, 'Parihar'),
(6, 1, 'Riga'),
(7, 1, 'Sonbarsa'),
(8, 1, 'Suppi'),
-- Pupri Sub-Division Blocks (5 Blocks)
(9, 2, 'Bajpatti'),
(10, 2, 'Bokhra'),
(11, 2, 'Choraut'),
(12, 2, 'Nanpur'),
(13, 2, 'Pupri'),
(14, 2, 'Sursand'),
-- Belsand Sub-Division Blocks (3 Blocks)
(15, 3, 'Belsand'),
(16, 3, 'Parsauni'),
(17, 3, 'Runni Saidpur');

-- Parliamentary Constituencies
INSERT IGNORE INTO parliamentary_constituencies (id, pc_number, name, category) VALUES
(1, 4, 'Sheohar (Part)', 'GEN'),
(2, 5, 'Sitamarhi', 'GEN');

-- 8 Assembly Constituencies in Sitamarhi
INSERT IGNORE INTO assembly_constituencies (id, ac_number, name, category, parliamentary_id) VALUES
(1, 23, 'Riga', 'GEN', 2),
(2, 24, 'Bathnaha', 'SC', 2),
(3, 25, 'Parihar', 'GEN', 2),
(4, 26, 'Sursand', 'GEN', 2),
(5, 27, 'Bajpatti', 'GEN', 2),
(6, 28, 'Sitamarhi', 'GEN', 2),
(7, 29, 'Runnisaidpur', 'GEN', 2),
(8, 30, 'Belsand', 'GEN', 1);

-- Election Types in Bihar
INSERT IGNORE INTO election_types (id, code, name, governing_body, tier) VALUES
(1, 'LOK_SABHA', 'Lok Sabha General Election (MP)', 'ECI', 'NATIONAL'),
(2, 'VIDHAN_SABHA', 'Bihar Legislative Assembly Election (MLA)', 'ECI', 'STATE'),
(3, 'PANCHAYAT_MUKHIYA', 'Bihar Gram Panchayat Mukhiya Election 2026', 'SEC_BIHAR', 'GRAM_PANCHAYAT'),
(4, 'PANCHAYAT_WARD', 'Gram Panchayat Ward Member Election 2026', 'SEC_BIHAR', 'WARD'),
(5, 'ZILA_PARISHAD', 'Zila Parishad Territorial Member Election', 'SEC_BIHAR', 'DISTRICT'),
(6, 'PANCHAYAT_SAMITI', 'Panchayat Samiti Member Election', 'SEC_BIHAR', 'BLOCK'),
(7, 'MUNICIPAL_MAYOR', 'Urban Local Body Mayor / Chief Councillor Election', 'SEC_BIHAR', 'MUNICIPAL');

-- Sample Gram Panchayats across key blocks
INSERT IGNORE INTO gram_panchayats (id, block_id, name, panchayat_code) VALUES
(1, 3, 'Lagma', 'GP-DUM-001'),
(2, 3, 'Bhikha', 'GP-DUM-002'),
(3, 6, 'Riga North', 'GP-RIG-001'),
(4, 6, 'Riga South', 'GP-RIG-002'),
(5, 17, 'Runnisaidpur North', 'GP-RUN-001'),
(6, 9, 'Bajpatti Western', 'GP-BAJ-001'),
(7, 14, 'Sursand Western', 'GP-SUR-001');

-- Sample Delimitation Wards (2026 rules)
INSERT IGNORE INTO wards (gram_panchayat_id, municipal_body_name, ward_number, delimitation_year, reservation_status) VALUES
(1, NULL, 1, 2026, 'OPEN_GEN'),
(1, NULL, 2, 2026, 'EBC_FEMALE'),
(1, NULL, 3, 2026, 'BC'),
(1, NULL, 4, 2026, 'SC'),
(3, NULL, 1, 2026, 'OPEN_GEN'),
(3, NULL, 2, 2026, 'OPEN_FEMALE'),
(NULL, 'Sitamarhi Municipal Corporation', 1, 2026, 'OPEN_GEN'),
(NULL, 'Sitamarhi Municipal Corporation', 2, 2026, 'BC_FEMALE'),
(NULL, 'Sitamarhi Municipal Corporation', 3, 2026, 'SC');

-- ==============================================================================
-- PILOT ELECTIONS IN SITAMARHI
-- ==============================================================================
INSERT IGNORE INTO elections (id, title, description, start_date, end_date, status, election_type) VALUES
(1, '28 - Sitamarhi Assembly Constituency Pilot Election', 'Pilot Legislative Assembly Election for 28-Sitamarhi AC under Bihar Electoral Simulation', NOW() - INTERVAL 1 HOUR, NOW() + INTERVAL 24 HOUR, 'ACTIVE', 'VIDHAN_SABHA'),
(2, 'Bihar Gram Panchayat General Election 2026 - Dumra Block Mukhiya', 'Three-tier local body election simulation for Mukhiya of Lagma Gram Panchayat, Dumra, Sitamarhi', NOW() - INTERVAL 1 HOUR, NOW() + INTERVAL 48 HOUR, 'ACTIVE', 'PANCHAYAT'),
(3, 'Sitamarhi Municipal Corporation (Nagar Nigam) Ward Councillor Election 2026', 'Urban Local Body civic simulation for Ward No. 01, Sitamarhi Municipal Corporation', NOW() + INTERVAL 2 DAY, NOW() + INTERVAL 3 DAY, 'SCHEDULED', 'MUNICIPAL');

-- ==============================================================================
-- CANDIDATES IN CANDIDATE DB
-- ==============================================================================
USE evoting_candidate_db;

INSERT IGNORE INTO candidates (id, election_id, full_name, party_name, symbol_url, constituency, bio, manifesto, approval_status) VALUES
-- Candidates for Election #1 (28 - Sitamarhi Assembly Constituency)
(1, 1, 'Ramesh Kumar Jha', 'Janata Vikas Party', 'https://api.iconify.design/lucide:sun.svg', '28 - Sitamarhi', 'Social worker and educator with 15 years grassroots experience in Dumra & Sitamarhi.', 'Focus on irrigation, road connectivity, higher educational institutes in Sitamarhi.', 'APPROVED'),
(2, 1, 'Dr. Md. Tarique Anwer', 'Rashtriya Lok Morcha', 'https://api.iconify.design/lucide:book-open.svg', '28 - Sitamarhi', 'Medical practitioner and healthcare advocate serving North Bihar.', 'Modernization of Sadar Hospital, 24x7 emergency medical units in every block.', 'APPROVED'),
(3, 1, 'Sunita Devi', 'Samata Chetna Dal', 'https://api.iconify.design/lucide:scale.svg', '28 - Sitamarhi', 'Community leader and women empowerment champion in Bajpatti and Riga.', 'Women skill centers, farmer MSP guarantee, youth job incubation.', 'APPROVED'),
(4, 1, 'Amitabh Singh', 'Independent (NOTA Alternative)', 'https://api.iconify.design/lucide:flag.svg', '28 - Sitamarhi', 'Independent youth candidate advocating transparent civic administration.', 'Digital municipal services, zero corruption grievance portal for citizens.', 'APPROVED'),

-- Candidates for Election #2 (Dumra Block Mukhiya)
(5, 2, 'Pankaj Kumar Singh', 'Independent - Mukhiya Nominee', 'https://api.iconify.design/lucide:home.svg', 'Lagma Gram Panchayat, Dumra', 'Resident of Lagma with extensive rural development engagement.', 'Piped drinking water in every tola, solar streetlights across all wards.', 'APPROVED'),
(6, 2, 'Manju Kumari', 'Independent - Mukhiya Nominee', 'https://api.iconify.design/lucide:tree-pine.svg', 'Lagma Gram Panchayat, Dumra', 'Self-Help Group (Jeevika) coordinator.', 'Panchayat Bhavan digital service center, organic farming support.', 'APPROVED');
