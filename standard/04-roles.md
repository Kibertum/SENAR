# 4. Roles

SENAR defines five responsibility sets. One person MAY cover multiple sets. Responsibilities SHALL be covered, not necessarily by dedicated positions.

For career paths, transition guides, and scaling ratios, see SENAR Guide and Reference.

## 4.1 Supervisor (SHALL — all configurations)

Directs AI agents, verifies output, makes architectural decisions, enforces Quality Gates.

**Responsibilities:**
a) Define Tasks with goals and acceptance criteria before work;
b) Provide structured context to the AI agent;
c) Direct AI through execution with course corrections;
d) Review all AI output against acceptance criteria;
e) Make architectural and trade-off decisions;
f) Enforce Quality Gates before closing Tasks;
g) Capture knowledge entries during work;
h) Maintain Session discipline (checkpoints, duration).

The Supervisor prefers AI generation but MAY write code manually when context preparation cost exceeds manual intervention cost. Manual interventions SHOULD be traceable.

## 4.2 Context Architect (SHALL — all configurations)

Designs requirements as structured AI input, manages the requirement hierarchy (BR → SR → TR), and ensures traceability. Quality is built at input: a defect in a Business Requirement cascades to all downstream System Requirements, Task Requirements, and ultimately to code. The Context Architect is the primary guardian of input quality.

**Foundation (combined with Supervisor — Section 4.8, Section 11.1):**
At Foundation, the Supervisor absorbs Context Architect responsibilities. Minimum Foundation-level duties:
a) Maintain the project context file (e.g., CLAUDE.md) and ensure it reflects current project state;
b) Ensure context quality before task start — verify that QG-0 inputs are sufficient and well-structured;
c) Design initial task decomposition (BR → TR at minimum).

**Team (SHALL — dedicated):**
a) Maintain the requirement hierarchy (BR → SR → TR) with bidirectional traceability;
b) Manage requirement lifecycle: draft → approved → verified → deprecated;
c) Ensure requirement quality properties: verifiability (SHALL), consistency, sufficiency, non-redundancy, traceability [Team+: SHALL];
d) Prioritize work using WSJF (Section 3.29);
e) Conduct periodic traceability audits to identify orphaned requirements (requirements without Tasks) and orphaned Tasks (Tasks without requirements);
f) Enable requirement reuse by maintaining verified requirements as reusable Knowledge Base entries;
g) Design Agent Profiles and manage Operational Scripts (Section 5);
h) Review script changes as production process changes (Section 10.14);
i) Maintain tool inventory per Agent Profile (Section 5.4).

## 4.3 Knowledge Engineer (SHALL Team+)

Captures, curates, and maintains the organizational knowledge base.

NOTE: At Foundation configuration, Knowledge Engineer responsibilities are combined with the Verification Engineer role and covered by one person (Section 4.8, Section 11.1). The "Team+" designation means a dedicated role; at Foundation, combined coverage applies. A dedicated Knowledge Engineer is required at Team configuration and above.

**Responsibilities:**
a) Capture Dead Ends, decisions, patterns, known issues;
b) Ensure entries are searchable and categorized;
c) Review knowledge freshness; deprecate outdated entries;
d) Analyze knowledge gaps.

## 4.4 Flow Manager (SHALL Team+)

Manages Session rhythm, cost tracking, and flow metrics.

NOTE: At Foundation configuration, Flow Manager responsibilities are absorbed by the Supervisor (Section 4.8, Section 11.1). The "Team+" designation means a dedicated role; at Foundation, combined coverage applies.

**Responsibilities:**
a) Monitor Session duration and checkpoint cadence;
b) Track cost per Task and Increment against budget;
c) Monitor flow metrics (Section 9);
d) Facilitate Increment Planning and Retrospective;
e) Coordinate dependencies between Pairs (Federation);
f) Schedule Quality Sweeps.

At Enterprise scale, expands to coordinate multiple Pairs (Federation Coordinator).

## 4.5 Verification Engineer (SHALL Team+)

Audits AI-generated output for correctness, security, and architectural conformance.

NOTE: At Foundation configuration, Verification Engineer responsibilities are combined with the Knowledge Engineer role and covered by one person (Section 4.8, Section 11.1). The "Team+" designation means a dedicated role; at Foundation, combined coverage applies.

**Responsibilities:**
a) Conduct Quality Sweeps;
b) Audit AI output using the AI Output Review Checklist (see SENAR Guide);
c) Review AI-generated tests for coverage and assertion quality;
d) Track Defect Escape Rate and identify systemic issues.

## 4.6 Enterprise Roles (Enterprise configuration only)

At Enterprise scale (10+ Pairs), three additional responsibility sets emerge:

**Portfolio Manager:** Coordinates multiple Increments across value streams. Manages unified budget, cross-stream dependencies, and strategic prioritization. Ensures AI investment aligns with organizational objectives.

**Chief Supervisor:** Sets architectural standards across all Pairs. Reviews and approves architectural exceptions. Defines organization-wide AI interaction patterns and context templates. Note: Chief Supervisor defines organization-wide standards; Context Architect (Section 4.2) implements them within specific projects.

**Federation Coordinator:** Manages cross-project dependency tracking, shared knowledge base governance, and cross-team requirement traceability. Facilitates Federation Sync ceremonies (Section 7.5) at the portfolio level.

These are responsibility sets, not job titles. One person MAY cover multiple Enterprise roles.

## 4.7 Summary

| Responsibility | Team | Enterprise |
|---------------|------|------------|
| Supervisor | SHALL (each Pair) | SHALL (each Pair) |
| Context Architect | SHALL (dedicated) | SHALL (dedicated) |
| Knowledge Engineer | SHALL (dedicated) | SHALL (dedicated) |
| Flow Manager | SHALL (dedicated) | SHALL (dedicated) |
| Verification Engineer | SHALL (dedicated) | SHALL (dedicated) |
| Portfolio Manager | — | SHALL |
| Chief Supervisor | — | SHALL |
| Federation Coordinator | — | SHALL |

NOTE: For entry-level adoption (1–2 Pairs), see SENAR Core. The Supervisor role in Core absorbs all responsibilities.

## 4.8 Role Combinations by Team Size

| Team Size | Combination Pattern |
|-----------|---------------------|
| 1 Pair (Core) | Supervisor covers all responsibilities informally |
| 1–3 Pairs (Foundation) | Supervisor + Context Architect (combined), Knowledge Engineer + Verification Engineer (combined). 2 people cover all roles. |
| 3–5 Pairs (Team) | Context Architect + Flow Manager (combined), Knowledge Engineer (dedicated or shared), Verification Engineer (dedicated), Supervisors (each pair). Minimum 3 distinct role-holders. |
| 5–10 Pairs (Team) | All 5 roles dedicated. Context Architect may still combine with Flow Manager at 5–6 pairs. |
| 10+ Pairs (Enterprise) | All roles dedicated + Enterprise roles (Portfolio Manager, Chief Supervisor, Federation Coordinator). |

NOTE: Role combinations are SHOULD-level guidance. Organizations MAY choose different combinations based on team skills and domain. The requirement is that all responsibilities are covered, not that specific combinations are used.
