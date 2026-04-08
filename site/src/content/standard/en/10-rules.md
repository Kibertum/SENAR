# 10. Operational Rules

## 10.1 Task Before Implementation (SHALL)

Implementation SHALL NOT begin without a Task. Explorations are exempt; if they yield code, a Task SHALL be created before commit.

## 10.2 Session Duration (SHALL)

Organizations SHALL establish, document, and enforce a maximum Session duration. Basis SHOULD be documented. The documented maximum SHOULD be informed by empirical session data. As a starting guideline, sessions exceeding 180 minutes show diminishing returns in most AI-assisted workflows.

## 10.3 Checkpoint Cadence (SHALL)

Checkpoints SHALL be performed at intervals not exceeding a duration documented by the organization. The documented interval SHOULD be no greater than the organization's maximum acceptable context loss in the event of a session interruption.

## 10.4 Dead End Documentation (SHALL)

Failed approaches SHALL be documented as Dead End knowledge entries (approach, reason, alternative). A dead end is any investigation that takes more than 15 minutes without producing a usable result. When this threshold is reached, the Supervisor SHALL stop, document the approach and reason for failure, and choose an alternative path.

## 10.5 Periodic Audit (SHALL)

Quality Sweeps SHALL be conducted at a cadence documented by the organization, reviewed at each Retrospective. The documented cadence SHOULD be no less frequent than once per 3 Increments. For Foundation configuration, the recommended cadence is monthly (Section 11.1), which satisfies this requirement when Increments are 2 weeks or shorter.

## 10.6 Version Control (SHALL)

a) Commits SHALL be atomic; b) Secrets detection SHALL be automated; c) AI changes SHALL be reviewed for scope creep.

## 10.7 Parallel Agent Limit (SHALL)

Supervisors SHALL NOT exceed the organization's defined parallel agent limit. A common starting limit is 3 concurrent agents per Supervisor; organizations SHOULD calibrate based on task complexity and Supervisor capacity.

## 10.8 Complexity-Cost Calibration (SHALL)

Organizations SHALL maintain cost baselines per task complexity level.

## 10.9 Knowledge Capture (SHALL)

Organizations SHALL establish and track a Knowledge Capture Rate target.

## 10.10 Requirement Traceability (SHALL Team+)

Organizations SHALL maintain traceability from Business Requirements through System Requirements to Task Requirements. Every Task SHALL link to at least one requirement or Story. Requirements SHALL be stored in a versioned, searchable system.

## 10.11 Code Documentation as Context (SHALL)

Code documentation (module-level documentation (docstrings, doc comments, or equivalent), API descriptions, architecture docs) is not a post-hoc artifact — it is active context for AI Agents. Well-documented code reduces the context volume a Supervisor must provide per Task and enables AI to produce correct output with less explicit instruction.

Organizations SHALL maintain code documentation that includes: (a) module/package purpose statement, (b) public API contracts with parameter and return types documented, (c) architectural boundary description identifying dependencies and integration points. The documentation SHALL be machine-readable (structured comments, API description formats, or equivalent). Documentation SHOULD be updated as part of the same Task that changes the code (QG-2 criterion: "docs updated if API changed").

In AI-native development, documentation has a dual audience: human Supervisors and AI Agents. Documentation that is useful only to humans (e.g., "see John for details") is useless for AI. Documentation SHALL be self-contained and machine-readable.

## 10.12 Context Hygiene (SHALL)

Supervisors SHALL NOT include production credentials, API keys, personally identifiable information (PII), or regulated data (financial, health) in AI Agent context unless the AI model provider has a current data processing agreement and the data classification permits it. Organizations SHALL maintain a context classification policy defining which data categories are prohibited in AI context. Placeholder or synthetic data SHOULD be used when AI assistance is needed for tasks involving sensitive domains.

## 10.13 AI Model Governance (SHALL)

AI model providers are external suppliers. The AI model is the primary production tool — equivalent to a compiler. Organizations SHALL:

a) Record the AI model identifier and version used for each Session;
b) Recalibrate metric baselines (FPSR, cost per task, throughput) when the active model version changes substantially — a change in model generation constitutes a substantial change;
c) At Team+: evaluate new model versions before adoption — compare FPSR and cost per task on a representative task set;
d) At Enterprise: maintain a formal model approval process — new models SHALL be tested against acceptance criteria for the organization's domain before production use;
e) Document known model-specific limitations and hallucination patterns as Knowledge Entries.

NOTE: SENAR provisions that reference AI behavior (hallucination detection heuristics in Guide, session duration recommendations, parallel agent limits) are capability-dependent. Organizations SHOULD review these provisions when model generations change substantially.

## 10.14 Script Change Management (SHALL)

Organizations SHALL treat operational script changes as production process changes:
- Version-controlled (Section 10.6)
- Reviewed before deployment
- Decision recorded in knowledge base (Section 10.9 applies)

Team+ configurations SHALL additionally:
- Test script changes on isolated environment before propagation
- Maintain version registry of active scripts per project
- Ensure rollback capability for any script change

For the full definition of Operational Scripts and their governance, see Section 5.3.

## 10.15 AI Output Quality Verification (SHALL)

AI-generated code SHALL undergo quality verification before commit. Three verification levels are defined:

| Level | Method | Configs |
|-------|--------|---------|
| L1: Automated | Static analysis — file size, function size, complexity metrics, security pattern checks, lint | All (SHALL) |
| L2: Verification Statement | The person or agent who did the work writes a structured verification statement confirming what was checked against acceptance criteria and Code Standards | All (SHALL) |
| L3: Adversarial Review | An independent agent (different model or context-free) reviews without access to the generating agent's reasoning | SHALL (Team+) |

L3 Adversarial Review requirements:
a) The reviewing agent SHALL NOT have access to the generating agent's session context or reasoning;
b) At least one reviewer SHOULD be a "cold" reviewer — an agent with zero prior context of the task;
c) Findings SHALL be classified by severity (CRITICAL, HIGH, MEDIUM) and recorded;
d) CRITICAL findings SHALL block commit until resolved;
e) Organizations SHALL track Adversarial Detection Rate (ADR) — see Section 9.

L3 review SHALL be applied based on risk level (see Section 8.7):
- **High risk** (security, auth, payment, data migration, architecture): For High risk changes (Section 8.7), L3 review SHALL be applied regardless of configuration level; at least one reviewer SHALL be a human Supervisor, not an AI agent; security review SHALL be performed (see Section 8.7);
- **Standard risk** (feature, UI, business logic): L3 SHALL be applied (Team+);
- **Low risk** (docs, config, trivial fixes): L3 MAY be skipped with documented justification.

NOTE: L2 Verification Statement addresses quality defects (logic errors, style violations, acceptance criteria coverage) but does NOT constitute a security control. For security assurance, L3 is the minimum effective verification level. The L2 verification statement is a structured record confirming what was checked — it is not a review by an independent party. The person or agent who did the work writes the statement, confirming each acceptance criterion was verified and how.

NOTE: Latent defects in AI-generated code are characteristically difficult to detect because they satisfy automated quality checks while containing subtle logical, security, or architectural flaws. Common patterns include: returning True without validation, null equality comparison bypasses, trusting HTTP headers without verification, empty configuration values that silently disable security checks, and unreachable "safety" code that masks incomplete control flow understanding.

Agent dispatch (delegating implementation to a sub-agent) is the highest-risk scenario for latent defects, as the dispatched agent operates with reduced context. Organizations using agent dispatch SHALL apply L3 review to all dispatched agent output.

## 10.16 Summary

| # | Rule | Team | Enterprise |
|---|------|------|------------|
| 1 | Task Before Implementation | SHALL | SHALL |
| 2 | Session Duration | SHALL | SHALL |
| 3 | Checkpoint Cadence | SHALL | SHALL |
| 4 | Dead End Documentation (>15 min threshold) | SHALL | SHALL |
| 5 | Periodic Audit | SHALL | SHALL |
| 6 | Version Control | SHALL | SHALL |
| 7 | Parallel Agent Limit | SHALL | SHALL |
| 8 | Complexity-Cost Calibration | SHALL | SHALL |
| 9 | Knowledge Capture | SHALL | SHALL |
| 10 | Requirement Traceability | SHALL | SHALL |
| 11 | Code Documentation as Context | SHALL | SHALL |
| 12 | Context Hygiene | SHALL | SHALL |
| 13 | AI Model Governance | SHALL | SHALL |
| 14 | Script Change Management | SHALL | SHALL |
| 15 | AI Output Quality Verification | SHALL | SHALL |

NOTE: For entry-level adoption, see SENAR Core which defines 8 foundational rules.
