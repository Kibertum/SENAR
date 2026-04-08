# 11. Configurations

NOTE: For individual adoption, see SENAR Core — 8 rules, 2 quality gates, 2 metrics. This Standard defines three organizational configurations: Foundation, Team, and Enterprise.

## 11.1 SENAR Foundation (1–3 Pairs)

The bridge between Core and Team. For small teams that need more structure than Core but aren't ready for full Team process.

| Category | Requirements |
|----------|-------------|
| Base | All SENAR Core rules apply |
| Responsibilities | 3 combined responsibility sets covered by 2 people (Section 4.8): Supervisor + Context Architect (combined), Knowledge Engineer + Verification Engineer (combined). Flow Manager responsibilities are absorbed by the Supervisor. |
| Ceremonies | 3: Session Start, Session End, Quality Sweep (monthly). NOTE: Foundation conducts Increments (Section 6.5) but omits formal Increment Planning and Retrospective ceremonies. Planning is implicit in Session Start; retrospective insights are captured in Quality Sweep. |
| Quality Gates | 2: QG-0 (Context Gate) + QG-2 (Implementation Gate) |
| Metrics | 4: Throughput, Lead Time, FPSR, Defect Escape Rate |
| Rules | Core 8 + Rule 2 (Standard 10.2, Session Duration), Rule 4 (Standard 10.4, Dead End Documentation), Rule 9 (Standard 10.9, Knowledge Capture) = 11 rules |
| Knowledge Base | Shared, accessible to all team members and AI sessions |

> **Note:** At Foundation, session duration monitoring (Rule 10.2) is the Supervisor's responsibility, since Flow Manager is not a separate role at this configuration (Section 4.8).

> **Note:** Core rules and Standard rules use different numbering. Core Rule 8 (Capture Knowledge) expands into Standard Rules 10.4 (Dead End Documentation) and 10.9 (Knowledge Capture). Foundation adds these as explicit, tracked requirements alongside Standard Rule 10.2 (Session Duration).

> **Note:** Section 6.4 (secrets detection in sessions) implicitly requires elements of Rule 10.6 (Version Control). Organizations adopting Foundation SHOULD also adopt Rule 10.6 to ensure atomic commits, automated secrets detection, and AI scope-creep review.

### Adoption Path (week by week)

- **Week 1 — Core habits + Session Start/End.** All team members read SENAR Core and begin applying its 8 rules daily. Introduce Session Start (context load + goal declaration) and Session End (output summary + knowledge entry) as team ceremonies. Assign the 3 combined responsibilities — roles may overlap.
- **Week 2 — Dead End documentation + Knowledge capture.** Activate Rule 4 (Dead End Documentation): every blocked path gets a knowledge entry before work pivots. Activate Rule 9 (Knowledge Capture): every significant decision and non-obvious finding goes into the shared KB. After two weeks the team has a working knowledge base, not an empty one.
- **Week 3 — Quality Sweep (first monthly).** Run the first Quality Sweep: review the session log, check which dead ends were documented, identify recurring friction points. This is a retrospective with output — concrete adjustments to thresholds, session duration, or task decomposition depth.
- **Week 4 — Metrics baseline.** Start measuring all 4 metrics: Throughput (tasks completed per week), Lead Time (task start to done), FPSR (first-pass success rate at QG-2), Defect Escape Rate (bugs found after done). Record baseline values — no targets yet, just calibration. Adjust thresholds to your domain.

### Foundation vs Core — What's Different

Core is individual discipline: one Supervisor, two quality gates, two metrics, all enforced at the personal level. Foundation adds **team coordination layer**:

- Shared knowledge base visible to all team members and AI sessions (not just the author's local context)
- Session Start/End as **team ceremonies** — synchronization points, not just individual habits
- Monthly Quality Sweep — collective review of process health, not individual retrospection
- 2 additional metrics (FPSR + DER) that only make sense when multiple people share a definition of "done"

The cognitive overhead is low. Foundation is designed to be adopted incrementally on top of Core habits already in place.

### FAQ for Foundation Teams

**When do we move to Team?** When any of the following applies: the team reaches 3+ Pairs and coordination overhead is visible; you need cross-pair dependency tracking or knowledge federation; you want QG-1 (Requirements Gate) or QG-3 (Verification Gate); you want dedicated (non-overlapping) responsibilities.

**Can we skip Foundation and go directly to Team?** Yes. If the team already has process discipline — structured task decomposition, code review culture, retrospectives — start at Team. Foundation is a bridge, not a mandatory stop.

**What if we're exactly 3 pairs?** Evaluate experience level. If everyone is experienced with structured AI-assisted development, go Team — the overhead is manageable. If the team has mixed experience or is just starting with AI workflows, stay Foundation for 4–8 weeks to build habits before adding federation and all 5 gates.

## 11.2 SENAR Team (3–10 Pairs)

| Category | Requirements |
|----------|-------------|
| Responsibilities | All 5 dedicated (SHALL) |
| Ceremonies | All 7 (per Section 7) |
| Quality Gates | All 5: QG-0 through QG-4 (SHALL) |
| Metrics | All 10 (SHALL) |
| Rules | All 15 (SHALL) |
| Federation | Cross-Pair dependency tracking, shared KB (SHALL) |
| Risk-Based Review | QG-3 differentiated by risk (Section 8.7) |
| Security Review | SHALL for high-risk changes (auth, payment, data, crypto) — see Section 8.7 |

## 11.3 SENAR Enterprise (10+ Pairs)

All Team requirements, PLUS:

| Category | Additional |
|----------|-----------|
| Portfolio Management | Increments grouped by value stream with unified budget |
| Additional Responsibilities | Portfolio Manager, Chief Supervisor, Federation Coordinator |
| Compliance | QG audit trails for ISO/regulatory requirements |
| Governance | Gate Bypass review, architectural exceptions, budget oversight |
| Requirements-as-Code | Requirements stored in VCS, CI validates traceability, change review required (SHALL) |

For scaling ratios and enterprise guidance, see SENAR Reference.

NOTE: Enterprise configuration describes target state for large-scale adoption. Organizations at this scale should validate ratios and adapt coordination mechanisms to their context.

## 11.4 Comparison

| Element | Core | Foundation | Team | Enterprise |
|---------|------|-----------|------|------------|
| Pairs | 1 | 1–3 | 3–10 | 10+ |
| Rules | 8 | 11 | 15 | 15 |
| Quality Gates | 2 | 2 (QG-0, QG-2) | 5 (QG-0..QG-4) | 5 + compliance |
| Metrics | 2 | 4 | 10 | 10 + portfolio |
| Responsibilities | 1 (Supervisor) | 3 (combined) | 5 (dedicated) | 5 + portfolio |
| Ceremonies | 0 | 3 | 7 | 7 + portfolio |
| Knowledge Base | Recommended | Required | Required + federation | Required + federation |
| Security Review | Checklist | Checklist | SHALL (high-risk) | SHALL + formal audit |
| Tooling | None | Recommended | Required | Required |

## 11.5 Migration

```
SENAR Core ──► Foundation ──► Team ──► Enterprise
 + 3 roles (combined)  + dedicated roles    + portfolio management
 + 3 ceremonies        + federation         + value streams
 + 2 more metrics      + all gates          + compliance
 + session mgmt        + all metrics/rules  + governance
```

Each step is incremental. Pilot with a subset of Pairs first. Typical timelines:
- Core → Foundation: 2-4 weeks after team has internalized Core habits
- Foundation → Team: 2-3 months, when team reaches 3+ Pairs or needs federation
- Team → Enterprise: when organization has 10+ Pairs and needs portfolio governance
