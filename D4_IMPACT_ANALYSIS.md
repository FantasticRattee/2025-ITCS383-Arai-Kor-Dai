# D4: Impact Analysis

This document presents the impact analysis for the Phase 2 maintenance work on Arai-Kor-Dai's **Smart Post & Parcel Management System**. The analysis follows the artifacts required by the project description: a whole-system traceability graph, an affected-part traceability graph, an SLO directed graph, a reachability matrix with shortest-path distances, and a discussion of which change requests are easy or difficult to apply.

The 9 change requests evaluated here come from `D3_CHANGE_REQUESTS.md`:

| CR | Title | Type |
|---|---|---|
| CR-01 | Fix Web Login to Use Real Backend Authentication | Corrective |
| CR-02 | Correct Backend Route Logic After Database Conversion | Corrective |
| CR-03 | Support Parcel Status Tracking With Cloud Database | Adaptive |
| CR-04 | Adapt the System for Cloud Deployment on Render | Adaptive |
| CR-05 | Implement Native Android Mobile Client (Feature 1) | Perfective |
| CR-06 | Add Thai Postal Code Address Auto-Fill and Validation | Perfective |
| CR-07 | Add Automated Backend Test Suite and Coverage | Preventive |
| CR-08 | Add CI Pipeline and SonarCloud Quality Monitoring | Preventive |
| CR-09 | Fix Cross-User Data Leak on the History Page | Corrective |

---

## 4.1 Traceability Graph — Whole System

The whole-system traceability graph maps every Requirement of the Smart Post & Parcel Management System to the Design containers (C4 containers) that realize it, the Code modules that implement those containers, and the Tests that verify them. It covers all 23 requirements, 5 design containers, 48 code modules, and 15 test modules across the Web, Backend, Database, Android, and CI/CD subsystems.

![Whole-system traceability graph](<Impact Analysis imgs/Emerald_Phase2_TraceabilityGraph - 7 - Done-Traceability - WholeSystem.drawio.png>)

**Reading the graph**

- **Requirements column** (yellow) — 3 Phase-2 features (F1–F3), 13 functional requirements (FR-01 to FR-13), 5 non-functional requirements (NFR-01 to NFR-05), Backend Quality, and CI/CD Quality.
- **Design column** (blue) — the 5 C4 containers: Web Frontend (DFE), Backend API (DBE), PostgreSQL Database (DDB), Android Client (DAND), CI/CD Pipeline (DCI).
- **Code column** (white) — every code module of the system, grouped vertically by container.
- **Test column** (purple) — automated test modules.

Edges are color-coded by target container so the influence of each subsystem is visually traceable end-to-end:

| Edge color | Meaning |
|---|---|
| 🔵 Blue | Requirement → Web Frontend |
| 🟢 Green | Requirement → Backend API or Backend code → Test |
| 🟣 Purple | Requirement → Database |
| 🟠 Orange | Requirement → Android Client or Android code → Test |
| 🔴 Red | Requirement → CI/CD Pipeline |
| ⚫ Slate | Internal "depends-on" relationships within the Design and Code columns |

---

## 4.2 Traceability Graph — Affected Part

The affected-part traceability graph uses the same whole-system layout, but only the requirements, design containers, code modules, and tests that were touched by the Phase 2 change requests retain their connecting lines. Unaffected nodes remain visible in their column slots so the reader can see the full scope of the system, but they are isolated (no incoming or outgoing edges), which highlights the affected subgraph.

![Affected-part traceability graph](<Impact Analysis imgs/Emerald_Phase2_TraceabilityGraph - 7 - Done-Traceability - Affected Part.drawio.png>)

**Affected scope summary**

| Layer | Affected count | Notable members |
|---|---|---|
| Requirements | 8 of 23 | F1, F2, F3, FR-03, FR-10, NFR-01, Backend Quality, CI/CD Quality |
| Design containers | 5 of 5 | DFE, DBE, DDB, DAND, DCI — every container is touched |
| Code modules | 39 of 48 | All Android modules (new), 7 backend files (PostgreSQL migration + tests), 7 web pages (login/history fixes + tracking + auto-fill), `schema.sql`, all CI configs |
| Tests | 15 of 15 | Every Phase-2 test module |

---

## 4.3 SLO Directed Graph

Per the discussion with Aj. Chaiyong on 30 April 2026 at 17:02, "let's use the bigger logical modules — the ones with 8–10 SLOs". We therefore grouped the 39 affected code files into 10 logical Software Lifecycle Objects (SLOs), where each SLO is a cohesive package of files that is developed, tested, and deployed as a unit.

![SLO directed graph](<Impact Analysis imgs/Emerald_Phase2_TraceabilityGraph - 7 - Done-SLOs.drawio.png>)

**SLO definitions (10 logical modules / 39 affected code files)**

| SLO | Logical Module | Underlying Files |
|---|---|---|
| SLO0 | Backend Core | `server.js`, `db.js`, `jest.config` |
| SLO1 | Backend Routes | `users.js`, `shipments.js`, `notifications.js`, `activity.js` |
| SLO2 | Database | `schema.sql` |
| SLO3 | Web Frontend | LoginPage, RegisterPage, UserDashboard, CreateShipmentPage, TrackingPage, HistoryPage, PaymentPage |
| SLO4 | Android Entry | `MainActivity.kt`, `AppNavigation.kt` |
| SLO5 | Android Networking | `RetrofitClient.kt`, `ApiService.kt` |
| SLO6 | Android Models | `User.kt`, `Shipment.kt`, `Notification.kt` |
| SLO7 | Android Utilities | `SessionManager.kt`, `ThaiPostalCodes.kt`, `ShipmentUtils.kt`, `Background.kt` |
| SLO8 | Android Screens | LoginScreen, RegisterScreen, DashboardScreen, CreateShipmentScreen, PaymentScreen, SuccessScreen, TrackingScreen, HistoryScreen, SettingsScreen |
| SLO9 | CI/CD | `ci.yml`, `sonar-project.properties`, `android-ci.yml`, `android-sonar.properties` |

**Directed dependencies (13 edges)**

The arrows in the SLO graph encode "depends-on" relationships: an arrow from SLO X to SLO Y means a change to SLO Y can propagate into SLO X. The 13 edges are:

1. Backend Routes → Backend Core (routes import `db.js`)
2. Backend Core → Database (`db.js` connects to the schema)
3. Backend Routes → Database (queries reference the schema)
4. Web Frontend → Backend Routes (REST API consumption)
5. Android Entry → Android Screens (NAV imports each Compose screen)
6. Android Screens → Android Networking (screens call API endpoints)
7. Android Screens → Android Models (screens read/write data classes)
8. Android Screens → Android Utilities (screens use SessionManager, ThaiPostalCodes, etc.)
9. Android Networking → Android Models (request and response types)
10. Android Networking → Backend Core (Retrofit base URL points to the deployed server)
11. CI/CD → Backend Core (CI tests backend code)
12. CI/CD → Android Entry (CI builds the Android app)
13. CI/CD → Web Frontend (CI lints and tests the web frontend)

---

## 4.4 Reachability Matrix

The reachability matrix lists the shortest-path distance from each row SLO to each column SLO in the SLO directed graph. A cell value of `n` means that the row SLO can reach the column SLO through `n` directed edges. A value of `0` means the column SLO is not reachable from the row SLO. The diagonal `—` represents an SLO compared to itself.

![Reachability matrix](<Impact Analysis imgs/Emerald_Phase2_TraceabilityGraph - 7 - Done-Reachability Matrix.drawio.png>)

**Computed shortest-path distances (from row to column)**

|     | SLO0 | SLO1 | SLO2 | SLO3 | SLO4 | SLO5 | SLO6 | SLO7 | SLO8 | SLO9 |
|-----|------|------|------|------|------|------|------|------|------|------|
| **SLO0** | — | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **SLO1** | 1 | — | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **SLO2** | 0 | 0 | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **SLO3** | 2 | 1 | 2 | — | 0 | 0 | 0 | 0 | 0 | 0 |
| **SLO4** | 3 | 0 | 4 | 0 | — | 2 | 2 | 2 | 1 | 0 |
| **SLO5** | 1 | 0 | 2 | 0 | 0 | — | 1 | 0 | 0 | 0 |
| **SLO6** | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 |
| **SLO7** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 |
| **SLO8** | 2 | 0 | 3 | 0 | 0 | 1 | 1 | 1 | — | 0 |
| **SLO9** | 1 | 2 | 2 | 1 | 1 | 3 | 3 | 3 | 2 | — |

**Architectural observations**

- **SLO9 (CI/CD)** sits at the top of the dependency tree — it transitively reaches every other SLO. A change to CI/CD scripts itself, however, has no downstream consumers (column SLO9 is empty), because no runtime code depends on CI configuration.
- **SLO2 (Database), SLO6 (Models), SLO7 (Utilities)** are leaf nodes — they have no outgoing edges. They are depended-on by many other SLOs (high incoming reachability) but never propagate change downstream.
- **The Android client reaches the Backend** through `RetrofitClient` (SLO5 → SLO0 = 1 hop), making the longest realistic path **Android Entry → Screens → Networking → Backend Core → Database (4 hops)**. This is the runtime call chain a single Android user action can trigger.

These distances translate directly into impact analysis: the lower the distance from the changed SLO to other SLOs, and the higher the number of SLOs that depend on it, the wider the ripple effect of a change.

---

## 4.5 Change Request Difficulty Analysis

The matrix and the affected traceability graph let us reason about which change requests were easy and which were difficult to apply during Phase 2. The judgement combines three factors:

1. **Surface size** — how many SLOs and individual files the change touches.
2. **Downstream reach** — using the reachability matrix's incoming edges for each SLO touched, how many other SLOs can be affected by ripple.
3. **Cross-subsystem coordination** — whether the change spans multiple containers (Backend, Web, Android, DB, CI/CD) that must agree.

### 4.5.1 Easy change requests

These changes were quick to apply because they were either scoped to a single SLO, additive (no behavior change for existing consumers), or sat at a leaf of the reachability graph with no downstream impact.

#### CR-09 — Fix Cross-User Data Leak on the History Page (Corrective)

- **Surface size**: 1 file, 1 line. Replaced `const USER_ID = 1` with `localStorage.getItem("userId") || 1` in `HistoryPage.jsx`.
- **SLOs affected**: only **SLO3 (Web Frontend)**. From the matrix, only SLO9 reaches SLO3, so the change cannot ripple to anything else at runtime.
- **Why it was easy**: The pattern was already proven in `UserDashboard.jsx` line 71, so the fix was a one-line copy-and-adapt, with verification by logging in as two different users.

#### CR-08 — Add CI Pipeline and SonarCloud Quality Monitoring (Preventive)

- **Surface size**: 4 YAML/properties files in **SLO9 (CI/CD)** only.
- **SLOs affected**: only SLO9. Column SLO9 in the matrix is entirely 0/`—`, so **no other SLO depends on CI** — its changes never break runtime code.
- **Why it was easy**: Adding a new GitHub Actions workflow and a SonarCloud configuration is purely additive; existing tests and source code did not need to change for the pipeline to pass.

#### CR-07 — Add Automated Backend Test Suite and Coverage (Preventive)

- **Surface size**: New Jest/Supertest test files plus a small refactor of `server.js` so the Express app can be imported without auto-listening.
- **SLOs affected**: SLO0 (Backend Core, only the test entry point) plus the new test modules.
- **Why it was easy**: Test code is additive — it does not change the production behavior of the routes, so existing consumers (Web FE, Android, CI) keep working unchanged. The only non-trivial step was the `server.js` refactor, which was a 3-line change.

#### CR-06 — Add Thai Postal Code Address Auto-Fill and Validation (Perfective)

- **Surface size**: 3 files: `ThaiPostalCodes.kt` (Android utility, new), `CreateShipmentScreen.kt` (Android screen, integration), `CreateShipmentPage.jsx` (web page, integration).
- **SLOs affected**: **SLO3 (Web Frontend), SLO7 (Android Utilities), SLO8 (Android Screens)**.
- **Why it was easy**: Although the change spans two subsystems, the integration points are extremely localized — both clients had a single shipment-creation form that needed an `onChange` lookup. The shared Thai postal-code map is a self-contained look-up table with no external dependency.

### 4.5.2 Difficult change requests

These changes were difficult because they either touched many files, hit SLOs that many others depend on, required cross-subsystem coordination, or all three.

#### CR-05 — Implement Native Android Mobile Client (Feature 1) (Perfective)

- **Surface size**: ~20 new files spread across **5 SLOs**: Android Entry (SLO4), Networking (SLO5), Models (SLO6), Utilities (SLO7), and Screens (SLO8).
- **Downstream reach**: Inside Android, every screen depends on Networking, Models, and Utilities — the longest internal chain is `Entry → Screens → Networking → Models` (3 hops). The Android client also adds the cross-subsystem dependency `Networking → Backend Core` (SLO5 → SLO0), so Android consumes the deployed REST API.
- **Why it was difficult**:
  1. **Greenfield platform**: an entirely new Kotlin + Jetpack Compose codebase had to be built from zero, including navigation graph, Material 3 theme, DataStore session, and 9 user-facing screens.
  2. **Backend contract alignment**: every existing route had to be re-consumed correctly through Retrofit, which exposed Phase-1 bugs (the login route's `setTimeout` shortcut, the History page's hard-coded `USER_ID`) that became blocking issues for Android.
  3. **End-to-end verification cost**: the change has to be validated on an emulator across all 9 screens with realistic data, not just unit-tested.

#### CR-03 / CR-04 — Cloud Database and Render Deployment (Adaptive)

These two CRs are conceptually paired — the deployment forced the database move and vice versa.

- **Surface size**:
  - CR-03 touches **SLO0 (Backend Core)** (`db.js` rewrite for `pg`), **SLO1 (Backend Routes)** (parameter syntax in every query), and **SLO2 (Database)** (`schema.sql` rewrite from MySQL DDL to PostgreSQL DDL).
  - CR-04 touches **SLO0**, **SLO3 (Web Frontend BASE_URL)**, **SLO5 (Android Networking BASE_URL)**, and **SLO9 (CI/CD)**.
- **Downstream reach**: From the matrix, **column SLO0 has 6 incoming SLOs** and **column SLO2 has 7 incoming SLOs** — every other layer eventually reaches Backend Core and the Database. A bug in the cloud DB connection or the deployed URL breaks the Web Frontend, the Android client, and the CI pipeline simultaneously.
- **Why it was difficult**:
  1. **Multi-subsystem coordination**: the URL had to change in three places at once (`HistoryPage.jsx`, `UserDashboard.jsx`, every `*.jsx` that calls `fetch`, and `RetrofitClient.kt`'s `BASE_URL`). Forgetting any one of them produces a confusing runtime mix where some screens hit localhost and some hit Render.
  2. **Subtle SQL syntax differences**: MySQL and PostgreSQL diverge on placeholder syntax (`?` vs `$1`), `INSERT ... RETURNING`, `CASE WHEN`, and date-interval literals. Each route file had to be audited line by line.
  3. **Render free-tier cold starts**: a fresh deployment takes ~50 seconds to wake from idle, which initially looked like a network bug from the Android emulator and required HTTP timeout adjustments.

#### CR-02 — Correct Backend Route Logic After Database Conversion (Corrective)

- **Surface size**: 4 route files (`users.js`, `shipments.js`, `notifications.js`, `activity.js`) plus `db.js` — entirely inside **SLO0 + SLO1**.
- **Downstream reach**: From the matrix, **2 SLOs reach Backend Routes** directly (Web Frontend, Android Networking via Backend Core), and **6 SLOs reach Backend Core**. A query bug in any route file silently breaks a consumer screen on a different subsystem.
- **Why it was difficult**:
  1. **Hidden coupling between SLO1 and SLO0**: routes use `db.js` helpers, so a parameter-style mismatch in `db.js` (MySQL `?` vs PostgreSQL `$1`) propagates to every route.
  2. **No tests existed before this CR**: discoveries were manual — running each endpoint against the new database one by one. CR-07 was added partly to prevent this class of regression in the future.

#### CR-01 — Fix Web Login to Use Real Backend Authentication (Corrective)

- **Surface size**: 2 files: `LoginPage.jsx` (real `fetch('/api/users/login')`) and `localStorage` writes for `userId`, `userName`, `userEmail`, `userRole`.
- **Downstream reach**: Affects **SLO3 (Web Frontend)** and indirectly **SLO1 (Backend Routes)**, which is the auth endpoint.
- **Why it was difficult (medium-difficult)**: Although the patch itself is small, it depends on `users.js` already being PostgreSQL-clean (CR-02) and on the cloud deployment being live (CR-04). It is the visible failure point that surfaces when any of those upstream issues is wrong, which made the order of execution important — CR-04 → CR-02 → CR-01 → CR-09 had to land before the History page's user-leak fix could be tested with multiple real accounts.

### 4.5.3 Difficulty summary table

| CR | Maintenance Type | SLOs touched | Incoming reach (matrix) | Difficulty |
|---|---|---|---:|---|
| CR-09 | Corrective | SLO3 | 1 | **Easy** |
| CR-08 | Preventive | SLO9 | 0 | **Easy** |
| CR-07 | Preventive | SLO0 (test entry only) | 6 (but additive) | **Easy** |
| CR-06 | Perfective | SLO3, SLO7, SLO8 | 1 + 3 + 2 | **Easy** |
| CR-01 | Corrective | SLO3, SLO1 | 1 + 2 | Medium |
| CR-02 | Corrective | SLO0, SLO1 | 6 + 2 | **Difficult** |
| CR-03 | Adaptive | SLO0, SLO1, SLO2 | 6 + 2 + 7 | **Difficult** |
| CR-04 | Adaptive | SLO0, SLO3, SLO5, SLO9 | cross-subsystem | **Difficult** |
| CR-05 | Perfective | SLO4, SLO5, SLO6, SLO7, SLO8 | 5 SLOs (greenfield) | **Difficult** |

---

## 4.6 Conclusion

Phase 2's hardest changes were the ones that touched the foundational layers — Backend Core, Backend Routes, and the Database — because those SLOs have the highest incoming reachability (6, 2, and 7 respectively). The Native Android Mobile Client (CR-05), although it sat in a relatively isolated subsystem, was difficult purely because of its surface size (20 new files across 5 SLOs).

In contrast, the easy changes (CR-06, CR-07, CR-08, CR-09) each touched a leaf SLO or were additive, so their changes had a small or zero ripple in the reachability matrix. This pattern — leaf-SLO and additive changes are cheap, foundational and cross-cutting changes are expensive — is the practical takeaway from the impact analysis and is consistent with the layered architecture that the C4 design was built to encourage.
