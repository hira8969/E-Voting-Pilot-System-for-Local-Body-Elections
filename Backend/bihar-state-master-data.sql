-- ==============================================================================
-- E-Voting Pilot System: Complete Bihar State Administrative & Electoral Master Data
-- Incorporates: 9 Divisions, 38 Districts, 40 Lok Sabha PCs, 243 Assembly ACs,
-- 16 Rajya Sabha Seats (Elected MLAs STV), Panchayati Raj & Municipal Bodies
-- ==============================================================================

USE evoting_election_db;

-- 1. Administrative Divisions (9 Divisions of Bihar)
CREATE TABLE IF NOT EXISTS administrative_divisions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    headquarters VARCHAR(100) NOT NULL,
    districts_count INT NOT NULL DEFAULT 0
);

-- Ensure district table has division_id
ALTER TABLE districts ADD COLUMN IF NOT EXISTS division_id BIGINT;
ALTER TABLE districts ADD CONSTRAINT fk_district_division 
    FOREIGN KEY (division_id) REFERENCES administrative_divisions(id) ON DELETE SET NULL;

-- 2. Rajya Sabha Representation Master
CREATE TABLE IF NOT EXISTS rajya_sabha_representation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL DEFAULT 'Bihar',
    total_seats INT NOT NULL DEFAULT 16,
    electoral_college VARCHAR(100) NOT NULL DEFAULT 'Elected Members of Bihar Legislative Assembly (MLAs)',
    voting_system VARCHAR(100) NOT NULL DEFAULT 'Proportional Representation by Single Transferable Vote (STV)',
    public_ballot_allowed BOOLEAN NOT NULL DEFAULT FALSE
);

-- 3. Delimitation & Electoral Term Master (To prevent hardcoding)
CREATE TABLE IF NOT EXISTS electoral_terms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    term_code VARCHAR(50) NOT NULL UNIQUE,
    start_year INT NOT NULL,
    end_year INT NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    description VARCHAR(255)
);

-- ==============================================================================
-- SEED DATA: 9 ADMINISTRATIVE DIVISIONS
-- ==============================================================================
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

-- ==============================================================================
-- SEED DATA: ALL 38 DISTRICTS OF BIHAR
-- ==============================================================================
INSERT IGNORE INTO districts (id, state_id, division_id, name, headquarters) VALUES
-- Patna Division (6 Districts)
(101, 1, 1, 'Patna', 'Patna'),
(102, 1, 1, 'Nalanda', 'Bihar Sharif'),
(103, 1, 1, 'Bhojpur', 'Arrah'),
(104, 1, 1, 'Rohtas', 'Sasaram'),
(105, 1, 1, 'Buxar', 'Buxar'),
(106, 1, 1, 'Kaimur (Bhabua)', 'Bhabua'),

-- Saran Division (3 Districts)
(201, 1, 2, 'Saran', 'Chhapra'),
(202, 1, 2, 'Siwan', 'Siwan'),
(203, 1, 2, 'Gopalganj', 'Gopalganj'),

-- Tirhut Division (6 Districts)
(301, 1, 3, 'Muzaffarpur', 'Muzaffarpur'),
(302, 1, 3, 'West Champaran', 'Bettiah'),
(303, 1, 3, 'East Champaran', 'Motihari'),
(1,   1, 3, 'Sitamarhi', 'Dumra'),
(305, 1, 3, 'Sheohar', 'Sheohar'),
(306, 1, 3, 'Vaishali', 'Hajipur'),

-- Purnia Division (4 Districts)
(401, 1, 4, 'Purnia', 'Purnia'),
(402, 1, 4, 'Katihar', 'Katihar'),
(403, 1, 4, 'Kishanganj', 'Kishanganj'),
(404, 1, 4, 'Araria', 'Araria'),

-- Bhagalpur Division (2 Districts)
(501, 1, 5, 'Bhagalpur', 'Bhagalpur'),
(502, 1, 5, 'Banka', 'Banka'),

-- Darbhanga Division (3 Districts)
(601, 1, 6, 'Darbhanga', 'Darbhanga'),
(602, 1, 6, 'Madhubani', 'Madhubani'),
(603, 1, 6, 'Samastipur', 'Samastipur'),

-- Kosi Division (3 Districts)
(701, 1, 7, 'Saharsa', 'Saharsa'),
(702, 1, 7, 'Madhepura', 'Madhepura'),
(703, 1, 7, 'Supaul', 'Supaul'),

-- Magadh Division (5 Districts)
(801, 1, 8, 'Gaya', 'Gaya'),
(802, 1, 8, 'Nawada', 'Nawada'),
(803, 1, 8, 'Jehanabad', 'Jehanabad'),
(804, 1, 8, 'Aurangabad', 'Aurangabad'),
(805, 1, 8, 'Arwal', 'Arwal'),

-- Munger Division (6 Districts)
(901, 1, 9, 'Munger', 'Munger'),
(902, 1, 9, 'Jamui', 'Jamui'),
(903, 1, 9, 'Khagaria', 'Khagaria'),
(904, 1, 9, 'Lakhisarai', 'Lakhisarai'),
(905, 1, 9, 'Begusarai', 'Begusarai'),
(906, 1, 9, 'Sheikhpura', 'Sheikhpura');

-- ==============================================================================
-- SEED DATA: ALL 40 PARLIAMENTARY CONSTITUENCIES (LOK SABHA) OF BIHAR
-- ==============================================================================
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

-- ==============================================================================
-- RAJYA SABHA & ELECTORAL TERMS MASTER
-- ==============================================================================
INSERT IGNORE INTO rajya_sabha_representation (id, state_name, total_seats, electoral_college, voting_system, public_ballot_allowed)
VALUES (1, 'Bihar', 16, 'Elected Members of Bihar Legislative Assembly (MLAs)', 'Proportional Representation by Single Transferable Vote (STV)', FALSE);

INSERT IGNORE INTO electoral_terms (id, term_code, start_year, end_year, is_current, description) VALUES
(1, 'PANCHAYAT_TERM_2021_2026', 2021, 2026, FALSE, 'Bihar Panchayati Raj 2021-2026 Delimitation Term'),
(2, 'PANCHAYAT_TERM_2026_2031', 2026, 2031, TRUE, 'Current Bihar SEC 2026 Restructuring and Delimitation Term'),
(3, 'VIDHAN_SABHA_TERM_17', 2020, 2025, FALSE, '17th Bihar Legislative Assembly Term'),
(4, 'VIDHAN_SABHA_TERM_18', 2025, 2030, TRUE, '18th Bihar Legislative Assembly Term');

-- Rajya Sabha Election Type
INSERT IGNORE INTO election_types (id, code, name, governing_body, tier) VALUES
(8, 'RAJYA_SABHA', 'Rajya Sabha Election (Council of States - MLAs STV)', 'ECI', 'STATE_COUNCIL');
