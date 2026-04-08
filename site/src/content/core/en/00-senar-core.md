# SENAR Core

## 8 Rules for AI-Assisted Development

**Version:** 1.3 | **Date:** 2026-03-25
**Authors:** Andrey Yumashev, Vadim Soglaev
**Copyright:** (C) 2026 Andrey Yumashev, Vadim Soglaev. Licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
**Website:** senar.tech

---

> 8 rules, 2 quality gates, 2 metrics, and a verification checklist — everything
> you need to work with AI coding assistants without shipping bugs.
> No specific tooling required. A text editor and version control are enough to start. As your practice matures, automation helps sustain discipline at scale.
> Reading time: 15 minutes.

---

## Who This Is For

You write code with AI assistants — Copilot, Claude, Cursor, or similar. You've noticed that AI output looks right but sometimes fails in production. You want a lightweight discipline that catches problems before they ship.

SENAR Core is that discipline. It works with any AI tool, any language, any workflow.

For organizations scaling AI development across teams, see the full [SENAR Standard](https://senar.tech).

---

## Key Term

**Supervisor** — the person directing the AI. If you work solo, that's you. In a team, it's whoever defines the task and reviews the AI's output. One person per task.

---

## The 8 Rules

### Rule 1. Task Before Code

Every change starts with a defined task:

- **Goal** — what you need to accomplish (one sentence).
- **Acceptance criteria** — numbered conditions that define "done." Each one independently verifiable.
- **Negative scenario** — at least one thing that could go wrong (error case, invalid input, edge case).

For tasks touching auth, payment, PII, or external APIs — include at least one acceptance criterion about input validation and access control.

Don't start coding without a task. Exploration is free, but committing exploration results requires a task.

**Why this matters.** AI output quality equals input quality. "Add login" produces plausible code that misses edge cases. "POST /auth/login returns JWT; returns 401 on wrong password; returns 422 on missing email" produces testable code on the first try.

### Rule 2. Scope Boundaries

Every task explicitly defines:

- **What to change** — files, modules, or components in scope.
- **What NOT to touch** — at minimum: "do not modify files outside the listed scope." Be more specific when the task is near sensitive areas.

Without boundaries, AI agents will confidently refactor code outside scope, introduce unnecessary abstractions, or modify working systems you didn't ask about. Scope creep is the most common AI failure pattern.

Also helpful: specify patterns to follow ("follow the structure of `auth/router.py`") and constraints ("do not change the database schema").

### Rule 3. Verify Against Criteria

Each acceptance criterion must be factually verified — run the test, check the output, measure the result, inspect the diff.

"It works" is not verification. "Looks right" is not verification. For each criterion, you need recorded evidence: a passing test, a command output, a measured value, a confirmed behavior.

No evidence for a criterion? That criterion is not verified. Where automated tests make sense, write them. Where they don't (documentation, config, infrastructure), other evidence works — command output, screenshot, grep result.

Never approve AI output based on intuition, code appearance, or the AI's claim that it's done. **The AI's confidence is not evidence.**

### Rule 4. Tests Verify Requirements, Not Implementation

Tests come from acceptance criteria. They verify **what** the system does, not **how**.

A test that breaks when you refactor internals (without changing behavior) is an implementation test. Implementation tests create false failures during refactoring and false confidence during feature changes.

Good test: "POST /auth/login with valid credentials returns 200 and a JWT."
Bad test: "The `_hash_password` method is called exactly once with bcrypt."

Watch AI-generated tests closely: AI tends to produce tests that mirror the implementation rather than verify the requirement. A test that just echoes what the code does provides zero verification value.

### Rule 5. Check for Latent Defects

Before declaring "done," run through the verification checklist (see below). Three tiers based on risk:

- **Standard tier** (every task): scope, deletions, phantom dependencies, test quality, test tampering, input validation, hardcoded secrets, stale patterns, cross-file consistency, code quality.
- **High tier** (security, auth, payment, data): Standard plus null guard bypass, empty config bypass, header trust, IDOR, return-True shortcut, auth coverage, unsafe deserialization.
- **Critical tier** (production incidents, regulatory, complex features): all items.

Tasks involving user input, database writes, authentication, file I/O, or external APIs — use High tier at minimum. When in doubt, go higher.

**Why this matters.** AI-generated defects are hard to spot because they pass automated checks while containing subtle logical, security, or architectural flaws. The checklist targets specific patterns: returning True without validation, null equality bypasses, trusting HTTP headers, empty config values that silently disable security.

### Rule 6. Zero Tolerance for Incomplete Work

Every claim of completion must be backed by evidence:

- "All tests pass" — show the test run output.
- "No lint violations" — show the linter output.
- "API returns 401" — show the response.
- "File was updated" — show the diff.

"Done" without verification is not done. "Probably works" is not done. If a task has 5 acceptance criteria, all 5 need recorded evidence. Claiming full completion with partial work is worse than honest partial completion.

### Rule 7. Fix Causes, Not Symptoms

When you find a defect, identify the root cause before applying a fix.

A quick fix that suppresses the symptom creates technical debt, masks related defects, and guarantees recurrence. AI agents are particularly prone to symptom-level fixes — they'll add a null check where the real problem is that the data should never be null.

Before fixing, answer: "Why does this defect exist?" If the answer is "I don't know," keep investigating before patching. At minimum: identify the point of failure and the condition that triggered it. For complex defects (concurrency, state, external deps), reproduce the issue to verify your hypothesis.

**Context hygiene:** avoid sending PII, credentials, or regulated data to cloud AI tools without a Data Processing Agreement. See Standard Rule 10.12 for full requirements.

### Rule 8. Capture Knowledge

Document the following during or right after completing a task:

- **Dead ends** — any approach that took more than 15 minutes and was abandoned. Record what you tried, why it failed, what you chose instead. (15 minutes is a starting point — adjust to your domain. Based on empirical observation: beyond 15 minutes, the cost of documenting increases while the approach rarely succeeds.)
- **Decisions** — non-obvious choices with rationale (e.g., "chose argon2 over bcrypt because bcrypt import fails on Python 3.14").
- **Known issues** — limitations, workarounds, or tech debt introduced by the task.

Store knowledge where future AI sessions can access it — project docs, knowledge base, code comments, wherever works for you. Knowledge that exists only in your head doesn't exist for AI.

**Why this matters.** AI has no memory between sessions. Without captured knowledge, the same dead ends get explored repeatedly, the same decisions get re-debated, the same workarounds get rediscovered — at the same cost each time.

---

## Quality Gates

Two quality gates that every task passes through. Enforce them however you want — manually, via tooling, in PR reviews. The method doesn't matter; doing them does.

NOTE: These are called "gates" to align with the SENAR Standard (Section 8), where Quality Gates are enforcement points and Checkpoints (Section 3.12) are context preservation actions within a session. The two concepts are distinct.

### Start Gate

*(Called QG-0 in the full SENAR Standard)*

Before writing any code, verify:

| # | Check | Rule |
|---|-------|------|
| 1 | Goal is defined (one sentence) | Rule 1 |
| 2 | Acceptance criteria are listed (numbered, verifiable) | Rule 1 |
| 3 | At least one negative scenario is included | Rule 1 |
| 4 | Scope is defined (what to change, what not to touch) | Rule 2 |
| 5 | For security-relevant tasks: threat surface identified, security AC included | Rule 1 |

If anything is missing, fill it in before directing the AI to start. Criterion 5 applies to tasks touching auth, user input, data storage, payment, or external APIs.

### Done Gate

*(Called QG-2 in the full SENAR Standard)*

Before declaring a task complete, verify:

| # | Check | Rule |
|---|-------|------|
| 1 | All acceptance criteria have recorded evidence of verification | Rules 3, 6 |
| 2 | Automated tests exist for testable criteria and pass; non-testable criteria have other recorded evidence | Rules 3, 4 |
| 3 | Verification checklist passed at the appropriate tier | Rule 5 |
| 4 | Root cause identified for any defects found during the task | Rule 7 |
| 5 | Dead ends, decisions, and known issues documented (if none — state "none") | Rule 8 |

If anything is not met, the task stays in progress.

---

## Metrics

Two numbers to track. Don't set targets immediately — measure for at least 3 work cycles to establish your baseline.

### FPSR — First-Pass Success Rate

`tasks_completed_without_rework / total_tasks_completed * 100%`

The percentage of tasks completed correctly on the first attempt — no defects found after declaring "done," no re-opening, no rework. This is your primary indicator of whether the Start Gate and Done Gate are working.

Teams adopting SENAR Core typically see 50-65% initially, improving to 80-90% as the rules become habitual. These are illustrative ranges — establish your own baseline.

### Dead End Rate

`time_spent_on_dead_ends / total_task_time * 100%`

Simpler alternative: `dead_ends_count / total_tasks` — average dead ends per task.

Measures how much effort goes into abandoned approaches. Reflects the effectiveness of knowledge capture (Rule 8). A declining rate means your knowledge base is working.

Above 30% warrants investigation. Below 10% in a mature project indicates effective knowledge reuse.

---

## Verification Checklist

This checklist puts Rule 5 into practice. Pick the tier based on task risk.

| Task Type | Tier | Items |
|-----------|------|-------|
| Bug fix, config change, simple CRUD | Lightweight | 4 (items 1, 3, 5, 7) |
| Normal feature, refactoring | Standard | 10 |
| Auth, payments, PII, external APIs | High | 18 |
| Production incident, regulatory, complex | Critical | 28 |

### Standard Tier — Every Task

> **Lightweight mode for small tasks:** For tasks under 15 minutes (bug fixes, config changes, simple CRUD), check items 1, 3, 5, and 7 at minimum — scope compliance, test tampering, error handling, and secrets. Apply the full Standard tier for anything touching auth, payments, or user data.

| # | Check | What to Look For |
|---|-------|-----------------|
| 1 | **Scope** | Did the AI modify files outside the defined task scope? |
| 2 | **Deletions** | Did the AI silently remove or replace existing working code? |
| 3 | **Phantom dependencies** | Are all referenced dependencies real and available? (packages in manifest, APIs reachable, services declared) |
| 4 | **Test quality** | Do tests verify behavior from acceptance criteria, or just mirror the implementation? |
| 5 | **Test tampering** | Did the AI modify existing tests to make them pass instead of fixing the code? |
| 6 | **Input validation** | All user-supplied data validated for type, length, and format before use in queries, file operations, or commands. |
| 7 | **Hardcoded secrets** | No API keys, passwords, tokens, or credentials in source code. |
| 8 | **Stale patterns** | Does the code use deprecated APIs, removed functions, or patterns from older framework versions? |
| 9 | **Cross-file consistency** | If a type, interface, or contract was changed — are all consumers updated? |
| 10 | **Code quality** | Functions over 200 lines, duplicated logic, no reuse of existing utilities, unreadable structure. AI-generated code often works but is architecturally disposable. |

### High Tier — Security, Auth, Payment, Data

All Standard tier items, plus:

| # | Check | What to Look For |
|---|-------|-----------------|
| 11 | **Null guard bypass** | Comparisons where both sides can be null/None/nil — `None == None` is True, bypassing access checks. |
| 12 | **Empty config bypass** | Security checks skipped when a config value is an empty string (e.g., `if secret and ...` fails open). |
| 13 | **Header trust** | HTTP headers (X-Forwarded-For, X-Partner-ID) used for security decisions without upstream proxy validation. |
| 14 | **IDOR** | Resources accessed by ID without verifying the requesting user's authorization to that specific resource. |
| 15 | **Return-True shortcut** | Access control functions that return True or grant access without performing explicit ownership validation. |
| 16 | **Auth coverage** | Every endpoint accessing user-specific data has authentication enforced; authorization checked at resource level. |
| 17 | **Unsafe deserialization** | Deserializing untrusted data without validation (pickle, yaml.load without SafeLoader, eval/exec on input). |
| 18 | **SSRF** | Server-Side Request Forgery: URLs from user input are validated against an allowlist; no unfiltered fetches of arbitrary URLs. |

### Critical Tier — Production Incidents, Regulatory, Complex Features

All Standard and High tier items, plus:

| # | Check | What to Look For |
|---|-------|-----------------|
| 19 | **Dependency versions** | Are specified package versions real and published in the official registry? |
| 20 | **Hardcoded values** | Magic numbers, URLs embedded in code (secrets covered in Standard tier). |
| 21 | **Over-engineering** | Unnecessary abstractions, design patterns, or generalizations beyond what the task requires. |
| 22 | **Duplication** | New code that duplicates functionality already available in existing project utilities. |
| 23 | **Edge cases** | Happy path works — what about null, empty, boundary, concurrent, and high-volume inputs? |
| 24 | **Naming** | Does the AI follow project naming conventions consistently? |
| 25 | **Commit scope** | Is the commit atomic and focused on the task, or does it include unrelated changes? |
| 26 | **Format string injection** | String interpolation or formatting with untrusted input (Python `str.format`, JS template literals with eval, C printf). |
| 27 | **Unreachable safety code** | "Just in case" code paths that can never execute, masking incomplete control flow. |
| 28 | **Swallowed exceptions** | Catch/except blocks that discard errors silently — `except Exception: pass`, empty catch blocks, debug-level logging of errors. |

---

## What's Next

SENAR Core is the starting point. When your team grows or you need more structure, there's a clear progression:

| | Core | Foundation | Team | Enterprise |
|---|------|-----------|------|-----------|
| **Pairs** | 1 | 1–3 | 3–10 | 10+ |
| **Rules** | 8 | 11 | 15 | 15 |
| **Quality Gates** | 2 | 2 (QG-0, QG-2) | 5 (QG-0..QG-4) | 5 + compliance |
| **Metrics** | 2 | 4 | 10 | 10 + portfolio |
| **Roles** | 1 | 3 (combined) | 5 (dedicated) | 5 + portfolio |
| **Ceremonies** | 0 | 3 | 7 | 7 + portfolio |
| **Tooling** | None | Recommended | Required | Required |

> **Note on "Pairs":** A Pair is one Supervisor working with one or more AI agents — typically one developer with their AI coding tool.

**Next step from Core:** SENAR Foundation — add session management, 3 combined roles, 4 metrics. Takes 2-4 weeks after Core habits are solid. See the full [SENAR Standard](https://senar.tech) for details.

> **Note:** Session management (structured start and end of AI work sessions) is introduced at Foundation level. Core focuses on individual task discipline.

**Conformance:** If you follow all 8 rules and pass both gates consistently, you practice SENAR Core. No formal declaration is required — Core conformance is self-assessed.

Core rules map directly to Standard rules — nothing is unlearned:

| Core Rule | Standard Equivalent |
|-----------|-------------------|
| 1. Task Before Code | Rule 1 (S10.1) + QG-0 (S8.1) |
| 2. Scope Boundaries | QG-0 criteria + Guide habit |
| 3. Verify Against Criteria | QG-2 (S8.3) + Rule 15 L2 (S10.15) |
| 4. Tests Verify Requirements | QG-2 test criteria + QG-3 (S8.4) |
| 5. Check for Latent Defects | Rule 15 (S10.15) + AI Review Checklist |
| 6. Zero Tolerance | QG-2 criteria (S8.3) |
| 7. Fix Causes, Not Symptoms | QG-2 criterion (S8.3) + Guide failure modes |
| 8. Capture Knowledge | Rule 4 (S10.4) + Rule 9 (S10.9) |

NOTE: Standard Rules 10.2 (Session Duration), 10.3 (Checkpoint Cadence), 10.5 (Periodic Audit), 10.6 (Version Control), 10.7 (Parallel Agent Limit), 10.8 (Complexity-Cost Calibration), 10.10 (Requirement Traceability), 10.11 (Code Documentation as Context), 10.12 (Context Hygiene), 10.13 (AI Model Governance), 10.14 (Script Change Management) are new at Foundation/Team/Enterprise configurations and have no Core equivalent.

---

## Quick Reference Card

**Before starting (Start Quality Gate):**

1. Write the goal (one sentence).
2. List acceptance criteria (numbered, each independently verifiable).
3. Add at least one negative scenario.
4. Define scope: what to change, what NOT to touch.

**While the AI works:**

5. Verify each acceptance criterion with evidence (run it, test it, measure it).
6. Document any dead end that took more than 15 minutes.

**Before declaring done (Done Quality Gate):**

7. Run the verification checklist at the appropriate tier.
8. Confirm: all AC verified, tests pass, checklist passed, knowledge captured.

**After the task:**

9. Record decisions, known issues, and anything non-obvious.
10. Ask: could a new developer (or AI) continue this work without asking you questions? If not, capture what's missing.

---

*SENAR Core 1.3 — senar.tech*
*Copyright (C) 2026 Andrey Yumashev, Vadim Soglaev. Licensed under CC BY-SA 4.0.*
