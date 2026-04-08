# SENAR Reference: Scaling Ratios

These ratios are guidelines. Organizations should adjust based on their domain, AI tooling capabilities, and team maturity.

## Responsibility Allocation by Team Size

| Pairs | Supervisor | Context Architect | Knowledge Engineer | Flow Manager | Verification Engineer |
|-------|-----------|-------------------|--------------------|--------------|-----------------------|
| 1–2 | 1 (covers all) | — (absorbed) | — (absorbed) | — (absorbed) | — (absorbed) |
| 3–5 | 3–5 | 1 (covers CA+KE) | (covered by CA) | 1 (covers FM+VE) | (covered by FM) |
| 6–10 | 6–10 | 1 dedicated | 1 dedicated | 1 dedicated | 1 dedicated |
| 10–20 | 10–20 | 2 (by domain) | 1 | 2 | 2 |
| 20–50 | 20–50 | 3–5 | 1–2 | 2–3 (Federation Coordinators) | 3–5 |
| 50+ | 50+ | 5–10 | 2–3 | 5+ (incl. Portfolio Manager) | 5–10 |

## Enterprise Roles

| Role | Ratio | When Needed |
|------|-------|-------------|
| Portfolio Manager | 1 per 20–50 Pairs | Multiple value streams or budget oversight |
| Chief Supervisor | 1 per organization | Architectural governance, QG standards |
| Federation Coordinator | 1 per 10–20 Pairs | Cross-team dependency management |
| Compliance Officer | 1 per organization | Regulated industries (ISO, PCI, HIPAA) |

## Quality Sweep Staffing

| Pairs | VE Coverage |
|-------|------------|
| 1–2 | Supervisor self-audits |
| 3–5 | 1 VE, sweeps rotate across Pairs |
| 6–10 | 1 dedicated VE, full sweep each cycle |
| 10+ | 1 VE per 5–10 Pairs, coordinated sweep schedule |
