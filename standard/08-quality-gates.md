# 8. Quality Gates

Automated enforcement points. Implemented as code, not checklists. See SENAR Guide for AI Output Review Checklist.

## 8.1 QG-0: Context Gate (Task start)

Quality is built at input. QG-0 ensures that a Task has sufficient, well-structured context before AI-directed work begins.

SHALL criteria: goal defined, acceptance criteria verifiable, requirement or story linked (SHALL), work type assigned.

SHALL criteria (Team+): acceptance criteria are independently verifiable (each can be tested or measured separately); at least one negative scenario (error case, invalid input, or boundary condition) is included in acceptance criteria.

SHALL criteria (all configurations, security-relevant tasks): security surface declared — tasks touching auth, user input, data storage, payment, or external APIs SHALL identify the threat surface and include at least one security-related acceptance criterion. See SENAR Core (Start Gate, criterion 5) and Section 8.7.

SHOULD: plan, complexity estimate, relevant knowledge identified.

NOTE: Foundation configuration inherits Core's Start Gate requirements (scope boundaries, negative scenario) even though they are listed as "Team+" SHALL criteria above. At Foundation, QG-0 = Core Start Gate checks + Standard QG-0 structure. The "Team+" criteria (independently verifiable AC, negative scenario) are already practiced at Core level; Foundation formalizes them as gate criteria.

## 8.2 QG-1: Requirements Gate (Story/Increment level)

Ensures requirements are defined, approved, decomposed, and of sufficient quality before implementation begins.

SHALL criteria [Team+]: Business Requirement (BR) exists and is approved; decomposition to Task Requirements (TR) is complete at appropriate depth; all TRs have verifiable acceptance criteria; no orphaned requirements (requirements without implementation Tasks).

SHOULD criteria (Team+: SHALL): requirements satisfy consistency (no contradictions between TRs within a Story); requirements satisfy sufficiency (normal, boundary, and error scenarios covered); non-functional requirements specified where applicable (performance, security, accessibility).

### Decomposition Depth

The Context Architect SHALL determine decomposition depth [Team+] based on complexity and regulatory context:

| Context | Required Depth | Example |
|---------|---------------|---------|
| Standard feature, Team config | BR → SR → TR (3 levels) | BR: "Support OAuth" → SR: "OAuth provider flow" → TR: Task AC |
| Complex/regulated, Enterprise config | BR → SR → TR → TM (formal Test Model) | Full traceability chain for audit compliance |

NOTE: For simple features (BR → TR, 2 levels), see SENAR Core.

### Requirement Quality Properties

Requirements submitted to QG-1 SHALL be verifiable (each can be tested, measured, or demonstrated). Requirements SHOULD (Team+: SHALL) satisfy:

a) **Consistency** — no contradictions with existing requirements at the same or higher level;
b) **Sufficiency** — the set of TRs covers the parent requirement (SR or BR) completely;
c) **Non-redundancy** — no duplicate requirements across Stories;
d) **Traceability** — every TR traces up to a BR; every BR decomposes to at least one TR.

### Requirement Change Management

NOTE: Requirement Change Management applies at Team+ configuration.

When an approved BR or SR changes after implementation has begun:

a) The change SHALL be documented with rationale and the identity of the person who authorized it;
b) Impact analysis SHALL identify all downstream requirements and Tasks affected by the change;
c) Affected Tasks that are already `done` SHALL be flagged for re-verification — their QG-2 approval is invalidated;
d) The changed requirement SHALL pass QG-1 again before new implementation begins;
e) Supervisors of affected Tasks SHALL be notified of the change.

Scaling: at Team, impact analysis SHALL be supported by tooling (requirement parent/child links). At Enterprise, requirement changes SHALL be version-controlled and subject to change review (see Section 11.3, Requirements-as-Code).

## 8.3 QG-2: Implementation Gate (Task done)

SHALL criteria: CI passes, tests pass, static analysis passes (including type checking where applicable), no new lint violations, acceptance criteria verified by Supervisor, no security vulnerabilities detected by scanning tools.

SHOULD: coverage meets threshold, no duplication, docs updated, knowledge entry if decision/dead end. Team+: generated tests reviewed against Test Model (TM) — AI-generated tests SHALL exercise the stated acceptance criteria, not just achieve coverage.

SHOULD (Team+: SHALL): AI-modified dependency manifests (the project's declared dependency files — e.g., package.json, requirements.txt, go.mod, Cargo.toml) reviewed for hallucinated packages — packages that do not exist in the official registry or that resolve to unexpected maintainers, typosquatted packages (near-name-matches of legitimate packages), and dependency confusion (internal vs. public namespace collisions).

## 8.4 QG-3: Verification Gate (Merge — Team+ configs)

SHALL criteria: acceptance tests pass, security scan clean, no regressions, code reviewed (risk-based — see 8.7).

SHOULD: performance within SLA, accessibility compliance, cross-service integration verified.

### AI Output Review Minimum Criteria

At QG-3, the following AI-specific checks SHALL be performed:

a) Generated code does not call non-existent APIs, methods, or CLI flags (hallucination check);
b) All imported packages exist in the project's dependency manifest (dependency validation);
c) Generated code follows project architectural patterns and conventions (pattern conformance);
d) Generated tests exercise the stated acceptance criteria, not just achieve coverage (test validity);
e) No hardcoded credentials, API keys, or secrets in generated code (secrets check).

These criteria replace dependency on the informative AI Output Review Checklist in the SENAR Guide with normative minimum requirements.

## 8.5 QG-4: Acceptance Gate (Release)

SHALL criteria: Delivery Review conducted OR stakeholder approval recorded, QG-3 still passing, staging environment (production-equivalent deployment target) verified, stakeholder acceptance recorded.

## 8.6 Enforcement Rules

a) Gates SHALL be automated wherever feasible. Human judgment criteria require explicit recorded approval.
b) Every gate execution SHALL produce an audit record.
c) Gates SHALL NOT be bypassed without documented Gate Bypass (justification + risk + remediation + senior approval).
d) Organizations SHOULD track Gate Bypass rate.

## 8.7 Risk-Based Review

| Risk Level | Examples | Review |
|-----------|---------|--------|
| High | Security, auth, payment, data migration, architecture | SHALL: peer review + security review (all configurations) |
| Standard | Feature, UI, business logic | QG-2 automated + Supervisor verification statement |
| Low | Docs, config, trivial fixes | QG-2 automated sufficient |

**Security review for high-risk changes:** For changes affecting authentication, payment processing, personal data handling, or cryptographic operations, security review SHALL be performed at ALL configuration levels, not only Enterprise. This is a mandatory (SHALL) requirement regardless of team size. Organizations developing security-sensitive systems SHALL adopt security controls (QG-3 with AI Output Review Minimum Criteria, risk-based code review) regardless of configuration level.

## 8.8 Gate Pipeline

```
Exploration ──► (yields work?) ──► Task
Task ──► [QG-0] ──► active ──► [QG-2] ──► done
                                  │
                         (Team+) [QG-3] ──► merged
                                  │
                                [QG-4] ──► released

Story/Increment: [QG-1] ──► approved ──► Tasks created
```

## 8.9 Summary

| Gate | Applied At | Core | Foundation | Team | Enterprise |
|------|-----------|------|------------|------|------------|
| QG-0 | Task start | YES (Start Gate) | YES | YES | YES |
| QG-1 | Story/Increment | — | — | YES | YES |
| QG-2 | Task done | YES (Done Gate) | YES | YES | YES |
| QG-3 | Merge | — | — | YES | YES |
| QG-4 | Release | — | — | YES | YES |

NOTE: SENAR Core defines QG-0 (Context Gate) and QG-2 (Implementation Gate) as its two quality gates. Foundation configuration inherits both gates from Core (Section 11.1).

## 8.10 Security Requirements Cross-Reference

One consolidated view of all security-related requirements across the Standard. Use this table when auditing security coverage or onboarding a new configuration.

| Requirement | Where Defined | Configuration |
|-------------|---------------|---------------|
| AI Output Review Minimum Criteria (secrets check, hallucination check) | QG-3 (8.4) | Team+ |
| High-risk change review — human approval required (auth, payment, data, crypto) | 8.7 + Section 10.15 L3 | All configs |
| Security surface declaration at task start | QG-0 (8.1) | All configs |
| Auth coverage verification | AI Output Review Checklist item 15 (SENAR Core) | High tier |
| Input validation | AI Output Review Checklist item 6 (SENAR Core) | Standard tier |
| Secrets detection in sessions | Section 6.4 | All configs |
| Agent dispatch review | Section 5.6 + Section 10.15 | Team+ |

NOTE: "All configs" means the requirement applies regardless of team size — including Foundation teams. See 8.7 for the normative statement on security review applicability.
