# 9. Metrics

Organizations SHALL establish baselines by measuring for at least 3 Increments before setting targets. Targets are organization-specific, not universal.

## 9.1 Mandatory (SHALL)

| # | Metric | Formula | Measures |
|---|--------|---------|----------|
| 1 | **Throughput** | tasks_done / sessions | Delivery performance |
| 2 | **Lead Time** | completed_at - created_at | Delivery speed |
| 3 | **First-Pass Success Rate** | single_cycle_tasks (completed without rework) / total × 100% | Context quality |
| 4 | **Defect Escape Rate** | post_done_defects / done × 100% | Gate effectiveness |

A post-done defect is a defect task explicitly linked to a completed parent task that introduced the defect. The link SHALL be recorded in the task tracker.

## 9.2 Recommended (SHOULD; SHALL in Team+)

| # | Metric | Formula | Measures |
|---|--------|---------|----------|
| 5 | **Knowledge Capture Rate** | entries / tasks | Organizational memory |
| 6 | **Cost Predictability** | actual_cost / planned_cost × 100% | Estimation accuracy |
| 7 | **Cost per Task** | total_cost / tasks (by complexity) | Efficiency |
| 8 | **Manual Intervention Rate** | manual_tasks / total × 100% | AI-first adherence |
| 9 | **Cycle Time** | completed_at - started_at | Execution speed (vs Lead Time which includes queue time) |
| 10 | **Adversarial Detection Rate** | adversarial_critical_findings / L3_reviewed_tasks | Latent defect density |

Manual Intervention Rate requires Supervisor self-reporting (flag on task indicating manual code was written). Organizations SHOULD define what constitutes "manual intervention" (e.g., any hand-written production code, or only tasks done entirely without AI).

Adversarial Detection Rate (ADR) measures the density of CRITICAL-severity findings discovered by adversarial review (Section 10.15, L3) per task that underwent L3 review. Target: organizations SHOULD aim for ADR < 0.5 (fewer than one CRITICAL finding per two reviewed tasks). An ADR of 0 indicates either excellent AI output quality or insufficient review rigor — organizations SHOULD distinguish between the two.

For ADR computation, "L3_reviewed_tasks" means tasks that underwent L3 Adversarial Review. Tasks that did not receive L3 review (e.g., Low-risk tasks where L3 was skipped per Section 10.15) are excluded from the denominator. This ensures ADR reflects review effectiveness, not review coverage.

Knowledge Capture Rate target calibration: organizations with established knowledge bases SHOULD set KCR targets that reflect diminishing returns. A target of 1.0 (one entry per task) is appropriate for greenfield projects. For mature projects (>500 tasks), a target of 0.33 (one entry per three tasks) better reflects the natural rate of novel knowledge discovery. Organizations SHALL document their KCR target rationale.

## 9.3 Collection

Metrics 1–5 and 9 SHALL be collected automatically from task tracking and session data. Metrics 6–7 require cost tracking integration. Metric 8 requires Supervisor self-reporting. Cost Predictability requires Flow Manager assessment at Increment Retrospective.

Metric 10 (ADR) SHALL be collected from adversarial review findings recorded during L3 review (Section 10.15). Organizations SHALL maintain a record of review findings per task, classified by severity, to compute ADR.

Metric computation SHALL include all tasks without epoch-based filtering or exclusion of historical data. Organizations SHALL NOT exclude tasks from metric computation based on creation date, migration status, or tooling version. Rationale: epoch filters introduce complexity, create maintenance burden, and mask data quality issues. Historical data naturally dilutes as new data accumulates, converging metrics to their true values over time. If early data is known to be unreliable (e.g., pre-automation manual entries), this SHALL be documented as a known limitation, not filtered.

Cost Predictability (metric 6) requires organizations to record planned cost before implementation begins. In practice, planned cost estimation for AI-assisted tasks is unreliable — AI execution time is non-deterministic and model pricing varies. At Team configuration, Cost Predictability SHALL be tracked but baselines may be provisional during the first 3 Increments. At Enterprise configuration, Cost Predictability SHALL be tracked with established baselines. Cost per Task (metric 7) provides a more actionable proxy for cost management in early adoption.

Multi-agent and multi-session configurations: when multiple AI agents work in parallel (multiple concurrent sessions), per-session metrics (throughput, session duration, cost per session) reflect individual agent performance, not aggregate team output. Organizations using multi-agent configurations SHOULD additionally track aggregate metrics at the Increment level. Token and cost attribution in multi-agent scenarios SHOULD be recorded per-agent, with aggregate totals available for Increment-level reporting.
