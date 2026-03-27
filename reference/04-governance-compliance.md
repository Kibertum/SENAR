# SENAR Reference: Governance and Compliance Annex

This annex maps SENAR practices to governance, regulatory, and compliance requirements for organizations using AI-native development teams. It is intended for compliance officers, auditors, legal counsel, and engineering leadership evaluating SENAR adoption in regulated environments.

**Disclaimer:** This document provides recommended practices and compliance mapping guidance. It does not constitute legal advice. Organizations should consult qualified legal counsel for jurisdiction-specific regulatory interpretation.

---

## A. Responsibility Model

### A.1 The Accountability Principle

In SENAR, **the Supervisor is accountable for all AI output they approve**. This is not a delegation of responsibility to the AI agent — it is an explicit acceptance of responsibility by the human who directs, reviews, and approves the work.

The accountability chain follows a clear principle:

> **AI generates. Human approves. Human is responsible.**

This principle is embedded structurally in SENAR through Quality Gates. When a Supervisor passes a Task through QG-2 (Implementation Gate), they are attesting that:

- CI passes, tests pass, types are clean (automated verification);
- Acceptance criteria are satisfied (human judgment);
- No security vulnerabilities were detected (tooling-assisted);
- The output is fit for its intended purpose (professional judgment).

This attestation is the compliance-relevant act. It is recorded, timestamped, and attributable to a specific individual.

### A.2 Responsibility by Quality Gate

| Gate | Who Is Responsible | What They Attest |
|------|--------------------|------------------|
| QG-0 (Context) | Supervisor / Context Architect | Task is well-defined with verifiable acceptance criteria |
| QG-1 (Requirements) | Context Architect | Business requirement is approved and properly decomposed |
| QG-2 (Implementation) | Supervisor | AI output meets acceptance criteria, CI passes, no security issues |
| QG-3 (Verification) | Verification Engineer / Peer Reviewer | Code reviewed, acceptance tests pass, no regressions |
| QG-4 (Acceptance) | Stakeholder / Context Architect | Software meets business requirements, ready for release |

Each gate passage constitutes a documented approval decision by an identified human.

### A.3 Gate Bypass Responsibility

SENAR Standard Section 8.6(c) requires that Gate Bypasses include justification, risk assessment, remediation plan, and senior approval. From a compliance perspective:

- **The person who approves the bypass owns the risk** for any downstream consequences.
- Gate Bypass records SHALL be preserved as audit evidence.
- Organizations SHOULD track Gate Bypass rate (Standard 8.6(d)) as a compliance health metric.
- Auditors should treat elevated Gate Bypass rates as an indicator of process pressure that warrants investigation.

### A.4 Escalation Paths

| Situation | Escalation Path |
|-----------|----------------|
| Supervisor is uncertain about AI output correctness | Escalate to Verification Engineer or peer Supervisor for independent review |
| AI output touches high-risk areas (security, auth, payment, data migration) | SHALL trigger peer review per risk-based review policy (Standard 8.7) |
| Defect found post-release in AI-generated code | Incident response process (Section F); trace to originating Task and Supervisor |
| Supervisor suspects AI hallucination or fabricated references | Stop, verify independently, document as Dead End if approach is abandoned |
| Regulatory or compliance implications unclear | Escalate to Compliance Officer (or equivalent organizational role) before proceeding |

### A.5 Shared Responsibility in Team+ Configurations

In Team+ configurations, responsibility is distributed across dedicated roles:

- **Context Architect** is responsible for requirement quality and traceability completeness.
- **Knowledge Engineer** is responsible for knowledge base accuracy and freshness.
- **Flow Manager** is responsible for process adherence and metric collection.
- **Verification Engineer** is responsible for independent verification and Quality Sweep thoroughness.
- **Supervisor** remains responsible for the specific AI output they direct and approve.

This distribution does not dilute individual accountability — it creates a chain of documented responsibilities, each with its own audit trail.

---

## B. Audit Trail Requirements

### B.1 SENAR Artifacts as Audit Evidence

SENAR's structure produces the following artifacts, each of which constitutes audit evidence:

| Artifact | What It Contains | Compliance Value |
|----------|------------------|------------------|
| **Task record** | Goal, acceptance criteria, requirement link, work type, lifecycle timestamps, assigned Supervisor | Demonstrates planned, authorized work with traceability |
| **Quality Gate records** | Gate ID, pass/fail, timestamp, approver, automated check results | Demonstrates enforcement of controls at each stage |
| **Gate Bypass records** | Justification, risk assessment, remediation plan, approver | Demonstrates controlled exception management |
| **Session logs** | Start/end timestamps, tasks worked, checkpoint records, handoff notes | Demonstrates supervised execution with bounded scope |
| **Handoff documents** | Session summary, next steps, warnings, open issues | Demonstrates continuity of supervision across sessions |
| **Knowledge entries** | Decisions, patterns, Dead Ends, gotchas — timestamped and categorized | Demonstrates organizational learning and rationale capture |
| **Increment Planning records** | Objectives, task pool, budget, risk register | Demonstrates planned delivery with risk management |
| **Retrospective records** | Metrics review, planned vs actual, improvement actions | Demonstrates continuous improvement and management review |
| **Quality Sweep reports** | Audit scope, findings, remediation actions | Demonstrates periodic independent verification |
| **Metrics data** | Throughput, Lead Time, FPSR, DER, Cost Predictability, etc. | Demonstrates measurement-based process management |

### B.2 Quality Gate to Audit Evidence Mapping

| Quality Gate | Evidence Produced | Demonstrates |
|-------------|-------------------|--------------|
| QG-0 (Context) | Task created with goal, AC, requirement link | Work authorization and scope definition |
| QG-1 (Requirements) | Approved requirement, decomposition record | Requirements management and approval |
| QG-2 (Implementation) | CI results, test results, Supervisor approval record | Verification of deliverable, change control |
| QG-3 (Verification) | Review record, acceptance test results, security scan | Independent verification, security assessment |
| QG-4 (Acceptance) | Stakeholder approval, staging verification, Delivery Review record | Release authorization, acceptance testing |

### B.3 Demonstrating Adequate Supervision

An auditor evaluating whether AI-generated code was adequately supervised should examine:

1. **Task definition quality.** Was QG-0 enforced? Did the Task have clear, verifiable acceptance criteria before AI work began? A well-defined Task demonstrates intentional direction, not open-ended AI generation.

2. **Gate passage records.** Did QG-2 pass with documented Supervisor approval? Were automated checks (CI, tests, lint, security scan) executed and recorded? Automated gate records are stronger evidence than manual checklists.

3. **Risk-appropriate review.** Was the risk level correctly classified? Did high-risk changes receive peer review as required by Standard 8.7? Consistent application of risk-based review is a key indicator.

4. **Session discipline.** Were Sessions bounded in duration? Were checkpoints performed at the required cadence? Unbounded sessions without checkpoints suggest inadequate attention.

5. **Knowledge capture.** Were decisions documented? Were Dead Ends recorded? Active knowledge capture indicates reflective supervision, not passive acceptance.

6. **Metrics trend.** Is the Defect Escape Rate stable or improving? A rising DER suggests degrading supervision quality.

7. **Gate Bypass rate.** Are bypasses rare and well-justified? Frequent bypasses indicate systemic process issues.

### B.4 Retention Recommendations

| Artifact Category | Recommended Minimum Retention | Rationale |
|-------------------|-------------------------------|-----------|
| Task and gate records | Duration of software lifecycle + regulatory retention period | Core traceability evidence |
| Session logs and handoffs | 3 years or regulatory minimum (whichever is longer) | Supervision evidence |
| Knowledge entries | Indefinite (active curation) | Ongoing operational value |
| Metrics data | 3 years minimum | Trend analysis and audit evidence |
| Gate Bypass records | Duration of software lifecycle | Risk acceptance evidence |
| Incident records | Per regulatory requirement (typically 5-7 years) | Post-incident analysis |

---

## C. Regulatory Mapping

### C.1 ISO 9001:2015 — Quality Management Systems

| ISO 9001 Clause | Requirement Summary | SENAR Artifact | How SENAR Satisfies |
|-----------------|---------------------|----------------|---------------------|
| 6.1 — Actions to address risks and opportunities | Identify risks affecting QMS, plan actions | Increment Planning risk register; Gate Bypass risk assessments; risk-based review classification (Standard 8.7) | Each Increment begins with documented risk identification. Gate Bypasses require explicit risk assessment. Review depth is determined by risk level. |
| 7.5 — Documented information | Create, update, and control documented information | Task records, gate records, knowledge entries, session logs, handoffs | All SENAR artifacts are timestamped, attributable, and retained. Knowledge entries are curated for freshness (Knowledge Engineer responsibility). |
| 8.1 — Operational planning and control | Plan and control processes for product/service provision | Increment Planning with objectives, task pool, and budget; QG-0 enforcing task definition before work | Work is planned at Increment level, authorized at Task level, and controlled through automated Quality Gates. |
| 8.5 — Production and service provision | Controlled conditions for production | Session discipline (bounded duration, checkpoints); Supervisor direction of AI agents; automated CI/CD enforcement | AI production occurs under supervised, time-bounded conditions with automated controls. Manual interventions are tracked. |
| 8.6 — Release of products and services | Verify product/service requirements met before release | QG-4 (Acceptance Gate): stakeholder approval, staging verification, QG-3 still passing | Release requires documented verification and stakeholder acceptance. |
| 9.1 — Monitoring, measurement, analysis, and evaluation | Determine what to monitor and measure | 8 defined metrics (4 mandatory, 4 recommended); Increment Retrospective with quantitative review | Metrics are collected automatically, reviewed at each Retrospective, with baselines established over 3+ Increments. |
| 10.1 — Improvement: Nonconformity and corrective action | React to nonconformities, take corrective action | Retrospective improvement actions (specific, measurable, time-bounded, assigned); Quality Sweep findings and remediation | Retrospectives produce assigned corrective actions. Quality Sweeps identify nonconformities. Dead Ends document failed approaches. |

### C.2 SOC 2 Type II — Trust Services Criteria

| SOC 2 Criterion | Requirement Summary | SENAR Artifact | How SENAR Satisfies |
|-----------------|---------------------|----------------|---------------------|
| CC6.1 — Logical and physical access controls | Restrict access to authorized users and processes | SENAR does not prescribe access control tooling, but: Supervisor role assignment controls who may approve gate passage; Task assignment documents authorized workers; Session logs document who performed what work and when | Organizations must supplement SENAR with infrastructure-level access controls. SENAR provides the process-level authorization records. |
| CC7.1 — Detection of unauthorized or malicious activity | Monitor and detect anomalies | Quality Sweeps detect scope creep, unauthorized changes, configuration drift; Version control rules (Standard 10.6) mandate atomic commits with secrets detection; DER metric tracks defects escaping gates | Quality Sweeps and automated scanning provide detection. Organizations must supplement with infrastructure monitoring. |
| CC7.2 — Monitoring of system components | Monitor system components to detect anomalies | Session logs document all AI-directed changes; Gate records document all approvals; Metrics track process health indicators (FPSR, DER) | SENAR provides process-level monitoring. Organizations must supplement with system-level monitoring (APM, logging, alerting). |
| CC8.1 — Changes to infrastructure, data, software, and procedures | Manage changes through a controlled process | QG-0 through QG-4 constitute a change management pipeline; Task records document change authorization; Gate records document change verification; Gate Bypasses document controlled exceptions | SENAR's Quality Gate pipeline is a change management process. Every change is authorized (Task), verified (QG-2), independently reviewed (QG-3 for Team+), and released (QG-4). |

### C.3 GDPR — Considerations for AI Tools Processing Personal Data

GDPR applies when AI coding tools process personal data. This can occur when:

- Source code contains personal data (e.g., test fixtures with real user data, hardcoded credentials);
- AI prompts include personal data from production systems (e.g., debugging with real data);
- AI tool providers process and potentially retain prompt data;
- Session logs contain personal data referenced during development.

| GDPR Consideration | Recommended SENAR Practice |
|--------------------|---------------------------|
| **Lawful basis for processing** | Organizations should establish lawful basis (typically legitimate interest or contract performance) for any personal data sent to AI tools. Document this in data processing records. |
| **Data minimization** | QG-0 context preparation SHOULD exclude personal data. Use synthetic or anonymized data in AI prompts. Include data classification check in Quality Sweep scope. |
| **Data processing agreements** | Organizations processing EU personal data via cloud-hosted AI tools SHALL have Data Processing Agreements (DPAs) in place with AI tool providers covering prompt data processing and retention. |
| **Right to erasure** | Session logs containing personal data must be subject to erasure processes. Organizations should design session logging to minimize personal data capture. |
| **Data protection impact assessment** | Organizations SHOULD conduct a DPIA before adopting AI coding tools that will process personal data, particularly when using cloud-hosted models. |
| **Cross-border transfers** | When AI tools process data outside the EEA, organizations must ensure adequate transfer mechanisms (SCCs, adequacy decisions) are in place. |

### C.4 General Software Audit Requirements

| Audit Requirement | SENAR Artifact | How SENAR Satisfies |
|-------------------|----------------|---------------------|
| Traceability from requirement to implementation | Task → requirement link (QG-0 mandate); Story → Task decomposition; Increment objectives → Stories | Every Task links to its parent requirement. Full traceability chain from business objective to implementation. |
| Change authorization | Task creation (authorization to work); QG-2 passage (authorization to close); QG-4 passage (authorization to release) | Changes are authorized at three levels: work initiation, implementation approval, and release. |
| Segregation of duties | Supervisor directs AI; Verification Engineer reviews independently (Team+ configurations); Stakeholder approves release | Team+ configurations provide role separation. Core/Foundation configurations should document compensating controls. |
| Evidence of testing | QG-2 mandates CI pass, tests pass; QG-3 mandates acceptance tests pass; automated test results recorded as gate evidence | Test execution is automated and recorded as part of gate passage. |
| Incident management | Task-based incident tracking; traceability from incident to originating code change; post-incident review process (Section F) | Incidents are traceable through the full chain: incident → code → Task → requirement → Supervisor. |
| Management review | Increment Retrospective with quantitative metrics; Quality Sweep reports; Delivery Review records | Regular, structured reviews with documented outcomes and improvement actions. |
| Continuous improvement | Retrospective improvement actions; DER and FPSR trending; Knowledge base growth | Improvement is measured (metrics), documented (actions), and verified (subsequent Retrospective review). |

### C.5 EU AI Act (Regulation 2024/1689)

AI coding assistants typically fall under 'limited risk' or 'general-purpose AI' categories. Key obligations:

- **Article 50: Transparency** — users must be informed they interact with AI. SENAR's explicit labeling of AI-generated work satisfies this.
- **Article 53: Obligations for GPAI model providers** — relevant when organizations fine-tune or deploy models.
- Organizations operating in the EU SHOULD review their AI tool usage against the Act's requirements and maintain documentation of compliance measures.

### C.6 NIST AI Risk Management Framework (AI RMF 1.0)

SENAR practices align with NIST AI RMF functions:

- **Govern**: Roles (Section 4), Governance (this annex)
- **Map**: Risk-based review tiers (Section 8.7), Data classification (D.1)
- **Measure**: Metrics (Section 9), Quality Sweeps (Section 7.4)
- **Manage**: Quality Gates (Section 8), Incident Response (F.1)

Organizations subject to US federal AI governance requirements SHOULD document this mapping.

### C.7 ISO/IEC 27001:2022

SENAR controls map to ISO 27001 Annex A:

- **A.8.25** (Secure development lifecycle): Quality Gates, Verification Checklist
- **A.8.28** (Secure coding): Rules 10.6, 10.15, AI Output Review
- **A.8.9** (Configuration management): Rules 10.13, 10.14
- **A.5.12** (Classification of information): Data classification (D.1)
- **A.8.15** (Logging): Audit trail requirements (B.1)

Organizations seeking ISO 27001 certification SHOULD map SENAR artifacts to their Statement of Applicability.

---

## D. Data Governance for AI Tools

### D.1 Data Classification for AI Interactions

Before sending any data to an AI coding tool, organizations should classify that data and apply appropriate controls:

| Classification | Definition | AI Tool Policy | Examples |
|---------------|------------|----------------|----------|
| **Public** | Information intended for public disclosure | Any AI tool (cloud or on-premise) | Open-source code, public documentation, published APIs |
| **Internal** | Information for internal use, low sensitivity | Cloud AI tools with DPA; on-premise AI tools | Internal architecture docs, non-sensitive business logic, internal tooling code |
| **Confidential** | Sensitive business information | On-premise AI tools preferred; cloud only with explicit DPA, encryption, and no-retention guarantees | Proprietary algorithms, customer-facing feature code, competitive differentiators |
| **Restricted** | Highest sensitivity; regulatory or contractual obligations | On-premise AI tools only; no cloud transmission | Personal data (GDPR), payment card data (PCI DSS), health records (HIPAA), authentication secrets, encryption keys |

### D.2 AI Tool Selection Criteria

Organizations should evaluate AI coding tools against the following criteria, weighted by their data classification requirements:

| Criterion | Questions to Answer |
|-----------|-------------------|
| **Data retention** | Does the provider retain prompts or generated output? For how long? Can retention be disabled? |
| **Training opt-out** | Does the provider use customer data for model training? Can this be contractually excluded? |
| **Data residency** | Where is data processed and stored? Does this comply with applicable data residency requirements? |
| **Encryption** | Is data encrypted in transit (TLS 1.2+) and at rest? Who holds the encryption keys? |
| **Access controls** | Who at the provider can access customer data? Under what circumstances? |
| **Audit rights** | Does the contract include audit rights or third-party audit reports (SOC 2, ISO 27001)? |
| **Subprocessors** | Does the provider use subprocessors? Are they disclosed and contractually bound? |
| **Incident notification** | What are the provider's breach notification obligations and timelines? |

### D.3 On-Premise vs. Cloud AI: Decision Framework

| Factor | Cloud AI Appropriate | On-Premise AI Required |
|--------|---------------------|----------------------|
| Data classification | Public or Internal | Confidential or Restricted |
| Regulatory environment | No data residency requirements | Data sovereignty or residency mandates |
| Contractual obligations | No customer restrictions on cloud processing | Customer contracts prohibit cloud AI processing |
| Risk tolerance | Organization accepts cloud provider risk | Zero tolerance for external data exposure |
| Cost-performance trade-off | Cloud cost is acceptable for capability | On-premise cost justified by compliance requirements |

Organizations operating in regulated industries (finance, healthcare, government, defense) should default to on-premise AI tools for all non-public data unless a specific risk assessment justifies cloud use.

### D.4 Data Retention for AI Interactions

| Data Type | Retention Recommendation | Notes |
|-----------|-------------------------|-------|
| Session logs (sanitized) | Per audit trail retention policy (Section B.4) | Remove personal data before long-term retention |
| Raw AI prompts | Minimal retention; purge after session close unless regulatory requirement | Prompts may contain sensitive context |
| AI-generated output | Retained as part of version-controlled source code | Standard code retention policies apply |
| Task and gate records | Duration of software lifecycle + regulatory period | Core compliance artifacts |
| AI tool usage metrics | 3 years minimum | Cost tracking, audit evidence |

### D.5 Right to Deletion

A critical question for organizations subject to GDPR or similar privacy regulations: if personal data was included in an AI prompt, can its influence be removed from the model?

**Current reality:** For cloud-hosted AI models, organizations generally cannot guarantee removal of training influence from model weights, even if the provider deletes stored prompt data. This is a fundamental limitation of current large language model architectures.

**Recommended practices:**

1. **Prevent rather than remediate.** Data classification and QG-0 context preparation should exclude personal data from AI prompts. Prevention is more reliable than post-hoc deletion.
2. **Contractual no-training clauses.** Ensure AI tool contracts explicitly exclude customer data from model training.
3. **Prompt data deletion.** Ensure contracts include prompt data deletion obligations and verify compliance.
4. **On-premise models for restricted data.** When deletion guarantees are required, use on-premise models where the organization controls the full data lifecycle.
5. **Document the limitation.** If an organization cannot guarantee deletion of training influence, document this as a known risk in the DPIA and apply compensating controls (data minimization, synthetic data).

---

## E. Intellectual Property and Licensing

**Note:** AI-generated code IP is an evolving legal landscape with significant jurisdictional variation. The following represents recommended practices as of the time of writing. Organizations should obtain qualified legal counsel for their specific jurisdiction.

### E.1 Ownership of AI-Generated Code

The legal status of AI-generated code ownership varies by jurisdiction and remains unsettled in many:

| Jurisdiction Approach | Current Position | Implication for SENAR |
|----------------------|------------------|----------------------|
| **Human authorship required** | Several jurisdictions require human creative contribution for copyright. Purely machine-generated output may not be copyrightable. | SENAR's Supervisor model strengthens IP claims: the Supervisor provides creative direction (Task goals, acceptance criteria, architectural decisions) and exercises judgment in selection and approval. |
| **Work-for-hire / employment** | In many jurisdictions, employer owns work created by employees in course of employment. | AI tool output directed by employee Supervisors is likely covered under existing employment IP agreements, but organizations should verify. |
| **AI tool provider terms** | Most AI tool providers assign output rights to the user, but terms vary. | Organizations should review AI tool terms of service for IP assignment clauses and ensure they are compatible with organizational requirements. |

**Recommended practices:**

1. **Update employment and contractor agreements** to explicitly address AI-assisted and AI-generated code.
2. **Review AI tool provider terms** to confirm output ownership assignment.
3. **Document human creative contribution** through SENAR's Task records (goal, acceptance criteria, architectural decisions, Supervisor review notes). This documentation strengthens authorship claims.
4. **Maintain records of Supervisor direction** — the context provided to the AI, the selection and modification of AI output, and the judgment applied during review.

### E.2 License Contamination Risk

AI models trained on open-source code may generate output that reproduces or closely resembles code under copyleft licenses (GPL, AGPL, LGPL). If such output is incorporated into proprietary software without compliance, this creates license contamination risk.

**Risk factors:**

- AI models trained on public code repositories without license filtering;
- Generated code that closely matches existing open-source implementations;
- Insufficient review of generated code for license-encumbered patterns.

**Recommended practices:**

1. **Automated license scanning.** Include license scanning tools in the CI pipeline (enforced at QG-2). Scan both direct dependencies and generated code for known license-encumbered patterns.
2. **Dependency audit at QG-3.** For Team+ configurations, include dependency license audit in the QG-3 verification scope.
3. **Quality Sweep coverage.** Include license compliance in Quality Sweep scope (dependency health audit).
4. **AI tool selection.** Evaluate AI tool providers' training data policies and any indemnification they offer against IP claims.
5. **Code provenance documentation.** For high-value or high-risk code, document whether it was AI-generated, human-written, or a combination.

### E.3 Documentation Requirements for IP Compliance

Organizations seeking to demonstrate IP compliance for AI-generated code should maintain:

| Document | Purpose | SENAR Source |
|----------|---------|-------------|
| AI tool inventory | List of AI tools used, their terms of service, IP provisions | Organizational policy (outside SENAR scope) |
| Task records with Supervisor attribution | Document human creative direction and judgment | Task records, gate records, session logs |
| License scan results | Demonstrate absence of license contamination | QG-2 and QG-3 automated scan results |
| Dependency audit records | Document license compliance for all dependencies | Quality Sweep reports |
| Human contribution records | Strengthen authorship claims | Context preparation records, review notes, knowledge entries documenting design decisions |

---

## F. Incident Response for AI-Generated Defects

### F.1 Response Process

When a production incident is traced to AI-generated code, the following process applies in addition to the organization's standard incident response:

1. **Triage and contain.** Standard incident response: assess severity, contain impact, restore service.

2. **Trace the origin.** Use SENAR's traceability chain:
   - Production incident → code change (version control);
   - Code change → Task record (commit references Task);
   - Task record → requirement (QG-0 requirement link);
   - Task record → Supervisor (Task assignment and QG-2 approval);
   - Task record → Session (session log with timestamps and context).

3. **Assess gate effectiveness.** For each Quality Gate the defective code passed through:
   - Did the gate execute? (Check gate records.)
   - Did automated checks pass? (Were checks adequate for this defect type?)
   - Did human review occur? (Was it risk-appropriate per Standard 8.7?)
   - Was a Gate Bypass involved? (If so, was the bypass risk assessment accurate?)

4. **Classify the root cause.** Use the AI-specific root cause taxonomy (Section F.2).

5. **Remediate.** Fix the immediate defect. Create a Task for any systemic improvement.

6. **Credential rotation.** If credentials or secrets are exposed (committed to VCS, included in AI context, or logged), the organization SHALL rotate affected credentials within 24 hours and audit access logs for unauthorized use.

7. **Post-incident review.** Conduct a structured review addressing:
   - Was supervision adequate for the risk level of this change?
   - Were Quality Gates effective? Should gate criteria be strengthened?
   - Was the AI agent's context sufficient? Should knowledge entries be created?
   - Should the risk classification for this type of change be elevated?

Organizations SHOULD define severity-based response timeframes for AI-generated vulnerabilities. Recommended: Critical — 4 hours, High — 24 hours, Medium — 72 hours, Low — next increment.

### F.2 AI-Specific Root Cause Taxonomy

Standard root cause categories (logic error, integration error, performance issue) apply to AI-generated code. The following additional categories are specific to AI-native development:

| Root Cause Category | Description | Indicator | Preventive Control |
|--------------------|-------------|-----------|-------------------|
| **Hallucination** | AI fabricated an API, library, or behavior that does not exist | Code references nonexistent functions, packages, or configurations | QG-2 automated checks (compilation, tests); Supervisor verification of external references |
| **Context gap** | AI lacked necessary context to produce correct output | Code contradicts existing architecture, duplicates existing functionality, or violates undocumented constraints | Improved QG-0 context preparation; knowledge base entries for constraints and conventions |
| **Stale context** | AI used outdated information (deprecated API, changed requirement) | Code uses deprecated patterns or APIs; behavior matches old requirements | Knowledge base freshness maintenance (Knowledge Engineer); Session Start context refresh |
| **Gate bypass** | Quality Gate was bypassed and the defect was in bypassed scope | Gate Bypass record exists for the relevant gate | Review Gate Bypass approval process; reduce bypass rate |
| **Insufficient gate criteria** | Quality Gate passed but criteria were inadequate to detect the defect | Gate records show passage; defect type was not covered by automated checks | Strengthen gate criteria; add test coverage for defect type |
| **Scope creep** | AI generated changes beyond the Task scope that introduced the defect | Commit includes changes unrelated to Task acceptance criteria | QG-2 scope review (Standard 10.6(c)); atomic commit enforcement |
| **Supervision gap** | Supervisor approved without adequate review | No evidence of substantive review; rubber-stamp pattern in gate records | Session duration limits; review quality metrics; Verification Engineer audits |
| **Accumulation effect** | Multiple individually-correct AI changes interact to create a systemic issue | No single commit is defective; issue emerges from combination | Quality Sweeps (architectural conformance check); integration testing at QG-3 |

### F.3 Traceability Chain

The complete traceability chain for incident investigation:

```
Production Incident
  └─► Code Change (commit hash, diff, timestamp)
        └─► Task Record (goal, AC, work type, Supervisor)
              ├─► Requirement (Story / business requirement)
              ├─► QG-0 Record (context quality at task start)
              ├─► QG-2 Record (implementation verification)
              │     ├─► Automated check results (CI, tests, lint, security)
              │     └─► Supervisor approval (who, when)
              ├─► QG-3 Record (if applicable: review, acceptance tests)
              ├─► Session Log (when, duration, checkpoints, context)
              └─► Knowledge Entries (decisions, Dead Ends, patterns)
```

This chain enables auditors and incident investigators to reconstruct the full decision history from business requirement through implementation to production deployment.

---

## G. What SENAR Does Not Cover

SENAR is a process methodology for supervised AI-native development. The following compliance-relevant areas are outside SENAR's scope and require additional organizational controls:

| Area | Why It Is Outside SENAR Scope | What Organizations Need |
|------|------------------------------|------------------------|
| **Infrastructure access controls** | SENAR prescribes process roles, not system permissions | IAM policies, RBAC, MFA, privileged access management |
| **Network security** | SENAR is tool-agnostic; network architecture is implementation-specific | Firewalls, VPNs, network segmentation, DDoS protection |
| **Data encryption standards** | SENAR does not prescribe cryptographic controls | Encryption-at-rest, encryption-in-transit, key management |
| **Business continuity / disaster recovery** | SENAR addresses development process, not operational resilience | BCP/DR plans, backup procedures, RTO/RPO targets |
| **Physical security** | SENAR is a software development methodology | Facility access, environmental controls |
| **Employee background checks** | SENAR defines responsibilities, not HR processes | Background verification, security clearance procedures |
| **Vendor management** (beyond AI tools) | SENAR addresses AI tool data governance only | Third-party risk management program |
| **Privacy by design** | SENAR supports data minimization in AI prompts but does not replace privacy architecture | Privacy impact assessments, data mapping, consent management |
| **AI model governance** | SENAR governs AI usage in development, not AI model training or deployment | Model risk management, bias testing, model monitoring (relevant for organizations that train or fine-tune models) |
| **Regulatory reporting** | SENAR produces audit evidence but does not automate regulatory submissions | Reporting workflows, regulatory calendars, submission procedures |

Organizations adopting SENAR should integrate it into their broader governance, risk, and compliance (GRC) framework rather than treating it as a standalone compliance solution.

### G.1 Compensating Controls for Core/Foundation Configuration

SENAR's Core configuration (1 Pair) and Foundation configuration (1–3 Pairs) combine multiple responsibilities in fewer people. This creates a segregation-of-duties gap that may concern auditors:

| Gap | Compensating Control |
|-----|---------------------|
| Supervisor self-reviews (no independent Verification Engineer) | Automated gate enforcement (QG-2 automated checks are independent of the Supervisor); periodic Quality Sweeps; peer review for high-risk changes |
| Supervisor absorbs Context Architect role | QG-0 enforcement ensures minimum task definition quality regardless of who fills the role |
| No dedicated Flow Manager | Automated metrics collection reduces dependence on manual oversight; Session duration limits are enforceable through tooling |

Organizations in regulated industries operating at Core or Foundation scale should document these compensating controls and assess whether they are adequate for their regulatory obligations. Transitioning to Team configuration may be necessary to satisfy segregation-of-duties requirements.

---

## H. Implementation Checklist

Organizations adopting SENAR in a regulated environment should address the following:

- [ ] Establish data classification policy for AI tool interactions (Section D.1)
- [ ] Evaluate and select AI tools based on data classification and compliance requirements (Section D.2)
- [ ] Execute data processing agreements with cloud AI tool providers (Section D.3)
- [ ] Update employment and contractor IP agreements for AI-generated code (Section E.1)
- [ ] Integrate license scanning into CI pipeline at QG-2 (Section E.2)
- [ ] Configure Quality Gate automation to produce audit-grade records (Section B.1)
- [ ] Establish Gate Bypass approval process with documentation requirements (Section A.3)
- [ ] Define data retention policies for SENAR artifacts (Section B.4)
- [ ] Conduct DPIA if AI tools will process personal data (Section C.3)
- [ ] Document compensating controls if operating at Core/Foundation configuration (Section G.1)
- [ ] Establish AI-specific root cause categories in incident management process (Section F.2)
- [ ] Include AI tool compliance in Quality Sweep scope (Section D, E)
- [ ] Train Supervisors on data classification and AI-specific compliance obligations
- [ ] Integrate SENAR audit trail into existing GRC tooling and reporting
