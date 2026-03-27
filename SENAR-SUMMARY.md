# SENAR — Supervised Engineering & Normative AI Regulation

First formalized methodology for AI-native software development.
Version 1.3 | 25.03.2026 | Authors: Andrey Yumashev, Vadim Soglaev | senar.tech

## In One Sentence

SENAR defines how human Supervisors manage AI agents to produce verified, traceable, quality-guaranteed software.

## The Shift

AI is no longer an assistant — it is the primary producer of code. The human's role shifts from writing code to supervising AI: designing context, verifying output, making architectural decisions, enforcing quality.

## 5 Values

1. **Context over Code** — AI output quality = input context quality
2. **Verification over Speed** — correctness is the constraint, not velocity
3. **Knowledge over Experience** — what's not documented doesn't exist for AI
4. **Enforcement over Agreement** — quality gates as automated code, not meetings
5. **Judgment over Keystrokes** — human attention on decisions, not typing

## SENAR Core (8 rules)

The entry point for individual developers. 8 rules, 2 quality gates (Start Gate + Done Gate), 2 metrics (FPSR + Dead End Rate), and a 28-item verification checklist across 3 tiers (Standard / High / Critical). No specific tooling required.

## Core Structure (Standard)

- **5 Roles:** Supervisor, Context Architect, Knowledge Engineer, Flow Manager, Verification Engineer
- **4 Units of Work:** Exploration → Task → Session → Increment
- **5 Quality Gates:** QG-0 (Context) → QG-1 (Requirements) → QG-2 (Implementation) → QG-3 (Verification) → QG-4 (Acceptance)
- **10 Metrics:** Throughput, Lead Time, FPSR, DER, KCR, Cost Predictability, Cost per Task, MIR, Cycle Time, ADR
- **15 Rules:** Task before work, session duration, checkpoints, dead ends, audits, version control, parallel limits, cost calibration, knowledge capture, requirement traceability, code documentation, context hygiene, AI model governance, script change management, AI output quality verification
- **4 Configurations:** Core (1 pair) → Foundation (1–3 pairs) → Team (3–10) → Enterprise (10+)
- **5 Maturity Levels:** Ad Hoc → Supervised → Measured → Managed → Optimizing
- **Agent Instrumentation:** Control levels, agent profiles, script governance, structured tool protocol, dispatch isolation, federation

## 28-Item Verification Checklist (3 tiers)

- **Standard** (10 items, every task): scope, deletions, phantom deps, test quality, test tampering, input validation, hardcoded secrets, stale patterns, cross-file consistency, code quality
- **High** (8 more items, security tasks): null guard bypass, empty config bypass, header trust, IDOR, return-True shortcut, auth coverage, unsafe deserialization, SSRF
- **Critical** (10 more items, complex/regulatory): dependency versions, hardcoded values, over-engineering, duplication, edge cases, naming, commit scope, format string injection, unreachable safety code, swallowed exceptions

## Key Innovations (not in any other methodology)

- **Supervisor+AI Pair** as production unit (replaces dev team)
- **First-Pass Success Rate** — measures context quality, not coding speed
- **Dead End Documentation** — mandatory (>15 min threshold), prevents AI from repeating failures
- **Quality Gates as Code** — automated enforcement, not manual checklists
- **Adversarial Detection Rate** — measures latent defect density in AI output
- **Agent Instrumentation** — control levels, profiles, dispatch isolation, federation
- **28-item Verification Checklist** — 3-tier risk-based review for AI-generated code

## Document Set

| Document | Purpose |
|----------|---------|
| SENAR Core | 8 rules for individual developers (EN + RU) |
| SENAR Standard | Normative specification (SHALL/SHOULD/MAY), 14 chapters (0–13) |
| SENAR Guide | Philosophy, patterns, adoption, training — 13 chapters (0–12) |
| SENAR Reference | Glossary, scaling, efficiency, governance, tooling |
