# Bihar State Administrative & Electoral Master Data Architecture

## 1. Executive Summary & Administrative Scale

According to the official government records of Bihar, Election Commission of India (ECI), and the State Election Commission (SEC) Bihar:

| Administrative Entity | Official Count | Architectural Scope in E-Voting System |
|:---|:---:|:---|
| **State** | 1 | Bihar (State Code: `BR`, Capital: Patna) |
| **Administrative Divisions** | 9 | Regional commissioner divisions grouping districts |
| **Districts** | 38 | Comprehensive district master (`districts` table) |
| **Sub-Divisions (Anumandal)** | 101 | Sub-divisional magistrate administrative units |
| **Blocks (Prakhand)** | 534 | Block Development Office & Panchayat Samiti level |
| **Gram Panchayats** | 8,054 | Rural local bodies for Mukhiya & Sarpanch elections |
| **Revenue Villages** | 45,693 | Cadastral revenue village units |
| **Urban Local Bodies (ULBs)** | 270 | 19 Municipal Corporations, 85 Municipal Councils, 166 Town Panchayats |

---

## 2. Nine Administrative Divisions & 38 Districts

```
Bihar State (38 Districts)
 ├── 1. Patna Division (6)       : Patna, Nalanda, Bhojpur, Rohtas, Buxar, Kaimur (Bhabua)
 ├── 2. Saran Division (3)       : Saran, Siwan, Gopalganj
 ├── 3. Tirhut Division (6)      : Muzaffarpur, West Champaran, East Champaran, Sitamarhi, Sheohar, Vaishali
 ├── 4. Purnia Division (4)      : Purnia, Katihar, Kishanganj, Araria
 ├── 5. Bhagalpur Division (2)   : Bhagalpur, Banka
 ├── 6. Darbhanga Division (3)   : Darbhanga, Madhubani, Samastipur
 ├── 7. Kosi Division (3)        : Saharsa, Madhepura, Supaul
 ├── 8. Magadh Division (5)      : Gaya, Nawada, Jehanabad, Aurangabad, Arwal
 └── 9. Munger Division (6)      : Munger, Jamui, Khagaria, Lakhisarai, Begusarai, Sheikhpura
```

---

## 3. All 40 Lok Sabha Parliamentary Constituencies (Bihar)

All 40 Parliamentary Constituencies (PCs) are registered in the `parliamentary_constituencies` database table:

| PC No. | Parliamentary Constituency | Category | PC No. | Parliamentary Constituency | Category |
|:---:|:---|:---:|:---:|:---|:---:|
| **1** | Valmiki Nagar | GEN | **21** | Hajipur | SC |
| **2** | Paschim Champaran | GEN | **22** | Ujiarpur | GEN |
| **3** | Purvi Champaran | GEN | **23** | Samastipur | SC |
| **4** | Sheohar | GEN | **24** | Begusarai | GEN |
| **5** | Sitamarhi | GEN | **25** | Khagaria | GEN |
| **6** | Madhubani | GEN | **26** | Bhagalpur | GEN |
| **7** | Jhanjharpur | GEN | **27** | Banka | GEN |
| **8** | Supaul | GEN | **28** | Munger | GEN |
| **9** | Araria | GEN | **29** | Nalanda | GEN |
| **10**| Kishanganj | GEN | **30** | Patna Sahib | GEN |
| **11**| Katihar | GEN | **31** | Patliputra | GEN |
| **12**| Purnia | GEN | **32** | Arrah | GEN |
| **13**| Madhepura | GEN | **33** | Buxar | GEN |
| **14**| Darbhanga | GEN | **34** | Sasaram | SC |
| **15**| Muzaffarpur | GEN | **35** | Karakat | GEN |
| **16**| Vaishali | GEN | **36** | Jehanabad | GEN |
| **17**| Gopalganj | SC | **37** | Aurangabad | GEN |
| **18**| Siwan | GEN | **38** | Gaya | SC |
| **19**| Maharajganj | GEN | **39** | Nawada | GEN |
| **20**| Saran | GEN | **40** | Jamui | SC |

---

## 4. 243 Bihar Vidhan Sabha (Assembly) Constituencies

The 243 Assembly Constituencies (ACs) map hierarchically within the 40 Parliamentary Constituencies. For instance, in Sitamarhi district:
* `AC-23`: Riga
* `AC-24`: Bathnaha (SC)
* `AC-25`: Parihar
* `AC-26`: Sursand
* `AC-27`: Bajpatti
* `AC-28`: Sitamarhi
* `AC-29`: Runnisaidpur
* `AC-30`: Belsand

---

## 5. Architectural Modeling of Rajya Sabha (16 Seats)

> [!IMPORTANT]
> **Constitutional Rule: Citizens do NOT directly vote in Rajya Sabha elections.**
> Rajya Sabha members are elected by the **Elected Members of the Bihar Legislative Assembly (MLAs)** through **Proportional Representation by means of Single Transferable Vote (STV)**.

### System Implementation:
* Registered under `election_types` as code `RAJYA_SABHA`.
* The `rajya_sabha_representation` entity specifies:
  - `total_seats = 16`
  - `electoral_college = 'Elected Members of Bihar Legislative Assembly (MLAs)'`
  - `voting_system = 'Proportional Representation by Single Transferable Vote (STV)'`
  - `public_ballot_allowed = FALSE`
* In the Angular UI, ordinary voters will **never** receive a candidate selection ballot for Rajya Sabha; access is strictly restricted to authenticated MLA credential tokens.

---

## 6. Electoral Term Versioning & 2026 Delimitation

To ensure the platform remains production-grade and accommodates changes without schema rewrites, electoral boundaries are bound to `electoral_terms`:

* `PANCHAYAT_TERM_2021_2026`: Previous Panchayati Raj term
* `PANCHAYAT_TERM_2026_2031`: Current SEC Bihar restructuring & delimitation cycle (population baseline ~500 per ward)
* `VIDHAN_SABHA_TERM_17` & `VIDHAN_SABHA_TERM_18`: State assembly legislative tenures

---

## 7. Master Data Artifacts in Project

* **Complete State SQL Migration**: [`Backend/bihar-state-master-data.sql`](file:///d:/E-Voting%20Pilot%20System/Backend/bihar-state-master-data.sql)
* **Master Initialization Script**: [`Backend/init-databases.sql`](file:///d:/E-Voting%20Pilot%20System/Backend/init-databases.sql)
* **Frontend Hierarchy JSON**: [`frontend/public/data/bihar_master_hierarchy.json`](file:///d:/E-Voting%20Pilot%20System/frontend/public/data/bihar_master_hierarchy.json)
* **Backend Classpath JSON**: [`Backend/election-service/src/main/resources/data/bihar_master_hierarchy.json`](file:///d:/E-Voting%20Pilot%20System/Backend/election-service/src/main/resources/data/bihar_master_hierarchy.json)
