# Bihar & Sitamarhi District Administrative & Electoral Hierarchy

## 1. Administrative Structure of Sitamarhi District

According to official administrative records and the State Election Commission (SEC) Bihar:

| Administrative Level | Count in Sitamarhi | Specific Details |
|:---|:---:|:---|
| **State** | 1 | Bihar (Code: `BR`) |
| **District** | 1 | Sitamarhi (Headquarters: Dumra) |
| **Sub-Divisions (Anumandal)** | 3 | **Sadar**, **Pupri**, **Belsand** |
| **Blocks (Prakhand)** | 17 | Divided across the 3 sub-divisions (see below) |
| **Gram Panchayats** | 273 | Rural local governance bodies |
| **Revenue Villages** | 845 | Cadastral revenue village units |
| **District Council (Zila Parishad)**| 1 | Apex rural district council |
| **Urban Local Bodies (Municipal)** | 4 | 1 Municipal Corporation (Nagar Nigam), 1 Municipal Council (Nagar Parishad - Dumra), 2 Town Councils (Nagar Panchayat - Bairgania, Pupri) |

### 17 Blocks Grouped by Sub-Division:
1. **Sadar Sub-Division (9 Blocks)**:
   - Bairgania, Bathnaha, Dumra, Majorganj, Parihar, Riga, Sonbarsa, Suppi
2. **Pupri Sub-Division (5 Blocks)**:
   - Bajpatti, Bokhra, Choraut, Nanpur, Pupri, Sursand
3. **Belsand Sub-Division (3 Blocks)**:
   - Belsand, Parsauni, Runni Saidpur

---

## 2. 2026 Delimitation & Ward Model

> [!IMPORTANT]
> **273 Gram Panchayats $\neq$ 273 Wards.**
> In Bihar Panchayati Raj, each Gram Panchayat contains multiple territorial wards configured on a population density baseline of approximately **500 citizens per ward**.

Because the 2026 restructuring and delimitation process is active in Bihar, ward counts and reservations (`OPEN_GEN`, `EBC_FEMALE`, `SC`, `BC_FEMALE`) are modeled as **database-driven entities** (`wards` table) rather than hardcoded enums.

```
State (Bihar)
 └── District (Sitamarhi)
      ├── Sub-Division (Sadar, Pupri, Belsand)
      │    └── Block (17 Blocks)
      │         └── Gram Panchayat (273 GPs)
      │              └── Ward (Territorial Ward 1..N based on ~500 population)
      │                   └── Polling Station / Booth
      │                        └── Registered Voter
```

---

## 3. Parliamentary & Assembly Constituencies

### Parliamentary Constituencies (Lok Sabha - ECI):
* **04 – Sheohar (Part)**: Covers Belsand Assembly segment.
* **05 – Sitamarhi**: Covers the majority of Sitamarhi district.

### 8 Assembly Constituencies (Vidhan Sabha - ECI):
| AC No. | Assembly Constituency | Reservation | Parliamentary Mapping |
|:---:|:---|:---:|:---|
| **23** | Riga | GEN | 05 - Sitamarhi |
| **24** | Bathnaha | SC | 05 - Sitamarhi |
| **25** | Parihar | GEN | 05 - Sitamarhi |
| **26** | Sursand | GEN | 05 - Sitamarhi |
| **27** | Bajpatti | GEN | 05 - Sitamarhi |
| **28** | Sitamarhi | GEN | 05 - Sitamarhi |
| **29** | Runnisaidpur | GEN | 05 - Sitamarhi |
| **30** | Belsand | GEN | 04 - Sheohar |

---

## 4. Bihar Election Types Master

The platform categorizes elections into 4 distinct jurisdictional tiers:

```
Election Types
├── 1. Lok Sabha Election (National / ECI)
│      └── Direct: Member of Parliament (MP)
│
├── 2. Vidhan Sabha Election (State / ECI)
│      └── Direct: Member of Legislative Assembly (MLA)
│
├── 3. Bihar Panchayat Election (Rural Local Body / SEC Bihar)
│      ├── Direct Elected Posts:
│      │    ├── Zila Parishad Member
│      │    ├── Panchayat Samiti Member
│      │    ├── Gram Panchayat Mukhiya
│      │    ├── Gram Panchayat Ward Member
│      │    ├── Gram Kachahri Sarpanch
│      │    └── Gram Kachahri Panch
│      └── Indirect Elected Posts:
│           ├── Zila Parishad Chairman / Vice-Chairman
│           ├── Panchayat Samiti Pramukh / Up-Pramukh
│           ├── Up-Mukhiya
│           └── Up-Sarpanch
│
└── 4. Municipal Election (Urban Local Body / SEC Bihar)
       ├── Nagar Nigam (Sitamarhi Municipal Corporation)
       ├── Nagar Parishad (Dumra)
       └── Nagar Panchayat (Bairgania, Pupri)
            ├── Mayor / Chief Councillor
            ├── Deputy Mayor
            └── Ward Councillor
```

---

## 5. Artifact Locations

* **SQL Seed & DDL Script**: [`Backend/sitamarhi-bihar-master-data.sql`](file:///d:/E-Voting%20Pilot%20System/Backend/sitamarhi-bihar-master-data.sql)
* **Combined Database Init**: [`Backend/init-databases.sql`](file:///d:/E-Voting%20Pilot%20System/Backend/init-databases.sql)
* **Frontend Master JSON**: [`frontend/public/data/sitamarhi_hierarchy.json`](file:///d:/E-Voting%20Pilot%20System/frontend/public/data/sitamarhi_hierarchy.json)
* **Backend Classpath JSON**: [`Backend/election-service/src/main/resources/data/sitamarhi_master_hierarchy.json`](file:///d:/E-Voting%20Pilot%20System/Backend/election-service/src/main/resources/data/sitamarhi_master_hierarchy.json)
