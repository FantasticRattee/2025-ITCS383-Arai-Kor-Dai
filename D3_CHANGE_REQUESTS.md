# D3: Change Request Analysis

This document analyzes the Phase 2 maintenance work for Arai-Kor-Dai's **Smart Post & Parcel Management System** and breaks the work into change requests using the required schema.

## Phase 2 Feature Requests

| Feature request | Feature name | Phase 2 purpose |
|---|---|---|
| Required Feature 1 | Native Android Mobile Client App | Add a new native Android platform for the Smart Post & Parcel Management System. The Android app was built with Kotlin and Jetpack Compose and includes the user-facing functions of the original web application, including login, registration, dashboard, shipment creation, payment, shipping label, parcel tracking, history, and settings. The app connects to the existing shared backend through Retrofit and uses the cloud API so mobile users can access the same shipment data as web users. |
| Product Owner Feature 2 | Parcel Status Tracking Page | Add a parcel tracking function where users can enter a tracking number and view the latest shipment status, such as pending, shipped, or delivered. This feature is supported in the web application and also implemented in the Android mobile app through the Tracking screen, allowing customers to monitor parcels from either platform without contacting post office staff. |
| Product Owner Feature 3 | Address Auto-fill and Validation | Add address auto-fill based on Thai zip code during shipment creation. When users enter a valid 5-digit zip code, the system fills address information such as province and validates the postal code format. This feature was implemented in the web shipment form and in the Android Create Shipment screen using shared Thai postal-code lookup logic, reducing manual input and preventing address entry mistakes on both platforms. |

## Change Request Summary

| Type of change | Number of change requests |
|---|---:|
| Corrective | 2 |
| Adaptive | 3 |
| Perfective | 2 |
| Preventive | 2 |
| **Total** | **9** |

---

## CR-01: Fix Web Login to Use Real Backend Authentication

| Attribute | Description |
|---|---|
| Associated Feature | User Login (FR-03) |
| Description | The original web login used a fake `setTimeout` redirect and did not call the backend login API. Replace it with a real API request to `/api/users/login`, then store `userId`, `userName`, `userEmail`, and `userRole` in `localStorage` so the dashboard receives the authenticated user data. |
| Maintenance Type | Corrective |
| Priority | High |
| Severity | Critical |
| Time to Implement | 0.5 person-weeks |
| Verification Method | Manual login testing, dashboard inspection, and backend API response verification |

## CR-02: Correct Backend Route Logic After Database Conversion

| Attribute | Description |
|---|---|
| Associated Feature | User Management, Shipment Management, Tracking, Notifications, Activity Log |
| Description | The backend route files originally used MySQL-style queries and assumptions. Update `users.js`, `shipments.js`, `notifications.js`, and `activity.js` so the APIs work correctly with PostgreSQL syntax, including numbered placeholders, `RETURNING`, `CASE WHEN`, and PostgreSQL date interval handling. |
| Maintenance Type | Adaptive |
| Priority | High |
| Severity | Critical |
| Time to Implement | 1.0 person-weeks |
| Verification Method | Jest and Supertest route tests, manual API testing, and successful backend startup |

## CR-03: Support Parcel Status Tracking With Cloud Database

| Attribute | Description |
|---|---|
| Associated Feature | Feature Request 2: Parcel Status Tracking Page |
| Description | Support the parcel tracking page with a PostgreSQL-backed tracking endpoint so shipment status can be retrieved by tracking number after deployment. The maintenance work includes adapting the database layer from local MySQL to PostgreSQL, rewriting `db.js`, converting `setup.sql`, and ensuring the shipment/tracking data can be read from the cloud database. |
| Maintenance Type | Adaptive |
| Priority | High |
| Severity | Major |
| Time to Implement | 1.5 person-weeks |
| Verification Method | Database connection testing, schema creation testing, route integration tests, and Render PostgreSQL deployment verification |

## CR-04: Adapt the System for Cloud Deployment on Render

| Attribute | Description |
|---|---|
| Associated Feature | System Deployment and Availability (NFR-01) |
| Description | Move the backend from localhost-only execution to a deployed Render web service and configure the application to use the shared cloud API URL. Update the web frontend pages and Android Retrofit configuration so both clients communicate with `https://two025-itcs383-arai-kor-dai-cyio.onrender.com/api/`. |
| Maintenance Type | Adaptive |
| Priority | High |
| Severity | Major |
| Time to Implement | 1.0 person-weeks |
| Verification Method | Browser testing, Android emulator testing, API endpoint checks, and Render deployment log inspection |

## CR-05: Implement Native Android Mobile Client (Feature 1)

| Attribute | Description |
|---|---|
| Associated Feature | Required Feature 1: Native Android Mobile Client App |
| Description | Build a complete native Android client for the Smart Post & Parcel Management System using Kotlin and Jetpack Compose, hosted in the new repository `2025-ITCS383-Emerald-Android`. The application implements all user-facing functions of the existing web platform across nine screens — Login, Register, Dashboard, Create Shipment, Payment, Shipping Label, Tracking, History, and Settings — and connects to the shared Render-hosted backend through a Retrofit + Gson networking layer (`RetrofitClient.kt`, `ApiService.kt`). It uses a DataStore-backed `SessionManager` for persistent login, Jetpack Navigation Compose for the navigation graph (`AppNavigation.kt`), and a Thailand Post-themed Material 3 UI. The Tracking screen on this client also fulfils Product Owner Feature 2 (Parcel Status Tracking) on the mobile platform. |
| Maintenance Type | Perfective |
| Priority | High |
| Severity | Major |
| Time to Implement | 3.0 person-weeks |
| Verification Method | Manual end-to-end walkthrough on Android emulator across all nine screens; Retrofit request/response inspection; navigation graph and back-stack testing; DataStore session persistence verification across app restarts; visual inspection against the Thailand Post theme. |

## CR-06: Add Thai Postal Code Address Auto-Fill and Validation

| Attribute | Description |
|---|---|
| Associated Feature | Feature Request 3: Address Auto-fill and Validation |
| Description | Improve the shipment creation flow by auto-filling address information when the user enters a valid 5-digit Thai postal code. On the web version, add a prefix-to-province lookup in `CreateShipmentPage.jsx`. On Android, add the same lookup behavior through `ThaiPostalCodes.kt` and integrate it into `CreateShipmentScreen.kt`. This reduces user typing, helps prevent invalid address entries, and makes shipment creation faster. |
| Maintenance Type | Perfective |
| Priority | Medium |
| Severity | Moderate |
| Time to Implement | 0.75 person-weeks |
| Verification Method | Manual form testing on web and Android, postal code lookup unit testing, and province field inspection |

## CR-07: Add Automated Backend Test Suite and Coverage

| Attribute | Description |
|---|---|
| Associated Feature | Backend Quality Assurance |
| Description | Add automated Jest and Supertest tests for backend routes, including users, shipments, notifications, activity, and error-handling paths. Refactor `server.js` so the Express app can be imported by tests without starting a duplicate listener. |
| Maintenance Type | Preventive |
| Priority | High |
| Severity | Major |
| Time to Implement | 1.5 person-weeks |
| Verification Method | Running `npm run test:ci`, reviewing coverage reports, and confirming route behavior through automated assertions |

## CR-08: Add CI Pipeline and SonarCloud Quality Monitoring

| Attribute | Description |
|---|---|
| Associated Feature | CI/CD and Code Quality |
| Description | Replace the scan-only workflow with a GitHub Actions pipeline that installs dependencies, runs backend tests with coverage, builds the frontend, uploads coverage, and executes SonarCloud analysis. Configure `sonar-project.properties` so coverage is measured on backend route code instead of being fully excluded. |
| Maintenance Type | Preventive |
| Priority | High |
| Severity | Major |
| Time to Implement | 1.0 person-weeks |
| Verification Method | GitHub Actions run inspection, SonarCloud quality gate inspection, and coverage report review |

## CR-09: Fix Cross-User Data Leak on the History Page

| Attribute | Description |
|---|---|
| Associated Feature | Transaction History (FR-10) |
| Description | The Phase 1 web History page contains an unfinished placeholder where the constant `USER_ID` on line 4 of `HistoryPage.jsx` is hard-coded to the literal `1` with the comment `// replace with real session user ID`. The placeholder was never replaced before handover. As a result, every authenticated user retrieves user 1's transaction history regardless of who is logged in, exposing other users' shipping addresses, recipient names, and transaction amounts. Replace the hard-coded literal with a real session lookup using `localStorage.getItem("userId")`, matching the pattern already used in `UserDashboard.jsx` (line 71), so the History page fetches the records of the actually authenticated user. |
| Maintenance Type | Corrective |
| Priority | High |
| Severity | Critical |
| Time to Implement | 0.25 person-weeks |
| Verification Method | Manual login test with two separate registered accounts to verify each user sees only their own history; browser DevTools Network panel inspection to confirm the `/shipments/history/{userId}` request URL matches the logged-in user's id; visual regression check that user 1's existing history still renders correctly after the fix. |
