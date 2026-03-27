# SENAR Guide: Transition from Traditional Roles & Core to Standard

## Upgrading from SENAR Core to SENAR Standard

### When to Upgrade

SENAR Core is sufficient for individual developers and small teams (1-2 people). Consider upgrading to the full Standard when:

- **Team grows beyond 3 people** — you need roles (Context Architect, Flow Manager, Verification Engineer) to coordinate work across Supervisors.
- **Multiple projects** — cross-project dependencies require federation coordination, not ad-hoc communication.
- **Compliance or regulatory needs** — you need audit trails, formal requirement traceability, and documented quality evidence.
- **Knowledge silos appear** — tribal knowledge is not making it into the knowledge base, and different Supervisors produce inconsistent results.
- **DER plateaus** — Dead End Rate stops improving because knowledge is captured but not systematically reused across the team.

### What Standard Adds Over Core

| Dimension | SENAR Core | SENAR Standard |
|-----------|-----------|----------------|
| **Rules** | 8 rules | 15 rules (adds session management, knowledge lifecycle, code documentation, federation) |
| **Gates** | Start Gate + Done Gate | 5 gates: QG-0 (Context) + QG-1 (Requirement) + QG-2 (Implementation) + QG-3 (Verification) + QG-4 (Deployment) |
| **Metrics** | FPSR + DER | 10 metrics (adds Throughput, Lead Time, KCR, MIR, Cost per Task, Cost Predictability, and more) |
| **Roles** | Supervisor (implicit) | Supervisor, Context Architect, Flow Manager, Verification Engineer, Knowledge Engineer |
| **Ceremonies** | None | Session Start/End, Increment Planning, Quality Sweep, Increment Retrospective |
| **Configurations** | Not applicable | Foundation, Team, Enterprise — progressive adoption levels (Core serves as the entry point) |
| **Session management** | Not prescribed | Duration limits, checkpoint cadence, handoff discipline |
| **Multi-team** | Not covered | Federation Sync, cross-project dependencies, portfolio metrics |
| **Maturity model** | Not applicable | 6 dimensions, 5 maturity levels per dimension |

### Migration Steps

If you are already using SENAR Core, migration to Standard is incremental — nothing is unlearned.

**Step 1: Map your Core practice to Standard (Day 1)**
Your 8 Core rules map directly to Standard rules. Your Start Gate maps to QG-0. Your Done Gate maps to QG-2. FPSR and DER remain your primary metrics. SENAR Core is the entry point to the Standard — you are ready for Foundation configuration.

**Step 2: Add session discipline — Foundation configuration (Week 1)**
Introduce formal Session Start (load context, select tasks, verify environment) and Session End (write handoff, capture metrics, document knowledge). Cap sessions at 4–6 hours. Add a monthly Quality Sweep. This is Foundation: 11 rules, 3 combined roles (Supervisor covers Context Architect + Knowledge Engineer + Verification Engineer), 4 metrics (add Throughput and Lead Time). Suitable for 1–3 Pairs.

**Step 3: Add Team ceremonies (Week 2-4)**
When you have 3+ Supervisors:
- **Increment Planning** — Context Architect leads: review backlog, apply WSJF prioritization, assign tasks to Pairs.
- **Quality Sweep** — Verification Engineer audits: sample recent work for architectural consistency, test quality, knowledge freshness.
- **Increment Retrospective** — Flow Manager leads: review metrics, identify process improvements, set targets.

**Step 4: Add organizational metrics (Month 2+)**
Beyond FPSR and DER, begin tracking: Throughput (tasks/session), Lead Time, Knowledge Capture Rate (KCR), Cost per Task, Cost Predictability. Establish baselines for 3 Increments before setting targets.

**Step 5: Add governance (when needed)**
Enterprise configuration (10+ Pairs): federation coordination across projects, QG-3 (independent verification), QG-4 (deployment gate), requirement traceability, audit trails.

### Core Rules to Standard Rules Mapping

| Core Rule | Standard Equivalent |
|-----------|-------------------|
| 1. Task Before Code | Rule 1 (S10.1) + QG-0 (S8.1) |
| 2. Scope Boundaries | QG-0 SHOULD criteria + Guide habit |
| 3. Verify Against Criteria | QG-2 (S8.3) + Rule 15 L2 (S10.15) |
| 4. Tests Verify Requirements | QG-2 test criteria + QG-3 test validity (S8.4) |
| 5. Check for Latent Defects | Rule 15 (S10.15) + AI Review Checklist (Guide) |
| 6. Zero Tolerance for Incomplete Work | QG-2 enforcement (S8.6) |
| 7. Fix Causes, Not Symptoms | Rule 5 Periodic Audit (S10.5) + Guide failure modes |
| 8. Capture Knowledge | Rule 4 Dead End Documentation (S10.4) + Rule 9 Knowledge Capture (S10.9) |

---

## Role Mapping

| Current Role | SENAR Responsibility | Transferable Skills | Skills to Develop |
|-------------|---------------------|-------------------|-------------------|
| Senior Developer | Supervisor | Code review, architecture, domain knowledge, debugging | Context design, AI interaction, delegation over execution |
| Tech Lead | Senior Supervisor | Architecture, trade-offs, mentoring | AI-first mindset, reduced hands-on coding |
| QA Engineer | Verification Engineer | Verification, edge case thinking, acceptance criteria | AI output patterns, hallucination detection |
| DevOps Engineer | Supervisor (infra) | Automation, CI/CD, infrastructure | AI-directed config, context for infrastructure |
| Product Owner | Context Architect | Requirements, prioritization, stakeholder management | Structuring requirements for AI consumption, traceability |
| Scrum Master | Flow Manager | Facilitation, process optimization | Metrics-driven management, cost tracking |

## Supervisor Career Path

| Level | Focus | Key Competency |
|-------|-------|----------------|
| Junior Supervisor | Single tasks, close verification | Following patterns, thorough review |
| Supervisor | Multiple tasks, architectural decisions | Context design, trade-off judgment |
| Senior Supervisor | Cross-project impact, mentoring | Architectural direction, reviewing others |
| Staff Supervisor | Process optimization, methodology | QG design, maturity assessment |

## Common Transition Challenges

**"I'm faster typing it myself"** — True for trivial tasks. For moderate+, context design + AI generation is faster than manual coding AND produces tests, documentation, and traceable output. Measure it.

**"I don't trust AI output"** — Good instinct. That's what QG-2 and the Review Checklist are for. Verification is your core skill now, not trust.

**"My value was writing code"** — Your value was solving problems. You still solve problems — but now through direction and judgment, not keystrokes. The problems get bigger.
