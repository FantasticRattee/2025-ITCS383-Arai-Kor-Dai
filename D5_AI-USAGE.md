# D5: AI Usage Report

This document reports the activities for which our team (Emerald) used AI coding assistants during Phase 2 of the Smart Post & Parcel Management System maintenance project.

---

## 1. AI Tools Used

| Tool | Provider | Primary use |
|---|---|---|
| **Claude (Sonnet, via Claude Code CLI)** | Anthropic | Code reading, debugging, documentation, drawio generation, git operations, professor-question drafting |
| **GitHub Copilot** | GitHub / OpenAI | Inline autocompletion when writing Kotlin and JavaScript |

The majority of the AI-assisted work was done with Claude. GitHub Copilot was used at a much lower intensity for inline code suggestions inside the IDE (Android Studio and VS Code).

---

## 2. Activities the AI Helped With

### 2.1 Reading and understanding the inherited project

We received the Phase 1 codebase from the Arai-Kor-Dai team. To get up to speed quickly, we used Claude to:

- Read and summarize the structure of the inherited web frontend (`React`), backend (`Node.js + Express`), and database schema (`MySQL → PostgreSQL`).
- Identify "leftover Phase 1 issues" that were never finished, including the placeholder `const USER_ID = 1` on line 4 of `HistoryPage.jsx`.
- Understand the existing API routes (`users.js`, `shipments.js`, `notifications.js`, `activity.js`) and how the frontend pages consumed them.

### 2.2 Diagnosing runtime issues during development

When we ran into runtime problems, we asked Claude to help diagnose them by inspecting log output and configuration:

- **Android emulator DNS resolution failure** — Claude identified that `netsimd` had captured an iPhone hotspot DNS server (`172.20.10.1`) while the Mac was on a different Wi-Fi network. The fix was to cold-boot the emulator or launch it with `-dns-server 8.8.8.8,1.1.1.1`.
- **Login/registration failures** — Claude diagnosed that the Render free-tier deployment was sleeping for ~50 seconds on first request after idle, which the Android client misread as a connectivity error. We adjusted Retrofit timeouts accordingly.
- **Generic "Failed" registration error** — Claude analyzed `RegisterScreen.kt` and identified that the screen was reading `body()?.message` instead of `errorBody()` when receiving non-2xx responses, so the real "This email is already registered." message from the backend was being swallowed.

### 2.3 D2 — Code Quality (`D2_CODE_QUALITY.md`)

- Claude helped structure the before/after SonarCloud comparison and discussed how to present coverage results.
- We wrote the prose ourselves; Claude reviewed wording and suggested clearer explanations.

### 2.4 D3 — Change Request Analysis (`D3_CHANGE_REQUESTS.md`)

- Claude reviewed the initial CR draft and suggested re-categorizing **CR-02 from Corrective to Adaptive** (database conversion is an adaptation to a new platform, not bug-fixing).
- Claude proposed adding **CR-09 (HistoryPage USER_ID fix)** after we discovered the cross-user data leak, including the schema-required attributes.
- Claude verified that the spec's "at least 8, with at least 2 of each type" rule was satisfied by the final 2/3/2/2 split.

### 2.5 Implementing the HistoryPage fix (CR-09)

- Claude proposed the one-line fix:
  ```
  Before: const USER_ID = 1;
  After:  const USER_ID = localStorage.getItem("userId") || 1;
  ```
  matching the pattern already in `UserDashboard.jsx` line 71.
- We applied and tested the fix manually with two registered accounts.

### 2.6 D4 — Impact Analysis (largest area of AI assistance)

D4 was the most extensive deliverable. Throughout this work the team made the design decisions and reviewed every output; Claude played a guide-and-assistant role, helping us realize and fix each artifact at our direction.

- **The four drawio diagrams**: We decided what each diagram should depict (whole-system traceability, affected-part traceability, SLO directed graph, reachability matrix) and how it should be organized. Across ~15 review rounds, we described changes we wanted (move this column, shrink fonts, rearrange these nodes, fix lines that weren't routing well), and Claude updated the drawio file accordingly. After each revision we opened the file and verified the result before continuing.
- **Color conventions**: We asked Claude for ideas to make each subsystem distinguishable end-to-end. Claude suggested a per-target color palette (DFE blue, DBE green, DDB purple, DAND orange, DCI red). After approving the proposal, we asked Claude to apply the palette consistently across all Req→Design and Code→Test edges, and we checked the result on each page.
- **Filtering edges in the Affected Part page**: Rather than remove many edges by hand, we asked Claude to automate it. Claude wrote a small Python script implementing our rule (keep an edge only if both endpoints are in the affected set). We reviewed the script, ran it, and verified the filtered diagram on screen.
- **Adding internal "depends-on" edges**: We described which design and code components depend on each other (e.g., `Backend Routes → Backend Core`, `Android Screens → Networking`). Claude helped translate our list into drawio edges with a consistent style and applied them to both pages.
- **SLO grouping**: After confirming with the professor that we should use ~8–10 logical SLOs, we asked Claude to help group the 39 affected code files. Claude suggested a layering (Backend Core, Backend Routes, Database, Web Frontend, Android Entry/Networking/Models/Utilities/Screens, CI/CD). We reviewed each cluster against the actual project structure and approved before adopting.
- **Reachability matrix computation**: We defined the 13 inter-SLO dependency edges ourselves. Claude helped compute shortest-path distances by implementing a BFS over the directed graph and producing the 10×10 matrix. We spot-checked several paths against the SLO graph by hand to confirm the numbers were correct.
- **Easy / difficult CR analysis**: We discussed each CR with Claude, explaining its scope and which SLOs it touches. Claude proposed a difficulty ranking using the matrix's incoming reachability and the surface size of each CR. We reviewed the reasoning, adjusted where we disagreed (CR-01 was reclassified to *medium* instead of *difficult*), and finalized the analysis.
- **D4 prose**: Claude drafted the narrative in `D4_IMPACT_ANALYSIS.md` based on our discussions and the four artifacts. We read it end-to-end and edited any framing or wording that didn't match our intent before committing.

### 2.7 D5 — AI Usage Report (this document)

Claude drafted the structure and initial content of `D5_AI-USAGE.md` based on the activity history of the Phase 2 work. We reviewed and edited the content before committing.

### 2.8 Drafting questions to the professor

When we needed clarification from Aj. Chaiyong, Claude drafted the messages in both formal English and casual Thai/English so we could pick the wording that matched our usual chat tone. Topics included:

- Whether the D4 traceability graph should cover the whole project or only Phase 2 changes.
- Whether 1 SLO = 1 individual code file or 1 SLO = 1 logical module.
- How the professor would discover our forked web repo and our separate Android repo for grading.

### 2.9 Git operations assistance

Claude walked us through several non-trivial git workflows:

- Cherry-picking the HistoryPage fix from `master` into `Phrase-2` after it was committed on the wrong branch.
- Resolving `non-fast-forward` rejection when pushing `Phrase-2` to `master`.
- Recognizing that `--force-with-lease` failed with "stale info" because we had not fetched recently, and using `git fetch origin` + `git log origin/master ^Phrase-2` to inspect what was on remote master before deciding whether to merge or force.
- The merge of `origin/master` (which had `D2_CODE_QUALITY.md` uploaded via the GitHub web UI) into local `Phrase-2`.
- Escaping vim when `git merge` opened the merge-commit-message editor.

### 2.10 README and submission preparation

- Claude noticed that the main repo's `README.md` still listed Arai-Kor-Dai's team members and not Emerald's. It suggested adding a "Phase 2 Maintenance Team — Emerald" section so the professor can see who maintained the project.
- Claude verified that the Android repository link (per spec requirement) is present in the main `README.md`.

---

## 3. How We Verified AI Output

Because AI assistants can produce confident-looking but incorrect output, we used the following verification practices throughout the project:

| Check | Where applied |
|---|---|
| **Manual code review** before committing | All AI-suggested code changes (CR-09 fix, RegisterScreen error handling, Retrofit timeouts) |
| **Manual end-to-end testing** on emulator and browser | After every behavioral change (login, register, history page, tracking screen) |
| **Cross-reference with the spec PDF** | All document structures (D2/D3/D4/D5 file names and required sections) |
| **Self-validation of computed data** | Reachability matrix distances spot-checked against the SLO directed graph by hand |
| **Asking the professor when ambiguous** | SLO interpretation, traceability scope, repo discoverability |

---

## 4. Limitations Encountered

- The AI sometimes proposed visual designs that did not work well in drawio (for example, a "junction-and-spoke" routing pattern that the user reverted to a backup version of). When this happened, we asked the AI to revert and try a different approach.
- The AI occasionally over-corrected — for example, normalizing Code→Test edge colors that we had intentionally left in a different style. We caught this in a final verification pass and discussed whether to revert.
- The AI cannot run the Android emulator or open Android Studio, so end-to-end visual verification of the mobile UI was always done manually by team members.

---

## 5. Summary

AI assistants accelerated our Phase 2 work primarily in three areas:

1. **Documentation drafting** (D2, D3, D4, D5 markdown structures and prose).
2. **Visual artifact generation** (drawio XML for the four D4 traceability/SLO/matrix pages).
3. **Diagnosis and explanation** (Render cold-start, Android networking, MySQL→PostgreSQL syntax differences, git operations).

Final correctness, end-to-end testing, and decisions about what to commit were verified and approved by the human team members before any artifact was submitted.
