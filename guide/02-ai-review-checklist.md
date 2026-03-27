# SENAR Guide: AI Output Review Checklist

> **NOTE — Relationship to SENAR Core**
>
> SENAR Core includes an updated **Verification Checklist** (26 items, 3 tiers: **Standard / High / Critical**) that supersedes this checklist for Core adopters.
>
> **Tier mapping:** Tier 1 (this guide) ≈ Standard (Core) | Tier 2 ≈ High | Tier 3 ≈ Critical
>
> This Guide checklist is retained for teams adopting SENAR through the Standard (team-level entry point) who have not yet moved to Core. If your team uses SENAR Core, use the Core Verification Checklist instead.

When reviewing AI-generated output, check for these AI-specific issues.

## The Checklist

| # | Check | What to Look For |
|---|-------|-----------------|
| 1 | **Scope** | Did AI modify files outside the task scope? (most common AI error) |
| 2 | **Deletions** | Did AI silently remove or replace existing working code? |
| 3 | **Phantom imports** | Are all imported packages in the dependency file? |
| 4 | **Dependency versions** | Are specified versions real and published? |
| 5 | **Hardcoded values** | Magic numbers, URLs, credentials, API keys in code? |
| 6 | **Over-engineering** | Unnecessary abstractions, patterns, or generalization? |
| 7 | **Duplication** | New code that duplicates existing utilities? |
| 8 | **Test quality** | Do tests verify behavior, or just mirror implementation? |
| 9 | **Test tampering** | Did AI modify tests to pass instead of fixing the code? |
| 10 | **Security** | Open CORS, hardcoded tokens, SQL without parameterization? |
| 11 | **Edge cases** | Happy path works — what about null, empty, boundary, concurrent? |
| 12 | **Naming** | Does AI follow project naming conventions? |
| 13 | **Commit scope** | Is the commit atomic and focused, or a kitchen sink? |
| 14 | **Null guard before comparison** | `None == None` is `True` in Python (JS: `null === null` is true; most languages have equivalent null-equality traps) — access checks bypassed when both sides null? |
| 15 | **Empty config bypass** | Security check skipped when config value is empty string? (`if secret and ...` fails open) |
| 16 | **Header trust** | X-Forwarded-For, X-Partner-ID, Content-Length used for security without proxy validation? |
| 17 | **IDOR** | Resource accessed by ID without verifying user's access to that resource? Auth ≠ authorization. |
| 18 | **Return True shortcut** | Access control function returns True/grants access without explicit ownership validation? |
| 19 | **Format string injection** | `str.format(**untrusted_dict)` — Python format supports attribute access, enables injection (JS: template literals with `eval()`; C/C++: `printf` format strings; any language: string interpolation with untrusted input) |
| 20 | **God functions/files** | Functions >50 lines, files >400 lines — strongest signal of unrefactored AI output |
| 21 | **Unreachable safety code** | `return False` after exhaustive exception handling — AI added "just in case" but can never execute |
| 22 | **Swallowed exceptions** | `catch/except` blocks that discard errors (`except Exception: pass`, `catch(e) {}`, or logging at debug level) — hides real failures. Check for null/None/nil returns that silently mask error conditions |
| 23 | **Unsafe deserialization** | pickle.loads, yaml.load without SafeLoader, eval/exec on untrusted input, JSON prototype pollution? (Java: `ObjectInputStream`; JS: `eval(JSON)`; any language: deserializing untrusted data without validation) |

## Priority Tiers

**Tier 1 — Always check (every task):**
Items 1–3 (scope, deletions, phantom imports) and 8–9 (test quality, test tampering). These catch the most frequent and most dangerous AI defects. A 5-item check takes under 2 minutes.

**Tier 2 — Security-sensitive tasks (auth, payment, data, API):**
Items 10 (security), 14–18 (null guard, empty config, header trust, IDOR, return True). These catch latent defect patterns — AI output that looks correct but fails under adversarial conditions. Identified through adversarial audits of production AI-generated code.

**Tier 3 — Deep review (complex tasks, agent dispatch output):**
All remaining items (4–7, 11–13, 19–23). Apply when reviewing complex features, refactors, or any output from dispatched agents (Rule 15 L3).

## Usage

Print this list. Use it at QG-2 (Implementation Gate) for every Task. Over time, some checks become automatic habits — but keep the list visible for new Supervisors.
