# 12. Maturity Model

## 12.1 Levels

### Level 1: Ad Hoc
AI used opportunistically. No tasks, no gates, no metrics, no documented knowledge.

### Level 2: Supervised (aligns with SENAR Core)
Tasks before work. AI output verified. QG-0 and QG-2 enforced. 2 metrics tracked (FPSR + Throughput). Dead Ends documented (>15 min threshold). Sessions have start/end with handoffs.

**Key indicator:** Every AI implementation has a Task; output is verified.

### Level 3: Measured (aligns with Team)
All 5 responsibility sets covered. All 5 gates automated. All 10 metrics with baselines and targets (including ADR tracked per task). Knowledge capture structured. Federation active. Architectural Decision Records (ADRs) tracked. Data-driven decisions.

**Key indicator:** Baselines established; metrics reviewed at every Retrospective.

> **Note:** Levels 4 and 5 are aspirational targets based on industry patterns (CMMI, DORA). No SENAR implementation has been independently validated at these levels. They are provided as directional guidance for organizations seeking continuous improvement.

### Level 4: Managed (aspirational)
Cost predictability consistent. FPSR improving. Defect Escape Rate below threshold. Knowledge base actively improves AI context quality. Process improvements are experimental and measured.

### Level 5: Optimizing (aspirational)
Organization defines own patterns. Value streams optimized. Process experiments routine. Knowledge base is competitive advantage.

NOTE: Levels 4–5 are aspirational. See the note above Level 4 for details.

## 12.2 Assessment Dimensions

Organizations MAY be at different levels across dimensions:

| Dimension | L1 | L2 | L3 |
|-----------|----|----|-----|
| Task Discipline | None | Tasks before work | Full lifecycle + traceability |
| Quality Gates | None | QG-0 + QG-2 | All 5 automated |
| Metrics | None | 2 (Core) | 4 mandatory + 6 recommended |
| Knowledge | Undocumented | Dead Ends captured | Structured + target rate |
| Verification | None | Supervisor self-verifies | Independent verification, adversarial review and ADR tracking |
| Cost | Unknown | Tracked | Baselined and predicted |
| Requirements | Undocumented | Task goal + AC | Full hierarchy (BR→SR→TR) + quality properties |

## 12.3 Progression

Organizations SHOULD progress sequentially. Each level builds on the previous. Organizations MAY focus on weakest dimensions first.

