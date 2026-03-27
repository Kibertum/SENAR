# 7. Ceremonies

Ceremonies handle human strategic decisions. Quality enforcement is handled by Gates (Section 8).

## 7.1 Increment Planning (SHALL)

Define objectives, task pool, budget, and risks for the upcoming Increment.

| Participants | Context Architect (leads), Flow Manager, Supervisors |
|-------------|------------------------------------------------------|
| Frequency | Once per Increment |

Outputs: objectives, prioritized tasks, planned budget, risk register.

## 7.2 Session Start (SHALL)

Load context, select tasks, verify environment.

| Participants | Supervisor |
|-------------|------------|
| Overhead | Minimal (MAY be automated) |

## 7.3 Session End (SHALL)

Capture metrics, write handoff, record knowledge.

| Participants | Supervisor |
|-------------|------------|
| Overhead | Minimal (MAY be automated) |

**SHALL outputs:** summary, task states, handoff (next steps, warnings), metrics, dead ends (if any).
**SHOULD outputs:** knowledge entries for decisions/patterns/known issues.

## 7.4 Quality Sweep (SHALL)

Periodic comprehensive audit of codebase and knowledge base.

| Participants | Verification Engineer (leads) |
|-------------|--------------------------------------------------------|
| Frequency | At cadence documented by the organization |

Scope: security, code quality, test health, configuration drift, knowledge freshness, architectural conformance, dependency health, AI-specific issues (duplication, scope creep accumulation, TODO debris).

## 7.5 Federation Sync (SHOULD; SHALL at Team+)

Coordinate multiple Supervisor+AI Pairs.

| Participants | Flow Manager (leads), Supervisors |
|-------------|-----------------------------------|
| Frequency | Regular cadence (daily or every 2–3 days recommended) |

Agenda: status per Pair, dependency updates, shared component changes, integration issues.

## 7.6 Delivery Review (SHOULD)

Demonstrate working software to stakeholders, collect feedback, obtain acceptance.

| Participants | Context Architect (leads), Supervisor, Stakeholder |
|-------------|-----------------------------------------------------|
| Frequency | Per deliverable milestone |

## 7.7 Increment Retrospective (SHALL)

Quantitative review: planned vs actual cost, throughput trend, FPSR, DER, ADR, knowledge capture rate.

| Participants | Flow Manager (leads) |
|-------------|------------------------------------------------|
| Frequency | End of each Increment |

Output: specific, measurable, time-bounded, assigned improvement actions.

Organizations SHOULD allocate time for innovation, learning, and AI tooling experimentation.

## 7.8 Summary

| Ceremony | Mandate | Frequency |
|----------|---------|-----------|
| Increment Planning | SHALL | Per Increment |
| Session Start | SHALL | Per Session |
| Session End | SHALL | Per Session |
| Quality Sweep | SHALL | Periodic (org-defined) |
| Federation Sync | SHALL (Team+) | Regular cadence |
| Delivery Review | SHOULD | Per milestone |
| Increment Retrospective | SHALL | Per Increment |
